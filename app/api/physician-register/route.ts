import { NextResponse } from "next/server";
import { query } from "@/app/lib/mysql"; // Import your raw query helper
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      firstname,
      lastname,
      phone_num,
      alternate_phone_number,
      mail_id,
      specialization,
      clinic_name,
      clinic_phonenum,
      clinic_alternate_phonenum,
      clinic_manager,
      registration_number,
      state,
      city,
      locality,
      pincode,
      address,
      status,
    } = body;

    // 1. Validate required fields
    if (!lastname || !phone_num || !mail_id || !state || !city || !address) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. Check if physician already exists by email or phone
    const existingPhysicians = await query<RowDataPacket[]>(
      "SELECT id FROM physician_appointment WHERE mail_id = ? OR phone_num = ? LIMIT 1",
      [mail_id, phone_num]
    );

    if (existingPhysicians.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Physician with this email or phone number already exists",
        },
        { status: 400 }
      );
    }

    // 3. Insert new physician record
    const insertSql = `
      INSERT INTO physician_appointment (
        firstname, lastname, phone_num, alternate_phone_number, mail_id,
        specialization, clinic_name, clinic_phonenum, clinic_alternate_phonenum,
        clinic_manager, registration_number, state, city, locality,
        pincode, address, status, active, role_id, created_by_id,
        clinic_module_activated, Signature_image, consultation_fee_validity
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      firstname || null,
      lastname,
      phone_num,
      alternate_phone_number || "",
      mail_id,
      specialization || null,
      clinic_name || null,
      clinic_phonenum || "",
      clinic_alternate_phonenum || "",
      clinic_manager || "",
      registration_number || null,
      state,
      city,
      locality || "",
      pincode ? parseInt(pincode) : null,
      address,
      status ? parseInt(status) : null,
      1, // active (true/1)
      1, // role_id
      0, // created_by_id
      0, // clinic_module_activated
      "", // Signature_image
      "" // consultation_fee_validity
    ];

    const result = await query<ResultSetHeader>(insertSql, params);

    // 4. Return success response with the new ID
    return NextResponse.json(
      {
        ok: true,
        message: "Physician registered successfully",
        data: {
          id: result.insertId,
          ...body,
          active: 1,
          role_id: 1
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Registration error:", errorMessage);
    return NextResponse.json(
      { ok: false, error: "Failed to register physician" },
      { status: 500 }
    );
  }
}