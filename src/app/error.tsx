"use client";

import Link from "next/link";
import { useEffect } from "react";
import { site } from "@/lib/site";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--paper)] px-6 text-center">
      <p className="font-display text-6xl font-black text-[var(--danger)]">Oops</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-[var(--ink)]">Terjadi kesalahan</h1>
      <p className="mt-2 max-w-sm text-[var(--muted)]">
        Tim {site.name} sudah diberi tahu. Coba refresh atau kembali ke dashboard.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--accent-hover)]"
        >
          Coba Lagi
        </button>
        <Link href="/dashboard" className="rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-bold text-[var(--ink)] hover:bg-white">
          Dashboard
        </Link>
      </div>
    </div>
  );
}