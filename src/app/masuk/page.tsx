"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { BrandLogo } from "@/components/BrandLogo";
import { site, supportWhatsAppUrl } from "@/lib/site";

const GOOGLE_ERRORS: Record<string, string> = {
  google_denied: "Login Google dibatalkan.",
  google_state: "Sesi Google tidak valid. Coba lagi.",
  google_failed: "Login Google gagal. Coba lagi.",
  google_config: "Login Google belum dikonfigurasi di server.",
};

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const googleError = params.get("error");
  const googleMsg = googleError && !googleError.startsWith("google_")
    ? decodeURIComponent(googleError)
    : googleError
      ? GOOGLE_ERRORS[googleError]
      : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.needsVerification) {
        router.push(`/verifikasi-email?email=${encodeURIComponent(String(fd.get("email") ?? ""))}`);
        return;
      }
      setError(data.error ?? "Login gagal");
      setLoading(false);
      return;
    }
    router.push(params.get("redirect") ?? "/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-[var(--ink)] p-12 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(29,93,168,0.2),transparent_60%)]" />
        <Link href="/" className="relative flex items-center gap-2.5">
          <BrandLogo variant="mark" size="sm" href={null} />
          <span className="text-xl font-extrabold text-white">{site.name}</span>
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-extrabold leading-tight text-white">
            Dashboard operasional<br />kos kamu menunggu
          </h2>
          <p className="mt-4 max-w-sm text-white/50">18 modul · Portal penyewa · QRIS · Laporan PDF · Multi-properti</p>
        </div>
        <p className="relative text-sm text-white/30">© 2026 {site.name}</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-[var(--paper)] p-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <BrandLogo variant="mark" size="sm" href={null} />
            <span className="font-extrabold">{site.name}</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-[var(--ink)]">Masuk</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Demo: budi@kosmelati.id / password123</p>

          {params.get("reset") === "ok" && (
            <p className="mt-4 rounded-lg bg-[var(--teal-soft)] px-3 py-2 text-sm font-medium text-[var(--teal)]">
              Password berhasil diubah. Silakan masuk.
            </p>
          )}
          {(googleMsg || error) && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {googleMsg || error}
            </p>
          )}

          <GoogleLoginButton />
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--paper)] px-2 text-[var(--muted)]">atau email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" name="email" type="email" defaultValue="budi@kosmelati.id" required />
            <Input label="Password" name="password" type="password" defaultValue="password123" required />
            <div className="text-right">
              <Link href="/lupa-password" className="text-xs font-semibold text-[var(--accent)] hover:underline">
                Lupa password?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Masuk ke Dashboard"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Belum punya akun?{" "}
            <Link href="/daftar" className="font-bold text-[var(--accent)]">Daftar gratis 14 hari</Link>
          </p>
          <p className="mt-4 text-center text-xs text-[var(--muted)]">
            Butuh bantuan?{" "}
            <a href={supportWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#25D366] hover:underline">
              Chat admin via WhatsApp
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MasukPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}