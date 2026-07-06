import Link from "next/link";
import { DoorOpen, MapPin, TrendingUp } from "lucide-react";
import { AddPropertyForm } from "@/components/forms/AddPropertyForm";
import { Card, PageTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { getProperties } from "@/lib/queries";
import { Building2 } from "lucide-react";

export default async function PropertiPage() {
  const properties = await getProperties();

  return (
    <div className="space-y-6">
      <PageTitle
        title="Properti"
        description={`${properties.length} kos & kontrakan terdaftar`}
        action={<AddPropertyForm />}
      />

      {properties.length === 0 ? (
        <Card>
          <EmptyState
            icon={Building2}
            title="Belum ada properti"
            description="Tambah kos atau kontrakan pertama kamu untuk mulai mengelola kamar dan penyewa."
            action={<AddPropertyForm />}
          />
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {properties.map((property) => {
            const occupied = property.rooms.filter((r) => r.status === "terisi").length;
            const revenue = property.rooms.filter((r) => r.status === "terisi").reduce((s, r) => s + r.monthlyRent, 0);
            const occupancy = property.rooms.length > 0 ? Math.round((occupied / property.rooms.length) * 100) : 0;

            return (
              <Link key={property.id} href={`/properti/${property.id}`}>
                <Card hover className="overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-[var(--accent)] to-orange-300" />
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-[var(--ink)]">{property.name}</h3>
                        <p className="mt-1 flex items-center gap-1 text-sm text-[var(--muted)]">
                          <MapPin className="h-3.5 w-3.5" /> {property.address}, {property.city}
                        </p>
                      </div>
                      <span className="rounded-full bg-[var(--paper)] px-3 py-1 text-xs font-bold text-[var(--muted)]">
                        {property._count.rooms} kamar
                      </span>
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl bg-[var(--paper)] p-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Hunian</p>
                        <p className="text-lg font-extrabold text-[var(--ink)]">{occupancy}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Terisi</p>
                        <p className="flex items-center gap-1 text-lg font-extrabold text-[var(--teal)]">
                          <DoorOpen className="h-4 w-4" /> {occupied}/{property.rooms.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Potensi</p>
                        <p className="flex items-center gap-1 text-lg font-extrabold text-[var(--accent)]">
                          <TrendingUp className="h-4 w-4" /> {(revenue / 1000000).toFixed(1)}jt
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {property.rooms.slice(0, 6).map((room) => (
                        <span key={room.id} className="inline-flex items-center gap-1.5 text-xs">
                          <span className="font-semibold text-[var(--ink)]">{room.number}</span>
                          <StatusBadge status={room.status} />
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}