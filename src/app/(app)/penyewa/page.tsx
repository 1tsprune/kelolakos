import Link from "next/link";
import { createTenant } from "@/lib/actions";
import { getRooms, getTenants } from "@/lib/queries";
import { formatDate, formatRupiah, daysUntil } from "@/lib/utils";
import { Card, PageTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { FileUpload } from "@/components/ui/FileUpload";
import { Users } from "lucide-react";

export default async function PenyewaPage() {
  const [tenants, rooms] = await Promise.all([getTenants(), getRooms()]);
  const emptyRooms = rooms.filter((r) => r.status === "kosong");
  const active = tenants.filter((t) => t.isActive);

  return (
    <div className="space-y-6">
      <PageTitle title="Penyewa" description={`${active.length} penyewa aktif`} />

      <Card className="p-6">
        <h3 className="mb-4 font-bold text-[var(--ink)]">Tambah Penyewa Baru</h3>
        <form action={createTenant} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select label="Kamar" name="roomId" required>
            <option value="">Pilih kamar kosong</option>
            {emptyRooms.map((r) => <option key={r.id} value={r.id}>{r.property.name} — {r.number}</option>)}
          </Select>
          <Input label="Nama" name="name" required />
          <Input label="WhatsApp" name="phone" required />
          <Input label="KTP" name="ktp" />
          <Input label="Tanggal Masuk" name="checkIn" type="date" required />
          <Input label="Kontrak Berakhir" name="contractEndDate" type="date" />
          <Input label="Deposit (Rp)" name="depositAmount" type="number" defaultValue={500000} />
          <Input label="Kontak Darurat" name="emergencyContact" />
          <FileUpload label="Foto KTP" name="ktpPhotoUrl" />
          <div className="flex items-end lg:col-span-3">
            <Button type="submit" className="w-full sm:w-auto">Simpan Penyewa</Button>
          </div>
        </form>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {tenants.map((tenant) => {
          const days = tenant.contractEndDate ? daysUntil(tenant.contractEndDate) : null;
          return (
            <Link key={tenant.id} href={`/penyewa/${tenant.id}`}>
              <Card hover className={`p-5 ${!tenant.isActive ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--ink)] text-sm font-bold text-[var(--accent)]">
                      {tenant.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-[var(--ink)]">{tenant.name}</p>
                      <p className="text-sm text-[var(--muted)]">{tenant.phone}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${tenant.isActive ? "bg-[var(--teal-soft)] text-[var(--teal)]" : "bg-[var(--paper-dark)] text-[var(--muted)]"}`}>
                    {tenant.isActive ? "Aktif" : "Keluar"}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-[var(--muted)]">Kamar</span><p className="font-semibold">{tenant.room.property.name} · {tenant.room.number}</p></div>
                  <div><span className="text-[var(--muted)]">Masuk</span><p className="font-semibold">{formatDate(tenant.checkIn)}</p></div>
                  <div><span className="text-[var(--muted)]">Deposit</span><p className="font-semibold">{formatRupiah(tenant.depositAmount)}</p></div>
                  {days !== null && days <= 30 && days > 0 && (
                    <div><span className="text-[var(--muted)]">Kontrak</span><p className="font-semibold text-[var(--warning)]">{days} hari lagi</p></div>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}