"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { site } from "@/lib/site";

function VerifyContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const emailParam = params.get("email");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(token ? "loading" : "idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(emailParam ?? "");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendOk, setResendOk] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setStatus("error");
          setMessage(data.error ?? "Verifikasi gagal");
          return;
        }
        setStatus("ok");
        setMessage("Email berhasil diverifikasi! Mengalihkan ke dashboard...");
        setTimeout(() => {
          router.push("/mulai");
          router.refresh();
        }, 1500);
      })
      .catch(() => {
        setStatus("error");
        setMessage("Terjadi kesalahan. Coba lagi.");
      });
  }, [token, router]);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    setResendLoading(true);
    setResendOk(false);
    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setResendLoading(false);
    if (res.ok) {
      setResendOk(true);
      setMessage("Link verifikasi dikirim ulang. Cek inbox & folder spam.");
    } else {
      const data = await res.json();
      setMessage(data.error ?? "Gagal mengirim ulang");
    }
  }

  if (token) {
    return (
      <div className="mx-auto max-w-md text-center">
        {status === "loading" && (
          <>
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
            <p className="text-[var(--muted)]">Memverifikasi email...</p>
          </>
        )}
        {status === "ok" && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-[var(--success)]" />
            <p className="mt-4 font-semibold text-[var(--ink)]">{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <AlertCircle className="mx-auto h-12 w-12 text-[var(--danger)]" />
            <p className="mt-4 font-semibold text-[var(--danger)]">{message}</p>
            <Link href="/masuk" className="mt-6 inline-block text-sm font-bold text-[var(--accent)]">
              Kembali ke login
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)]/10">
        <Mail className="h-7 w-7 text-[var(--accent)]" />
      </div>
      <h1 className="font-display text-2xl font-bold text-[var(--ink)]">Cek email kamu</h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
        Kami sudah kirim link verifikasi ke email kamu. Klik link tersebut untuk mengaktifkan akun {site.name}.
        Tanpa verifikasi, kamu tidak bisa masuk.
      </p>
      {process.env.NODE_ENV === "development" && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Mode dev: cek terminal/console server untuk link verifikasi (jika RESEND belum di-set).
        </p>
      )}
      {message && (
        <p className={`mt-4 text-sm font-medium ${resendOk ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleResend} className="mt-8 space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={resendLoading}>
          {resendLoading ? "Mengirim..." : "Kirim Ulang Link Verifikasi"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        Sudah verifikasi?{" "}
        <Link href="/masuk" className="font-bold text-[var(--accent)]">Masuk</Link>
      </p>
    </div>
  );
}

export default function VerifikasiEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--paper)] p-8">
      <Suspense>
        <VerifyContent />
      </Suspense>
    </div>
  );
}