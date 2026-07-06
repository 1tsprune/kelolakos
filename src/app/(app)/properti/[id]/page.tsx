import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createRoom, updateProperty } from "@/lib/actions";
import { getProperty } from "@/lib/queries";
import { formatRupiah } from "@/lib/utils";
import { Card, PageTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { DataCell, DataRow, DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/StatusBadge";

export default async function PropertiDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) notFound();

  const occupied = property.rooms.filter((r) => r.status === "terisi").length;
  const occupancy = property.rooms.length > 0 ? Math.round((occupied / property.rooms.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <Link href="/properti" className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]">
        <ArrowLeft className="h-4 w-4" /> Semua Properti
      </Link>

      <PageTitle
        title={property.name}
        description={`${property.address}, ${property.city} · Hunian ${occupancy}%`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 font-bold text-[var(--ink)]">Edit Properti</h3>
          <form action={updateProperty} className="space-y-4">
            <input type="hidden" name="id" value={property.id} />
            <Input label="Nama" name="name" defaultValue={property.name} required />
            <Input label="Alamat" name="address" defaultValue={property.address} required />
            <Input label="Kota" name="city" defaultValue={property.city} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Nama Pemilik" name="ownerName" defaultValue={property.ownerName} />
              <Input label="Telepon Pemilik" name="ownerPhone" defaultValue={property.ownerPhone} />
            </div>
            <Textarea label="Catatan" name="notes" defaultValue={property.notes ?? ""} />
            <Button type="submit">Simpan Perubahan</Button>
          </form>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-bold text-[var(--ink)]">Tambah Kamar</h3>
          <form action={createRoom} className="space-y-4">
            <input type="hidden" name="propertyId" value={property.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Nomor Kamar" name="number" placeholder="A1" required />
              <Input label="Lantai" name="floor" type="number" defaultValue={1} required />
              <Input label="Harga/bulan" name="monthlyRent" type="number" placeholder="850000" required />
              <Select label="Listrik" name="electricityType">
                <option value="termasuk">Termasuk</option>
                <option value="meteran">Meteran</option>
              </Select>
            </div>
            <Input label="Fasilitas (pisah koma)" name="facilities" placeholder="AC, WiFi, Kamar Mandi Dalam" />
            <Button type="submit" className="w-full">Simpan Kamar</Button>
          </form>
        </Card>
      </div>

      <Card>
        <DataTable
          columns={[
            { label: "Kamar" },
            { label: "Lantai" },
            { label: "Harga" },
            { label: "Status" },
            { label: "Penyewa" },
          ]}
        >
          {property.rooms.map((room) => (
            <DataRow key={room.id}>
              <DataCell>
                <Link href={`/kamar/${room.id}`} className="font-bold text-[var(--accent)] hover:underline">
                  {room.number}
                </Link>
              </DataCell>
              <DataCell>{room.floor}</DataCell>
              <DataCell className="font-semibold">{formatRupiah(room.monthlyRent)}</DataCell>
              <DataCell><StatusBadge status={room.status} /></DataCell>
              <DataCell className="text-[var(--muted)]">{room.tenants[0]?.name ?? "Kosong"}</DataCell>
            </DataRow>
          ))}
        </DataTable>
      </Card>
    </div>
  );
}