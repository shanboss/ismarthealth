import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/lib/mysql"; // Import your raw query helper
import { verifyAuthFromRequest, ROLES, hasRole } from "@/app/lib/auth";
import { RowDataPacket } from "mysql2";

// Define an interface for the Doctor row to maintain type safety
interface DoctorRow extends RowDataPacket {
  id: number;
  laboratory_id: number;
  doc_firstname: string;
  doc_lastname: string;
  doc_phone_number: string;
  doc_email: string;
  doc_designation: string;
  is_active: number;
  // Add other columns as per your database schema
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