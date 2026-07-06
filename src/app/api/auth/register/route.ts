import { NextRequest, NextResponse } from "next/server";
import { createSession, registerUser, loginUser } from "@/lib/auth";
import { welcomeEmailHtml, sendEmail } from "@/lib/email";
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
  const login = await loginUser(email, password);
  if (login.ok && login.user) {
    await createSession(login.user);
    void sendEmail({
      to: email,
      subject: `Selamat datang di ${site.name}!`,
      html: welcomeEmailHtml(name),
      text: `Selamat datang di ${site.name}. Mulai setup di ${site.url}/mulai`,
    });
  }
  return NextResponse.json({ ok: true });
}