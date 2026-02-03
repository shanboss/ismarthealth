import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/lib/mysql"; // Using the helper established in previous steps
import { verifyAuthFromRequest, ROLES, hasRole } from "@/app/lib/auth";
import { RowDataPacket } from "mysql2";

// Define an interface for the Patient Queue row to ensure type safety
interface PatientQueueRow extends RowDataPacket {
  id: number;
  BillId: string;
  firstname: string;
  phonenum: string;
  phyfname: string;
  medical_num: string;
  mailid: string;
  created_on: Date;
  laboratory_id: number;
}

export async function GET(request: NextRequest) {
  try {
    // 1. Verify user authorization
    const user = verifyAuthFromRequest(request);
    
    if (!user || !hasRole(user, [ROLES.LABORATORY, ROLES.BILLING, ROLES.SAMPLES, ROLES.LAB_REPORTS])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get pagination and search parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const searchQuery = searchParams.get("search") || "";

    const laboratoryId = user.laboratory_id;
    if (!laboratoryId) {
      return NextResponse.json({ error: "Laboratory ID not found" }, { status: 400 });
    }

    // 3. Build dynamic SQL for WHERE clause
    let whereSql = "WHERE p.laboratory_id = ?";
    const params: (string | number)[] = [laboratoryId];

    if (searchQuery.trim()) {
      const searchWildcard = `%${searchQuery}%`;
      whereSql += ` AND (p.lab_test_status !=5 OR p.bill_status !=2)`;
      whereSql += ` AND (
        p.BillId LIKE ? OR 
        p.firstname LIKE ? OR 
        p.phonenum LIKE ? OR 
        p.phyfname LIKE ? OR 
        p.medical_num LIKE ? OR 
        p.mailid LIKE ?
      )`;
      // Add the wildcard for each of the 6 searchable fields
      params.push(searchWildcard, searchWildcard, searchWildcard, searchWildcard, searchWildcard, searchWildcard);
    }

    // 4. Fetch Total Count for pagination
    const countSql = `SELECT COUNT(*) as total FROM patientqueue as p ${whereSql}`;
    const countResult = await query<RowDataPacket[]>(countSql, params);
    const totalCount = countResult[0]?.total || 0;

    // 5. Fetch Paginated Data
    // Note: LIMIT and OFFSET cannot use placeholders in MySQL prepared statements
    // They must be interpolated directly (safe since they're parsed integers)
    const safeLimit = Math.max(1, Math.min(limit, 100)); // Clamp between 1 and 100
    const safeSkip = Math.max(0, skip); // Ensure non-negative
    const dataSql = `
      SELECT p.*, b.balance_amt, b.final_balance, b.balance_pymnt2 FROM patientqueue as p left join billing as b 
      on p.medical_num = b.medical_num and p.patient_unique_id = b.patient_unique_id 
      ${whereSql} 
      ORDER BY p.created_on DESC 
      LIMIT ${safeLimit} OFFSET ${safeSkip}
    `;
    const patients = await query<PatientQueueRow[]>(dataSql, params);

    // 6. Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: patients,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching patient queue:", message);
    return NextResponse.json(
      { error: "Failed to fetch patient queue" },
      { status: 500 }
    );
  }
}