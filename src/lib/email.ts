import { site } from "./site";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(input: SendEmailInput): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM ?? `${site.name} <noreply@kelolakos.id>`;

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info("[email:dev]", input.to, input.subject, input.text ?? input.html.slice(0, 120));
      return { ok: true };
    }
    return { ok: false, error: "RESEND_API_KEY belum dikonfigurasi" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return { ok: false, error: body || "Gagal mengirim email" };
  }

  return { ok: true };
}

export function welcomeEmailHtml(name: string): string {
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#0c1222">
      <h1 style="color:#d4551a">Selamat datang di ${site.name}!</h1>
      <p>Halo <strong>${name}</strong>,</p>
      <p>Akun kamu sudah aktif dengan <strong>trial 14 hari</strong>. Mulai dengan menambahkan properti kos pertama di dashboard.</p>
      <p><a href="${site.url}/mulai" style="display:inline-block;background:#d4551a;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Mulai Setup</a></p>
      <p style="color:#5c6478;font-size:13px">Butuh bantuan? Balas email ini atau hubungi ${site.contactEmail}</p>
    </div>
  `;
}

export function resetPasswordEmailHtml(name: string, resetUrl: string): string {
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#0c1222">
      <h1 style="color:#d4551a">Reset Password</h1>
      <p>Halo <strong>${name}</strong>,</p>
      <p>Kami menerima permintaan reset password untuk akun ${site.name} kamu. Klik tombol di bawah (berlaku 1 jam):</p>
      <p><a href="${resetUrl}" style="display:inline-block;background:#d4551a;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Reset Password</a></p>
      <p style="color:#5c6478;font-size:13px">Kalau kamu tidak meminta ini, abaikan email ini.</p>
    </div>
  `;
}