import { NextRequest, NextResponse } from "next/server";
import{ query } from "@/app/lib/mysql";
import pool from "@/app/lib/mysql";
import { verifyAuthFromRequest, ROLES, hasRole } from "@/app/lib/auth";
import { RowDataPacket, ResultSetHeader } from "mysql2";

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

interface BillInsertResult extends RowDataPacket {
  insertId: number;
}

// Helper function to set IST timezone
function getISTDateTime(): string {
  const now = new Date();
  const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000) - (now.getTimezoneOffset() * 60 * 1000));
  return istTime.toISOString().slice(0, 19).replace('T', ' ');
}

// Helper to ensure no undefined values in params
function sanitizeParams(params: (string | number | boolean | null | undefined)[]): (string | number | boolean | null)[] {
  return params.map(param => param === undefined ? null : param);
}



export async function GET(request: NextRequest) {
  try {
    const user = verifyAuthFromRequest(request);
    if (!user || !hasRole(user, [ROLES.LABORATORY, ROLES.BILLING])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get("patient_id")?.trim();
    const medicalNum = searchParams.get("medical_num")?.trim();
    const medicalNumSpecial = medicalNum?.replace(/ /g, '%20');
    // Force decode in case the param arrived double-encoded
 
    console.log("GET Params received:", { patientId, medicalNum, medicalNumSpecial });


    if (!patientId || !medicalNum) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // 1. Fetch patient data from patientqueue
    const patientRows = await query<PatientQueueRow[]>(
      "SELECT * FROM patientqueue WHERE (medical_num = ? or medical_num = ?) AND patient_unique_id = ? LIMIT 1",
      [medicalNum, medicalNumSpecial, patientId]
    );
    const patientData = patientRows[0];
    console.log("Patient Data:", patientData);

    if (!patientData) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // 2. Fetch referral patient details (main patient)
    const patientDepRows = await query<RowDataPacket[]>(
      "SELECT firstname, lastname, gender, age FROM referral_patient_details WHERE patient_unique_id = ? LIMIT 1",
      [patientData.patient_unique_id]
    );
    const patientDepDetails = patientDepRows[0];
    console.log("Patient Dep Details:", patientDepDetails);

    // 3. Fetch test records using the new UNION query
    const testRecords = await query<TestRecordRow[]>(
      `(SELECT DISTINCT 
          rptd.instruction,
          ltd.instruction as test_instruction,
          ltd.methodology,
          sr.sample_value,
          sr.referral_test_ID,
          itd.investigation_id,
          b.tot_amt,
          b.discount,
          b.net_amt,
          b.adv_amt,
          b.balance_amt,
          b.billing_id AS bill_id,
          ltd.test_price,
          rptd.billing_id,
          rptd.sample_collected_id,
          rptd.labapproval_id,
          rptd.ID,
          rptd.report_filename,
          rcd.brief_history,
          itd.test_name,
          rcd.phy_advice,
          rptd.laboratory_tests,
          rptd.date,
          rptd.time,
          rptd.created_on,
          sm.status,
          sm.status_id,
          rptd.pat_status,
          ltd.unit,
          ltd.reference_range,
          rptd.medical_num,
          rptd.parse_parent_id,
          rptd.patient_unique_id
        FROM referral_patient_test_details rptd
        INNER JOIN referral_patient_details rpd ON rptd.main_patient_id = rpd.referral_patient_id
        INNER JOIN investigation_test_details itd ON itd.parse_id = rptd.laboratory_tests
        INNER JOIN laboratory_details ld ON ld.laboratory_id = rptd.laboratory_id
        LEFT JOIN physician_appointment pa ON pa.physician_id = rptd.physician_id
        INNER JOIN status_master sm ON sm.status_id = rptd.pat_status
        INNER JOIN referral_confirmation_details rcd ON rcd.patient_unique_id = rptd.patient_unique_id 
          AND rcd.medical_num = rptd.medical_num
        INNER JOIN laboratory_test_details ltd ON ltd.laboratory_tests = rptd.laboratory_tests 
          AND ltd.laboratory_id = rptd.laboratory_id
        LEFT JOIN billing b ON b.medical_num = rptd.medical_num AND b.laboratory_tests = rptd.ID
        LEFT JOIN sample_results sr ON sr.referral_test_ID = rptd.ID
        WHERE (rptd.medical_num = ? or rptd.medical_num = ?) AND rptd.parse_parent_id = 0 
        GROUP bY rptd.laboratory_tests
        )
      UNION
      (SELECT DISTINCT 
          rptd.instruction,
          ltd.instruction as test_instruction,
          ltd.methodology,
          sr.sample_value,
          sr.referral_test_ID,
          itd.investigation_id,
          b.tot_amt,
          b.discount,
          b.net_amt,
          b.adv_amt,
          b.balance_amt,
          b.billing_id AS bill_id,
          ltd.test_price,
          rptd.billing_id,
          rptd.sample_collected_id,
          rptd.labapproval_id,
          rptd.ID,
          rptd.report_filename,
          rcd.brief_history,
          itd.test_name,
          rcd.phy_advice,
          rptd.laboratory_tests,
          rptd.date,
          rptd.time,
          rptd.created_on,
          sm.status,
          sm.status_id,
          rptd.pat_status,
          ltd.unit,
          ltd.reference_range,
          rptd.medical_num,
          rptd.parse_parent_id,
          rptd.patient_unique_id
        FROM referral_patient_test_details rptd
        INNER JOIN patient_dep_details pdd ON rptd.dependent_id = pdd.patient_dep_id
        INNER JOIN investigation_test_details itd ON itd.parse_id = rptd.laboratory_tests
        INNER JOIN laboratory_details ld ON ld.laboratory_id = rptd.laboratory_id
        LEFT JOIN physician_appointment pa ON pa.physician_id = rptd.physician_id
        INNER JOIN status_master sm ON sm.status_id = rptd.pat_status
        INNER JOIN referral_confirmation_details rcd ON rcd.patient_unique_id = rptd.patient_unique_id 
          AND rcd.medical_num = rptd.medical_num
        INNER JOIN laboratory_test_details ltd ON ltd.laboratory_tests = rptd.laboratory_tests 
          AND ltd.laboratory_id = rptd.laboratory_id
        LEFT JOIN billing b ON b.medical_num = rptd.medical_num AND b.laboratory_tests = rptd.ID
        LEFT JOIN sample_results sr ON sr.referral_test_ID = rptd.ID
        WHERE (rptd.medical_num = ? or rptd.medical_num = ?) AND rptd.parse_parent_id = 0 
        GROUP BY rptd.laboratory_tests
        )`,
      [medicalNum, medicalNumSpecial, medicalNum, medicalNumSpecial]
    );
    console.log("Test Records:", testRecords);
    // 4. Map test records to frontend-friendly structure
    const patientTestDetails = testRecords.map((record) => ({
      testName: record.test_name || "Unknown Test",
      testId: record.laboratory_tests,
      date: record.date ? new Date(record.date).toISOString().split('T')[0] : "N/A",
      time: record.time || "N/A",
      instructions: record.test_instruction || record.instruction || "None",
      methodology: record.methodology || "N/A",
      unit: record.unit || null,
      referenceRange: record.reference_range || null,
      sampleValue: record.sample_value || null,
      price: record.test_price ? Number(record.test_price) : 0,
      totalAmount: record.tot_amt ? Number(record.tot_amt) : 0,
      discount: record.discount ? Number(record.discount) : 0,
      netAmount: record.net_amt ? Number(record.net_amt) : 0,
      advanceAmount: record.adv_amt ? Number(record.adv_amt) : 0,
      balanceAmount: record.balance_amt ? Number(record.balance_amt) : 0,
      billingId: record.bill_id || null,
      status: record.status || "Unknown",
      patStatus: record.pat_status || null,
      reportFilename: record.report_filename || null,
      briefHistory: record.brief_history || null,
      phyAdvice: record.phy_advice || null,
    }));
    console.log("Mapped Patient Test Details:", patientTestDetails);
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
    console.log("Laboratory Details:", labDetails);
    console.log("medicalNum:", medicalNum);
    console.log("medicalNumSpecial:", medicalNumSpecial);
    console.log("patientId:", patientId);
    // 6. Fetch billing details
    const billingRowss = await query<RowDataPacket[]>(
      `SELECT * FROM billing WHERE (medical_num = ? or medical_num = ?) AND patient_unique_id = ? LIMIT 1`,
      [medicalNum, medicalNumSpecial, patientId]
    );
    console.log("Billing Rows:", billingRowss);
    const billingDetails = billingRowss[0];
    console.log("Billing Details:", billingDetails);

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
          firstname: null,
          lastname: null,
          gender: null,
          age: null,
        },
        patientTestDetails,
        labInfo: labDetails || {
          laboratory_name: "N/A",
          laboratory_address: "N/A",
          lab_city: "N/A",
          lab_state: "N/A",
          laboratory_phone: "N/A",
          laboratory_email: "N/A",
        },
        billingDetails: billingDetails || null,
      },
    });
  } catch (error) {
    console.error("Billing API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {  
  const connection = await pool.getConnection();

  try {
    const user = verifyAuthFromRequest(request);
    if (!user || !hasRole(user, [ROLES.LABORATORY, ROLES.BILLING])) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const laboratory_id = user.laboratory_id;
    const body = await request.json();
    
    const {
      patient_id,
      firstTimeBilling,
      medical_num,
      total_amount,
      discount_enabled,
      discount_percentage,
      discount_amount,
      net_amount,
      advance_payment,
      balance_amount,
      billing_status
    } = body;

    // Validate required fields
    if (!medical_num || patient_id === undefined || total_amount === undefined || net_amount === undefined || balance_amount === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("POST Body received:", {
      patient_id,
      firstTimeBilling,
      medical_num,
      total_amount,
      discount_enabled,
      discount_percentage,
      discount_amount,
      net_amount,
      advance_payment,
      balance_amount,
      billing_status
    });

    const medicalNumSpecial = medical_num.replace(/%20/g, ' ');

    // Start transaction
    await connection.beginTransaction();

    const now = getISTDateTime();
    
    // Determine billing_id and lab_test_status based on balance_amount
    // If balance is 0, billing is complete (status = 2), otherwise partial (status = 1)
    const billingStatusCode = balance_amount === 0 ? 2 : 1;
    const labTestStatusCode = balance_amount === 0 ? 2 : 1;

    try {
      // 1. Update referral_patient_test_details
      await connection.execute(
        "UPDATE referral_patient_test_details SET billing_id = ?, billing_datetime = ? WHERE medical_num = ? or medical_num = ?",
        sanitizeParams([billingStatusCode, now, medical_num, medicalNumSpecial])
      );

      // 2. Update referral_confirmation_details
      await connection.execute(
        "UPDATE referral_confirmation_details SET lab_test_status = ?, billing_status = ? WHERE medical_num = ? or medical_num = ?",
        sanitizeParams([labTestStatusCode, billingStatusCode, medical_num, medicalNumSpecial])
      );

      // 3. Update patientqueue
      await connection.execute(
        "UPDATE patientqueue SET billing_id = ?, lab_test_status = ?, billing_status = ? WHERE (medical_num = ? or medical_num = ?) AND patient_unique_id = ?",
        sanitizeParams([billingStatusCode, labTestStatusCode, billingStatusCode, medical_num, medicalNumSpecial ,patient_id])
      );

      // 4. Get last unique_billid for the laboratory
      const [lastBillRows] = await connection.execute<RowDataPacket[]>(
        "SELECT unique_billid FROM billing WHERE lab_id = ? ORDER BY billing_id DESC LIMIT 1",
        [laboratory_id]
      );

      let unique_billid: string;
      const currentDate = new Date().toISOString().slice(0, 7).replace('-', ''); // YYYYMM format

      if (lastBillRows.length > 0) {
        const oldUniqueBillId = lastBillRows[0].unique_billid as string;
        const numericPart = parseInt(oldUniqueBillId.slice(-4));
        const newBillIdNum = numericPart + 1;
        unique_billid = oldUniqueBillId.slice(0, -4) + String(newBillIdNum).padStart(4, '0');
      } else {
        unique_billid = currentDate + '0001';
      }

      // 5. Determine discount value
      const finalDiscount = discount_percentage || 0;
      const discountType = discount_enabled ? 'percentage' : 'none';

      // 6. Insert into billing table
      let billing_id;

      // We use a shared params array to keep it clean, 
      // though the Update and Insert have different structures.
      if (firstTimeBilling) {
          // --- INSERT LOGIC ---
          const [insertResult] = await connection.execute<ResultSetHeader>(
              `INSERT INTO billing 
              (laboratory_tests, tot_amt, discount, discount_type, net_amt, adv_amt, balance_amt, patient_unique_id, medical_num, lab_id, unique_billid, created_on) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              sanitizeParams([
                  '',                         // laboratory_tests
                  total_amount ?? 0,          // tot_amt
                  finalDiscount ?? 0,         // discount
                  discountType || 'none',     // discount_type
                  net_amount ?? 0,            // net_amt
                  advance_payment ?? 0,       // adv_amt
                  balance_amount ?? 0,        // balance_amt
                  patient_id || null,         // patient_unique_id
                  medicalNumSpecial,          // medical_num
                  laboratory_id,              // lab_id
                  unique_billid,              // unique_billid
                  now                         // created_on
              ])
          );
          billing_id = insertResult.insertId;

      } else {
          // --- UPDATE LOGIC ---
          // id = LAST_INSERT_ID(id) ensures result.insertId is populated with the updated row's ID
          const [updateResult] = await connection.execute<ResultSetHeader>(
              `UPDATE billing 
              SET 
                  balance_pymnt2 = ?, 
                  final_balance = ?
              WHERE medical_num = ? AND patient_unique_id = ?`,
              sanitizeParams([
                  advance_payment ?? 0,       // adv_amt
                  balance_amount ?? 0,        // balance_amt
                  medicalNumSpecial,          // WHERE medical_num
                  patient_id                  // WHERE patient_unique_id
              ])
          );
          
          billing_id = updateResult.insertId;
      }

      // billing_id now holds the correct ID whether inserted or updated
      console.log('Processed Billing ID:', billing_id);

      // 7. Insert into billing_log for advance payment if advance payment > 0
      if (advance_payment && advance_payment > 0) {
        await connection.execute(
          "INSERT INTO billing_log (amt, billing_id, payment_method) VALUES (?, ?, ?)",
          sanitizeParams([advance_payment ?? 0, billing_id, 'advance'])
        );
      }

      // 8. Generate and store barcode
      // Barcode reference: billing_id + medical_num
      const barcode = `${billing_id}${medical_num}`;
      const barcodeTimestamp = Math.floor(Date.now() / 1000);
      const barcode_image = `${barcodeTimestamp}${barcode}.png`;
      const barcodePath = `barcode/${barcode_image}`;

      await connection.execute(
        "INSERT INTO barcode (billing_id, barcode, barcode_image, created_date) VALUES (?, ?, ?, ?)",
        sanitizeParams([billing_id, barcode, barcodePath, now])
      );

      // 9. Update patientqueue with unique_billid
      if (patient_id && medical_num) {
        await connection.execute(
          "UPDATE patientqueue SET BillId = ? WHERE medical_num = ? AND patient_unique_id = ?",
          sanitizeParams([unique_billid, medical_num, patient_id])
        );
      }

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: "Billing saved successfully",
        data: {
          billing_id,
          unique_billid,
          barcode,
          barcode_image: barcodePath,
          billing_status: billingStatusCode === 2 ? "Approved" : "Pending",
          created_on: now
        }
      }, { status: 201 });

    } catch (transactionError) {
      // Rollback transaction if any query fails
      await connection.rollback();
      console.error("Transaction failed, rolling back:", transactionError);
      throw transactionError;
    }

  } catch (error) {
    console.error("Billing API Error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  } finally {
    // Release connection back to pool
    await connection.release();
  }
}