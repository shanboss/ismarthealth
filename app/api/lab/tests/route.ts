import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAuthFromRequest, ROLES, hasRole } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Verify user is authorized (Lab roles only)
    const user = verifyAuthFromRequest(request);
    
    if (!user || !hasRole(user, [ROLES.LABORATORY, ROLES.BILLING, ROLES.SAMPLES, ROLES.LAB_REPORTS])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get laboratory_id from authenticated user
    const laboratoryId = user.laboratory_id;

    if (!laboratoryId) {
      return NextResponse.json({ error: "Laboratory ID not found" }, { status: 400 });
    }

    // Get search query parameter
    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get("search") || "";

    // Build where clause
    const whereClause: any = {
      laboratory_id: laboratoryId,
      status: "ACTIVE", // Only fetch active tests
    };

    // Add search conditions if search query exists
    if (searchQuery.trim()) {
      whereClause.OR = [
        { laboratory_tests: { contains: searchQuery } },
        { custom_test_name: { contains: searchQuery } },
        { code: { contains: searchQuery } },
        { test_type: { contains: searchQuery } },
        { sub_department: { contains: searchQuery } },
      ];
    }

    // Fetch laboratory tests
    const tests = await prisma.laboratory_test_details.findMany({
      where: whereClause,
      orderBy: [
        { sub_department: "asc" },
        { sort_order: "asc" },
        { laboratory_tests: "asc" },
      ],
    });

    // Convert BigInt fields to strings for JSON serialization
    const serializedTests = tests.map((test) => ({
      ...test,
      test_price: test.test_price.toString(),
    }));

    return NextResponse.json({
      success: true,
      data: serializedTests,
    });
  } catch (error) {
    console.error("Error fetching laboratory tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch tests" },
      { status: 500 }
    );
  }
}

