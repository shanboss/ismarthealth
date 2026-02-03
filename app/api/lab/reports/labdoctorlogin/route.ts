// app/api/lab/reports/labdoctorlogin/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import pool from "@/app/lib/mysql";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { laboratory_doctors_id, password } = body;

    // Validate required fields
    if (!laboratory_doctors_id || !password) {
      return NextResponse.json(
        { success: false, message: 'Missing laboratory_doctors_id or password' },
        { status: 400 }
      );
    }

    const conn = await pool.getConnection();

    try {
      // Query to fetch the doctor and validate password
      const query = `
        SELECT 
          laboratory_doctors_id,
          doc_firstname,
          doc_lastname,
          doc_email,
          laboratory_id
        FROM laboratory_doctors 
        WHERE laboratory_doctors_id = ?
      `;

      const [rows]: any = await conn.query(query, [laboratory_doctors_id]);

      // Check if doctor exists
      if (!rows.length) {
        return NextResponse.json(
          { success: false, message: 'Doctor not found' },
          { status: 404 }
        );
      }

      const doctor = rows[0];

      // Convert password to MD5 for comparison
      const passwordHash = crypto.createHash('md5').update(password).digest('hex');

      // Query to validate password
      const validateQuery = `
        SELECT laboratory_doctors_id
        FROM laboratory_doctors 
        WHERE laboratory_doctors_id = ? AND doc_password = ?
      `;

      const [validationRows]: any = await conn.query(validateQuery, [
        laboratory_doctors_id,
        passwordHash,
      ]);

      // Check if password is correct
      if (!validationRows.length) {
        return NextResponse.json(
          { success: false, message: 'Invalid password' },
          { status: 401 }
        );
      }

      // Both doctor exists and password is correct
      return NextResponse.json(
        {
          success: true,
          message: 'Login successful',
          data: {
            laboratory_doctors_id: doctor.laboratory_doctors_id,
            name: `${doctor.doc_firstname} ${doctor.doc_lastname}`,
            email: doctor.doc_email,
            laboratory_id: doctor.laboratory_id,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Doctor Login API Error:", error);
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Doctor Login API Error:", error);
    return NextResponse.json(
      { success: false, message: 'Invalid request body' },
      { status: 400 }
    );
  }
}