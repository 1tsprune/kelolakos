"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { site } from "@/lib/site";

export default function DaftarPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        password: fd.get("password"),
        phone: fd.get("phone"),
        website: fd.get("website"),
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Registrasi gagal");
      setLoading(false);
      return;
    }
    router.push("/mulai");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-[var(--ink)] p-12 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(26,107,92,0.2),transparent_60%)]" />
        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)]">
            <span className="font-display text-sm font-black text-white">{site.logoLetter}</span>
          </div>
          <span className="text-xl font-extrabold text-white">{site.name}</span>
        </Link>
        <div className="relative">
          <h2 className="font-display text-3xl font-bold leading-tight text-white">
            Kelola kos seperti<br />bisnis profesional
          </h2>
          <p className="mt-4 max-w-sm text-white/50">18 modul operasional. Trial 14 hari gratis.</p>
        </div>
        <p className="relative text-sm text-white/30">© 2026 {site.name}</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-[var(--paper)] p-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--ink)]">
              <span className="font-display text-xs font-black text-[var(--accent)]">{site.logoLetter}</span>
            </div>
            <span className="font-extrabold">{site.name}</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-[var(--ink)]">Daftar Gratis</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Trial 14 hari · Tanpa kartu kredit</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <Input label="Nama Lengkap" name="name" required />
            <Input label="Email" name="email" type="email" required />
            <Input label="No. WhatsApp" name="phone" required />
            <Input label="Password" name="password" type="password" minLength={6} required />
            {error && <p className="text-sm font-medium text-[var(--danger)]">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Buat Akun"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Sudah punya akun?{" "}
            <Link href="/masuk" className="font-bold text-[var(--accent)]">Masuk</Link>
          </p>
          <p className="mt-3 text-center text-xs text-[var(--muted)]">
            Dengan mendaftar, kamu setuju{" "}
            <Link href="/syarat-ketentuan" className="underline hover:text-[var(--ink)]">Syarat & Ketentuan</Link>
            {" "}dan{" "}
            <Link href="/kebijakan-privasi" className="underline hover:text-[var(--ink)]">Kebijakan Privasi</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}