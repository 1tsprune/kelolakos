import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { testMidtransConnection } from "@/lib/integrations";
import { getUserSettings } from "@/lib/settings";
import { readDb } from "@/lib/store";

export async function POST() {
  try {
    const db = await readDb();
    const userId = await getSessionUserId();
    const settings = getUserSettings(db, userId);
    const result = await testMidtransConnection(settings);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "Gagal tes koneksi" },
      { status: 500 },
    );
  }
}