import { NextRequest, NextResponse } from "next/server";
import pool, { query } from "@/app/lib/mysql";
import { verifyAuthFromRequest, ROLES, hasRole } from "@/app/lib/auth";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import crypto from "crypto";

// Helper to sanitize params (avoid undefined)
function sanitizeParams(
  params: (string | number | boolean | null | undefined)[]
): (string | number | boolean | null)[] {
  return params.map((p) => (p === undefined ? null : p));
}

// Helper function to generate medical_num
async function generateMedicalNum(
  firstName: string,
  phone: string,
  labId: number
): Promise<string> {
  const firstTwoChars = firstName.substring(0, 2).toLowerCase();
  const lastTwoDigits = phone.slice(-2);
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  const datePart = `${day}${month}${year}`;

  // Get the last sequence number for today
  const today = now.toISOString().split("T")[0];
  const existing = await query<RowDataPacket[]>(
    `SELECT medical_num FROM patientqueue 
     WHERE laboratory_id = ? AND DATE(created_on) = ? 
     ORDER BY patientqueue_id DESC LIMIT 1`,
    [labId, today]
  );

  let sequence = 1;
  if (existing.length > 0) {
    const lastMedicalNum = existing[0].medical_num as string;
    // Extract sequence from last medical_num (last 2 digits)
    const lastSeq = parseInt(lastMedicalNum.slice(-2)) || 0;
    sequence = lastSeq + 1;
  }

  return `${firstTwoChars}${lastTwoDigits}${datePart}${String(sequence).padStart(2, "0")}`;
}

// Helper function to generate patient_unique_id
async function generatePatientUniqueId(
  firstName: string,
  phone: string,
  physicianId?: number | null
): Promise<string> {
  const prefix = physicianId ? "" : "ISD";
  const firstTwoChars = firstName.substring(0, 2).toLowerCase();
  const lastDigit = phone.slice(-1);
  
  // Try to generate a unique ID (check for conflicts)
  let attempts = 0;
  let patientUniqueId: string;
  do {
    const random = Math.floor(Math.random() * 1000);
    patientUniqueId = `${prefix}${firstTwoChars}${lastDigit}${random}`;
    
    const existing = await query<RowDataPacket[]>(
      `SELECT patient_unique_id FROM referral_patient_details 
       WHERE patient_unique_id = ? LIMIT 1`,
      [patientUniqueId]
    );
    
    if (existing.length === 0) {
      break; // Unique ID found
    }
    
    attempts++;
    if (attempts > 10) {
      // Fallback: use timestamp
      patientUniqueId = `${prefix}${firstTwoChars}${lastDigit}${Date.now().toString().slice(-6)}`;
      break;
    }
  } while (true);
  
  return patientUniqueId;
}

// Helper function to generate password hash
function hashPassword(password: string): string {
  return crypto.createHash("md5").update(password).digest("hex");
}

