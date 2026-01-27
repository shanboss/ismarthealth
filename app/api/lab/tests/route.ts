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
  test_name: string | null;
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

    // 4. Build dynamic SQL for lab catalog (ltd) WHERE clause
    let whereSql = "WHERE ltd.laboratory_id = ? AND ltd.status = 'ACTIVE'";
    const params: (string | number)[] = [laboratoryId];

    if (searchQuery.trim()) {
      const searchWildcard = `%${searchQuery}%`;
      whereSql += ` AND (
        ltd.laboratory_tests LIKE ? OR 
        ltd.custom_test_name LIKE ? OR 
        ltd.code LIKE ? OR 
        ltd.test_type LIKE ? OR 
        ltd.sub_department LIKE ? OR
        itd.test_name LIKE ?
      )`;
      params.push(searchWildcard, searchWildcard, searchWildcard, searchWildcard, searchWildcard, searchWildcard);
    }

    // 5. Fetch lab catalog tests (with investigation names where join matches)
    const labSql = `
      SELECT 
        ltd.*,
        itd.test_name
      FROM laboratory_test_details ltd
      LEFT JOIN investigation_test_details itd ON itd.parse_id = CAST(ltd.laboratory_tests AS UNSIGNED)
      ${whereSql} 
      ORDER BY ltd.sub_department ASC, ltd.sort_order ASC, ltd.laboratory_tests ASC
    `;
    const labTests = await query<LabTestRow[]>(labSql, params);

    // 6. Fetch investigation tests (e.g. MRI, X-RAY) not in this lab's catalog
    const invSearchParams: (string | number)[] = [laboratoryId, laboratoryId];
    let invWhere = `WHERE (itd.active = 1 OR itd.active IS NULL) AND NOT EXISTS (
      SELECT 1 FROM laboratory_test_details ltd 
      WHERE ltd.laboratory_id = ? AND (ltd.laboratory_tests = CAST(itd.parse_id AS CHAR) OR ltd.laboratory_tests = CONCAT('', itd.parse_id))
    )`;
    if (searchQuery.trim()) {
      const searchWildcard = `%${searchQuery}%`;
      invWhere += ` AND (itd.test_name LIKE ? OR id.investigation_name LIKE ?)`;
      invSearchParams.push(searchWildcard, searchWildcard);
    }
    const invSql = `
      SELECT 
        itd.parse_id AS laboratory_testid,
        CAST(itd.parse_id AS CHAR) AS laboratory_tests,
        '' AS code,
        0 AS display_order,
        '' AS mnemonics,
        id.investigation_name AS test_type,
        id.investigation_name AS sub_department,
        '' AS sample_type,
        '' AS container_type,
        '' AS confidential,
        '' AS methodology,
        '' AS transport_temperature,
        '' AS tat,
        '' AS outsourcing_status,
        '' AS instrument,
        ? AS laboratory_id,
        0 AS test_price,
        '' AS custom_test_name,
        '' AS instruction,
        '' AS test_method,
        'ACTIVE' AS status,
        '' AS status_changed_by,
        '' AS status_changed_on,
        '' AS unit,
        '' AS reference_range,
        NULL AS age_gender_specific,
        NULL AS critical_alert,
        NULL AS interpretation,
        0 AS sort_order,
        0 AS title_required,
        itd.test_name AS test_name
      FROM investigation_test_details itd
      JOIN investigation_details id ON id.investigation_id = itd.investigation_id AND (id.active = 1 OR id.active IS NULL)
      ${invWhere}
      ORDER BY id.investigation_name ASC, itd.test_name ASC
    `;
    const invTests = await query<LabTestRow[]>(invSql, invSearchParams);

    // 7. Merge and dedupe by laboratory_testid (lab catalog wins)
    const seen = new Set<number>();
    const tests = [...labTests];
    for (const row of invTests) {
      const id = Number(row.laboratory_testid);
      if (!seen.has(id)) {
        seen.add(id);
        tests.push(row);
      }
    }
    tests.sort((a, b) => {
      const deptA = (a.sub_department || "Other").toLowerCase();
      const deptB = (b.sub_department || "Other").toLowerCase();
      if (deptA !== deptB) return deptA.localeCompare(deptB);
      const nameA = (a.test_name || a.laboratory_tests || "").toLowerCase();
      const nameB = (b.test_name || b.laboratory_tests || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });

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