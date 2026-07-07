import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";
import { createVerificationToken, saveVerificationToken } from "@/lib/email-verification";
import { verifyEmailHtml, sendEmail } from "@/lib/email";
import { checkRateLimit, validatePassword } from "@/lib/security";
import { site } from "@/lib/site";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = checkRateLimit(`register:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Terlalu banyak pendaftaran. Coba lagi dalam ${limit.retryAfterSec} detik.` },
      { status: 429 },
    );
  }

  const { name, email, password, phone, website } = await request.json();
  if (website) {
    return NextResponse.json({ error: "Registrasi gagal" }, { status: 400 });
  }
  const passwordError = validatePassword(password ?? "");
  if (passwordError) return NextResponse.json({ error: passwordError }, { status: 400 });

  const reg = await registerUser({ name, email, password, phone });
  if (!reg.ok) return NextResponse.json({ error: reg.error }, { status: 400 });

  const token = createVerificationToken();
  await saveVerificationToken(email, token);
  const verifyUrl = `${site.url}/verifikasi-email?token=${token}`;

  const mail = await sendEmail({
    to: email,
    subject: `Verifikasi email ${site.name}`,
    html: verifyEmailHtml(name, verifyUrl),
    text: `Verifikasi email ${site.name}: ${verifyUrl}`,
  });

  if (!mail.ok && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: mail.error ?? "Gagal mengirim email verifikasi" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, needsVerification: true, email });
}