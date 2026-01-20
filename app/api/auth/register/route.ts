import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/lib/mysql";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. SELECT Query: Type it as RowDataPacket[]
    const existingUsers = await query<RowDataPacket[]>(
      "SELECT login_id FROM login_details WHERE phone_num = ? LIMIT 1",
      [body.phone_num]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User exists" }, { status: 409 });
    }

    // 2. INSERT Query: Type it as ResultSetHeader
    const insertSql = `INSERT INTO login_details (firstname, phone_num) VALUES (?, ?)`;
    
    // params array is now strictly typed based on our SQLValue definition
    const params = [body.firstname, body.phone_num];

    const result = await query<ResultSetHeader>(insertSql, params);
    
    // Accessing insertId is now safe and ESLint-compliant
    const newId = result.insertId;

    return NextResponse.json({ success: true, id: newId });

  } catch (error) {
    // Handle error type safely
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Database error:", message);
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}