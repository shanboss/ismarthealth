import { NextResponse } from "next/server";
import { query } from "@/app/lib/mysql";
import { ResultSetHeader } from 'mysql2/promise';

export async function GET() {
  try {
    const versionRows = await query<{ version: string }[]>("SELECT VERSION() AS version");
    const nowRows = await query<{ now: string }[]>("SELECT NOW() AS now");

    return NextResponse.json({
      ok: true,
      version: versionRows[0]?.version ?? null,
      now: nowRows[0]?.now ?? null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "DB connection failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      firstName, lastName, phone, email, specialization,
      clinicName, clinicPhone, registrationNumber, degree,
      state, city, locality, pinCode, landMark, address, status,
    } = body;

    // 1. Check if physician already exists
    const existing = (await query(
      "SELECT id FROM physician_appointment WHERE email = ? OR phone = ? LIMIT 1",
      [email, phone]
    )) as unknown as { id: number }[];

    if (existing.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Physician with this email or phone number already exists",
          existingId: existing[0].id,
        },
        { status: 400 }
      );
    }

    // 2. Create new physician appointment record
    const sql = `
      INSERT INTO physician_appointment (
        firstName, lastName, phone, email, specialization, 
        clinicName, clinicPhone, registrationNumber, degree, 
        state, city, locality, pinCode, landMark, address, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      firstName ?? null, lastName, phone, email, specialization,
      clinicName ?? null, clinicPhone ?? null, registrationNumber ?? null, degree ?? null,
      state, city, locality ?? null, pinCode ?? null, landMark ?? null, address, status
    ];

  const result = (await query(sql, params)) as unknown as ResultSetHeader;

    return NextResponse.json(
      {
        ok: true,
        message: "Physician registered successfully",
        data: { id: result.insertId, ...body },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to register physician" },
      { status: 500 }
    );
  }
}