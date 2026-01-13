import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Type for the login request body
interface LoginRequest {
  phone_num: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    console.log("Login request body:", body);

    // Validate required fields
    if (!body.phone_num || !body.password) {
      return NextResponse.json(
        { error: "Missing required fields: phone_num, password" },
        { status: 400 }
      );
    }

    // Find user by phone number
    const user = await prisma.login_details.findUnique({
      where: { phone_num: body.phone_num },
    });

    console.log("user=", user);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials-1" },
        { status: 401 }
      );
    }

    // Check if user is active
    if (user.active !== 1) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 403 }
      );
    }



    // Verify password
    const passwordMatch = (body.password === user.password)?true:false; //await bcrypt.compare(body.password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials-2" },
        { status: 401 }
      );
    }

    // Update last login time
    await prisma.login_details.update({
      where: { phone_num: body.phone_num },
      data: {
        last_login: new Date(),
        count: user.count + 1,
      },
    });

    // Get role name
    const role = await prisma.user.findUnique({
      where: { role_id: user.role_id },
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        login_id: user.login_id,
        phone_num: user.phone_num,
        role_id: user.role_id,
        role_name: role?.name || "Unknown",
        laboratory_id: user.laboratory_id,
        physician_id: user.physician_id,
      },
      process.env.JWT_SECRET || "your-secret-key-change-this",
      { expiresIn: "7d" }
    );

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        login_id: user.login_id,
        firstname: user.firstname,
        username: user.username,
        phone_num: user.phone_num,
        role_id: user.role_id,
        role_name: role?.name || "Unknown",
        physician_id: user.physician_id,
        laboratory_id: user.laboratory_id,
        patient_id: user.patient_id,
        phy_admin_id: user.phy_admin_id,
        state: user.state,
        city: user.city,
        last_login: user.last_login,
      },
      token,
    });

    // Set HTTP-only cookie with the token
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error during login" },
      { status: 500 }
    );
  }
}
