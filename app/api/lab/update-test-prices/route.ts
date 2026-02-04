import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/lib/mysql";
import { verifyAuthFromRequest, ROLES, hasRole } from "@/app/lib/auth";
import { ResultSetHeader } from "mysql2";

type TestUpdate = {
  id: string;
  price: number;
  customName: string;
  instruction: string;
  method: string;
  unit: string;
  referenceRange: string;
};

export async function POST(request: NextRequest) {
  try {
    const user = verifyAuthFromRequest(request);
    if (
      !user ||
      !hasRole(user, [ROLES.LABORATORY, ROLES.BILLING])
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const laboratoryId = user.laboratory_id;
    if (!laboratoryId) {
      return NextResponse.json(
        { error: "Laboratory ID not found" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { tests } = body as { tests: TestUpdate[] };

    if (!tests || !Array.isArray(tests) || tests.length === 0) {
      return NextResponse.json(
        { error: "No tests provided" },
        { status: 400 }
      );
    }

    let updated = 0;
    let inserted = 0;

    for (const test of tests) {
      const laboratoryTests = String(test.id);
      const testPrice = Number(test.price) || 0;
      const customName = (test.customName || "").trim();
      const instruction = (test.instruction || "").trim();
      const method = (test.method || "").trim();
      const unit = (test.unit || "").trim();
      const referenceRange = (test.referenceRange || "").trim();

      const updateResult = await query<ResultSetHeader>(
        `UPDATE laboratory_test_details 
         SET test_price = ?, custom_test_name = ?, instruction = ?, test_method = ?, unit = ?, reference_range = ?
         WHERE laboratory_id = ? AND (laboratory_tests = ? OR laboratory_tests = CONCAT('', ?))`,
        [
          testPrice,
          customName,
          instruction,
          method,
          unit,
          referenceRange,
          laboratoryId,
          laboratoryTests,
          laboratoryTests,
        ]
      );

      if (updateResult.affectedRows > 0) {
        updated++;
      } else {
        // Test not in lab catalog - insert new row
        await query<ResultSetHeader>(
          `INSERT INTO laboratory_test_details (
            laboratory_id, laboratory_tests, test_price, custom_test_name,
            instruction, test_method, unit, reference_range, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
          [
            laboratoryId,
            laboratoryTests,
            testPrice,
            customName,
            instruction,
            method,
            unit,
            referenceRange,
          ]
        );
        inserted++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updated} test(s), added ${inserted} new test(s) to catalog`,
      data: { updated, inserted },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error updating test prices:", message);
    return NextResponse.json(
      { error: "Failed to update test prices", details: message },
      { status: 500 }
    );
  }
}
