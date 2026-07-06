import Link from "next/link";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--paper)] px-6 text-center">
      <p className="font-display text-8xl font-black text-[var(--paper-dark)]">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-[var(--ink)]">Halaman tidak ditemukan</h1>
      <p className="mt-2 max-w-sm text-[var(--muted)]">
        Link mungkin sudah tidak aktif atau halaman dipindahkan.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--accent-hover)]">
          Ke Beranda
        </Link>
        <Link href="/masuk" className="rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-bold text-[var(--ink)] hover:bg-white">
          Masuk
        </Link>
      </div>
      <p className="mt-12 text-xs text-[var(--muted)]">{site.name}</p>
    </div>
  );
}