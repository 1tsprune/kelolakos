"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { site } from "@/lib/site";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!res.ok) {
      setError((await res.json()).error ?? "Login gagal");
      setLoading(false);
      return;
    }
    router.push(params.get("redirect") ?? "/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-[var(--ink)] p-12 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(232,98,26,0.3),transparent_60%)]" />
        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)]">
            <span className="text-sm font-extrabold text-white">{site.logoLetter}</span>
          </div>
          <span className="text-xl font-extrabold text-white">{site.name}</span>
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-extrabold leading-tight text-white">
            Dashboard operasional<br />kos kamu menunggu
          </h2>
          <p className="mt-4 max-w-sm text-white/50">15+ modul. Portal penyewa. QRIS. Laporan PDF.</p>
        </div>
        <p className="relative text-sm text-white/30">© 2026 {site.name}</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-[var(--paper)] p-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--ink)]">
              <span className="text-xs font-extrabold text-[var(--accent)]">{site.logoLetter}</span>
            </div>
            <span className="font-extrabold">{site.name}</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-[var(--ink)]">Masuk</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Demo: budi@kosmelati.id / password123</p>

          {params.get("reset") === "ok" && (
            <p className="mt-4 rounded-lg bg-[var(--teal-soft)] px-3 py-2 text-sm font-medium text-[var(--teal)]">
              Password berhasil diubah. Silakan masuk.
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input label="Email" name="email" type="email" defaultValue="budi@kosmelati.id" required />
            <Input label="Password" name="password" type="password" defaultValue="password123" required />
            <div className="text-right">
              <Link href="/lupa-password" className="text-xs font-semibold text-[var(--accent)] hover:underline">
                Lupa password?
              </Link>
            </div>
            {error && <p className="text-sm font-medium text-[var(--danger)]">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Masuk ke Dashboard"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Belum punya akun?{" "}
            <Link href="/daftar" className="font-bold text-[var(--accent)]">Daftar gratis 14 hari</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MasukPage() {
  return <Suspense><LoginForm /></Suspense>;
}