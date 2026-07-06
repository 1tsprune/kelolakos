"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { site } from "@/lib/site";

export default function LupaPasswordPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fd.get("email"), website: fd.get("website") }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Gagal mengirim email");
      return;
    }
    setMessage(data.message ?? "Cek inbox email kamu.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--paper)] p-8">
      <div className="w-full max-w-sm">
        <Link href="/masuk" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]">
          ← Kembali ke masuk
        </Link>
        <h1 className="font-display text-2xl font-bold text-[var(--ink)]">Lupa Password</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Kami kirim link reset ke email kamu.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <Input label="Email" name="email" type="email" required />
          {error && <p className="text-sm font-medium text-[var(--danger)]">{error}</p>}
          {message && <p className="text-sm font-medium text-[var(--success)]">{message}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-[var(--muted)]">© 2026 {site.name}</p>
      </div>
    </div>
  );
}