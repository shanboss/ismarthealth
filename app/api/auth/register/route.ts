import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcrypt";

// Type for the registration request body
interface RegisterRequest {
  firstname: string;
  username: string;
  password: string;
  phone_num: string;
  role_id: number;
  state: number;
  city: number;
  physician_id?: number;
  laboratory_id?: number;
  patient_id?: number;
  phy_admin_id?: number;
  device_id?: string;
  player_id?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();

    // Validate required fields
    if (!body.firstname || !body.username || !body.password || !body.phone_num) {
      return NextResponse.json(
        { error: "Missing required fields: firstname, username, password, phone_num" },
        { status: 400 }
      );
    }

    if (!body.role_id || !body.state || !body.city) {
      return NextResponse.json(
        { error: "Missing required fields: role_id, state, city" },
        { status: 400 }
      );
    }

    // Validate role_id (1-8 based on your roles table)
    if (body.role_id < 1 || body.role_id > 8) {
      return NextResponse.json(
        { error: "Invalid role_id. Must be between 1 and 8" },
        { status: 400 }
      );
    }

    // Check if user already exists (phone_num is the primary key)
    const existingUser = await prisma.login_details.findUnique({
      where: { phone_num: body.phone_num },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this phone number already exists" },
        { status: 409 }
      );
    }

    // Check if username is already taken
    const existingUsername = await prisma.login_details.findFirst({
      where: { username: body.username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 }
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    // Create the user
    const newUser = await prisma.login_details.create({
      data: {
        firstname: body.firstname,
        username: body.username,
        password: hashedPassword,
        phone_num: body.phone_num,
        role_id: body.role_id,
        state: body.state,
        city: body.city,
        physician_id: body.physician_id || null,
        laboratory_id: body.laboratory_id || null,
        patient_id: body.patient_id || null,
        phy_admin_id: body.phy_admin_id || null,
        count: 0,
        active: 1,
        otp: 0,
        device_id: body.device_id || "",
        player_id: body.player_id || "",
        updated_on: new Date(),
      },
    });

    // Return success response (excluding password)
    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      user: {
        login_id: newUser.login_id,
        firstname: newUser.firstname,
        username: newUser.username,
        phone_num: newUser.phone_num,
        role_id: newUser.role_id,
        created_on: newUser.created_on,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 }
    );
  }
}

