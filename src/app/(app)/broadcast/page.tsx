import { sendCustomBroadcast } from "@/lib/actions";
import { getTenants, getWhatsAppLogs } from "@/lib/queries";
import { statusColor } from "@/lib/utils";
import { Card, PageTitle } from "@/components/ui/Card";
import { BroadcastForm } from "@/components/broadcast/BroadcastForm";

export default async function BroadcastPage() {
  const [tenants, logs] = await Promise.all([getTenants(), getWhatsAppLogs()]);
  const active = tenants.filter((t) => t.isActive);

  async function broadcastAction(formData: FormData) {
    "use server";
    await sendCustomBroadcast(formData);
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title="Broadcast WhatsApp"
        description={`Kirim pesan ke ${active.length} penyewa aktif sekaligus`}
      />

      <Card className="p-6">
        <BroadcastForm tenantCount={active.length} action={broadcastAction} />
      </Card>

      <Card>
        <div className="border-b border-[var(--border)] px-5 py-4 font-bold text-[var(--ink)]">Log Pengiriman</div>
        <div className="divide-y divide-[var(--border)]">
          {logs.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-[var(--muted)]">Belum ada log</p>
          ) : logs.slice(0, 15).map((log) => (
            <div key={log.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
              <div className="min-w-0">
                <p className="font-semibold text-[var(--ink)]">{log.phone}</p>
                <p className="line-clamp-1 text-xs text-[var(--muted)]">{log.message}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColor(log.status === "sent" ? "lunas" : log.status === "simulated" ? "sedang" : "belum")}`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}