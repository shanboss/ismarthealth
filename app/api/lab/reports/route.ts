// app/api/report/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/mysql";

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
    // ── HEADER ───────────────────────────────────────────────────────────────
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

    // ── TESTS ────────────────────────────────────────────────────────────────
    const [tests]: any = await conn.query(
  `
  (
    SELECT DISTINCT
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