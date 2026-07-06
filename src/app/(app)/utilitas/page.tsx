import { createUtilityBill, markUtilityPaid } from "@/lib/actions";
import { getUtilityBills, getRooms } from "@/lib/queries";
import { formatMonthYear, formatRupiah } from "@/lib/utils";
import { Card, PageTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { DataCell, DataRow, DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Zap } from "lucide-react";

export default async function UtilitasPage() {
  const [bills, rooms] = await Promise.all([getUtilityBills(), getRooms()]);
  const now = new Date();
  const pending = bills.filter((b) => b.status === "belum");
  const totalPending = pending.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="space-y-6">
      <PageTitle
        title="Tagihan Utilitas"
        description="Kelola listrik & air per kamar"
        action={
          <div className="rounded-xl bg-amber-50 px-4 py-2 text-sm font-bold text-[var(--warning)]">
            Tunggakan: {formatRupiah(totalPending)}
          </div>
        }
      />

      <Card className="p-6">
        <h3 className="mb-4 font-bold text-[var(--ink)]">Input Tagihan Baru</h3>
        <form action={createUtilityBill} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select label="Kamar" name="roomId" required>
            <option value="">Pilih kamar</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>{r.property.name} — {r.number}</option>
            ))}
          </Select>
          <Select label="Jenis" name="type" required>
            <option value="listrik">Listrik</option>
            <option value="air">Air</option>
          </Select>
          <Input label="Bulan" name="periodMonth" type="number" defaultValue={now.getMonth() + 1} min={1} max={12} required />
          <Input label="Tahun" name="periodYear" type="number" defaultValue={now.getFullYear()} required />
          <Input label="Meter Awal" name="meterStart" type="number" required />
          <Input label="Meter Akhir" name="meterEnd" type="number" required />
          <Input label="Tarif/Unit (Rp)" name="ratePerUnit" type="number" defaultValue={1500} required />
          <div className="flex items-end">
            <Button type="submit" className="w-full"><Zap className="h-4 w-4" /> Hitung & Simpan</Button>
          </div>
        </form>
      </Card>

      <Card>
        <DataTable
          columns={[
            { label: "Properti / Kamar" },
            { label: "Jenis" },
            { label: "Periode" },
            { label: "Pemakaian" },
            { label: "Total" },
            { label: "Status" },
            { label: "Aksi" },
          ]}
          empty={bills.length === 0 ? <p className="px-5 py-12 text-center text-[var(--muted)]">Belum ada tagihan utilitas</p> : undefined}
        >
          {bills.map((bill) => (
            <DataRow key={bill.id}>
              <DataCell className="font-semibold">{bill.property.name} · {bill.room.number}</DataCell>
              <DataCell className="capitalize">{bill.type}</DataCell>
              <DataCell>{formatMonthYear(bill.periodMonth, bill.periodYear)}</DataCell>
              <DataCell>{bill.meterEnd - bill.meterStart} unit</DataCell>
              <DataCell className="font-bold">{formatRupiah(bill.amount)}</DataCell>
              <DataCell><StatusBadge status={bill.status} type="payment" /></DataCell>
              <DataCell>
                {bill.status === "belum" && (
                  <form action={markUtilityPaid.bind(null, bill.id)}>
                    <Button type="submit" size="sm">Lunas</Button>
                  </form>
                )}
              </DataCell>
            </DataRow>
          ))}
        </DataTable>
      </Card>
    </div>
  );
}