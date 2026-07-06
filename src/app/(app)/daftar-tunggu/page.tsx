import { createWaitlistEntry, updateWaitlistStatus } from "@/lib/actions";
import { getProperties, getWaitlistEntries } from "@/lib/queries";
import { formatDate, formatRupiah } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Card, PageTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { UserPlus, Phone } from "lucide-react";

import { statusColor } from "@/lib/utils";

export default async function DaftarTungguPage() {
  const [entries, properties] = await Promise.all([getWaitlistEntries(), getProperties()]);
  const active = entries.filter((e) => e.status === "menunggu" || e.status === "dihubungi");

  return (
    <div className="space-y-6">
      <PageTitle
        title="Daftar Tunggu"
        description={`${active.length} calon penyewa menunggu kamar kosong`}
      />

      <Card className="p-6">
        <h3 className="mb-4 flex items-center gap-2 font-bold text-[var(--ink)]">
          <UserPlus className="h-5 w-5 text-[var(--teal)]" /> Tambah Calon Penyewa
        </h3>
        <form action={createWaitlistEntry} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select label="Properti" name="propertyId" required>
            <option value="">Pilih properti</option>
            {properties.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.city}</option>)}
          </Select>
          <Input label="Nama" name="name" required />
          <Input label="WhatsApp" name="phone" required />
          <Input label="Budget (Rp/bulan)" name="budget" type="number" placeholder="850000" />
          <Input label="Kamar Diinginkan" name="preferredRoom" placeholder="A1, lantai 2, dll" />
          <Input label="Rencana Masuk" name="moveInDate" type="date" />
          <div className="sm:col-span-2">
            <Textarea label="Catatan" name="notes" placeholder="Preferensi AC, dekat kampus, dll" />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full">Simpan ke Daftar Tunggu</Button>
          </div>
        </form>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {entries.length === 0 ? (
          <Card className="col-span-full p-10 text-center">
            <p className="text-[var(--muted)]">Belum ada calon di daftar tunggu. Tambahkan saat ada yang tanya kamar kosong.</p>
          </Card>
        ) : (
          entries.map((entry) => {
            const waUrl = buildWhatsAppUrl(entry.phone, `Halo ${entry.name}, ada kamar kosong di ${entry.property.name}. Apakah masih berminat?`);
            return (
              <Card key={entry.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-[var(--ink)]">{entry.name}</p>
                    <p className="text-sm text-[var(--muted)]">{entry.property.name} · {entry.property.city}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${statusColor(entry.status)}`}>
                    {entry.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-[var(--muted)]">WhatsApp</span>
                    <p className="font-medium">{entry.phone}</p>
                  </div>
                  {entry.budget && (
                    <div>
                      <span className="text-[var(--muted)]">Budget</span>
                      <p className="font-medium">{formatRupiah(entry.budget)}</p>
                    </div>
                  )}
                  {entry.preferredRoom && (
                    <div>
                      <span className="text-[var(--muted)]">Kamar</span>
                      <p className="font-medium">{entry.preferredRoom}</p>
                    </div>
                  )}
                  {entry.moveInDate && (
                    <div>
                      <span className="text-[var(--muted)]">Rencana Masuk</span>
                      <p className="font-medium">{formatDate(entry.moveInDate)}</p>
                    </div>
                  )}
                </div>

                {entry.notes && <p className="mt-3 text-sm text-[var(--muted)]">{entry.notes}</p>}

                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="whatsapp" size="sm"><Phone className="h-3.5 w-3.5" /> Hubungi</Button>
                  </a>
                  {entry.status === "menunggu" && (
                    <form action={updateWaitlistStatus.bind(null, entry.id, "dihubungi")}>
                      <Button type="submit" variant="secondary" size="sm">Tandai Dihubungi</Button>
                    </form>
                  )}
                  {(entry.status === "menunggu" || entry.status === "dihubungi") && (
                    <>
                      <form action={updateWaitlistStatus.bind(null, entry.id, "dikonversi")}>
                        <Button type="submit" variant="primary" size="sm">Jadi Penyewa</Button>
                      </form>
                      <form action={updateWaitlistStatus.bind(null, entry.id, "batal")}>
                        <Button type="submit" variant="ghost" size="sm">Batal</Button>
                      </form>
                    </>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}