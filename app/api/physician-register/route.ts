import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

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

    // Validate required fields
    if (!lastname || !phone_num || !mail_id || !state || !city || !address) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if physician already exists
    const existingPhysician = await prisma.physician_appointment.findFirst({
      where: {
        OR: [{ mail_id }, { phone_num }],
      },
    });

    if (existingPhysician) {
      return NextResponse.json(
        {
          ok: false,
          error: "Physician with this email or phone number already exists",
        },
        { status: 400 }
      );
    }

    // Create new physician
    const newPhysician = await prisma.physician_appointment.create({
      data: {
        firstname: firstname || null,
        lastname,
        phone_num,
        alternate_phone_number: alternate_phone_number || "",
        mail_id,
        specialization: specialization || null,
        clinic_name: clinic_name || null,
        clinic_phonenum: clinic_phonenum || "",
        clinic_alternate_phonenum: clinic_alternate_phonenum || "",
        clinic_manager: clinic_manager || "",
        registration_number: registration_number || null,
        state,
        city,
        locality: locality || "",
        pincode: pincode ? parseInt(pincode) : null,
        address,
        status: status ? parseInt(status) : null,
        active: true,
        role_id: 1,
        created_by_id: 0,
        clinic_module_activated: 0,
        Signature_image: "",
        consultation_fee_validity: "",
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
  }
}