import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/lib/mysql";
import { verifyAuthFromRequest, ROLES, hasRole } from "@/app/lib/auth";
import { RowDataPacket } from "mysql2";

// Define interfaces for our database rows to maintain type safety
interface PatientQueueRow extends RowDataPacket {
  BillId: string;
  created_on: Date;
  firstname: string;
  phonenum: string;
  patient_unique_id: string;
  laboratory_id: number;
}

interface TestRecordRow extends RowDataPacket {
  parse_parent_id: number;
  laboratory_id: number;
  laboratory_tests: string;
  date: Date | null;
  time: string | null;
  instruction: string | null;
}

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

    // 1. Fetch patient data
    const patientRows = await query<PatientQueueRow[]>(
      "SELECT * FROM patientqueue WHERE medical_num = ? AND patient_unique_id = ? LIMIT 1",
      [medicalNum, patientId]
    );
    const patientData = patientRows[0];

    if (!patientData) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // 2. Fetch referral patient details
    const patientDepRows = await query<RowDataPacket[]>(
      "SELECT firstname, lastname, gender, age FROM referral_patient_details WHERE patient_unique_id = ? LIMIT 1",
      [patientData.patient_unique_id]
    );
    const patientDepDetails = patientDepRows[0];

    // 3. Fetch test records
    const testRecords = await query<TestRecordRow[]>(
      "SELECT parse_parent_id, laboratory_id, laboratory_tests, date, time, instruction FROM referral_patient_test_details WHERE medical_num = ?",
      [medicalNum]
    );

    // 4. Resolve details for each test
    const patientTestDetails = await Promise.all(
      testRecords.map(async (record) => {
        // Fetch test name
        const testInfoRows = await query<RowDataPacket[]>(
          "SELECT test_name FROM investigation_test_details WHERE parse_id = ? LIMIT 1",
          [record.parse_parent_id]
        );

        // Fetch lab-specific instructions and price
        const labInfoRows = await query<RowDataPacket[]>(
          "SELECT instruction, test_price FROM laboratory_test_details WHERE laboratory_id = ? AND laboratory_tests = ? LIMIT 1",
          [record.laboratory_id || 0, record.laboratory_tests || ""]
        );

        // Fetch billing status
        const billingInfoRows = await query<RowDataPacket[]>(
          "SELECT billing_status FROM referral_confirmation_details WHERE medical_num = ? LIMIT 1",
          [medicalNum]
        );

        const testInfo = testInfoRows[0];
        const labInfo = labInfoRows[0];
        const billingInfo = billingInfoRows[0];

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

    // 5. Fetch laboratory details
    const labDetailsRows = await query<RowDataPacket[]>(
      `SELECT 
        laboratory_name, laboratory_address, lab_city, lab_state, 
        laboratory_phone, laboratory_email 
       FROM laboratory_details 
       WHERE laboratory_id = ? LIMIT 1`,
      [patientData.laboratory_id]
    );
    const labDetails = labDetailsRows[0];

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
        patientTestDetails,
        labInfo: labDetails || {
          laboratory_name: "N/A",
          laboratory_address: "N/A",
          lab_city: "N/A",
          lab_state: "N/A",
          laboratory_phone: "N/A",
          laboratory_email: "N/A"
        }
      }
    });
  } catch (error) {
    console.error("Billing API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}