// Helper to get IST datetime
function getISTDateTime(): string {
  const now = new Date();
  const istTime = new Date(
    now.getTime() +
      5.5 * 60 * 60 * 1000 -
      now.getTimezoneOffset() * 60 * 1000
  );
  return istTime.toISOString().slice(0, 19).replace("T", " ");
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verify authorization
    const user = verifyAuthFromRequest(request);
    if (
      !user ||
      !hasRole(user, [ROLES.LABORATORY, ROLES.BILLING, ROLES.SAMPLES])
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const laboratoryId = user.laboratory_id;
    if (!laboratoryId) {
      return NextResponse.json(
        { error: "Laboratory ID not found" },
        { status: 400 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const {
      patient,
      doctor,
      tests,
    }: {
      patient: {
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
        patient_unique_id?: string; // Optional: for existing patients from search
      };
      doctor?: {
        id: number;
        name: string;
        phone: string;
        email: string;
        designation: string;
        department: number;
      };
      tests: Array<{
        id: number;
        name: string;
        department: string;
        price: string;
        code: string;
      }>;
    } = body;

    // 3. Validate required fields
    if (!patient?.firstName || !patient?.phone || !tests || tests.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: patient firstName, phone, and tests" },
        { status: 400 }
      );
    }

    // 4. Check if patient already exists by phone or patient_unique_id (if provided)
    const patientUniqueIdFromRequest = (patient as any).patient_unique_id;
    let existingPatients: RowDataPacket[] = [];
    
    if (patientUniqueIdFromRequest) {
      // If patient_unique_id is provided (from search), use it
      existingPatients = await query<RowDataPacket[]>(
        `SELECT referral_patient_id, patient_unique_id 
         FROM referral_patient_details 
         WHERE patient_unique_id = ? LIMIT 1`,
        [patientUniqueIdFromRequest]
      );
    }
    
    // If not found by patient_unique_id, try phone
    if (existingPatients.length === 0) {
      existingPatients = await query<RowDataPacket[]>(
        `SELECT referral_patient_id, patient_unique_id 
         FROM referral_patient_details 
         WHERE phonenum = ? LIMIT 1`,
        [patient.phone]
      );
    }

    let referralPatientId: number;
    let patientUniqueId: string;
    const now = getISTDateTime();
    const referDate = new Date().toISOString().split("T")[0];

    if (existingPatients.length > 0) {
      // Use existing patient
      referralPatientId = existingPatients[0].referral_patient_id;
      patientUniqueId = existingPatients[0].patient_unique_id;

      // Update patient details if provided
      if (
        patient.firstName ||
        patient.lastName ||
        patient.email ||
        patient.address
      ) {
        await query<ResultSetHeader>(
          `UPDATE referral_patient_details 
           SET firstname = COALESCE(?, firstname),
               lastname = COALESCE(?, lastname),
               mailid = COALESCE(?, mailid),
               address = COALESCE(?, address),
               city = COALESCE(?, city),
               state = COALESCE(?, state),
               pincode = COALESCE(?, pincode),
               gender = COALESCE(?, gender),
               date_of_birth = COALESCE(?, date_of_birth),
               age = COALESCE(?, age),
               updated_on = ?
           WHERE referral_patient_id = ?`,
          [
            patient.firstName || null,
            patient.lastName || null,
            patient.email || null,
            patient.address || null,
            patient.city || null,
            patient.state || null,
            patient.pincode || null,
            patient.gender || null,
            patient.dob || null,
            patient.age || null,
            now,
            referralPatientId,
          ]
        );
      }
    } else {
      // Create new patient
      patientUniqueId = await generatePatientUniqueId(
        patient.firstName,
        patient.phone,
        doctor?.id
      );
      const password = Math.random().toString(36).slice(-4);
      const hashedPassword = hashPassword(password);

      const insertPatientResult = await query<ResultSetHeader>(
        `INSERT INTO referral_patient_details (
          firstname, lastname, gender, date_of_birth, age,
          address, state, city, pincode, mailid, phonenum,
          password, relationship, created_on, active, role_id,
          patient_unique_id, physician_id, status, r_count, count, prescribe_receipt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          patient.firstName,
          patient.lastName || "",
          patient.gender || null,
          patient.dob || null,
          patient.age || null,
          patient.address || null,
          patient.state || null,
          patient.city || null,
          patient.pincode || null,
          patient.email || "",
          patient.phone,
          hashedPassword,
          "1", // relationship: Self
          now,
          1, // active
          3, // role_id: PATIENT
          patientUniqueId,
          doctor?.id?.toString() || "",
          "disabled",
          0, // r_count
          0, // count
          0, // prescribe_receipt
        ]
      );

      referralPatientId = insertPatientResult.insertId;
    }

    // 5. Generate medical_num
    const medicalNum = await generateMedicalNum(patient.firstName, patient.phone, laboratoryId);

    // 6. Get next referred_id (unique across table; use global max)
    const maxReferred = await query<RowDataPacket[]>(
      `SELECT COALESCE(MAX(referred_id), 0) AS max_id FROM referral_confirmation_details`
    );
    const referredId = (Number(maxReferred[0]?.max_id) || 0) + 1;

    // 7. Generate password for referral
    const referralPassword = Math.random().toString(36).slice(-4);

    // 8. Calculate billing totals from tests
    const totAmt = tests.reduce((sum, t) => sum + (parseFloat(t.price) || 0), 0);
    const laboratoryTestsRef = tests.map((t) => t.id).join(","); // Reference all purchased items

    // 9. Use transaction for billing + referral + queue + test details
    const connection = await pool.getConnection();
    let billingId: number;
    let uniqueBillId: string;

    try {
      await connection.beginTransaction();

      // 9a. Generate unique_billid for the laboratory
      const [lastBillRows] = await connection.execute<RowDataPacket[]>(
        "SELECT unique_billid FROM billing WHERE lab_id = ? ORDER BY billing_id DESC LIMIT 1",
        [laboratoryId]
      );
      const currentDate = new Date().toISOString().slice(0, 7).replace("-", ""); // YYYYMM
      if (lastBillRows.length > 0) {
        const oldUniqueBillId = lastBillRows[0].unique_billid as string;
        const numericPart = parseInt(oldUniqueBillId.slice(-4)) || 0;
        uniqueBillId = oldUniqueBillId.slice(0, -4) + String(numericPart + 1).padStart(4, "0");
      } else {
        uniqueBillId = currentDate + "0001";
      }

      // 9b. Create billing entry (references all purchased items)
      const [billingResult] = await connection.execute<ResultSetHeader>(
        `INSERT INTO billing (
          laboratory_tests, medical_num, patient_unique_id, tot_amt, discount, discount_type,
          net_amt, adv_amt, balance_amt, balance_pymnt2, final_balance, lab_id, unique_billid, created_on
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        sanitizeParams([
          laboratoryTestsRef,
          medicalNum,
          patientUniqueId,
          totAmt,
          0,
          0, // discount_type: 0 = none
          totAmt,
          0,
          totAmt,
          0,
          totAmt,
          laboratoryId,
          uniqueBillId,
          now,
        ])
      );
      billingId = billingResult.insertId;

      // 9c. Create referral_confirmation_details entry
      await connection.execute(
        `INSERT INTO referral_confirmation_details (
          referred_id, medical_num, relationship, referral_pat_id, password,
          patient_unique_id, refer_date, created_by, login_id, created_on,
          ref_type, lab_test_status, billing_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        sanitizeParams([
          referredId,
          medicalNum,
          "1",
          referralPatientId,
          referralPassword,
          patientUniqueId,
          referDate,
          user.role_name || "Lab User",
          user.login_id,
          now,
          "I",
          0,
          0,
        ])
      );

      // 9d. Create patientqueue entry with billing_id and BillId (unique_billid)
      await connection.execute(
        `INSERT INTO patientqueue (
          BillId, medical_num, firstname, mailid, phonenum, refer_date,
          patient_unique_id, physician_id, phyfname, referred_id, ID,
          billing_id, laboratory_id, ref_type, lab_test_status, billing_status, is_sync
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        sanitizeParams([
          uniqueBillId,
          medicalNum,
          patient.firstName,
          patient.email || "",
          patient.phone,
          referDate,
          patientUniqueId,
          doctor?.id || null,
          doctor?.name || null,
          referredId,
          referralPatientId,
          billingId,
          laboratoryId,
          "I",
          0,
          0,
          0,
        ])
      );

      // 9e. Create referral_patient_test_details entries for each test (with billing_id)
      const datePart = referDate;
      const timePart = now.split(" ")[1] || "00:00:00";
      for (const test of tests) {
        await connection.execute(
          `INSERT INTO referral_patient_test_details (
            medical_num, laboratory_tests, parse_parent_id, has_child, time, date, instruction,
            patient_unique_id, physician_id, laboratory_id, dependent_id, main_patient_id,
            billing_id, billing_datetime, sample_collected_id, sample_datetime, labapproval_id,
            labapproval_datetime, pat_status, approved_lab_doc_id, editor, created_on
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          sanitizeParams([
            medicalNum,
            test.id.toString(),
            0, // parse_parent_id: 0 for top-level tests (billing query filters by this)
            0, // has_child
            timePart,
            datePart,
            null,
            patientUniqueId,
            doctor?.id || null,
            laboratoryId,
            0,
            referralPatientId,
            billingId,
            now,
            0,
            now,
            0,
            now,
            0,
            0,
            "",
            now,
          ])
        );
      }

      await connection.commit();
    } catch (txError) {
      await connection.rollback();
      throw txError;
    } finally {
      connection.release();
    }

    // 10. Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Lab test patient added successfully",
        data: {
          medicalNum,
          patientUniqueId,
          referralPatientId,
          referredId,
          billingId,
          uniqueBillId,
          testsCount: tests.length,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error adding lab test patient:", message);
    console.error("Error stack:", error instanceof Error ? error.stack : "");
    return NextResponse.json(
      { error: "Failed to add lab test patient", details: message },
      { status: 500 }
    );
  }
}
