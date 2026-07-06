import Link from "next/link";
import { createInventoryItem } from "@/lib/actions";
import { getInventoryItems, getRooms } from "@/lib/queries";
import { formatRupiah, statusColor } from "@/lib/utils";
import { Card, PageTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Package } from "lucide-react";

const condLabels: Record<string, string> = {
  baik: "Baik", rusak_ringan: "Rusak Ringan", rusak_berat: "Rusak Berat", hilang: "Hilang",
};

export default async function InventarisPage() {
  const [items, rooms] = await Promise.all([getInventoryItems(), getRooms()]);
  const totalValue = items.reduce((s, i) => s + i.value * i.quantity, 0);
  const damaged = items.filter((i) => i.condition !== "baik").length;

  return (
    <div className="space-y-6">
      <PageTitle
        title="Inventaris Kamar"
        description={`${items.length} item · Nilai ${formatRupiah(totalValue)}${damaged > 0 ? ` · ${damaged} perlu perhatian` : ""}`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="app-stat p-5">
          <p className="text-sm text-[var(--muted)]">Total Item</p>
          <p className="text-2xl font-extrabold">{items.length}</p>
        </div>
        <div className="app-stat p-5">
          <p className="text-sm text-[var(--muted)]">Nilai Aset</p>
          <p className="text-2xl font-extrabold text-[var(--teal)]">{formatRupiah(totalValue)}</p>
        </div>
        <div className="app-stat p-5">
          <p className="text-sm text-[var(--muted)]">Rusak/Hilang</p>
          <p className="text-2xl font-extrabold text-[var(--warning)]">{damaged}</p>
        </div>
      </div>

      <Card className="p-6">
        <form action={createInventoryItem} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select label="Kamar" name="roomId" required>
            <option value="">Pilih kamar</option>
            {rooms.map((r) => <option key={r.id} value={r.id}>{r.property.name} — {r.number}</option>)}
          </Select>
          <Input label="Nama Barang" name="name" placeholder="AC, Kasur, Lemari..." required />
          <Select label="Kondisi" name="condition">
            {Object.entries(condLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </Select>
          <Input label="Jumlah" name="quantity" type="number" defaultValue={1} min={1} />
          <Input label="Nilai per unit (Rp)" name="value" type="number" placeholder="500000" />
          <Input label="Catatan" name="notes" placeholder="Opsional" />
          <div className="flex items-end sm:col-span-2 lg:col-span-3">
            <Button type="submit">Tambah Inventaris</Button>
          </div>
        </form>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} hover className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--paper)]">
                  <Package className="h-5 w-5 text-[var(--muted)]" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--ink)]">{item.name}</h3>
                  <Link href={`/kamar/${item.roomId}`} className="text-sm text-[var(--accent)] hover:underline">
                    {item.property.name} · Kamar {item.room.number}
                  </Link>
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColor(item.condition === "baik" ? "lunas" : item.condition === "hilang" ? "belum" : "sedang")}`}>
                {condLabels[item.condition]}
              </span>
            </div>
            <div className="mt-4 flex justify-between border-t border-[var(--border)] pt-3 text-sm">
              <span className="text-[var(--muted)]">Qty: {item.quantity}</span>
              <span className="font-bold">{formatRupiah(item.value * item.quantity)}</span>
            </div>
            {item.notes && <p className="mt-2 text-xs text-[var(--muted)]">{item.notes}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}