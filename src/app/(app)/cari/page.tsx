import Link from "next/link";
import { globalSearch } from "@/lib/queries";
import { Card, PageTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search, Users, DoorOpen, Building2 } from "lucide-react";

export default async function CariPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? await globalSearch(q) : null;
  const total = results ? results.tenants.length + results.rooms.length + results.properties.length : 0;

  return (
    <div className="space-y-6">
      <PageTitle title="Pencarian" description="Cari penyewa, kamar, atau properti di semua kos kamu" />

      <form className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]" />
        <input
          name="q"
          defaultValue={q}
          placeholder="Ketik nama penyewa, nomor kamar, nama kos..."
          className="w-full rounded-2xl border border-[var(--border)] bg-white py-3.5 pl-12 pr-4 text-base outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
        />
      </form>

      {q && results && total === 0 && (
        <Card>
          <EmptyState icon={Search} title="Tidak ditemukan" description={`Tidak ada hasil untuk "${q}"`} />
        </Card>
      )}

      {q && results && total > 0 && (
        <div className="space-y-6">
          <p className="text-sm font-semibold text-[var(--muted)]">{total} hasil untuk &ldquo;{q}&rdquo;</p>

          {results.tenants.length > 0 && (
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
                <Users className="h-4 w-4" /> Penyewa
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {results.tenants.map((t) => (
                  <Link key={t.id} href={`/penyewa/${t.id}`} className="rounded-xl border border-[var(--border)] bg-white px-5 py-4 transition-all hover:border-[var(--accent)] hover:shadow-sm">
                    <p className="font-bold text-[var(--ink)]">{t.name}</p>
                    <p className="text-sm text-[var(--muted)]">{t.phone}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.rooms.length > 0 && (
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
                <DoorOpen className="h-4 w-4" /> Kamar
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {results.rooms.map((r) => (
                  <Link key={r.id} href={`/kamar/${r.id}`} className="rounded-xl border border-[var(--border)] bg-white px-5 py-4 transition-all hover:border-[var(--accent)] hover:shadow-sm">
                    <p className="font-bold text-[var(--ink)]">Kamar {r.number}</p>
                    <p className="text-sm capitalize text-[var(--muted)]">{r.status}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.properties.length > 0 && (
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
                <Building2 className="h-4 w-4" /> Properti
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {results.properties.map((p) => (
                  <Link key={p.id} href={`/properti/${p.id}`} className="rounded-xl border border-[var(--border)] bg-white px-5 py-4 transition-all hover:border-[var(--accent)] hover:shadow-sm">
                    <p className="font-bold text-[var(--ink)]">{p.name}</p>
                    <p className="text-sm text-[var(--muted)]">{p.city}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}