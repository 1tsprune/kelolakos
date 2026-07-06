import { createMaintenanceTicket, updateMaintenanceStatus } from "@/lib/actions";
import { getMaintenanceTickets, getProperties, getRooms } from "@/lib/queries";
import { formatDate, formatRupiah, statusColor } from "@/lib/utils";
import { Card, PageTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Wrench } from "lucide-react";

const statusLabels = { open: "Terbuka", progress: "Dikerjakan", done: "Selesai" };

export default async function MaintenancePage() {
  const [tickets, properties, rooms] = await Promise.all([
    getMaintenanceTickets(), getProperties(), getRooms(),
  ]);
  const openCount = tickets.filter((t) => t.status !== "done").length;

  return (
    <div className="space-y-6">
      <PageTitle title="Tiket Perbaikan" description={`${openCount} tiket terbuka`} />

      <Card className="p-6">
        <h3 className="mb-4 font-bold text-[var(--ink)]">Buat Tiket Baru</h3>
        <form action={createMaintenanceTicket} className="grid gap-4 sm:grid-cols-2">
          <Select label="Properti" name="propertyId" required>
            <option value="">Pilih properti</option>
            {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
          <Select label="Kamar (opsional)" name="roomId">
            <option value="">— Umum —</option>
            {rooms.map((r) => <option key={r.id} value={r.id}>{r.property.name} — {r.number}</option>)}
          </Select>
          <Input label="Judul" name="title" placeholder="Keran bocor" required className="sm:col-span-2" />
          <Textarea label="Deskripsi" name="description" placeholder="Detail masalah..." className="sm:col-span-2" />
          <Select label="Prioritas" name="priority">
            <option value="rendah">Rendah</option>
            <option value="sedang">Sedang</option>
            <option value="tinggi">Tinggi</option>
          </Select>
          <Input label="Dilaporkan oleh" name="reportedBy" defaultValue="Pemilik" />
          <div className="sm:col-span-2">
            <Button type="submit"><Wrench className="h-4 w-4" /> Buat Tiket</Button>
          </div>
        </form>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tickets.map((ticket) => (
          <Card key={ticket.id} hover className="p-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-[var(--ink)]">{ticket.title}</h3>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold capitalize ${statusColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{ticket.description || "—"}</p>
            <p className="mt-2 text-xs text-[var(--muted)]">
              {ticket.property.name}{ticket.room ? ` · Kamar ${ticket.room.number}` : ""}
            </p>
            {ticket.cost && <p className="mt-1 text-sm font-semibold">Biaya: {formatRupiah(ticket.cost)}</p>}
            <div className="mt-4 flex items-center justify-between">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusColor(ticket.status)}`}>
                {statusLabels[ticket.status]}
              </span>
              <span className="text-xs text-[var(--muted)]">{formatDate(ticket.createdAt)}</span>
            </div>
            {ticket.status !== "done" && (
              <div className="mt-3 flex gap-2">
                {ticket.status === "open" && (
                  <form action={updateMaintenanceStatus.bind(null, ticket.id, "progress")} className="flex-1">
                    <Button type="submit" variant="secondary" size="sm" className="w-full">Kerjakan</Button>
                  </form>
                )}
                <form action={updateMaintenanceStatus.bind(null, ticket.id, "done")} className="flex-1">
                  <Button type="submit" size="sm" className="w-full">Selesai</Button>
                </form>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}