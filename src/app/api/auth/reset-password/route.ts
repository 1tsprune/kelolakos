import { NextRequest, NextResponse } from "next/server";
import { updateUserPassword } from "@/lib/auth";
import { consumeResetToken } from "@/lib/password-reset";
import { checkRateLimit, validatePassword } from "@/lib/security";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = checkRateLimit(`reset:${ip}`, 10, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Terlalu banyak percobaan." }, { status: 429 });
  }

  const { token, password } = await request.json();
  const passwordError = validatePassword(password ?? "");
  if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });

  const consumed = await consumeResetToken(String(token ?? ""));
  if (!consumed.ok || !consumed.email) {
    return NextResponse.json({ error: consumed.error ?? "Token tidak valid" }, { status: 400 });
  }

  const updated = await updateUserPassword(consumed.email, password);
  if (!updated.ok) return NextResponse.json({ error: updated.error }, { status: 400 });

  return NextResponse.json({ ok: true });
}