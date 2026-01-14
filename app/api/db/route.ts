import { NextResponse } from "next/server";
import { query } from "@/app/lib/mysql";
import { prisma } from "@/app/lib/prisma";




export async function GET() {
  try {
    const versionRows = await query<{ version: string }>("SELECT VERSION() AS version");
    const nowRows = await query<{ now: string }>("SELECT NOW() AS now");

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
      firstName,
      lastName,
      phone,
      email,
      specialization,
      clinicName,
      clinicPhone,
      registrationNumber,
      degree,
      state,
      city,
      locality,
      pinCode,
      landMark,
      address,
      status,
    } = body;

    // Check if physician already exists by email and phone
    const existingPhysician = await prisma.physician_appointment.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingPhysician) {
      return NextResponse.json(
        {
          ok: false,
          error: "Physician with this email or phone number already exists",
          existingId: existingPhysician.id,
        },
        { status: 400 }
      );
    }

    // Create new physician appointment record
    const newPhysician = await prisma.physician_appointment.create({
      data: {
        firstName || null,
        lastName,
        phone,
        email,
        specialization,
        clinicName: clinicName || null,
        clinicPhone: clinicPhone || null,
        registrationNumber: registrationNumber || null,
        degree: degree || null,
        state,
        city,
        locality: locality || null,
        pinCode: pinCode || null,
        landMark: landMark || null,
        address,
        status,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Physician registered successfully",
        data: newPhysician,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to register physician" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}





