import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/auth";
import { createVerificationToken, saveVerificationToken } from "@/lib/email-verification";
import { verifyEmailHtml, sendEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/security";
import { site } from "@/lib/site";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = checkRateLimit(`resend-verify:${ip}`, 3, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Terlalu banyak permintaan. Coba lagi dalam ${limit.retryAfterSec} detik.` },
      { status: 429 },
    );
  }

  const { email } = await request.json();
  const user = await findUserByEmail(email ?? "");
  if (!user) {
    return NextResponse.json({ ok: true });
  }
  if (user.emailVerified) {
    return NextResponse.json({ error: "Email sudah terverifikasi" }, { status: 400 });
  }

  const token = createVerificationToken();
  await saveVerificationToken(user.email, token);
  const verifyUrl = `${site.url}/verifikasi-email?token=${token}`;

  const mail = await sendEmail({
    to: user.email,
    subject: `Verifikasi email ${site.name}`,
    html: verifyEmailHtml(user.name, verifyUrl),
    text: `Verifikasi email: ${verifyUrl}`,
  });

  if (!mail.ok && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: mail.error ?? "Gagal mengirim email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}