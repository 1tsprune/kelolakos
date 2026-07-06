"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { site } from "@/lib/site";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setError("Token tidak ditemukan");
      return;
    }
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") ?? "");
    const confirm = String(fd.get("confirm") ?? "");
    if (password !== confirm) {
      setError("Password tidak cocok");
      setLoading(false);
      return;
    }
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Gagal reset password");
      return;
    }
    router.push("/masuk?reset=ok");
  }

  if (!token) {
    return (
      <p className="text-sm text-[var(--danger)]">
        Link tidak valid. <Link href="/lupa-password" className="font-bold underline">Minta link baru</Link>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <Input label="Password Baru" name="password" type="password" minLength={8} required />
      <Input label="Konfirmasi Password" name="confirm" type="password" minLength={8} required />
      {error && <p className="text-sm font-medium text-[var(--danger)]">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Menyimpan..." : "Simpan Password Baru"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--paper)] p-8">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl font-bold text-[var(--ink)]">Password Baru</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Masukkan password baru untuk akun {site.name} kamu.</p>
        <Suspense fallback={<p className="mt-8 text-sm text-[var(--muted)]">Memuat...</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}