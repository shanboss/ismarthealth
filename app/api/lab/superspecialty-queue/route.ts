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
      laboratory_id: laboratoryId,
    };

    // Note: Search will be done on the joined patient data in a more complex query
    // For now, we'll fetch the consultations and then join with patient details

    // Fetch superspecialty consultations with related patient data
    const [consultations, totalCount] = await Promise.all([
      prisma.superspeciality_consultation.findMany({
        where: whereClause,
        orderBy: {
          referdate: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.superspeciality_consultation.count({
        where: whereClause,
      }),
    ]);

    // Fetch related patient details
    const patientIds = consultations.map((c) => c.referral_patient_id);
    const patients = await prisma.referral_patient_details.findMany({
      where: {
        referral_patient_id: {
          in: patientIds,
        },
      },
    });

    // Create a map for quick lookup
    const patientMap = new Map(
      patients.map((p) => [p.referral_patient_id, p])
    );

    // Combine consultation data with patient data
    let enrichedData = consultations.map((consultation) => {
      const patient = patientMap.get(consultation.referral_patient_id);
      return {
        ss_id: consultation.ss_id,
        referralId: `SS${consultation.consultationId}`,
        name: patient?.firstname || "N/A",
        age: patient?.age || "—",
        mobile: patient?.phonenum || "—",
        email: patient?.mailid || "—",
        referdate: consultation.referdate,
        totalAmount: consultation.totalAmount,
        status: consultation.status,
      };
    });

    // Apply search filter if provided
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      enrichedData = enrichedData.filter((item) =>
        [
          item.referralId,
          item.name,
          item.age,
          item.mobile,
          item.email,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: enrichedData,
      pagination: {
        page,
        limit,
        totalCount: searchQuery.trim() ? enrichedData.length : totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching superspecialty queue:", error);
    return NextResponse.json(
      { error: "Failed to fetch superspecialty queue" },
      { status: 500 }
    );
  }
}

