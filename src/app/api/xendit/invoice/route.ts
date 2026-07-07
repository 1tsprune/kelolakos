import { NextRequest, NextResponse } from "next/server";
import { createTenantInvoice } from "@/lib/xendit";

export async function POST(request: NextRequest) {
  try {
    const { paymentId } = (await request.json()) as { paymentId?: string };
    if (!paymentId) {
      return NextResponse.json({ error: "paymentId wajib" }, { status: 400 });
    }
    const result = await createTenantInvoice(paymentId);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invoice error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}