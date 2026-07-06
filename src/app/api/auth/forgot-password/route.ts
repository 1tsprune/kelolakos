import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/auth";
import { resetPasswordEmailHtml, sendEmail } from "@/lib/email";
import { createResetToken, saveResetToken } from "@/lib/password-reset";
import { checkRateLimit } from "@/lib/security";
import { site } from "@/lib/site";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = checkRateLimit(`forgot:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Terlalu banyak permintaan. Coba lagi nanti." }, { status: 429 });
  }

  const { email, website } = await request.json();
  if (website) {
    return NextResponse.json({ ok: true });
  }

  const normalized = String(email ?? "").trim().toLowerCase();
  if (!normalized) {
    return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
  }

  const user = await findUserByEmail(normalized);
  if (user) {
    const token = createResetToken();
    await saveResetToken(normalized, token);
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? site.url).replace(/\/$/, "");
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;
    await sendEmail({
      to: normalized,
      subject: `Reset password ${site.name}`,
      html: resetPasswordEmailHtml(user.name, resetUrl),
      text: `Reset password: ${resetUrl}`,
    });
  }

  return NextResponse.json({
    ok: true,
    message: "Kalau email terdaftar, link reset sudah dikirim.",
  });
}