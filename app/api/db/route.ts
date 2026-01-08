import { NextResponse } from "next/server";
import { query } from "@/app/lib/mysql";

export async function GET() {
  try {
    const versionRows = await query<{ version: string }>("SELECT VERSION() AS version");
    const nowRows = await query<{ now: string }>("SELECT NOW() AS now");

    return NextResponse.json({
      ok: true,
      version: versionRows[0]?.version ?? null,
      now: nowRows[0]?.now ?? null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "DB connection failed" }, { status: 500 });
  }
}





