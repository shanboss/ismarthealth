import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/lib/mysql";
import { verifyAuthFromRequest, ROLES, hasRole } from "@/app/lib/auth";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import crypto from "crypto";

async function generatePatientUniqueId(
  firstName: string,
  phone: string,
): Promise<string> {
  const prefix = "ISD";
  const firstTwoChars = firstName.substring(0, 2).toLowerCase();
  const lastDigit = phone.slice(-1);
  let attempts = 0;
  let patientUniqueId: string;
  do {
    const random = Math.floor(Math.random() * 1000);
    patientUniqueId = `${prefix}${firstTwoChars}${lastDigit}${random}`;
    const existing = await query<RowDataPacket[]>(
      `SELECT patient_unique_id FROM referral_patient_details 
       WHERE patient_unique_id = ? LIMIT 1`,
      [patientUniqueId],
    );
    if (existing.length === 0) break;
    attempts++;
    if (attempts > 10) {
      patientUniqueId = `${prefix}${firstTwoChars}${lastDigit}${Date.now().toString().slice(-6)}`;
      break;
    }
  } while (true);
  return patientUniqueId;
}

function hashPassword(password: string): string {
  return crypto.createHash("md5").update(password).digest("hex");
}

function getISTDateTime(): string {
  const now = new Date();
  const istTime = new Date(
    now.getTime() + 5.5 * 60 * 60 * 1000 - now.getTimezoneOffset() * 60 * 1000,
  );
  return istTime.toISOString().slice(0, 19).replace("T", " ");
}

export async function POST(request: NextRequest) {
  try {
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
        { status: 400 },
      );
    }

    const body = await request.json();
    const {
      patient,
      specialist,
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
        patient_unique_id?: string;
      };
      specialist: {
        name: string;
        specialty: string;
        hospital: string;
      };
    } = body;

    if (!patient?.firstName || !patient?.phone) {
      return NextResponse.json(
        { error: "Missing required fields: patient firstName and phone" },
        { status: 400 },
      );
    }
    if (!specialist?.name || !specialist?.specialty || !specialist?.hospital) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: specialist name, specialty, and hospital",
        },
        { status: 400 },
      );
    }

    const patientUniqueIdFromRequest = (
      patient as { patient_unique_id?: string }
    ).patient_unique_id;
    let existingPatients: RowDataPacket[] = [];

    if (patientUniqueIdFromRequest) {
      existingPatients = await query<RowDataPacket[]>(
        `SELECT referral_patient_id, patient_unique_id 
         FROM referral_patient_details 
         WHERE patient_unique_id = ? LIMIT 1`,
        [patientUniqueIdFromRequest],
      );
    }
    if (existingPatients.length === 0) {
      existingPatients = await query<RowDataPacket[]>(
        `SELECT referral_patient_id, patient_unique_id 
         FROM referral_patient_details 
         WHERE phonenum = ? LIMIT 1`,
        [patient.phone],
      );
    }

    let referralPatientId: number;
    let patientUniqueId: string;
    const now = getISTDateTime();
    const referDate = new Date().toISOString().split("T")[0];

    if (existingPatients.length > 0) {
      referralPatientId = existingPatients[0].referral_patient_id as number;
      patientUniqueId = existingPatients[0].patient_unique_id as string;
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
          ],
        );
      }
    } else {
      patientUniqueId = await generatePatientUniqueId(
        patient.firstName,
        patient.phone,
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
          "1",
          now,
          1,
          3,
          patientUniqueId,
          "",
          "disabled",
          0,
          0,
          0,
        ],
      );
      referralPatientId = insertPatientResult.insertId;
    }

    const maxRow = await query<RowDataPacket[]>(
      `SELECT COALESCE(MAX(consultationId), 0) AS max_id FROM superspeciality_consultation`,
    );
    const consultationId = (Number(maxRow[0]?.max_id) || 0) + 1;

    // Discover columns that require explicit values (NOT NULL, no default, not auto_increment)
    const requiredColumns = await query<RowDataPacket[]>(
      `SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'superspeciality_consultation'
       AND IS_NULLABLE = 'NO' AND (COLUMN_DEFAULT IS NULL OR COLUMN_DEFAULT = '')
       AND EXTRA NOT LIKE '%auto_increment%'
       ORDER BY ORDINAL_POSITION`,
    );

    const nowStr = getISTDateTime();
    const defaultFor = (col: string, dataType: string): string | number => {
      const lower = col.toLowerCase();
      const type = (dataType || "").toLowerCase();
      if (lower === "consultationid") return consultationId;
      if (lower === "referral_patient_id") return referralPatientId;
      if (lower === "laboratory_id") return laboratoryId;
      if (lower === "referdate") return referDate;
      if (lower === "totalamount") return 0;
      if (lower === "status") return 0;
      if (lower === "patient_dep_id") return 0;
      if (lower === "superspeciality_id") return 0;
      if (
        lower === "comments" ||
        lower === "notes" ||
        lower === "remarks" ||
        lower === "comment"
      )
        return "";
      if (
        type.includes("int") ||
        type.includes("decimal") ||
        type.includes("float")
      )
        return 0;
      if (type.includes("date") || type.includes("time")) return nowStr;
      return "";
    };

    const cols = requiredColumns.map((r) => r.COLUMN_NAME as string);
    const placeholders = cols.map(() => "?").join(", ");
    const values = requiredColumns.map((r) =>
      defaultFor(r.COLUMN_NAME as string, r.DATA_TYPE as string),
    );

    await query<ResultSetHeader>(
      `INSERT INTO superspeciality_consultation (${cols.join(", ")}) VALUES (${placeholders})`,
      values,
    );

    const referralId = `SS${consultationId}`;
    return NextResponse.json(
      {
        success: true,
        message: "Super specialty referral created successfully",
        data: {
          referralId,
          consultationId,
          patientUniqueId,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error adding superspecialty referral:", message);
    console.error("Error stack:", error instanceof Error ? error.stack : "");
    return NextResponse.json(
      {
        error: "Failed to add superspecialty referral",
        details: message,
      },
      { status: 500 },
    );
  }
}
