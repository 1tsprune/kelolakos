import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CreditCard, Phone } from "lucide-react";
import { checkoutTenant, updateTenant } from "@/lib/actions";
import { getTenant, getTenantPayments } from "@/lib/queries";
import { daysUntil, formatDate, formatMonthYear, formatRupiah } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Card, PageTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { PortalLinkCopy } from "@/components/PortalLinkCopy";
import { StatusBadge } from "@/components/StatusBadge";
import { DataCell, DataRow, DataTable } from "@/components/ui/DataTable";

export default async function PenyewaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tenant = await getTenant(id);
  if (!tenant) notFound();

  const history = await getTenantPayments(tenant.id);

  const contractDays = tenant.contractEndDate ? daysUntil(tenant.contractEndDate) : null;

  return (
    <div className="space-y-6">
      <Link href="/penyewa" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]">
        <ArrowLeft className="h-4 w-4" /> Semua Penyewa
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--ink)] text-lg font-bold text-[var(--accent)]">
            {tenant.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <PageTitle
            title={tenant.name}
            description={`${tenant.room.property.name} · Kamar ${tenant.room.number}`}
          />
        </div>
        <span className={`self-start rounded-full px-3 py-1 text-xs font-bold ${tenant.isActive ? "bg-[var(--teal-soft)] text-[var(--teal)]" : "bg-[var(--paper-dark)] text-[var(--muted)]"}`}>
          {tenant.isActive ? "Aktif" : "Sudah Keluar"}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "Masuk", v: formatDate(tenant.checkIn) },
          { l: "Deposit", v: formatRupiah(tenant.depositAmount) },
          { l: "Kontrak", v: tenant.contractEndDate ? formatDate(tenant.contractEndDate) : "—" },
          { l: "Sisa Kontrak", v: contractDays !== null ? `${contractDays} hari` : "—" },
        ].map((s) => (
          <div key={s.l} className="app-stat p-4">
            <p className="text-xs text-[var(--muted)]">{s.l}</p>
            <p className="font-bold text-[var(--ink)]">{s.v}</p>
          </div>
        ))}
      </div>

      {contractDays !== null && contractDays <= 30 && contractDays > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-semibold text-[var(--warning)]">
          Kontrak berakhir dalam {contractDays} hari — siapkan perpanjangan atau cari penyewa baru.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 font-bold text-[var(--ink)]">Kontak & Portal</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">WhatsApp</span>
              <a href={buildWhatsAppUrl(tenant.phone, `Halo ${tenant.name}`)} className="flex items-center gap-1 font-semibold text-[var(--teal)]">
                <Phone className="h-3.5 w-3.5" /> {tenant.phone}
              </a>
            </div>
            {tenant.emergencyContact && (
              <div className="flex justify-between"><span className="text-[var(--muted)]">Darurat</span><span>{tenant.emergencyContact}</span></div>
            )}
            {tenant.ktp && <div className="flex justify-between"><span className="text-[var(--muted)]">KTP</span><span>{tenant.ktp}</span></div>}
          </div>
          {tenant.isActive && (
            <div className="mt-5 flex flex-wrap gap-3">
              <PortalLinkCopy token={tenant.portalToken} />
              <form action={checkoutTenant.bind(null, tenant.id)}>
                <Button type="submit" variant="danger" size="sm">Check-out</Button>
              </form>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-bold text-[var(--ink)]">Edit Data</h3>
          <form action={updateTenant} className="space-y-4">
            <input type="hidden" name="id" value={tenant.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Nama" name="name" defaultValue={tenant.name} />
              <Input label="WhatsApp" name="phone" defaultValue={tenant.phone} />
              <Input label="KTP" name="ktp" defaultValue={tenant.ktp ?? ""} />
              <Input label="Kontrak Berakhir" name="contractEndDate" type="date" defaultValue={tenant.contractEndDate?.split("T")[0] ?? ""} />
              <Input label="Deposit" name="depositAmount" type="number" defaultValue={tenant.depositAmount} />
              <Input label="Kontak Darurat" name="emergencyContact" defaultValue={tenant.emergencyContact ?? ""} />
            </div>
            <Textarea label="Catatan" name="notes" defaultValue={tenant.notes ?? ""} />
            <Button type="submit">Simpan</Button>
          </form>
        </Card>
      </div>

      <Card>
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h3 className="flex items-center gap-2 font-bold text-[var(--ink)]">
            <CreditCard className="h-5 w-5 text-[var(--accent)]" /> Riwayat Pembayaran
          </h3>
        </div>
        {history.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-[var(--muted)]">Belum ada riwayat pembayaran</p>
        ) : (
          <DataTable columns={[{ label: "Periode" }, { label: "Jumlah" }, { label: "Jatuh Tempo" }, { label: "Status" }]}>
            {history.map((p) => (
              <DataRow key={p.id}>
                <DataCell>{formatMonthYear(p.periodMonth, p.periodYear)}</DataCell>
                <DataCell className="font-bold">{formatRupiah(p.amount + p.lateFee)}</DataCell>
                <DataCell>{formatDate(p.dueDate)}</DataCell>
                <DataCell><StatusBadge status={p.status} type="payment" /></DataCell>
              </DataRow>
            ))}
          </DataTable>
        )}
      </Card>
    </div>
  );
}