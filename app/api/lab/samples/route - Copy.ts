import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/lib/mysql";
import pool from "@/app/lib/mysql";
import { verifyAuthFromRequest, ROLES, hasRole } from "@/app/lib/auth";
import { RowDataPacket } from "mysql2";

interface PatientQueueRow extends RowDataPacket {
  BillId: string;
  created_on: Date;
  firstname: string;
  phonenum: string;
  patient_unique_id: string;
  laboratory_id: number;
}

interface TestRecordRow extends RowDataPacket {
  id: number | bigint;
  parse_parent_id: number;
  laboratory_id: number;
  laboratory_tests: string;
  date: Date | null;
  time: string | null;
  instruction: string | null;
  sample_collected_id: number | null;
  bill_id: number | null;
  labapproval_id: number | null;
  investigation_id: number | null;
}


// GET handler for fetchApprovedSamples endpoint
// export async function GET(request: NextRequest) {
//   try {
//     // Extract query parameters
//     const searchParams = request.nextUrl.searchParams;
//     const medicalNum = searchParams.get('medicalNum');
//     const patientId = searchParams.get('patientId');

//     if (!medicalNum || !patientId) {
//       return NextResponse.json(
//         { error: "Missing required parameters: medicalNum and patientId" },
//         { status: 400 }
//       );
//     }

//     // Call the fetchApprovedSamples function
//     const result = await fetchApprovedSamples(medicalNum, patientId);
    
