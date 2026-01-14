// app/api/lab/billing/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAuthFromRequest, ROLES, hasRole } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = verifyAuthFromRequest(request);
    if (!user || !hasRole(user, [ROLES.LABORATORY, ROLES.BILLING])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get("patient_id");
    const medicalNum = searchParams.get("medical_num");

    if (!patientId || !medicalNum) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const patientData = await prisma.patientqueue.findFirst({
      where: {
        medical_num: medicalNum,
        patient_unique_id: patientId,
      },
    });

    if (!patientData) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const patientDepDetails = await prisma.referral_patient_details.findFirst({
      where: { patient_unique_id: patientData.patient_unique_id },
    });

    // 1. Fetch the test records for this patient
const testRecords = await prisma.referral_patient_test_details.findMany({
      where: { 
        medical_num: medicalNum,
        // Optional: filter out records that haven't been processed yet if needed
      },
      select: {
        parse_parent_id: true,
        laboratory_id: true,
        laboratory_tests: true,
        date: true,
        time: true,
        instruction: true,
        // Do NOT include sample_datetime or labapproval_datetime here
      }
    });

    // 2. Resolve details for each test


    const patientTestDetails = await Promise.all(
      testRecords.map(async (record) => {
        const testInfo = await prisma.investigation_test_details.findUnique({
          where: { parse_id: record.parse_parent_id },
          select: { test_name: true }
        });

        const labInfo = await prisma.laboratory_test_details.findFirst({
          where: { 
            laboratory_id: record.laboratory_id || 0,
            laboratory_tests: record.laboratory_tests || "" 
          },
          select: { instruction: true, test_price: true }
        });

        const billingInfo = await prisma.referral_confirmation_details.findUnique({
          where: { medical_num: medicalNum },
          select: { billing_status: true }
        });

        return {
          testName: testInfo?.test_name || record.laboratory_tests || "Unknown Test",
          date: record.date ? record.date.toISOString().split('T')[0] : "N/A",
          time: record.time || "N/A",
          instructions: record.instruction || labInfo?.instruction || "None",
          price: labInfo?.test_price ? Number(labInfo.test_price) : 0,
          billingStatus: billingInfo?.billing_status === 1 ? "Approved" : "Not-Approved"
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        patientQueue: {
          billId: patientData.BillId,
          createdOn: patientData.created_on,
          firstName: patientData.firstname,
          phoneNum: patientData.phonenum,
        },
        patientDepDetails: patientDepDetails || {
          firstname: null, lastname: null, gender: null, age: null
        },
        patientTestDetails
      }
    });
  } catch (error) {
    console.error("Billing API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}