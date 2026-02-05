// app/api/report/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/mysql";

export async function GETDoctorDetails(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const patient_id = searchParams.get('patient_id');
  const medical_num = searchParams.get('medical_num');

  if (!patient_id || !medical_num) {
    return NextResponse.json(
      { success: false, message: 'Missing parameters' },
      { status: 400 }
    );
  } else {
    return NextResponse.json(
      { success: true, message: 'Parameters received' },
      { status: 200 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const patient_id = searchParams.get("patient_id");
  const medical_num = searchParams.get("medical_num");

  if (!patient_id || !medical_num) {
    return NextResponse.json(
      { success: false, message: "Missing parameters" },
      { status: 400 }
    );
  }

  const conn = await pool.getConnection();

  try {
    // ─── HEADER ────────────────────────────────────────────────────────────────
    const [headerRows]: any = await conn.query(
      `
      SELECT * FROM (
        -- Main patient (referral_patient_details)
        SELECT
          l.laboratory_name,
          l.laboratory_phone,
          l.laboratory_address,
          rpd.firstname AS patient_name,
          rpd.phonenum AS patient_phone,
          rpd.gender,
          rpd.age,
          CONCAT(pa.firstname, ' ', pa.lastname) AS referred_doctor,
          rpd.patient_unique_id,
          l.laboratory_id,
          b.billing_id
        FROM billing b
        JOIN laboratory_details l ON l.laboratory_id = b.lab_id
        JOIN referral_patient_details rpd ON rpd.patient_unique_id = b.patient_unique_id
        LEFT JOIN physician_appointment pa ON pa.physician_id = rpd.physician_id
        WHERE b.medical_num = ?

        UNION

        -- Dependent patient (patient_dep_details)
        SELECT
          l.laboratory_name,
          l.laboratory_phone,
          l.laboratory_address,
          pdd.firstname AS patient_name,
          pdd.phonenum AS patient_phone,
          pdd.gender,
          pdd.age,
          CONCAT(pa.firstname, ' ', pa.lastname) AS referred_doctor,
          pdd.patient_unique_id,
          l.laboratory_id,
          b.billing_id
        FROM billing b
        JOIN laboratory_details l ON l.laboratory_id = b.lab_id
        JOIN patient_dep_details pdd ON pdd.patient_unique_id = b.patient_unique_id
        LEFT JOIN physician_appointment pa ON pa.physician_id = pdd.physician_id
        WHERE b.medical_num = ?
      ) AS h
      LIMIT 1
      `,
      [medical_num, medical_num]
    );

    if (!headerRows.length) {
      return NextResponse.json({ success: false, message: "Report not found" });
    }

    const header = headerRows[0];

    // Security check: ensure patient_id matches
    if (header.patient_unique_id !== patient_id) {
      return NextResponse.json({ success: false, message: "Unauthorized or report not found" });
    }

    // ─── TESTS ────────────────────────────────────────────────────────────────
    const [tests]: any = await conn.query(
  `
  (
    SELECT DISTINCT
      rptd.ID as testid,
      idet.test_name as parent_test_name,
      itd.test_name,
      DATE(CONCAT(rptd.date, ' ', rptd.time)) AS test_date,
      TIME(CONCAT(rptd.date, ' ', rptd.time)) AS test_time,
      sr.sample_value AS sample_result,
      ltd.unit,
      ltd.reference_range,
      rptd.sample_collected_id,
      IF(rptd.labapproval_id > 0, 'Approved', 'Pending') AS review_approve,
      CASE rptd.pat_status
        WHEN 0 THEN 'NA'
        WHEN 1 THEN 'In Progress'
        WHEN 2 THEN 'Completed'
        ELSE 'Unknown'
      END AS report_status
    FROM referral_patient_test_details rptd
    INNER JOIN referral_patient_details rpd
      ON rptd.main_patient_id = rpd.referral_patient_id
    INNER JOIN investigation_test_details itd
      ON itd.parse_id = rptd.laboratory_tests
    INNER JOIN investigation_test_details idet
      ON itd.parent_parse_id = idet.parse_id 
    INNER JOIN laboratory_test_details ltd
      ON ltd.laboratory_tests = rptd.laboratory_tests
      AND ltd.laboratory_id = rptd.laboratory_id
    LEFT JOIN sample_results sr
      ON sr.referral_test_ID = rptd.ID
    WHERE rptd.medical_num = ?
      AND rptd.laboratory_id = ?
    GROUP BY rptd.laboratory_tests
  )

  UNION

  (
    SELECT DISTINCT
      rptd.ID as testid,
      idet.test_name as parent_test_name,
      itd.test_name,
      DATE(CONCAT(rptd.date, ' ', rptd.time)) AS test_date,
      TIME(CONCAT(rptd.date, ' ', rptd.time)) AS test_time,
      sr.sample_value AS sample_result,
      ltd.unit,
      ltd.reference_range,
      rptd.sample_collected_id,
      IF(rptd.labapproval_id > 0, 'Approved', 'Pending') AS review_approve,
      CASE rptd.pat_status
        WHEN 0 THEN 'NA'
        WHEN 1 THEN 'In Progress'
        WHEN 2 THEN 'Completed'
        ELSE 'Unknown'
      END AS report_status
    FROM referral_patient_test_details rptd
    INNER JOIN patient_dep_details pdd
      ON rptd.dependent_id = pdd.patient_dep_id
    INNER JOIN investigation_test_details itd
      ON itd.parse_id = rptd.laboratory_tests
    INNER JOIN investigation_test_details idet
      ON itd.parent_parse_id = idet.parse_id 
    INNER JOIN laboratory_test_details ltd
      ON ltd.laboratory_tests = rptd.laboratory_tests
      AND ltd.laboratory_id = rptd.laboratory_id
    LEFT JOIN sample_results sr
      ON sr.referral_test_ID = rptd.ID
    WHERE rptd.medical_num = ?
      AND rptd.laboratory_id = ?
    GROUP BY rptd.laboratory_tests
  )
  ORDER BY test_name
  `,
  [medical_num, header.laboratory_id, medical_num, header.laboratory_id]
);


    return NextResponse.json({
      success: true,
      data: {
        laboratory: {
          name: header.laboratory_name,
          phone: header.laboratory_phone,
          address: header.laboratory_address,
        },
        patient: {
          name: header.patient_name,
          phone: header.patient_phone,
          sex: header.gender,
          age: header.age,
          referredDoctor: header.referred_doctor,
        },
        tests: tests.map((t: any, i: number) => ({
          slNo: i + 1,
          testId: t.testid,
          investigationName: t.parent_test_name,
          testName: t.test_name,
          date: t.test_date,
          time: t.test_time,
          sampleResult: t.sample_result || "N/A",
          unit: t.unit || "N/A",
          referenceRange: t.reference_range || "N/A",
          reviewApprove: t.review_approve,
          reportStatus: t.report_status,
          sampleCollectedId: t.sample_collected_id,
        })),
      },
    });
  } catch (error) {
    console.error("Report API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}

// ─── POST: Approve Lab Report ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const { medical_num, patient_id, test_id } = await req.json();

  // Validate required parameters
  if (!medical_num || !patient_id || !test_id) {
    return NextResponse.json(
      { success: false, message: "Missing required parameters: medical_num, patient_id, test_id" },
      { status: 400 }
    );
  }

  const conn = await pool.getConnection();

  try {
    // Begin transaction
    await conn.beginTransaction();

    // Step 1: Update referral_patient_test_details - approve the test
    const updateTestResult = await conn.query(
      `UPDATE referral_patient_test_details 
       SET labapproval_id = 1, sample_collected_id = 3, pat_status = 1
       WHERE medical_num = ? AND patient_unique_id = ? AND ID = ?`,
      [medical_num, patient_id, test_id]
    );

    if (updateTestResult.affectedRows === 0) {
      await conn.rollback();
      return NextResponse.json(
        { success: false, message: "Test record not found or already processed" },
        { status: 404 }
      );
    }

    // Step 2: Check approval status across all tests for this medical_num
    const [approvalStatus]: any = await conn.query(
      `SELECT 
        SUM(CASE WHEN labapproval_id = 0 THEN 1 ELSE 0 END) AS count_pending,
        SUM(CASE WHEN labapproval_id = 1 THEN 1 ELSE 0 END) AS count_approved, 
        COUNT(*) AS total_rows
       FROM referral_patient_test_details 
       WHERE medical_num = ? AND patient_unique_id = ?`,
      [medical_num, patient_id]
    );

    const status = approvalStatus[0];
    console.log("Approval Status:", status);
    console.log(`Pending: ${status.count_pending}, Approved: ${status.count_approved}, Total: ${status.total_rows}`);

    // Step 3: If all tests are approved, update related tables
    if (parseInt(status.count_approved) == parseInt(status.total_rows)) {
      // Update patientqueue table
      await conn.query(
        `UPDATE patientqueue 
         SET lab_test_status = 4 
         WHERE medical_num = ? AND patient_unique_id = ?`,
        [medical_num, patient_id]
      );

      // Update referral_confirmation_details table
      await conn.query(
        `UPDATE referral_confirmation_details 
         SET lab_test_status = 4 
         WHERE medical_num = ? AND patient_unique_id = ?`,
        [medical_num, patient_id]
      );
    }

    // Commit transaction
    await conn.commit();

    return NextResponse.json(
      {
        success: true,
        message: "Test approved successfully",
        data: {
          testApproved: true,
          allTestsApproved: status.count_approved === status.total_rows,
          approvalSummary: {
            pendingTests: status.count_pending || 0,
            approvedTests: status.count_approved || 0,
            totalTests: status.total_rows || 0,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    try {
      await conn.rollback();
    } catch (rollbackError) {
      console.error("Rollback error:", rollbackError);
    }
    
    console.error("Report Approval API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during approval process" },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}