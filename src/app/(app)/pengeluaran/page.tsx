import { createExpense } from "@/lib/actions";
import { getExpenses, getProperties } from "@/lib/queries";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Card, PageTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { DataCell, DataRow, DataTable } from "@/components/ui/DataTable";
import { Receipt } from "lucide-react";

const categoryLabels: Record<string, string> = {
  listrik: "Listrik", air: "Air", gaji: "Gaji", perbaikan: "Perbaikan", kebersihan: "Kebersihan", lainnya: "Lainnya",
};

export default async function PengeluaranPage() {
  const [expenses, properties] = await Promise.all([getExpenses(), getProperties()]);
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const now = new Date();

  return (
    <div className="space-y-6">
      <PageTitle
        title="Pengeluaran"
        description="Catat biaya operasional kos"
        action={
          <div className="rounded-xl bg-red-50 px-5 py-3">
            <p className="text-xs font-bold text-[var(--danger)]">Total</p>
            <p className="text-xl font-extrabold text-[var(--danger)]">{formatRupiah(total)}</p>
          </div>
        }
      />

      <Card className="p-6">
        <form action={createExpense} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select label="Properti" name="propertyId" required>
            <option value="">Pilih properti</option>
            {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
          <Select label="Kategori" name="category" required>
            {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </Select>
          <Input label="Tanggal" name="date" type="date" defaultValue={now.toISOString().split("T")[0]} required />
          <Input label="Deskripsi" name="description" placeholder="Bayar tukang ledeng" required className="sm:col-span-2" />
          <Input label="Jumlah (Rp)" name="amount" type="number" required />
          <div className="flex items-end">
            <Button type="submit" className="w-full"><Receipt className="h-4 w-4" /> Simpan</Button>
          </div>
        </form>
      </Card>

      <Card>
        <DataTable
          columns={[
            { label: "Tanggal" },
            { label: "Properti" },
            { label: "Kategori" },
            { label: "Deskripsi" },
            { label: "Jumlah" },
          ]}
        >
          {expenses.map((e) => (
            <DataRow key={e.id}>
              <DataCell>{formatDate(e.date)}</DataCell>
              <DataCell>{e.property.name}</DataCell>
              <DataCell>
                <span className="rounded-full bg-[var(--paper)] px-2.5 py-0.5 text-xs font-bold">{categoryLabels[e.category]}</span>
              </DataCell>
              <DataCell>{e.description}</DataCell>
              <DataCell className="font-bold text-[var(--danger)]">{formatRupiah(e.amount)}</DataCell>
            </DataRow>
          ))}
        </DataTable>
      </Card>
    </div>
  );
}