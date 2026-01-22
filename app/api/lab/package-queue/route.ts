import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/lib/mysql"; // Using the helper established in previous steps
import { verifyAuthFromRequest, ROLES, hasRole } from "@/app/lib/auth";
import { RowDataPacket } from "mysql2";

// Define an interface for the Package Queue row to ensure type safety
interface PackageQueueRow extends RowDataPacket {
  id: number | bigint;
  medical_num: string;
  package_id: string;
  patient_id: string;
  doctor_id: string;
  package_status: string;
  lab_id: string;
  created_on: Date;
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
    // Note: lab_id is stored as a string in this table
    let whereSql = "WHERE lab_id = ?";
    const params: (string | number)[] = [laboratoryId.toString()];

    if (searchQuery.trim()) {
      const searchWildcard = `%${searchQuery}%`;
      whereSql += ` AND (
        medical_num LIKE ? OR 
        package_id LIKE ? OR 
        patient_id LIKE ? OR 
        doctor_id LIKE ? OR 
        package_status LIKE ?
      )`;
      // Add the wildcard for each of the 5 searchable fields
      params.push(searchWildcard, searchWildcard, searchWildcard, searchWildcard, searchWildcard);
    }

    // 4. Fetch Total Count for pagination
    const countSql = `SELECT COUNT(*) as total FROM package_queue ${whereSql}`;
    const countResult = await query<RowDataPacket[]>(countSql, params);
    const totalCount = countResult[0]?.total || 0;

    // 5. Fetch Paginated Data
    // Note: LIMIT and OFFSET cannot use placeholders in MySQL prepared statements
    // They must be interpolated directly (safe since they're parsed integers)
    const safeLimit = Math.max(1, Math.min(limit, 100)); // Clamp between 1 and 100
    const safeSkip = Math.max(0, skip); // Ensure non-negative
    const dataSql = `
      SELECT * FROM package_queue 
      ${whereSql} 
      ORDER BY created_on DESC 
      LIMIT ${safeLimit} OFFSET ${safeSkip}
    `;
    const packages = await query<PackageQueueRow[]>(dataSql, params);

    // 6. Serialize data (Handling BigInt to string conversion)
    const serializedPackages = packages.map((pkg) => ({
      ...pkg,
      id: pkg.id.toString(), // Ensures BigInt compatibility for JSON
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: serializedPackages,
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
    console.error("Error fetching package queue:", message);
    return NextResponse.json(
      { error: "Failed to fetch package queue" },
      { status: 500 }
    );
  }
}