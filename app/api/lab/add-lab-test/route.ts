import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/lib/mysql";
import { verifyAuthFromRequest, ROLES, hasRole } from "@/app/lib/auth";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import crypto from "crypto";

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

    // 8. Create referral_confirmation_details entry
    await query<ResultSetHeader>(
      `INSERT INTO referral_confirmation_details (
        referred_id, medical_num, relationship, referral_pat_id, password,
        patient_unique_id, refer_date, created_by, login_id, created_on,
        ref_type, lab_test_status, billing_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        referredId,
        medicalNum,
        "1", // relationship: Self
        referralPatientId,
        referralPassword,
        patientUniqueId,
        referDate,
        user.role_name || "Lab User",
        user.login_id,
        now,
        "I", // ref_type: Individual tests
        0, // lab_test_status: Queue
        0, // billing_status: Not billed
      ]
    );

    // 9. Create patientqueue entry
    const patientQueueResult = await query<ResultSetHeader>(
      `INSERT INTO patientqueue (
        BillId, medical_num, firstname, mailid, phonenum, refer_date,
        patient_unique_id, physician_id, phyfname, referred_id, ID,
        billing_id, laboratory_id, ref_type, lab_test_status, billing_status, is_sync
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "", // BillId - empty initially, will be set when billing is done
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
        0, // billing_id - 0 initially
        laboratoryId,
        "I", // ref_type: Individual tests
        0, // lab_test_status: Queue
        0, // billing_status: Not billed
        0, // is_sync
      ]
    );

    // 10. Create referral_patient_test_details entries for each test
    const testInserts = tests.map((test) =>
      query<ResultSetHeader>(
        `INSERT INTO referral_patient_test_details (
          medical_num, laboratory_tests, parse_parent_id, has_child,
          patient_unique_id, physician_id, laboratory_id, dependent_id,
          main_patient_id, billing_id, billing_datetime, sample_collected_id,
          sample_datetime, labapproval_id, labapproval_datetime, pat_status,
          approved_lab_doc_id, editor, created_on
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          medicalNum,
          test.id.toString(), // laboratory_tests stores test ID
          test.id, // parse_parent_id
          0, // has_child
          patientUniqueId,
          doctor?.id || null,
          laboratoryId,
          0, // dependent_id
          referralPatientId,
          0, // billing_id - 0 initially
          now, // billing_datetime (NOT NULL; use order time until billed)
          0, // sample_collected_id
          now, // sample_datetime (NOT NULL; use order time until collected)
          0, // labapproval_id
          now, // labapproval_datetime (NOT NULL; use order time until approved)
          0, // pat_status: NA
          0, // approved_lab_doc_id
          "", // editor
          now,
        ]
      )
    );

    await Promise.all(testInserts);

    // 11. Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Lab test patient added successfully",
        data: {
          medicalNum,
          patientUniqueId,
          referralPatientId,
          referredId,
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
