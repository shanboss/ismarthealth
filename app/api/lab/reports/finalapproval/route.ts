// app/api/lab/reports/finalapproval/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/mysql";

export async function POST(req: NextRequest) {
  let conn;
  try {
    const body = await req.json();
    const { medical_num, patient_id } = body;

    // Validate required parameters
    if (!medical_num || !patient_id) {
      return NextResponse.json(
        { success: false, message: "Missing required parameters: medical_num and patient_id" },
        { status: 400 }
      );
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    // Update patientqueue table
    await conn.query(
      `UPDATE patientqueue
       SET lab_test_status = 5, billing_status = 2
       WHERE medical_num = ? AND patient_unique_id = ?`,
      [medical_num, patient_id]
    );

    // Update referral_confirmation_details table
    await conn.query(
      `UPDATE referral_confirmation_details
       SET lab_test_status = 5, billing_status = 2
       WHERE medical_num = ? AND patient_unique_id = ?`,
      [medical_num, patient_id]
    );

    // Optional: You can add more related updates here if needed
    // e.g. update billing table, final report status, etc.

    await conn.commit();

    return NextResponse.json(
      {
        success: true,
        message: "Final approval completed successfully",
        data: {
          medical_num,
          patient_id,
          lab_test_status: 5,
          billing_status: 2,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (conn) {
      try {
        await conn.rollback();
      } catch (rollbackError) {
        console.error("Rollback error:", rollbackError);
      }
    }

    console.error("Final Approval API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process final approval",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

// Optional: GET method to check final approval status (useful for frontend polling/validation)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const medical_num = searchParams.get("medical_num");
  const patient_id = searchParams.get("patient_id");

  if (!medical_num || !patient_id) {
    return NextResponse.json(
      { success: false, message: "Missing medical_num or patient_id" },
      { status: 400 }
    );
  }

  const conn = await pool.getConnection();

  try {
    const [rows]: any = await conn.query(
      `
      SELECT 
        pq.lab_test_status AS patientqueue_lab_status,
        rcd.lab_test_status AS referral_lab_status,
        pq.billing_status
      FROM patientqueue pq
      LEFT JOIN referral_confirmation_details rcd
        ON pq.medical_num = rcd.medical_num 
        AND pq.patient_unique_id = rcd.patient_unique_id
      WHERE pq.medical_num = ? AND pq.patient_unique_id = ?
      `,
      [medical_num, patient_id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }

    const status = rows[0];

    return NextResponse.json({
      success: true,
      data: {
        isFinalApproved: status.patientqueue_lab_status === 5 && status.referral_lab_status === 5,
        lab_test_status: status.patientqueue_lab_status,
        billing_status: status.billing_status,
      },
    });
  } catch (error) {
    console.error("Final Approval Status Check Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}