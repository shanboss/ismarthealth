import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/lib/mysql";
import { verifyAuthFromRequest, ROLES, hasRole } from "@/app/lib/auth";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import crypto from "crypto";

// Define an interface for the Doctor row to maintain type safety
interface DoctorRow extends RowDataPacket {
  laboratory_doctors_id: number;
  laboratory_id: number;
  doc_firstname: string;
  doc_lastname: string;
  doc_phone_number: string;
  doc_email: string;
  doc_designation: string;
  doc_dept?: number;
  is_active: number;
}

function hashPassword(password: string): string {
  return crypto.createHash("md5").update(password).digest("hex");
}

export async function GET(request: NextRequest) {
  try {
    // 1. Verify user authorization
    const user = verifyAuthFromRequest(request);
    
    if (!user || !hasRole(user, [ROLES.LABORATORY, ROLES.BILLING, ROLES.SAMPLES, ROLES.LAB_REPORTS])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get laboratory_id from authenticated user
    const laboratoryId = user.laboratory_id;

    if (!laboratoryId) {
      return NextResponse.json({ error: "Laboratory ID not found" }, { status: 400 });
    }

    // 3. Get search query parameter
    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get("search") || "";

    // 4. Construct SQL and Parameters
    let sql = "SELECT * FROM laboratory_doctors WHERE laboratory_id = ?";
    const params: (string | number)[] = [laboratoryId];

    // Add search conditions if search query exists
    if (searchQuery.trim()) {
      const searchWildcard = `%${searchQuery}%`;
      sql += ` AND (
        doc_firstname LIKE ? OR 
        doc_lastname LIKE ? OR 
        doc_phone_number LIKE ? OR 
        doc_email LIKE ? OR 
        doc_designation LIKE ?
      )`;
      
      // Add the same wildcard 5 times for each OR field
      params.push(searchWildcard, searchWildcard, searchWildcard, searchWildcard, searchWildcard);
    }

    // Add ordering
    sql += " ORDER BY doc_firstname ASC";

    // 5. Execute the query
    const doctors = await query<DoctorRow[]>(sql, params);

    return NextResponse.json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching laboratory doctors:", message);
    
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyAuthFromRequest(request);
    if (
      !user ||
      !hasRole(user, [ROLES.LABORATORY, ROLES.BILLING])
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

    const body = await request.json();
    const {
      firstName,
      lastName,
      phone,
      email,
      designation,
      department = 0,
      password,
    } = body as {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      designation: string;
      department?: number;
      password?: string;
    };

    if (!firstName?.trim() || !lastName?.trim() || !phone?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "First name, last name, phone, and email are required" },
        { status: 400 }
      );
    }

    const docPassword = password?.trim()
      ? hashPassword(password)
      : hashPassword(Math.random().toString(36).slice(-8));

    const result = await query<ResultSetHeader>(
      `INSERT INTO laboratory_doctors (
        laboratory_id, doc_firstname, doc_lastname, doc_phone_number,
        doc_email, doc_designation, doc_dept, doc_password, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        laboratoryId,
        firstName.trim(),
        lastName.trim(),
        phone.trim(),
        email.trim(),
        (designation || "").trim(),
        Number(department) || 0,
        docPassword,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Doctor added successfully",
        data: { id: result.insertId },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error adding doctor:", message);
    return NextResponse.json(
      { error: "Failed to add doctor", details: message },
      { status: 500 }
    );
  }
}