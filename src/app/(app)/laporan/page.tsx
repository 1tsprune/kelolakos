import Link from "next/link";
import { Download, FileText, Printer, TrendingDown, TrendingUp } from "lucide-react";
import { getReportData } from "@/lib/queries";
import { formatMonthYear, formatRupiah } from "@/lib/utils";
import { Card, PageTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MonthPicker } from "@/components/ui/MonthPicker";
import { DataCell, DataRow, DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/StatusBadge";

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ bulan?: string; tahun?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const month = Number(params.bulan) || now.getMonth() + 1;
  const year = Number(params.tahun) || now.getFullYear();
  const report = await getReportData(month, year);
  const collectionRate = report.totalExpected > 0 ? Math.round((report.totalCollected / report.totalExpected) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageTitle
        title="Laporan Keuangan"
        description={formatMonthYear(month, year)}
        action={
          <div className="flex flex-wrap gap-2">
            <a href={`/laporan/cetak?bulan=${month}&tahun=${year}`}>
              <Button variant="secondary"><Printer className="h-4 w-4" /> Cetak</Button>
            </a>
            <a href={`/api/laporan/pdf?bulan=${month}&tahun=${year}`}>
              <Button variant="secondary"><FileText className="h-4 w-4" /> PDF</Button>
            </a>
            <a href={`/api/laporan/export?bulan=${month}&tahun=${year}`}>
              <Button variant="secondary"><Download className="h-4 w-4" /> CSV</Button>
            </a>
          </div>
        }
      />

      <MonthPicker month={month} year={year} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="app-stat border-l-4 border-l-[var(--success)] p-5">
          <p className="flex items-center gap-1 text-sm text-[var(--muted)]"><TrendingUp className="h-4 w-4" /> Pendapatan</p>
          <p className="text-2xl font-extrabold text-[var(--success)]">{formatRupiah(report.totalCollected)}</p>
          <p className="text-xs text-[var(--muted)]">dari {formatRupiah(report.totalExpected)} target</p>
        </div>
        <div className="app-stat border-l-4 border-l-[var(--danger)] p-5">
          <p className="flex items-center gap-1 text-sm text-[var(--muted)]"><TrendingDown className="h-4 w-4" /> Pengeluaran</p>
          <p className="text-2xl font-extrabold text-[var(--danger)]">{formatRupiah(report.totalExpenses)}</p>
        </div>
        <div className="app-stat border-l-4 border-l-[var(--accent)] p-5">
          <p className="text-sm text-[var(--muted)]">Laba Bersih</p>
          <p className={`text-2xl font-extrabold ${report.netIncome >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
            {formatRupiah(report.netIncome)}
          </p>
        </div>
        <div className="app-stat p-5">
          <p className="text-sm text-[var(--muted)]">Tingkat Koleksi</p>
          <p className="text-2xl font-extrabold text-[var(--ink)]">{collectionRate}%</p>
          <div className="progress-bar mt-2">
            <div style={{ width: `${collectionRate}%` }} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {report.properties.map((property) => {
          const occupied = property.rooms.filter((r) => r.status === "terisi").length;
          const revenue = property.rooms.filter((r) => r.status === "terisi").reduce((s, r) => s + r.monthlyRent, 0);
          return (
            <Card key={property.id} className="p-5">
              <div className="flex justify-between">
                <h3 className="font-bold text-[var(--ink)]">{property.name}</h3>
                <Link href={`/properti/${property.id}`} className="text-xs font-bold text-[var(--accent)]">Detail →</Link>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div><p className="text-[var(--muted)]">Hunian</p><p className="font-bold">{property.rooms.length > 0 ? Math.round((occupied / property.rooms.length) * 100) : 0}%</p></div>
                <div><p className="text-[var(--muted)]">Terisi</p><p className="font-bold">{occupied}/{property.rooms.length}</p></div>
                <div><p className="text-[var(--muted)]">Pendapatan</p><p className="font-bold text-[var(--success)]">{formatRupiah(revenue)}</p></div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="border-b border-[var(--border)] px-5 py-4 font-bold text-[var(--ink)]">Rincian Pembayaran</div>
        <DataTable columns={[{ label: "Penyewa" }, { label: "Kamar" }, { label: "Jumlah" }, { label: "Status" }]}>
          {report.payments.map((p) => (
            <DataRow key={p.id}>
              <DataCell>{p.tenant.name}</DataCell>
              <DataCell className="text-[var(--muted)]">{p.room.property.name} · {p.room.number}</DataCell>
              <DataCell className="font-bold">{formatRupiah(p.amount)}</DataCell>
              <DataCell><StatusBadge status={p.status} type="payment" /></DataCell>
            </DataRow>
          ))}
        </DataTable>
      </Card>
    </div>
  );
}