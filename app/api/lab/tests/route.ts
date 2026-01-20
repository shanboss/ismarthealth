import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/lib/mysql"; // Using the helper established in previous steps
import { verifyAuthFromRequest, ROLES, hasRole } from "@/app/lib/auth";
import { RowDataPacket } from "mysql2";

// Define an interface for the Laboratory Test row to ensure type safety
interface LabTestRow extends RowDataPacket {
  laboratory_id: number;
  laboratory_tests: string;
  custom_test_name: string | null;
  code: string | null;
  test_type: string | null;
  sub_department: string | null;
  test_price: number | string | bigint;
  status: string;
  sort_order: number | null;
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

    // 4. Build dynamic SQL for WHERE clause
    let whereSql = "WHERE laboratory_id = ? AND status = 'ACTIVE'";
    const params: (string | number)[] = [laboratoryId];

    if (searchQuery.trim()) {
      const searchWildcard = `%${searchQuery}%`;
      whereSql += ` AND (
        laboratory_tests LIKE ? OR 
        custom_test_name LIKE ? OR 
        code LIKE ? OR 
        test_type LIKE ? OR 
        sub_department LIKE ?
      )`;
      // Add the wildcard for each of the 5 searchable fields
      params.push(searchWildcard, searchWildcard, searchWildcard, searchWildcard, searchWildcard);
    }

    // 5. Fetch laboratory tests with ordering
    const sql = `
      SELECT * FROM laboratory_test_details 
      ${whereSql} 
      ORDER BY sub_department ASC, sort_order ASC, laboratory_tests ASC
    `;
    
    const tests = await query<LabTestRow[]>(sql, params);

    // 6. Convert BigInt fields (like test_price) to strings for JSON serialization
    const serializedTests = tests.map((test) => ({
      ...test,
      test_price: test.test_price.toString(),
    }));

    return NextResponse.json({
      success: true,
      data: serializedTests,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching laboratory tests:", message);
    return NextResponse.json(
      { error: "Failed to fetch tests" },
      { status: 500 }
    );
  }
}