import { getReportData, getSettings } from "@/lib/queries";
import { site } from "@/lib/site";
import { formatDate, formatMonthYear, formatRupiah } from "@/lib/utils";
import { PrintButton } from "./PrintButton";
import { Button } from "@/components/ui/Button";
import { FileText } from "lucide-react";

export default async function LaporanCetakPage({
  searchParams,
}: {
  searchParams: Promise<{ bulan?: string; tahun?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const month = Number(params.bulan) || now.getMonth() + 1;
  const year = Number(params.tahun) || now.getFullYear();
  const [report, settings] = await Promise.all([getReportData(month, year), getSettings()]);

  return (
    <div className="print-layout mx-auto max-w-4xl bg-white p-8">
      <div className="no-print mb-6 flex gap-3">
        <PrintButton />
        <a href={`/api/laporan/pdf?bulan=${month}&tahun=${year}`}>
          <Button variant="secondary"><FileText className="h-4 w-4" /> Download PDF</Button>
        </a>
      </div>

      <header className="border-b-2 border-[var(--accent)] pb-4">
        <h1 className="font-display text-2xl font-bold text-[var(--ink)]">{settings.businessName}</h1>
        <p className="text-[var(--muted)]">Laporan Keuangan — {formatMonthYear(month, year)}</p>
        <p className="text-sm text-[var(--muted)]">Dicetak: {formatDate(now.toISOString())}</p>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Target", val: report.totalExpected, color: "text-[var(--ink)]" },
          { label: "Terkumpul", val: report.totalCollected, color: "text-[var(--success)]" },
          { label: "Pengeluaran", val: report.totalExpenses, color: "text-[var(--danger)]" },
          { label: "Laba Bersih", val: report.netIncome, color: report.netIncome >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]" },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-[var(--border)] p-3">
            <p className="text-xs font-semibold text-[var(--muted)]">{item.label}</p>
            <p className={`text-lg font-bold ${item.color}`}>{formatRupiah(item.val)}</p>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-[var(--ink)]">Rincian Pembayaran Sewa</h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-[var(--border)] bg-[var(--paper)]">
              <th className="px-3 py-2 text-left">Penyewa</th>
              <th className="px-3 py-2 text-left">Properti / Kamar</th>
              <th className="px-3 py-2 text-right">Jumlah</th>
              <th className="px-3 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {report.payments.map((p) => (
              <tr key={p.id} className="border-b border-[var(--border)]">
                <td className="px-3 py-2">{p.tenant.name}</td>
                <td className="px-3 py-2">{p.room.property.name} / {p.room.number}</td>
                <td className="px-3 py-2 text-right font-medium">{formatRupiah(p.amount)}</td>
                <td className="px-3 py-2 text-center capitalize">{p.status}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[var(--border)] font-bold">
              <td colSpan={2} className="px-3 py-2">Total Terkumpul</td>
              <td className="px-3 py-2 text-right text-[var(--success)]">{formatRupiah(report.totalCollected)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </section>

      {report.expenses.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-[var(--ink)]">Pengeluaran</h2>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-[var(--border)] bg-[var(--paper)]">
                <th className="px-3 py-2 text-left">Deskripsi</th>
                <th className="px-3 py-2 text-left">Kategori</th>
                <th className="px-3 py-2 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {report.expenses.map((e) => (
                <tr key={e.id} className="border-b border-[var(--border)]">
                  <td className="px-3 py-2">{e.description}</td>
                  <td className="px-3 py-2 capitalize">{e.category}</td>
                  <td className="px-3 py-2 text-right text-[var(--danger)]">{formatRupiah(e.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <footer className="mt-12 border-t border-[var(--border)] pt-4 text-center text-xs text-[var(--muted)]">
        Dokumen dibuat otomatis oleh {site.name} · {settings.ownerEmail}
      </footer>
    </div>
  );
}