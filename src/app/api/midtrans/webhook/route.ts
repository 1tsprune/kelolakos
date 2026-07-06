import { NextRequest, NextResponse } from "next/server";
import { handleMidtransWebhook } from "@/lib/midtrans";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await handleMidtransWebhook(body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Webhook error";
    const status = message.includes("signature") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}