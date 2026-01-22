import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/lib/mysql"; // Using the helper established in previous steps
import { verifyAuthFromRequest, ROLES, hasRole } from "@/app/lib/auth";
import { RowDataPacket } from "mysql2";

// Define an interface for the joined row result
interface EnrichedConsultationRow extends RowDataPacket {
  ss_id: number;
  consultationId: number;
  referdate: Date;
  totalAmount: number;
  status: string;
  firstname: string | null;
  age: string | null;
  phonenum: string | null;
  mailid: string | null;
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

    // 3. Build dynamic SQL WHERE clause for filtering
    // We filter by laboratory_id and optionally by the search query across multiple fields
    let whereSql = "WHERE c.laboratory_id = ?";
    const params: (string | number)[] = [laboratoryId];

    if (searchQuery.trim()) {
      const searchWildcard = `%${searchQuery}%`;
      // Search across consultation ID and patient details
      whereSql += ` AND (
        CONCAT('SS', c.consultationId) LIKE ? OR 
        p.firstname LIKE ? OR 
        p.phonenum LIKE ? OR 
        p.mailid LIKE ? OR
        p.age LIKE ?
      )`;
      params.push(searchWildcard, searchWildcard, searchWildcard, searchWildcard, searchWildcard);
    }

    // 4. Fetch Total Count for pagination
    // Note: We join with patient details to ensure the count matches the searchable results
    const countSql = `
      SELECT COUNT(*) as total 
      FROM superspeciality_consultation c
      LEFT JOIN referral_patient_details p ON c.referral_patient_id = p.referral_patient_id
      ${whereSql}
    `;
    const countResult = await query<RowDataPacket[]>(countSql, params);
    const totalCount = countResult[0]?.total || 0;

    // 5. Fetch Paginated and Enriched Data using a LEFT JOIN
    // Note: LIMIT and OFFSET cannot use placeholders in MySQL prepared statements
    // They must be interpolated directly (safe since they're parsed integers)
    const safeLimit = Math.max(1, Math.min(limit, 100)); // Clamp between 1 and 100
    const safeSkip = Math.max(0, skip); // Ensure non-negative
    const dataSql = `
      SELECT 
        c.ss_id, c.consultationId, c.referdate, c.totalAmount, c.status,
        p.firstname, p.age, p.phonenum, p.mailid
      FROM superspeciality_consultation c
      LEFT JOIN referral_patient_details p ON c.referral_patient_id = p.referral_patient_id
      ${whereSql}
      ORDER BY c.referdate DESC
      LIMIT ${safeLimit} OFFSET ${safeSkip}
    `;
    const rows = await query<EnrichedConsultationRow[]>(dataSql, params);

    // 6. Format the data to match your existing frontend structure
    const enrichedData = rows.map((row) => ({
      ss_id: row.ss_id,
      referralId: `SS${row.consultationId}`,
      name: row.firstname || "N/A",
      age: row.age || "—",
      mobile: row.phonenum || "—",
      email: row.mailid || "—",
      referdate: row.referdate,
      totalAmount: row.totalAmount,
      status: row.status,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: enrichedData,
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
    console.error("Error fetching superspecialty queue:", message);
    return NextResponse.json(
      { error: "Failed to fetch superspecialty queue" },
      { status: 500 }
    );
  }
}