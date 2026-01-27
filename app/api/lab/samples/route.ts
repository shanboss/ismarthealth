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
    const { patient_id, medical_num, testId, billingId } = body;

    if (!patient_id || !medical_num || !testId) {
      return NextResponse.json(
        { error: "Missing required fields: patient_id, medical_num, and testId" },
        { status: 400 }
      );
    }

    // Normalize medical_num (in case it contains spaces or was URL-encoded)
    const medicalNumClean = medical_num.trim();
    const medicalNumSpecial = medicalNumClean.replace(/ /g, "%20");

    console.log("Marking sample collected:", {
      patient_id,
      medical_num: medicalNumClean,
      medical_num_special: medicalNumSpecial,
      testId,
      billingId,
    });

    // 3. Start transaction
    await connection.beginTransaction();

    const now = new Date()
      .toISOString()
      .replace("T", " ")
      .slice(0, 19); // MySQL-friendly datetime

    try {
      // 4. Update referral_patient_test_details
      // We update the specific test record that matches patient_unique_id, medical_num, and laboratory_tests (testId)
      const [result] = await connection.execute(
        `UPDATE referral_patient_test_details 
         SET 
           sample_collected_id = 1,
           sample_datetime = ?
         WHERE 
           patient_unique_id = ? 
           AND (medical_num = ? OR medical_num = ?)
           AND laboratory_tests = ?
           AND (sample_collected_id IS NULL OR sample_collected_id != 1)`,
        [now, patient_id, medicalNumClean, medicalNumSpecial, testId]
      );

      const updateResult = result as import("mysql2").OkPacket; // mysql2 types
      const affectedRows = updateResult.affectedRows || 0;

      console.log(`Updated ${affectedRows} test record to sample collected`);

      if (affectedRows === 0) {
        // No rows were updated → either not found or already collected
        await connection.rollback();
        return NextResponse.json(
          {
            success: false,
            message: "No matching records found or sample already marked as collected",
          },
          { status: 200 }
        );
      }

      // 5. Commit transaction
      await connection.commit();

      return NextResponse.json(
        {
          success: true,
          message: `Sample collection marked successfully`,
          affectedRows,
          collected_at: now,
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
        INNER JOIN referral_patient_details rpd ON rptd.main_patient_id = rpd.referral_patient_id
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