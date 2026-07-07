import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { site } from "@/lib/site";

export function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-[var(--ink)]">
            <BrandLogo variant="mark" size="sm" href={null} />
            {site.name}
          </Link>
          <Link href="/" className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]">
            ← Beranda
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-display text-3xl font-bold text-[var(--ink)]">{title}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Terakhir diperbarui: Juli 2026</p>
        <div className="prose-kos mt-8 space-y-4 text-sm leading-relaxed text-[var(--ink)]">{children}</div>
      </main>
    </div>
  );
}