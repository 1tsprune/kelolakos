import { getTenants } from "@/lib/queries";
import { formatDate, formatRupiah } from "@/lib/utils";
import { Card, PageTitle } from "@/components/ui/Card";
import { PrintDocButton } from "./PrintDocButton";

export default async function DokumenPage() {
  const tenants = await getTenants();
  const active = tenants.filter((t) => t.isActive);

  return (
    <div className="space-y-6">
      <PageTitle title="Dokumen" description="Generator kontrak sewa & surat peringatan" />

      <div className="grid gap-6 lg:grid-cols-2">
        {active.map((tenant) => {
          const contract = `PERJANJIAN SEWA KAMAR

Yang bertanda tangan di bawah ini:

PEMILIK: ${tenant.room.property.ownerName}
Alamat Kos: ${tenant.room.property.address}, ${tenant.room.property.city}

PENYEWA: ${tenant.name}
No. HP: ${tenant.phone}
${tenant.ktp ? `No. KTP: ${tenant.ktp}` : ""}

Dengan ini disepakati:
1. Penyewa menyewa Kamar ${tenant.room.number} di ${tenant.room.property.name}
2. Harga sewa: ${formatRupiah(tenant.room.monthlyRent)} per bulan
3. Deposit: ${formatRupiah(tenant.depositAmount)}
4. Tanggal mulai: ${formatDate(tenant.checkIn)}
5. Listrik: ${tenant.room.electricityType}

Peraturan:
- Dilarang membawa hewan peliharaan tanpa izin
- Tamu menginap maksimal 3 malam
- Keterlambatan bayar dikenakan denda sesuai kebijakan kos

${tenant.room.property.city}, ${formatDate(new Date().toISOString())}


PEMILIK                          PENYEWA
${tenant.room.property.ownerName}              ${tenant.name}`;

          const warning = `SURAT PERINGATAN PEMBAYARAN

Kepada Yth.
${tenant.name}
Kamar ${tenant.room.number} — ${tenant.room.property.name}

Dengan hormat,

Berdasarkan catatan kami, pembayaran sewa Anda untuk periode berjalan BELUM kami terima hingga tanggal surat ini dibuat.

Mohon segera melakukan pembayaran sebesar ${formatRupiah(tenant.room.monthlyRent)} dalam waktu 3 (tiga) hari kerja.

Apabila dalam jangka waktu tersebut pembayaran belum kami terima, kami berhak mengambil tindakan sesuai perjanjian sewa.

Atas perhatiannya, kami ucapkan terima kasih.

${tenant.room.property.city}, ${formatDate(new Date().toISOString())}


${tenant.room.property.ownerName}
Pemilik ${tenant.room.property.name}`;

          return (
            <Card key={tenant.id} className="p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[var(--ink)]">{tenant.name}</h3>
                  <p className="text-sm text-[var(--muted)]">{tenant.room.property.name} · Kamar {tenant.room.number}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl bg-[var(--paper)] p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">Kontrak Sewa</p>
                  <pre className="max-h-32 overflow-hidden text-[11px] leading-relaxed text-[var(--muted)] whitespace-pre-wrap">{contract.slice(0, 300)}...</pre>
                  <PrintDocButton content={contract} filename={`kontrak-${tenant.name}`} label="Cetak Kontrak" />
                </div>
                <div className="rounded-xl bg-red-50 p-4 ring-1 ring-red-100">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-red-600">Surat Peringatan</p>
                  <pre className="max-h-24 overflow-hidden text-[11px] leading-relaxed text-red-800/70 whitespace-pre-wrap">{warning.slice(0, 200)}...</pre>
                  <PrintDocButton content={warning} filename={`peringatan-${tenant.name}`} label="Cetak Peringatan" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {active.length === 0 && (
        <Card className="p-12 text-center text-[var(--muted)]">Belum ada penyewa aktif untuk generate dokumen</Card>
      )}
    </div>
  );
}