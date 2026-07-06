import { NextRequest, NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { testWhatsAppConnection } from "@/lib/integrations";
import { getUserSettings } from "@/lib/settings";
import { readDb } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { phone?: string };
    const db = await readDb();
    const userId = await getSessionUserId();
    const settings = getUserSettings(db, userId);
    const phone = body.phone?.trim() || settings.ownerPhone?.trim();
    const result = await testWhatsAppConnection(settings, phone);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "Gagal tes koneksi" },
      { status: 500 },
    );
  }
}