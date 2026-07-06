import Link from "next/link";
import { getNotifications, getActivities } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { Card, PageTitle } from "@/components/ui/Card";
import { Bell, History } from "lucide-react";

const priorityStyle = {
  high: "border-l-[var(--danger)] bg-red-50/40",
  medium: "border-l-[var(--warning)] bg-amber-50/40",
  low: "border-l-[var(--border)]",
};

export default async function NotifikasiPage() {
  const [notifications, activities] = await Promise.all([getNotifications(), getActivities()]);

  return (
    <div className="space-y-6">
      <PageTitle title="Notifikasi & Aktivitas" description={`${notifications.length} notifikasi aktif`} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-bold text-[var(--ink)]">
            <Bell className="h-5 w-5 text-[var(--accent)]" /> Notifikasi
          </h3>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <Card className="p-8 text-center text-[var(--muted)]">Semua beres, tidak ada notifikasi</Card>
            ) : notifications.map((n) => (
              <Link key={n.id} href={n.href}>
                <Card className={`border-l-4 p-4 transition-shadow hover:shadow-md ${priorityStyle[n.priority]}`}>
                  <p className="font-semibold text-[var(--ink)]">{n.title}</p>
                  <p className="text-sm text-[var(--muted)]">{n.message}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{formatDate(n.createdAt)}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 flex items-center gap-2 font-bold text-[var(--ink)]">
            <History className="h-5 w-5 text-[var(--muted)]" /> Riwayat Aktivitas
          </h3>
          <Card>
            <div className="divide-y divide-[var(--border)]">
              {activities.slice(0, 20).map((act) => (
                <div key={act.id} className="flex gap-3 px-5 py-3.5">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                  <div>
                    <p className="text-sm text-[var(--ink)]">{act.message}</p>
                    <p className="text-xs text-[var(--muted)]">{formatDate(act.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}