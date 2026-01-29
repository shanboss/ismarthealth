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

interface SampleResultPostBody {
  testDetailsId: number;
  value: string | number;
  investigationId: number;
  unit: string;
  referenceRange: string;
  medicalNum: string;
  patientId: string;
}


// GET handler for fetchApprovedSamples endpoint
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const medicalNum = searchParams.get('medicalNum');
    const patientId = searchParams.get('patientId');

    if (!medicalNum || !patientId) {
      return NextResponse.json(
        { error: "Missing required parameters: medicalNum and patientId" },
        { status: 400 }
      );
    }

    // Call the fetchApprovedSamples function
    const result = await fetchApprovedSamples(medicalNum, patientId);
    const patientDepRows = await query<RowDataPacket[]>(
      "SELECT firstname, lastname, gender, age FROM referral_patient_details WHERE patient_unique_id = ? LIMIT 1",
      [patientId]
    );
    const patientDepDetails = patientDepRows[0];
    console.log("Patient Dep Details:", patientDepDetails);

    const responseData = {
      ...result,
      patientDetails: patientDepDetails || null,
    };
    
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("GET /api/lab/samples Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


// POST handler for inserting/updating sample results
export async function POST(request: NextRequest) {
  const connection = await pool.getConnection();

  try {
    const body: SampleResultPostBody = await request.json();

    // Validate required fields
    const requiredFields = ['testDetailsId', 'value', 'investigationId', 'unit', 'referenceRange', 'medicalNum', 'patientId'];
    const missingFields = requiredFields.filter(field => !(field in body));

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    const {
      testDetailsId,
      value,
      investigationId,
      unit,
      referenceRange,
      medicalNum,
      patientId,
    } = body;

    // Start transaction
    await connection.beginTransaction();

    try {
      // Step 1: Insert into sample_results if investigationId = 4
      if (investigationId === 4) {
        // Get max result_id
        const maxResultRows = await connection.query(
          "SELECT MAX(CAST(result_id AS UNSIGNED)) as max_id FROM sample_results"
        );
        const maxResultId = maxResultRows[0][0]?.max_id || 0;
        const newResultId = maxResultId + 1;

        await connection.query(
          "INSERT INTO sample_results (result_id, sample_value, referral_test_id) VALUES (?, ?, ?)",
          [newResultId, value, testDetailsId]
        );

        console.log(`Inserted sample result: result_id=${newResultId}, sample_value=${value}, referral_test_id=${testDetailsId}`);
      }

      // Step 2: Update referral_patient_test_details
      const updateResult = await connection.query(
        `UPDATE referral_patient_test_details 
         SET sample_collected_id = 2 
         WHERE medical_num = ? AND patient_unique_id = ? AND ID = ?`,
        [medicalNum, patientId, testDetailsId]
      );

      console.log(`Updated referral_patient_test_details: ${updateResult[0].affectedRows} rows affected`);

      // Step 3a: Check if there are any uncollected samples
      const pendingSamplesRows = await connection.query(
        `SELECT COUNT(*) as count FROM referral_patient_test_details 
         WHERE sample_collected_id < 2 AND medical_num = ? AND patient_unique_id = ?`,
        [medicalNum, patientId]
      );

      const pendingCount = pendingSamplesRows[0][0]?.count || 0;

      // Step 3b: If no pending samples, update referral_confirmation_details
      if (pendingCount === 0) {
        const confirmationResult = await connection.query(
          `UPDATE referral_confirmation_details 
           SET lab_test_status = 3 
           WHERE medical_num = ? AND patient_unique_id = ?`,
          [medicalNum, patientId]
        );

        console.log(`Updated referral_confirmation_details: ${confirmationResult[0].affectedRows} rows affected`);
      } else {
        console.log(`Skipped updating referral_confirmation_details: ${pendingCount} pending samples remain`);
      }

      // Commit transaction
      await connection.commit();

      return NextResponse.json(
        {
          success: true,
          message: "Sample result processed successfully",
          data: {
            testDetailsId,
            investigationId,
            medicalNum,
            patientId,
            pendingSamplesRemaining: pendingCount,
          },
        },
        { status: 200 }
      );
    } catch (transactionError) {
      // Rollback transaction on error
      await connection.rollback();
      throw transactionError;
    }
  } catch (error) {
    console.error("POST /api/lab/samples Error:", error);

    // Determine error type and return appropriate response
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          success: false,
          error: "Invalid JSON in request body" 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    // Always release the connection back to the pool
    if (connection) {
      await connection.release();
    }
  }
}


export async function fetchApprovedSamples(
  medicalNum: string,
  patientId: string
) {
  try {
    // Normalize medical_num (in case it contains spaces or was URL-encoded)
    const medicalNumClean = medicalNum.trim();
    const medicalNumSpecial = medicalNumClean.replace(/ /g, "%20");

    console.log("Fetching approved samples:", {
      medical_num: medicalNumClean,
      medical_num_special: medicalNumSpecial,
      patient_id: patientId,
    });

    const approvedSamples = await query<RowDataPacket[]>(
      `SELECT DISTINCT 
        itd.investigation_id, 
        itd.test_name as parent_test_name, 
        itd2.test_name as child_test_name, 
        ltd.unit, 
        ltd.reference_range, 
        rptd.* 
      FROM referral_patient_test_details as rptd 
      INNER JOIN investigation_test_details as itd ON itd.parse_id = rptd.laboratory_tests
      INNER JOIN laboratory_test_details as ltd ON ltd.laboratory_tests = rptd.laboratory_tests AND ltd.laboratory_id = rptd.laboratory_id
      LEFT JOIN investigation_test_details as itd2 on itd.parse_id = itd2.parent_parse_id
      WHERE (rptd.medical_num = ? OR rptd.medical_num = ?) 
        AND rptd.patient_unique_id = ? 
        AND rptd.sample_collected_id = 1`,
      [medicalNumClean, medicalNumSpecial, patientId]
    );

    console.log("Approved Samples Result:", approvedSamples);

    if (!approvedSamples || approvedSamples.length === 0) {
      return {
        success: false,
        message: "No approved samples found",
        data: [],
      };
    }

    // Map the results to a frontend-friendly structure
    const mappedSamples = approvedSamples.map((sample) => ({
      investigationId: sample.investigation_id,
      parentTestName: sample.parent_test_name,
      childTestName: sample.child_test_name || null,
      unit: sample.unit || null,
      referenceRange: sample.reference_range || null,
      testId: sample.laboratory_tests,
      testDetails: {
        id: sample.ID,
        medicalNum: sample.medical_num,
        patientUniqueId: sample.patient_unique_id,
        mainPatientId: sample.main_patient_id || null,
        dependentId: sample.dependent_id || null,
        physicianId: sample.physician_id || null,
        laboratoryId: sample.laboratory_id,
        date: sample.date ? new Date(sample.date).toISOString().split('T')[0] : null,
        time: sample.time || null,
        instruction: sample.instruction || null,
        sampleCollectedId: sample.sample_collected_id !== null ? Number(sample.sample_collected_id) : null,
        billingId: sample.billing_id || null,
        labapprovalId: sample.labapproval_id !== null ? Number(sample.labapproval_id) : null,
        patStatus: sample.pat_status || null,
        createdOn: sample.created_on,
        parseParentId: sample.parse_parent_id,
        reportFilename: sample.report_filename || null,
      },
    }));

    return {
      success: true,
      message: "Approved samples fetched successfully",
      count: mappedSamples.length,
      data: mappedSamples,
    };
  } catch (error) {
    console.error("Fetch Approved Samples Error:", error);
    return {
      success: false,
      message: "Error fetching approved samples",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}