import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/lib/mysql"; // Using the helper established in previous steps
import { verifyAuthFromRequest, ROLES, hasRole } from "@/app/lib/auth";
import { RowDataPacket } from "mysql2";

// Define an interface for the Laboratory Test row to ensure type safety
interface LabTestRow extends RowDataPacket {
  laboratory_testid: number;
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

    // 4. Build dynamic SQL - primary source: investigation_test_details, lab overrides from laboratory_test_details
    let whereSql = "WHERE (itd.active = 1 OR itd.active IS NULL)";
    const params: (string | number)[] = [laboratoryId];

    if (searchQuery.trim()) {
      const searchWildcard = `%${searchQuery}%`;
      whereSql += ` AND (
        itd.test_name LIKE ? OR 
        id.investigation_name LIKE ? OR 
        COALESCE(ltd.custom_test_name, '') LIKE ? OR 
        COALESCE(ltd.code, '') LIKE ? OR 
        COALESCE(ltd.test_type, id.investigation_name) LIKE ? OR 
        COALESCE(ltd.sub_department, id.investigation_name) LIKE ?
      )`;
      params.push(searchWildcard, searchWildcard, searchWildcard, searchWildcard, searchWildcard, searchWildcard);
    }

    // 5. Fetch lab tests from investigation_test_details (primary source) with lab-specific overrides
    const labSql = `
      SELECT 
        itd.parse_id AS laboratory_testid,
        CAST(itd.parse_id AS CHAR) AS laboratory_tests,
        COALESCE(ltd.code, '') AS code,
        COALESCE(ltd.display_order, 0) AS display_order,
        COALESCE(ltd.mnemonics, '') AS mnemonics,
        COALESCE(ltd.test_type, id.investigation_name) AS test_type,
        COALESCE(ltd.sub_department, id.investigation_name) AS sub_department,
        COALESCE(ltd.sample_type, '') AS sample_type,
        COALESCE(ltd.container_type, '') AS container_type,
        COALESCE(ltd.confidential, '') AS confidential,
        COALESCE(ltd.methodology, '') AS methodology,
        COALESCE(ltd.transport_temperature, '') AS transport_temperature,
        COALESCE(ltd.tat, '') AS tat,
        COALESCE(ltd.outsourcing_status, '') AS outsourcing_status,
        COALESCE(ltd.instrument, '') AS instrument,
        ? AS laboratory_id,
        COALESCE(ltd.test_price, 0) AS test_price,
        COALESCE(ltd.custom_test_name, '') AS custom_test_name,
        COALESCE(ltd.instruction, '') AS instruction,
        COALESCE(ltd.test_method, '') AS test_method,
        COALESCE(ltd.status, 'ACTIVE') AS status,
        COALESCE(ltd.status_changed_by, '') AS status_changed_by,
        COALESCE(ltd.status_changed_on, '') AS status_changed_on,
        COALESCE(ltd.unit, '') AS unit,
        COALESCE(ltd.reference_range, '') AS reference_range,
        ltd.age_gender_specific,
        ltd.critical_alert,
        ltd.interpretation,
        COALESCE(ltd.sort_order, 0) AS sort_order,
        COALESCE(ltd.title_required, 0) AS title_required,
        itd.test_name AS test_name
      FROM investigation_test_details itd
      JOIN investigation_details id ON id.investigation_id = itd.investigation_id AND (id.active = 1 OR id.active IS NULL)
      LEFT JOIN laboratory_test_details ltd ON (ltd.laboratory_tests = CAST(itd.parse_id AS CHAR) OR ltd.laboratory_tests = CONCAT('', itd.parse_id)) AND ltd.laboratory_id = ? AND ltd.status = 'ACTIVE'
      ${whereSql}
      ORDER BY COALESCE(ltd.sub_department, id.investigation_name) ASC, COALESCE(ltd.sort_order, 0) ASC, itd.test_name ASC
    `;
    params.push(laboratoryId);
    const rawTests = await query<LabTestRow[]>(labSql, params);

    // 6. Deduplicate by laboratory_testid (prefer rows with lab overrides when available)
    const seenIds = new Map<number, LabTestRow>();
    for (const row of rawTests) {
      const id = Number(row.laboratory_testid);
      const existing = seenIds.get(id);
      const hasLabOverride = Number(row.test_price) > 0 || (row.custom_test_name && row.custom_test_name.trim() !== "");
      const existingHasOverride = existing && (Number(existing.test_price) > 0 || (existing.custom_test_name && existing.custom_test_name.trim() !== ""));
      if (!existing || (hasLabOverride && !existingHasOverride)) {
        seenIds.set(id, row);
      }
    }
    const tests = Array.from(seenIds.values());

    // 7. Sort tests
    tests.sort((a, b) => {
      const deptA = (a.sub_department || "Other").toLowerCase();
      const deptB = (b.sub_department || "Other").toLowerCase();
      if (deptA !== deptB) return deptA.localeCompare(deptB);
      const nameA = (a.test_name || a.laboratory_tests || "").toLowerCase();
      const nameB = (b.test_name || b.laboratory_tests || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });

    // 8. Convert BigInt fields (like test_price) to strings for JSON serialization
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