import Link from "next/link";
import { getRooms } from "@/lib/queries";
import { formatRupiah, roomStatusLabel } from "@/lib/utils";
import { Card, PageTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { DoorOpen } from "lucide-react";

const statusIcon: Record<string, string> = {
  terisi: "bg-[var(--teal-soft)] text-[var(--teal)]",
  kosong: "bg-[var(--paper-dark)] text-[var(--muted)]",
  maintenance: "bg-amber-50 text-[var(--warning)]",
};

export default async function KamarPage() {
  const rooms = await getRooms();
  const stats = {
    total: rooms.length,
    terisi: rooms.filter((r) => r.status === "terisi").length,
    kosong: rooms.filter((r) => r.status === "kosong").length,
  };

  return (
    <div className="space-y-6">
      <PageTitle
        title="Semua Kamar"
        description={`${stats.terisi} terisi · ${stats.kosong} kosong · ${stats.total} total`}
      />

      {rooms.length === 0 ? (
        <Card>
          <EmptyState
            icon={DoorOpen}
            title="Belum ada kamar"
            description="Tambah kamar lewat halaman Properti terlebih dahulu."
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Link key={room.id} href={`/kamar/${room.id}`}>
              <Card hover className="h-full overflow-hidden">
                {room.photoUrl ? (
                  <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${room.photoUrl})` }} />
                ) : (
                  <div className="flex h-20 items-center justify-center bg-[var(--ink)]">
                    <span className="font-display text-3xl font-bold text-white/20">{room.number}</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${statusIcon[room.status]}`}>
                        <DoorOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-[var(--ink)]">Kamar {room.number}</p>
                        <p className="text-sm text-[var(--muted)]">{room.property.name}</p>
                      </div>
                    </div>
                    <StatusBadge status={room.status} />
                  </div>
                  <div className="mt-4 space-y-1.5 border-t border-[var(--border)] pt-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Harga</span>
                      <span className="font-bold">{formatRupiah(room.monthlyRent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Penyewa</span>
                      <span className="font-medium">{room.tenants[0]?.name ?? "—"}</span>
                    </div>
                  </div>
                  {room.facilities.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {room.facilities.slice(0, 3).map((f) => (
                        <span key={f} className="rounded-md bg-[var(--paper)] px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)]">{f}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}