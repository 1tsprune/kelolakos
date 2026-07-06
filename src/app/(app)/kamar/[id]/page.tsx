import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { updateRoom, updateRoomStatus } from "@/lib/actions";
import { getInventoryItems, getRoom } from "@/lib/queries";
import { formatRupiah } from "@/lib/utils";
import { Card, PageTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { StatusBadge } from "@/components/StatusBadge";
import { FileUpload } from "@/components/ui/FileUpload";

export default async function KamarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = await getRoom(id);
  if (!room) notFound();

  const inventory = (await getInventoryItems()).filter((i) => i.roomId === id);
  const tenant = room.tenants[0];

  return (
    <div className="space-y-6">
      <Link href="/kamar" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]">
        <ArrowLeft className="h-4 w-4" /> Semua Kamar
      </Link>

      <PageTitle
        title={`Kamar ${room.number}`}
        description={`${room.property.name} · Lantai ${room.floor}`}
        action={<StatusBadge status={room.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 font-bold text-[var(--ink)]">Detail Kamar</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-[var(--muted)]">Harga/bulan</span><span className="font-bold">{formatRupiah(room.monthlyRent)}</span></div>
            <div className="flex justify-between"><span className="text-[var(--muted)]">Listrik</span><span className="capitalize">{room.electricityType}</span></div>
            <div className="flex justify-between"><span className="text-[var(--muted)]">Penyewa</span>
              {tenant ? <Link href={`/penyewa/${tenant.id}`} className="font-semibold text-[var(--accent)]">{tenant.name}</Link> : <span>—</span>}
            </div>
            {room.facilities.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {room.facilities.map((f) => (
                  <span key={f} className="rounded-lg bg-[var(--paper)] px-2.5 py-1 text-xs font-semibold">{f}</span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {(["kosong", "terisi", "maintenance"] as const).map((s) => (
              <form key={s} action={updateRoomStatus.bind(null, room.id, s)}>
                <Button type="submit" variant={room.status === s ? "primary" : "secondary"} size="sm">
                  {s === "kosong" ? "Kosong" : s === "terisi" ? "Terisi" : "Maintenance"}
                </Button>
              </form>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-bold text-[var(--ink)]">Edit Kamar</h3>
          <form action={updateRoom} className="space-y-4">
            <input type="hidden" name="id" value={room.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Nomor" name="number" defaultValue={room.number} required />
              <Input label="Lantai" name="floor" type="number" defaultValue={room.floor} />
              <Input label="Harga/bulan" name="monthlyRent" type="number" defaultValue={room.monthlyRent} />
              <Select label="Listrik" name="electricityType" defaultValue={room.electricityType}>
                <option value="termasuk">Termasuk</option>
                <option value="meteran">Meteran</option>
              </Select>
            </div>
            <Input label="Fasilitas" name="facilities" defaultValue={room.facilities.join(", ")} />
            <Textarea label="Catatan" name="notes" defaultValue={room.notes ?? ""} />
            <FileUpload label="Foto Kamar" name="photoUrl" defaultValue={room.photoUrl ?? ""} />
            <Button type="submit">Simpan Perubahan</Button>
          </form>
        </Card>
      </div>

      {inventory.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 font-bold text-[var(--ink)]">Inventaris ({inventory.length})</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {inventory.map((item) => (
              <div key={item.id} className="rounded-xl border border-[var(--border)] p-4">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-[var(--muted)]">{item.condition} · {formatRupiah(item.value)}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}