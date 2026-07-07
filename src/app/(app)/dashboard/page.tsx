import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Calendar,
  DoorOpen,
  PiggyBank,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
  Wrench,
  Zap,
} from "lucide-react";
import { OccupancyDonut } from "@/components/charts/OccupancyDonut";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getDashboardStats, getOnboardingStatus, getSettings } from "@/lib/queries";
import { resolveAppUrl } from "@/lib/settings";
import {
  buildPaymentPageUrl,
  buildPaymentReminderMessage,
  buildTenantPortalUrl,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";
import { formatDate, formatMonthYear, formatRupiah } from "@/lib/utils";

export default async function DashboardPage() {
  const [stats, onboarding, settings] = await Promise.all([
    getDashboardStats(),
    getOnboardingStatus(),
    getSettings(),
  ]);

  if (!settings.onboardingCompleted && onboarding.percent < 40) {
    redirect("/mulai");
  }
  const appUrl = resolveAppUrl(settings);
  const targetPct = stats.revenueTarget > 0 ? Math.min(100, Math.round((stats.collected / stats.revenueTarget) * 100)) : 0;
  const collectionRate = stats.paymentsThisMonth.length > 0
    ? Math.round((stats.paymentsThisMonth.filter((p) => p.status === "lunas").length / stats.paymentsThisMonth.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--ink)] p-6 text-white lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-white/45">{formatMonthYear(stats.month, stats.year)}</p>
            <h2 className="mt-1 font-display text-2xl font-bold lg:text-3xl">
              Ringkasan operasional kos
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Hunian {stats.occupancyRate}% · Koleksi {collectionRate}% · {stats.activeTenants} penyewa aktif
            </p>
          </div>
          <div className="min-w-[240px] rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-medium text-white/60">
                <Target className="h-4 w-4 text-[var(--accent)]" /> Target pendapatan
              </span>
              <span className="font-bold text-[var(--accent)]">{targetPct}%</span>
            </div>
            <div className="progress-bar mt-3">
              <div style={{ width: `${targetPct}%` }} />
            </div>
            <p className="mt-2 text-xs text-white/40">
              {formatRupiah(stats.collected)} dari {formatRupiah(stats.revenueTarget)}
            </p>
          </div>
        </div>
      </div>

      {/* Financial strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="app-stat border-l-4 border-l-[var(--success)] p-5">
          <p className="text-sm font-medium text-[var(--muted)]">Terkumpul Bulan Ini</p>
          <p className="mt-1 text-2xl font-extrabold text-[var(--success)]">{formatRupiah(stats.collected)}</p>
        </div>
        <div className="app-stat border-l-4 border-l-[var(--warning)] p-5">
          <p className="text-sm font-medium text-[var(--muted)]">Tunggakan</p>
          <p className="mt-1 text-2xl font-extrabold text-[var(--warning)]">{formatRupiah(stats.pending)}</p>
        </div>
        <div className="app-stat border-l-4 border-l-[var(--accent)] p-5">
          <p className="text-sm font-medium text-[var(--muted)]">Tingkat Hunian</p>
          <p className="mt-1 text-2xl font-extrabold text-[var(--accent)]">{stats.occupancyRate}%</p>
          <p className="text-xs text-[var(--muted)]">{stats.occupiedRooms} dari {stats.roomCount} kamar</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Properti" value={stats.propertyCount} icon={Building2} accent="ink" />
        <StatCard label="Kamar Terisi" value={`${stats.occupiedRooms}/${stats.roomCount}`} icon={DoorOpen} accent="teal" sub={`${stats.emptyRooms} kosong · ${stats.maintenanceRooms} maintenance`} />
        <StatCard label="Penyewa Aktif" value={stats.activeTenants} icon={Users} accent="orange" />
        <StatCard label="Deposit Ditahan" value={formatRupiah(stats.totalDeposits)} icon={PiggyBank} accent="ink" />
        <StatCard label="Tiket Open" value={stats.openTickets} icon={Wrench} accent="warning" />
        <StatCard label="Utilitas Pending" value={stats.utilityPending} icon={Zap} accent="teal" sub="Tagihan belum lunas" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Pendapatan 6 Bulan Terakhir" description="Pembayaran sewa yang sudah lunas" />
          <CardBody><RevenueChart data={stats.monthlyRevenue} /></CardBody>
        </Card>
        <Card>
          <CardHeader title="Status Hunian" />
          <CardBody>
            <OccupancyDonut occupied={stats.occupiedRooms} empty={stats.emptyRooms} maintenance={stats.maintenanceRooms} />
          </CardBody>
        </Card>
      </div>

      {/* Alerts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {stats.expiringContracts.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/40">
            <CardHeader
              title={<span className="flex items-center gap-2"><Calendar className="h-5 w-5 text-[var(--warning)]" /> Kontrak Hampir Habis</span>}
              action={<Link href="/penyewa" className="text-sm font-semibold text-[var(--accent)]">Lihat →</Link>}
            />
            <div className="divide-y divide-amber-100">
              {stats.expiringContracts.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{t.name}</p>
                    <p className="text-xs text-[var(--muted)]">{t.roomLabel}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-[var(--warning)]">
                    {t.daysLeft} hari
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {stats.waitlistCount > 0 && (
          <Card className="border-[var(--teal)]/20 bg-[var(--teal-soft)]/30">
            <CardHeader
              title={<span className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-[var(--teal)]" /> Daftar Tunggu</span>}
              action={<Link href="/daftar-tunggu" className="text-sm font-semibold text-[var(--teal)]">{stats.waitlistCount} calon →</Link>}
            />
            <CardBody>
              <p className="text-sm text-[var(--muted)]">
                Ada {stats.waitlistCount} calon penyewa menunggu kamar kosong. Hubungi mereka untuk isi hunian lebih cepat.
              </p>
              <Link href="/daftar-tunggu" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[var(--teal)] hover:underline">
                Kelola daftar tunggu <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardBody>
          </Card>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Tagihan Bulan Ini"
            action={<Link href="/pembayaran" className="text-sm font-semibold text-[var(--accent)]">Lihat semua →</Link>}
          />
          <div className="divide-y divide-[var(--border)]">
            {stats.paymentsThisMonth.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-[var(--muted)]">Belum ada tagihan bulan ini</p>
            ) : (
              stats.paymentsThisMonth.slice(0, 5).map((payment) => {
                const waUrl = buildWhatsAppUrl(payment.tenant.phone, buildPaymentReminderMessage({
                  tenantName: payment.tenant.name,
                  propertyName: payment.room.property.name,
                  roomNumber: payment.room.number,
                  amount: payment.amount + payment.lateFee,
                  periodMonth: payment.periodMonth,
                  periodYear: payment.periodYear,
                  dueDate: payment.dueDate,
                  ownerName: payment.room.property.ownerName,
                  portalUrl: buildTenantPortalUrl(appUrl, payment.tenant.portalToken),
                  paymentUrl: buildPaymentPageUrl(appUrl, payment.id),
                  variant: "reminder",
                }));
                return (
                  <div key={payment.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div>
                      <p className="font-semibold text-[var(--ink)]">{payment.tenant.name}</p>
                      <p className="text-sm text-[var(--muted)]">{payment.room.property.name} · Kamar {payment.room.number}</p>
                      <p className="mt-1 font-bold text-[var(--ink)]">{formatRupiah(payment.amount)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={payment.status} type="payment" />
                      {payment.status !== "lunas" && <WhatsAppButton href={waUrl} />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Aktivitas Terbaru"
            action={<Link href="/notifikasi" className="text-sm font-semibold text-[var(--accent)]">Semua →</Link>}
          />
          <div className="divide-y divide-[var(--border)]">
            {stats.recentActivities.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-[var(--muted)]">Belum ada aktivitas</p>
            ) : (
              stats.recentActivities.map((act) => (
                <div key={act.id} className="flex gap-3 px-5 py-3.5">
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                  <div>
                    <p className="text-sm text-[var(--ink)]">{act.message}</p>
                    <p className="text-xs text-[var(--muted)]">{formatDate(act.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {stats.overduePayments.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/40">
          <CardHeader
            title={<span className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-[var(--warning)]" /> Perlu Perhatian</span>}
            action={<Link href="/pembayaran" className="text-sm font-semibold text-[var(--accent)]">Kelola tagihan →</Link>}
          />
          <div className="grid gap-3 px-5 pb-5 sm:grid-cols-2">
            {stats.overduePayments.slice(0, 4).map((p) => (
              <div key={p.id} className="rounded-xl border border-amber-100 bg-white p-4">
                <p className="font-semibold text-[var(--ink)]">{p.tenant.name}</p>
                <p className="text-sm text-[var(--muted)]">{formatRupiah(p.amount + p.lateFee)} · Jatuh tempo {formatDate(p.dueDate)}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/pembayaran", label: "Generate Tagihan", icon: Wallet, color: "text-[var(--accent)]" },
          { href: "/penyewa", label: "Tambah Penyewa", icon: Users, color: "text-[var(--teal)]" },
          { href: "/daftar-tunggu", label: "Daftar Tunggu", icon: UserPlus, color: "text-[var(--teal)]" },
          { href: "/laporan", label: "Export Laporan", icon: TrendingUp, color: "text-[var(--ink)]" },
        ].map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-white p-4 text-sm font-semibold text-[var(--ink)] transition-all hover:border-[var(--accent)]/40 hover:shadow-md"
          >
            <a.icon className={`h-5 w-5 ${a.color}`} /> {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}