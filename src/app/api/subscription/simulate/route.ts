import { NextRequest, NextResponse } from "next/server";
import { simulateSubscriptionPayment } from "@/lib/subscription-billing";
import type { PaidPlan } from "@/lib/subscription";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production" && process.env.BILLING_XENDIT_SECRET_KEY?.trim()) {
    return NextResponse.json({ error: "Simulasi tidak tersedia di production" }, { status: 403 });
  }

  try {
    const { plan } = (await request.json()) as { plan?: PaidPlan };
    if (!plan || !["pro", "business"].includes(plan)) {
      return NextResponse.json({ error: "Paket tidak valid" }, { status: 400 });
    }
    await simulateSubscriptionPayment(plan);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Simulasi error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}