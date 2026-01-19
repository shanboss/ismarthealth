import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
import { query } from "@/app/lib/mysql"; // Using the helper from your new mysql.ts
import jwt from "jsonwebtoken";
import { RowDataPacket } from 'mysql2/promise';

// Type for the login request body
interface LoginRequest {
  phone_num: string;
  password: string;
}

export interface UserRow extends RowDataPacket {
  login_id: number;
  firstname: string | null;
  physician_id: number | null;
  laboratory_id: number | null;
  patient_id: number | null;
  phy_admin_id: number | null;
  username: string;
  password: string;
  phone_num: string;
  state: string | null;
  city: string | null;
  count: number;
  role_id: number;
  active: number; // usually 0 or 1 in MySQL
  last_login: Date | string | null;
  created_on: Date | string;
  updated_on: Date | string;
  otp: string | null;
  device_id: string | null;
  player_id: string | null;
}

interface RoleRow extends RowDataPacket {
  name: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    // 1. Validate required fields
    if (!body.phone_num || !body.password) {
      return NextResponse.json(
        { error: "Missing required fields: phone_num, password" },
        { status: 400 }
      );
    }

    // 2. Find user by phone number using raw SQL
   const users = await query<UserRow>("SELECT * FROM login_details WHERE phone_num = ? LIMIT 1",[body.phone_num])

   if (users.length > 0) {
    const user = users[0];
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials-1" },
        { status: 401 }
      );
    }
    console.log(`Welcome back, ${user.firstname ?? user.username}`);
    
    // 3. Check if user is active
    if (user.active !== 1) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 403 }
      );
    }

        // 4. Verify password (MD5 as per your original logic)
    const hashedInput = crypto.createHash('md5').update(body.password).digest('hex');
    const passwordMatch = (hashedInput === user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials-2" },
        { status: 401 }
      );
    }

    // 5. Update last login time and count
    await query(
      "UPDATE login_details SET last_login = NOW(), count = count + 1 WHERE phone_num = ?",
      [body.phone_num]
    );

    // 6. Get role name from the user/role table
 
    const roles = await query<RoleRow>(
      "SELECT name FROM user WHERE role_id = ? LIMIT 1",
      [user.role_id]
    );
    const roleName = roles[0]?.name || "Unknown";

    // 7. Generate JWT token
    const token = jwt.sign(
      {
        login_id: user.login_id,
        phone_num: user.phone_num,
        role_id: user.role_id,
        role_name: roleName,
        laboratory_id: user.laboratory_id,
        physician_id: user.physician_id,
      },
      process.env.JWT_SECRET || "your-secret-key-change-this",
      { expiresIn: "7d" }
    );

    // 8. Create response with user data
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        login_id: user.login_id,
        firstname: user.firstname,
        username: user.username,
        phone_num: user.phone_num,
        role_id: user.role_id,
        role_name: roleName,
        physician_id: user.physician_id,
        laboratory_id: user.laboratory_id,
        patient_id: user.patient_id,
        phy_admin_id: user.phy_admin_id,
        state: user.state,
        city: user.city,
        last_login: new Date(), // Reflecting the update just made
      },
      token,
    });

    // 9. Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;

  } else {
    console.log("No user found with that phone number.");
  }

    
   

    



  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error during login" },
      { status: 500 }
    );
  }
}