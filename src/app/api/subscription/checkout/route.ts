import { NextRequest, NextResponse } from "next/server";
import { createSubscriptionCheckout } from "@/lib/subscription-billing";
import type { PaidPlan } from "@/lib/subscription";

export async function POST(request: NextRequest) {
  try {
    const { plan } = (await request.json()) as { plan?: PaidPlan };
    if (!plan || !["pro", "business"].includes(plan)) {
      return NextResponse.json({ error: "Paket tidak valid" }, { status: 400 });
    }
    const result = await createSubscriptionCheckout(plan);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout error";
    const status = message.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}