import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/mysql";
import { verifyAuthFromRequest, ROLES, hasRole } from "@/app/lib/auth";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// Interfaces for request body
interface PatientData {
  firstName: string;
  lastName?: string;
  gender?: string;
  email?: string;
  phone: string;
  dob?: string;
  age?: string;
  address?: string;
  pincode?: string;
  state?: string;
  city?: string;
  patient_unique_id?: string; // Present if existing patient
}

interface DoctorData {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  designation?: string;
  department?: string;
}

interface TestData {
  id: number;
  name: string;
  code?: string;
  department?: string;
  price: number;
}

interface RequestBody {
  patient: PatientData;
  doctor: DoctorData;
  tests: TestData[];
}

// Helper to get IST datetime
function getISTDateTime(): string {
  const now = new Date();
  const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000) - (now.getTimezoneOffset() * 60 * 1000));
  return istTime.toISOString().slice(0, 19).replace('T', ' ');
}

// Helper to generate medical_num (similar to PHP: 'sr' + YYYYmmddHHiiSS + random 3 digits)
function generateMedicalNum(): string {
  const now = getISTDateTime().replace(/[- :]/g, '').slice(0, 14);
  const random = Math.floor(Math.random() * 900) + 100;
  return `sr${now}${random}`;
}

// Helper to generate patient_unique_id (6 random digits)
function generatePatientUniqueId(): number {
  return Math.floor(Math.random() * 900000) + 100000;
}

// Helper to sanitize params (remove undefined)
function sanitizeParams(params: (string | number | null | undefined)[]): (string | number | null)[] {
  return params.map(param => param === undefined ? null : param);
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyAuthFromRequest(request);
    if (!user || !hasRole(user, [ROLES.LABORATORY])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Assume user has laboratory_id (from auth)
    const laboratory_id = user.laboratory_id; // Adjust based on your auth implementation
    if (!laboratory_id) {
      return NextResponse.json({ error: "Missing laboratory ID" }, { status: 400 });
    }

    const body: RequestBody = await request.json();
    const { patient, doctor, tests } = body;

    if (!patient || !doctor || !tests || tests.length === 0) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const now = getISTDateTime();
      const medical_num = generateMedicalNum();
      let referral_patient_id: number;
      let patient_unique_id: string | number = patient.patient_unique_id || generatePatientUniqueId();

      // Handle patient: new or existing
      if (!patient.patient_unique_id) {
        // New patient: insert into referral_patient_details
        const [insertResult] = await connection.execute<ResultSetHeader>(
          `INSERT INTO referral_patient_details 
           (firstname, lastname, gender, mailid, phonenum, date_of_birth, age, address, pincode, state, city, created_on) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          sanitizeParams([
            patient.firstName,
            patient.lastName,
            patient.gender,
            patient.email,
            patient.phone,
            patient.dob,
            patient.age,
            patient.address,
            patient.pincode,
            patient.state,
            patient.city,
            now
          ])
        );

        referral_patient_id = insertResult.insertId;

        // Update patient_unique_id
        await connection.execute(
          `UPDATE referral_patient_details SET patient_unique_id = ? WHERE referral_patient_id = ?`,
          [patient_unique_id, referral_patient_id]
        );
      } else {
        // Existing patient: fetch referral_patient_id
        const [patientRows] = await connection.query<RowDataPacket[]>(
          `SELECT referral_patient_id FROM referral_patient_details WHERE patient_unique_id = ? LIMIT 1`,
          [patient.patient_unique_id]
        );

        if (patientRows.length === 0) {
          throw new Error("Existing patient not found");
        }

        referral_patient_id = patientRows[0].referral_patient_id;

        // Optionally update patient details if needed
        await connection.execute(
          `UPDATE referral_patient_details 
           SET firstname = ?, lastname = ?, gender = ?, mailid = ?, phonenum = ?, date_of_birth = ?, age = ?, 
               address = ?, pincode = ?, state = ?, city = ?, updated_on = ? 
           WHERE referral_patient_id = ?`,
          sanitizeParams([
            patient.firstName,
            patient.lastName,
            patient.gender,
            patient.email,
            patient.phone,
            patient.dob,
            patient.age,
            patient.address,
            patient.pincode,
            patient.state,
            patient.city,
            now,
            referral_patient_id
          ])
        );
      }

      // Insert tests into referral_patient_test_details
      for (const test of tests) {
        await connection.execute(
          `INSERT INTO referral_patient_test_details 
           (main_patient_id, dependent_id, laboratory_id, physician_id, laboratory_tests, date, time, instruction, pat_status, created_on) 
           VALUES (?, 0, ?, ?, ?, ?, ?, NULL, 1, ?)`,
          [
            referral_patient_id,
            laboratory_id,
            doctor.id, // physician_id = doctor.id (laboratory_doctors_id or physician_id)
            test.id, // parse_id / laboratory_tests
            now.split(' ')[0], // date
            now.split(' ')[1], // time
            now
          ]
        );
      }

      // Insert into referral_confirmation_details
      const [rcdInsert] = await connection.execute<ResultSetHeader>(
        `INSERT INTO referral_confirmation_details 
         (medical_num, laboratory_id, patient_unique_id, lab_test_status, billing_status, ref_type, refer_date) 
         VALUES (?, ?, ?, 1, 0, 'I', ?)`,
        [medical_num, laboratory_id, patient_unique_id, now.split(' ')[0]]
      );
      const referred_id = rcdInsert.insertId;

      // Insert into patientqueue (simplified based on pq query)
      await connection.execute(
        `INSERT INTO patientqueue 
         (medical_num, mailid, phonenum, refer_date, created_on, patient_unique_id, 
          referred_id, laboratory_id, ref_type, lab_test_status, billing_status, physician_id, firstname) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'I', 1, 0, ?, ?)`,
        [
          medical_num,
          patient.email || null,
          patient.phone,
          now.split(' ')[0],
          now,
          patient_unique_id,
          referred_id,
          laboratory_id,
          doctor.id,
          patient.firstName
        ]
      );

      // Commit
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: "Patient referral added successfully",
        data: {
          medicalNum: medical_num,
          patientUniqueId: patient_unique_id
        }
      }, { status: 201 });

    } catch (txError) {
      await connection.rollback();
      console.error("Transaction error:", txError);
      throw txError;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error("AddPatient API Error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}