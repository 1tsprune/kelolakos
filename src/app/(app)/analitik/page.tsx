import Link from "next/link";
import { getAnalytics } from "@/lib/queries";
import { formatMonthYear, formatRupiah } from "@/lib/utils";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { OccupancyDonut } from "@/components/charts/OccupancyDonut";
import { Card, CardBody, CardHeader, PageTitle } from "@/components/ui/Card";
import { DataCell, DataRow, DataTable } from "@/components/ui/DataTable";
import { applyLateFees } from "@/lib/actions";
import { Button } from "@/components/ui/Button";

export default async function AnalitikPage() {
  const data = await getAnalytics();

  async function lateFeeAction() {
    "use server";
    await applyLateFees();
  }

  const targetPct = data.revenueTarget > 0
    ? Math.min(100, Math.round((data.collected / data.revenueTarget) * 100))
    : 0;

  return (
    <div className="space-y-6">
      <PageTitle
        title="Analitik"
        description={`${formatMonthYear(data.month, data.year)} · Insight operasional mendalam`}
        action={
          <form action={lateFeeAction}>
            <Button type="submit" variant="secondary" size="sm">Terapkan Denda Otomatis</Button>
          </form>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--ink)] p-6 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/50">Target pendapatan bulan ini</p>
            <p className="text-2xl font-extrabold">{formatRupiah(data.collected)} <span className="text-base font-medium text-white/40">/ {formatRupiah(data.revenueTarget)}</span></p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold text-[var(--accent)]">{targetPct}%</p>
            <p className="text-xs text-white/40">tercapai</p>
          </div>
        </div>
        <div className="progress-bar mt-4">
          <div style={{ width: `${targetPct}%` }} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Rata-rata Sewa", v: formatRupiah(data.avgRent) },
          { l: "Churn Bulan Ini", v: `${data.churnRate} penyewa` },
          { l: "Item Inventaris", v: String(data.inventoryCount) },
          { l: "Tingkat Hunian", v: `${data.occupancyRate}%` },
        ].map((s) => (
          <div key={s.l} className="app-stat p-5">
            <p className="text-xs font-semibold text-[var(--muted)]">{s.l}</p>
            <p className="mt-1 text-xl font-extrabold text-[var(--ink)]">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Tren Pendapatan" description="6 bulan terakhir (lunas)" />
          <CardBody><RevenueChart data={data.monthlyRevenue} /></CardBody>
        </Card>
        <Card>
          <CardHeader title="Komposisi Hunian" />
          <CardBody>
            <OccupancyDonut occupied={data.occupiedRooms} empty={data.emptyRooms} maintenance={data.maintenanceRooms} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Performa per Properti" description="Bulan berjalan — klik nama untuk detail" />
        <DataTable
          columns={[
            { label: "Properti" },
            { label: "Hunian" },
            { label: "Potensi" },
            { label: "Terkumpul" },
            { label: "Pengeluaran" },
            { label: "Laba Bersih" },
          ]}
        >
          {data.propertyPerformance.map((p) => (
            <DataRow key={p.property.id}>
              <DataCell>
                <Link href={`/properti/${p.property.id}`} className="font-bold text-[var(--accent)] hover:underline">
                  {p.property.name}
                </Link>
              </DataCell>
              <DataCell>{p.occupied}/{p.rooms} ({p.occupancy}%)</DataCell>
              <DataCell>{formatRupiah(p.potentialRevenue)}</DataCell>
              <DataCell className="font-semibold text-[var(--success)]">{formatRupiah(p.collected)}</DataCell>
              <DataCell className="text-[var(--danger)]">{formatRupiah(p.expenses)}</DataCell>
              <DataCell className={`font-bold ${p.netIncome >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
                {formatRupiah(p.netIncome)}
              </DataCell>
            </DataRow>
          ))}
        </DataTable>
      </Card>
    </div>
  );
}