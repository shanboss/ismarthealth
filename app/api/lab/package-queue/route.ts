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

    // Get pagination parameters from query
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    const searchQuery = searchParams.get("search") || "";

    // Get laboratory_id from authenticated user
    const laboratoryId = user.laboratory_id;

    if (!laboratoryId) {
      return NextResponse.json({ error: "Laboratory ID not found" }, { status: 400 });
    }

    // Build where clause with search filter
    const whereClause: any = {
      lab_id: laboratoryId.toString(),
    };

    // Add search conditions if search query exists
    if (searchQuery.trim()) {
      whereClause.OR = [
        { medical_num: { contains: searchQuery } },
        { package_id: { contains: searchQuery } },
        { patient_id: { contains: searchQuery } },
        { doctor_id: { contains: searchQuery } },
        { package_status: { contains: searchQuery } },
      ];
    }

    // Fetch paginated package queue data
    const [packages, totalCount] = await Promise.all([
      prisma.package_queue.findMany({
        where: whereClause,
        orderBy: {
          created_on: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.package_queue.count({
        where: whereClause,
      }),
    ]);

    // Convert BigInt to string for JSON serialization
    const serializedPackages = packages.map((pkg) => ({
      ...pkg,
      id: pkg.id.toString(),
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
    console.error("Error fetching package queue:", error);
    return NextResponse.json(
      { error: "Failed to fetch package queue" },
      { status: 500 }
    );
  }
}

