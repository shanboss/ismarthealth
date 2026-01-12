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
      // Show all doctors regardless of is_active status
    };

    // Add search conditions if search query exists
    if (searchQuery.trim()) {
      whereClause.OR = [
        { doc_firstname: { contains: searchQuery } },
        { doc_lastname: { contains: searchQuery } },
        { doc_phone_number: { contains: searchQuery } },
        { doc_email: { contains: searchQuery } },
        { doc_designation: { contains: searchQuery } },
      ];
    }

    // Fetch laboratory doctors
    const doctors = await prisma.laboratory_doctors.findMany({
      where: whereClause,
      orderBy: {
        doc_firstname: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error("Error fetching laboratory doctors:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}

