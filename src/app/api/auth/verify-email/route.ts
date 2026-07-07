import { NextRequest, NextResponse } from "next/server";
import { consumeVerificationToken } from "@/lib/email-verification";
import { createSession, verifyUserEmail, findUserByEmail } from "@/lib/auth";
import { welcomeEmailHtml, sendEmail } from "@/lib/email";
import { site } from "@/lib/site";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token tidak ada" }, { status: 400 });
  }

  const consumed = await consumeVerificationToken(token);
  if (!consumed.ok || !consumed.email) {
    return NextResponse.json({ error: consumed.error }, { status: 400 });
  }

  const ok = await verifyUserEmail(consumed.email);
  if (!ok) {
    return NextResponse.json({ error: "Akun tidak ditemukan" }, { status: 404 });
  }

  const user = await findUserByEmail(consumed.email);
  if (user) {
    await createSession(user);
    void sendEmail({
      to: user.email,
      subject: `Selamat datang di ${site.name}!`,
      html: welcomeEmailHtml(user.name),
      text: `Selamat datang di ${site.name}. Mulai setup di ${site.url}/mulai`,
    });
  }

  return NextResponse.json({ ok: true, email: consumed.email });
}