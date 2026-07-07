import { NextRequest, NextResponse } from "next/server";
import { handleXenditPaymentWebhook, type XenditInvoiceWebhook } from "@/lib/xendit";
import { handleSubscriptionWebhook } from "@/lib/subscription-billing";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as XenditInvoiceWebhook;
    const callbackToken = request.headers.get("x-callback-token");

    if (body.external_id?.startsWith("SUB-")) {
      await handleSubscriptionWebhook(body, callbackToken);
      return NextResponse.json({ ok: true });
    }

    await handleXenditPaymentWebhook(body, callbackToken);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Webhook error";
    const status = message.includes("callback token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}