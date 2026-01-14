// app/api/lab/billing/route.ts
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

    // Get patient_id and medical_num from query parameters
    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get("patient_id");
    const medicalNum = searchParams.get("medical_num");

    if (!patientId || !medicalNum) {
      return NextResponse.json(
        { error: "Missing required parameters: patient_id and medical_num" },
        { status: 400 }
      );
    }

    //Get laboratory_id from authenticated user
    const laboratoryId = user.laboratory_id;

    if (!laboratoryId) {
      return NextResponse.json({ error: "Laboratory ID not found" }, { status: 400 });
    }

    // Fetch patient data from patientqueue
    const patientData = await prisma.patientqueue.findFirst({
      where: {
        patient_unique_id: patientId,
        medical_num: medicalNum,
        laboratory_id: laboratoryId,
      },
      select: {
        BillId: true,
        created_on: true,
        firstname: true,
        phonenum: true,
        patient_unique_id: true,
      },
    });

    if (!patientData) {
      return NextResponse.json(
        { error: "Patient billing record not found" },
        { status: 404 }
      );
    }

    // Fetch patient details from patient_dep_details using patient_unique_id
    const patientDepDetails = await prisma.referral_patient_details.findFirst({
      where: {
        patient_unique_id: patientData.patient_unique_id,
      },
      select: {
        firstname: true,
        lastname: true,
        gender: true,
        age: true,
      },
    });

    

    // Combine data from both tables
    const billingDetails = {
      patientQueue: {
        billId: patientData.BillId,
        createdOn: patientData.created_on,
        firstName: patientData.firstname,
        phoneNum: patientData.phonenum,
      },
      patientDepDetails: patientDepDetails || {
        firstname: null,
        lastname: null,
        gender: null,
        age: null,
      },
    };

    return NextResponse.json(
      {
        success: true,
        data: billingDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching billing details:", error);
    return NextResponse.json(
      { error: "Failed to fetch billing details" },
      { status: 500 }
    );
  }
}