import { NextRequest, NextResponse } from "next/server";
import { createSnapToken } from "@/lib/midtrans";

export async function POST(request: NextRequest) {
  try {
    const { paymentId } = (await request.json()) as { paymentId?: string };
    if (!paymentId) {
      return NextResponse.json({ error: "paymentId wajib" }, { status: 400 });
    }
    const result = await createSnapToken(paymentId);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Gagal buat token Snap" },
      { status: 500 },
    );
  }
}