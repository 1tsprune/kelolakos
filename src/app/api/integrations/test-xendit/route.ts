import { NextResponse } from "next/server";
import { getSettings } from "@/lib/queries";
import { testXenditConnection } from "@/lib/integrations";

export async function POST() {
  try {
    const settings = await getSettings();
    const result = await testXenditConnection(settings);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Test error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}