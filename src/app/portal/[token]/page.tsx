import Link from "next/link";
import { notFound } from "next/navigation";
import { getSettingsForUser, getTenantByPortalToken } from "@/lib/queries";
import { submitPortalMaintenance } from "@/lib/actions";
import { formatDate, formatMonthYear, formatRupiah } from "@/lib/utils";
import { Building2, CreditCard, Wrench } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { StatusBadge } from "@/components/StatusBadge";
import { site } from "@/lib/site";

export default async function PortalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const data = await getTenantByPortalToken(token);
  if (!data) notFound();

  const { tenant, room, property, payments, utilities } = data;
  const settings = await getSettingsForUser(property.userId);
  const unpaid = payments.filter((p) => p.status !== "lunas");

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <header className="border-b border-[var(--border)] bg-[var(--ink)] text-white">
        <div className="mx-auto flex h-16 max-w-lg items-center gap-3 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)]">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold">{property.name}</p>
            <p className="text-xs text-white/50">Portal Penyewa</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-8">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <p className="text-sm text-[var(--muted)]">Halo,</p>
          <h1 className="font-display text-2xl font-bold text-[var(--ink)]">{tenant.name}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Kamar {room.number} · Sejak {formatDate(tenant.checkIn)}</p>
          {tenant.contractEndDate && (
            <p className="mt-2 text-xs font-semibold text-[var(--warning)]">Kontrak hingga {formatDate(tenant.contractEndDate)}</p>
          )}
          {settings.portalWelcomeMessage && (
            <p className="mt-4 rounded-xl bg-[var(--paper)] p-3 text-sm text-[var(--muted)]">
              {settings.portalWelcomeMessage}
            </p>
          )}
        </div>

        {unpaid.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 font-bold text-[var(--ink)]">Tagihan Belum Lunas</h2>
            <div className="space-y-3">
              {unpaid.map((p) => (
                <div key={p.id} className="rounded-xl border border-red-100 bg-red-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[var(--ink)]">{formatMonthYear(p.periodMonth, p.periodYear)}</p>
                      <p className="text-sm text-[var(--muted)]">Jatuh tempo {formatDate(p.dueDate)}</p>
                    </div>
                    <p className="text-lg font-extrabold text-[var(--danger)]">{formatRupiah(p.amount + p.lateFee)}</p>
                  </div>
                  <Link
                    href={`/bayar/${p.id}`}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-3 text-sm font-bold text-white hover:bg-[var(--accent-hover)]"
                  >
                    <CreditCard className="h-4 w-4" /> Bayar via QRIS
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8">
          <h2 className="mb-3 font-bold text-[var(--ink)]">Riwayat Pembayaran</h2>
          <div className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] bg-white">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="text-sm font-semibold">{formatMonthYear(p.periodMonth, p.periodYear)}</p>
                  <StatusBadge status={p.status} type="payment" />
                </div>
                <p className="font-bold">{formatRupiah(p.amount)}</p>
              </div>
            ))}
          </div>
        </section>

        {utilities.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 font-bold text-[var(--ink)]">Tagihan Utilitas</h2>
            <div className="space-y-2">
              {utilities.map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white px-4 py-3">
                  <span className="text-sm capitalize">{u.type} {formatMonthYear(u.periodMonth, u.periodYear)}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{formatRupiah(u.amount)}</span>
                    <StatusBadge status={u.status} type="payment" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8 rounded-xl border border-[var(--border)] bg-white p-5">
          <h2 className="mb-3 flex items-center gap-2 font-bold text-[var(--ink)]">
            <Wrench className="h-5 w-5 text-[var(--accent)]" /> Laporkan Masalah
          </h2>
          <form action={submitPortalMaintenance} className="space-y-3">
            <input type="hidden" name="token" value={token} />
            <Input label="Judul" name="title" placeholder="Contoh: Keran bocor" required />
            <Textarea label="Deskripsi" name="description" placeholder="Jelaskan masalahnya..." required />
            <Button type="submit" className="w-full">Kirim Laporan</Button>
          </form>
        </section>

        <p className="mt-8 text-center text-xs text-[var(--muted)]">Portal penyewa · {site.name}</p>
      </main>
    </div>
  );
}