//     return NextResponse.json(result, { status: 200 });
//   } catch (error) {
//     console.error("GET /api/lab/samples Error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: NextRequest) {
  const connection = await pool.getConnection();

  try {
    // 1. Authentication & Authorization
    const user = verifyAuthFromRequest(request);
    if (!user || !hasRole(user, [ROLES.LABORATORY, ROLES.BILLING])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request body
    const body = await request.json();
    const { patient_unique_id, medical_num, lab_testname, sample_collected_status } = body;

    if (!patient_unique_id || !medical_num || !lab_testname || sample_collected_status === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: patient_unique_id, medical_num, lab_testname, and sample_collected_status" },
        { status: 400 }
      );
    }

    // Normalize medical_num (in case it contains spaces or was URL-encoded)
    const medicalNumClean = medical_num.trim();
    const medicalNumSpecial = medicalNumClean.replace(/ /g, "%20");

    console.log("Update sample collected status:", {
      patient_unique_id,
      medical_num: medicalNumClean,
      medical_num_special: medicalNumSpecial,
      lab_testname,
      sample_collected_status,
    });

    // 3. Start transaction
    await connection.beginTransaction();

    try {
      // 4. Step 1: Get laboratory_tests value where has_child = 1
      // This mirrors the PHP CodeIgniter query:
      // $this->db->where('has_child', 1);
      const [checkRows] = await connection.execute(
        `SELECT laboratory_tests FROM referral_patient_test_details 
         WHERE patient_unique_id = ? 
         AND (medical_num = ? OR medical_num = ?)
         AND ID = ? 
         AND has_child = 1 
         LIMIT 1`,
        [patient_unique_id, medicalNumClean, medicalNumSpecial, lab_testname]
      );

      const checkResult = checkRows as RowDataPacket[];
      let laboratoryTests: string | null = null;
      const hasChild = checkResult.length > 0;

      if (hasChild) {
        laboratoryTests = checkResult[0].laboratory_tests;
        console.log(`Found parent test with has_child = 1: laboratory_tests = ${laboratoryTests}`);
      }

      // 5. Step 2a: Update the main record (always executed)
      // This always runs regardless of has_child value
      const [mainUpdate] = await connection.execute(
        `UPDATE referral_patient_test_details 
         SET sample_collected_id = ?
         WHERE medical_num = ? 
         AND ID = ? 
         AND patient_unique_id = ?`,
        [sample_collected_status, medicalNumClean, lab_testname, patient_unique_id]
      );

      const mainUpdateResult = mainUpdate as import("mysql2").OkPacket;
      const mainAffectedRows = mainUpdateResult.affectedRows || 0;
      console.log(`Updated main record: ${mainAffectedRows} rows affected`);

      // 5. Step 2b: If has_child = 1, also update child records
      // This mirrors the PHP CodeIgniter conditional update for child records:
      // $this->db->where('parse_parent_id', $laboratory_tests);
      let childAffectedRows = 0;
      if (hasChild && laboratoryTests) {
        const [childUpdate] = await connection.execute(
          `UPDATE referral_patient_test_details 
           SET sample_collected_id = ?
           WHERE medical_num = ? 
           AND parse_parent_id = ? 
           AND patient_unique_id = ?`,
          [sample_collected_status, medicalNumClean, laboratoryTests, patient_unique_id]
        );

        const childUpdateResult = childUpdate as import("mysql2").OkPacket;
        childAffectedRows = childUpdateResult.affectedRows || 0;
        console.log(`Updated child records: ${childAffectedRows} rows affected`);
      }

      const totalAffectedRows = mainAffectedRows + childAffectedRows;

      if (totalAffectedRows === 0) {
        await connection.rollback();
        return NextResponse.json(
          {
            success: false,
            message: "No matching records found to update",
          },
          { status: 200 }
        );
      }

      // 6. Step 3: Check if all tests for this patient/medical_num have sample_collected_id = 0
      // This mirrors the PHP CodeIgniter check:
      // if($query->num_rows()<=0) { update lab_test_status to 3 }
      const [pendingTests] = await connection.execute(
        `SELECT * FROM referral_patient_test_details 
         WHERE patient_unique_id = ? 
         AND (medical_num = ? OR medical_num = ?)
         AND sample_collected_id = 0`,
        [patient_unique_id, medicalNumClean, medicalNumSpecial]
      );

      const pendingTestsResult = pendingTests as RowDataPacket[];
      const hasPendingTests = pendingTestsResult.length > 0;

      console.log(`Pending tests remaining: ${pendingTestsResult.length}`);

      // If no pending tests (all collected), update lab_test_status to 3
      if (!hasPendingTests) {
        // Update referral_confirmation_details
        // PHP CodeIgniter: $this->db->update('referral_confirmation_details');
        const [confirmUpdate] = await connection.execute(
          `UPDATE referral_confirmation_details 
           SET lab_test_status = 3
           WHERE medical_num = ? 
           AND patient_unique_id = ?`,
          [medicalNumClean, patient_unique_id]
        );

        const confirmUpdateResult = confirmUpdate as import("mysql2").OkPacket;
        console.log(`Updated referral_confirmation_details: ${confirmUpdateResult.affectedRows} rows affected`);

        // Update patientqueue
        // PHP CodeIgniter: $this->db->update('patientqueue');
        const [queueUpdate] = await connection.execute(
          `UPDATE patientqueue 
           SET lab_test_status = 3
           WHERE medical_num = ? 
           AND patient_unique_id = ?`,
          [medicalNumClean, patient_unique_id]
        );

        const queueUpdateResult = queueUpdate as import("mysql2").OkPacket;
        console.log(`Updated patientqueue: ${queueUpdateResult.affectedRows} rows affected`);
      }

      // 7. Commit transaction
      await connection.commit();

      return NextResponse.json(
        {
          success: true,
          message: "Sample collection status updated successfully",
          mainRecordsUpdated: mainAffectedRows,
          childRecordsUpdated: childAffectedRows,
          totalRecordsUpdated: totalAffectedRows,
          allTestsCollected: !hasPendingTests,
          labTestStatusUpdated: !hasPendingTests,
        },
        { status: 200 }
      );
    } catch (innerError) {
      await connection.rollback();
      console.error("Transaction failed:", innerError);
      throw innerError;
    }
  } catch (error) {
    console.error("Sample Collection API Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyAuthFromRequest(request);
    if (!user || !hasRole(user, [ROLES.LABORATORY, ROLES.BILLING])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get("patient_id")?.trim();
    const medicalNum = searchParams.get("medical_num")?.trim();
    const medicalNumSpecial = medicalNum?.replace(/ /g, '%20');
    // Force decode in case the param arrived double-encoded
 
    console.log("GET Params received:", { patientId, medicalNum, medicalNumSpecial });


    if (!patientId || !medicalNum) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // 1. Fetch patient data from patientqueue
    const patientRows = await query<PatientQueueRow[]>(
      "SELECT * FROM patientqueue WHERE (medical_num = ? or medical_num = ?) AND patient_unique_id = ? LIMIT 1",
      [medicalNum, medicalNumSpecial, patientId]
    );
    const patientData = patientRows[0];
    console.log("Patient Data:", patientData);

    if (!patientData) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // 2. Fetch referral patient details (main patient)
    const patientDepRows = await query<RowDataPacket[]>(
      "SELECT firstname, lastname, gender, age FROM referral_patient_details WHERE patient_unique_id = ? LIMIT 1",
      [patientData.patient_unique_id]
    );
    const patientDepDetails = patientDepRows[0];
    console.log("Patient Dep Details:", patientDepDetails);

    // 3. Fetch test records using the new UNION query
    const testRecords = await query<TestRecordRow[]>(
      `(SELECT DISTINCT 
          rptd.ID as id,
          rptd.instruction,
          ltd.instruction as test_instruction,
          ltd.methodology,
          sr.sample_value,
          sr.referral_test_ID,
          itd.investigation_id,
          b.tot_amt,
          b.discount,
          b.net_amt,
          b.adv_amt,
          b.balance_amt,
          b.billing_id AS bill_id,
          ltd.test_price,
          rptd.billing_id,
          rptd.sample_collected_id,
          rptd.labapproval_id,
          rptd.ID,
          rptd.report_filename,
          rcd.brief_history,
          itd.test_name,
          rcd.phy_advice,
          rptd.laboratory_tests,
          rptd.date,
          rptd.time,
          rptd.created_on,
          sm.status,
          sm.status_id,
          rptd.pat_status,
          ltd.unit,
          ltd.reference_range,
          rptd.medical_num,
          rptd.parse_parent_id,
          rptd.patient_unique_id
        FROM referral_patient_test_details rptd
        INNER JOIN investigation_test_details itd ON itd.parse_id = rptd.laboratory_tests
        INNER JOIN laboratory_details ld ON ld.laboratory_id = rptd.laboratory_id
        LEFT JOIN physician_appointment pa ON pa.physician_id = rptd.physician_id
        INNER JOIN status_master sm ON sm.status_id = rptd.pat_status
        INNER JOIN referral_confirmation_details rcd ON rcd.patient_unique_id = rptd.patient_unique_id 
          AND rcd.medical_num = rptd.medical_num
        INNER JOIN laboratory_test_details ltd ON ltd.laboratory_tests = rptd.laboratory_tests 
          AND ltd.laboratory_id = rptd.laboratory_id
        LEFT JOIN billing b ON b.medical_num = rptd.medical_num AND b.laboratory_tests = rptd.ID
        LEFT JOIN sample_results sr ON sr.referral_test_ID = rptd.ID
        WHERE (rptd.medical_num = ? or rptd.medical_num = ?) AND rptd.parse_parent_id = 0 
        GROUP BY rptd.laboratory_tests)
      UNION
      (SELECT DISTINCT 
          rptd.ID as id,
          rptd.instruction,
          ltd.instruction as test_instruction,
          ltd.methodology,
          sr.sample_value,
          sr.referral_test_ID,
          itd.investigation_id,
          b.tot_amt,
          b.discount,
          b.net_amt,
          b.adv_amt,
          b.balance_amt,
          b.billing_id AS bill_id,
          ltd.test_price,
          rptd.billing_id,
          rptd.sample_collected_id,
          rptd.labapproval_id,
          rptd.ID,
          rptd.report_filename,
          rcd.brief_history,
          itd.test_name,
          rcd.phy_advice,
          rptd.laboratory_tests,
          rptd.date,
          rptd.time,
          rptd.created_on,
          sm.status,
          sm.status_id,
          rptd.pat_status,
          ltd.unit,
          ltd.reference_range,
          rptd.medical_num,
          rptd.parse_parent_id,
          rptd.patient_unique_id
        FROM referral_patient_test_details rptd
        INNER JOIN patient_dep_details pdd ON rptd.dependent_id = pdd.patient_dep_id
        INNER JOIN investigation_test_details itd ON itd.parse_id = rptd.laboratory_tests
        INNER JOIN laboratory_details ld ON ld.laboratory_id = rptd.laboratory_id
        LEFT JOIN physician_appointment pa ON pa.physician_id = rptd.physician_id
        INNER JOIN status_master sm ON sm.status_id = rptd.pat_status
        INNER JOIN referral_confirmation_details rcd ON rcd.patient_unique_id = rptd.patient_unique_id 
          AND rcd.medical_num = rptd.medical_num
        INNER JOIN laboratory_test_details ltd ON ltd.laboratory_tests = rptd.laboratory_tests 
          AND ltd.laboratory_id = rptd.laboratory_id
        LEFT JOIN billing b ON b.medical_num = rptd.medical_num AND b.laboratory_tests = rptd.ID
        LEFT JOIN sample_results sr ON sr.referral_test_ID = rptd.ID
        WHERE (rptd.medical_num = ? or rptd.medical_num = ?) AND rptd.parse_parent_id = 0 
        GROUP BY rptd.laboratory_tests)`,
      [medicalNum, medicalNumSpecial, medicalNum, medicalNumSpecial]
    );
    console.log("Test Records:", testRecords);
    // 4. Map test records to frontend-friendly structure
    const patientTestDetails = testRecords.map((record) => ({
      id: record.id.toString(),
      testName: record.test_name || "Unknown Test",
      testId: record.laboratory_tests,
      date: record.date ? new Date(record.date).toISOString().split('T')[0] : "N/A",
      time: record.time || "N/A",
      instructions: record.test_instruction || record.instruction || "None",
      methodology: record.methodology || "N/A",
      unit: record.unit || null,
      referenceRange: record.reference_range || null,
      sampleValue: record.sample_value || null,
      price: record.test_price ? Number(record.test_price) : 0,
      totalAmount: record.tot_amt ? Number(record.tot_amt) : 0,
      discount: record.discount ? Number(record.discount) : 0,
      netAmount: record.net_amt ? Number(record.net_amt) : 0,
      advanceAmount: record.adv_amt ? Number(record.adv_amt) : 0,
      balanceAmount: record.balance_amt ? Number(record.balance_amt) : 0,
      billingId: record.bill_id || null,
      status: record.status || "Unknown",
      patStatus: record.pat_status || null,
      reportFilename: record.report_filename || null,
      briefHistory: record.brief_history || null,
      phyAdvice: record.phy_advice || null,
      sampleCollectedId: record.sample_collected_id !== null ? Number(record.sample_collected_id) : null,
      sampleDateTime: record.sample_datetime ? new Date(record.sample_datetime) : null,
      labapprovalId: record.labapproval_id !== null ? Number(record.labapproval_id) : null,
      investigationId: record.investigation_id !== null ? Number(record.investigation_id) : null,
    }));
    console.log("Mapped Patient Test Details:", patientTestDetails);
    // 5. Fetch laboratory details
    const labDetailsRows = await query<RowDataPacket[]>(
      `SELECT
        laboratory_name, laboratory_address, lab_city, lab_state,
        laboratory_phone, laboratory_email
       FROM laboratory_details
       WHERE laboratory_id = ? LIMIT 1`,
      [patientData.laboratory_id]
    );
    const labDetails = labDetailsRows[0];
    console.log("Laboratory Details:", labDetails);
    console.log("medicalNum:", medicalNum);
    console.log("medicalNumSpecial:", medicalNumSpecial);
    console.log("patientId:", patientId);
    // 6. Fetch billing details
    const billingRowss = await query<RowDataPacket[]>(
      `SELECT * FROM billing WHERE (medical_num = ? or medical_num = ?) AND patient_unique_id = ? LIMIT 1`,
      [medicalNum, medicalNumSpecial, patientId]
    );
    console.log("Billing Rows:", billingRowss);
    const billingDetails = billingRowss[0];
    console.log("Billing Details:", billingDetails);

    return NextResponse.json({
      success: true,
      data: {
        patientQueue: {
          billId: patientData.BillId,
          createdOn: patientData.created_on,
          firstName: patientData.firstname,
          phoneNum: patientData.phonenum,
        },
        patientDepDetails: patientDepDetails || {
          firstname: null,
          lastname: null,
          gender: null,
          age: null,
        },
        patientTestDetails,
        labInfo: labDetails || {
          laboratory_name: "N/A",
          laboratory_address: "N/A",
          lab_city: "N/A",
          lab_state: "N/A",
          laboratory_phone: "N/A",
          laboratory_email: "N/A",
        },
        billingDetails: billingDetails || null,
      },
    });
  } catch (error) {
    console.error("Billing API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// export async function fetchApprovedSamples(
//   medicalNum: string,
//   patientId: string
// ) {
//   try {
//     // Normalize medical_num (in case it contains spaces or was URL-encoded)
//     const medicalNumClean = medicalNum.trim();
//     const medicalNumSpecial = medicalNumClean.replace(/ /g, "%20");

//     console.log("Fetching approved samples:", {
//       medical_num: medicalNumClean,
//       medical_num_special: medicalNumSpecial,
//       patient_id: patientId,
//     });

//     const approvedSamples = await query<RowDataPacket[]>(
//       `SELECT DISTINCT 
//         itd.investigation_id, 
//         itd.test_name as parent_test_name, 
//         itd2.test_name as child_test_name, 
//         ltd.unit, 
//         ltd.reference_range, 
//         rptd.* 
//       FROM referral_patient_test_details as rptd 
//       INNER JOIN investigation_test_details as itd ON itd.parse_id = rptd.laboratory_tests
//       INNER JOIN laboratory_test_details as ltd ON ltd.laboratory_tests = rptd.laboratory_tests AND ltd.laboratory_id = rptd.laboratory_id
//       LEFT JOIN investigation_test_details as itd2 on itd.parse_id = itd2.parent_parse_id
//       WHERE (rptd.medical_num = ? OR rptd.medical_num = ?) 
//         AND rptd.patient_unique_id = ? 
//         AND rptd.sample_collected_id = 1`,
//       [medicalNumClean, medicalNumSpecial, patientId]
//     );

//     console.log("Approved Samples Result:", approvedSamples);

//     if (!approvedSamples || approvedSamples.length === 0) {
//       return {
//         success: false,
//         message: "No approved samples found",
//         data: [],
//       };
//     }

//     // Map the results to a frontend-friendly structure
//     const mappedSamples = approvedSamples.map((sample) => ({
//       investigationId: sample.investigation_id,
//       parentTestName: sample.parent_test_name,
//       childTestName: sample.child_test_name || null,
//       unit: sample.unit || null,
//       referenceRange: sample.reference_range || null,
//       testId: sample.laboratory_tests,
//       testDetails: {
//         id: sample.ID,
//         medicalNum: sample.medical_num,
//         patientUniqueId: sample.patient_unique_id,
//         mainPatientId: sample.main_patient_id || null,
//         dependentId: sample.dependent_id || null,
//         physicianId: sample.physician_id || null,
//         laboratoryId: sample.laboratory_id,
//         date: sample.date ? new Date(sample.date).toISOString().split('T')[0] : null,
//         time: sample.time || null,
//         instruction: sample.instruction || null,
//         sampleCollectedId: sample.sample_collected_id !== null ? Number(sample.sample_collected_id) : null,
//         billingId: sample.billing_id || null,
//         labapprovalId: sample.labapproval_id !== null ? Number(sample.labapproval_id) : null,
//         patStatus: sample.pat_status || null,
//         createdOn: sample.created_on,
//         parseParentId: sample.parse_parent_id,
//         reportFilename: sample.report_filename || null,
//       },
//     }));

//     return {
//       success: true,
//       message: "Approved samples fetched successfully",
//       count: mappedSamples.length,
//       data: mappedSamples,
//     };
//   } catch (error) {
//     console.error("Fetch Approved Samples Error:", error);
//     return {
//       success: false,
//       message: "Error fetching approved samples",
//       error: error instanceof Error ? error.message : "Unknown error",
//     };
//   }
// }