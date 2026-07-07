import { NextRequest, NextResponse } from "next/server";
import { createSession, loginUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Terlalu banyak percobaan. Coba lagi dalam ${limit.retryAfterSec} detik.` },
      { status: 429 },
    );
  }

  const { email, password } = await request.json();
  const result = await loginUser(email, password);
  if (!result.ok || !result.user) {
    return NextResponse.json(
      { error: result.error, needsVerification: result.needsVerification ?? false },
      { status: result.needsVerification ? 403 : 401 },
    );
  }
  await createSession(result.user);
  return NextResponse.json({ ok: true, user: { name: result.user.name, email: result.user.email } });
}