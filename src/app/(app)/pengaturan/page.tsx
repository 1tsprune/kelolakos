import { updateSettings } from "@/lib/actions";
import { getSettings } from "@/lib/queries";
import {
  getSubscriptionLabel,
  getTrialDaysLeft,
  isEarlyAdopterExpired,
  xenditConfigured,
  xenditModeLabel,
  resolveAppUrl,
  whatsappConfigured,
} from "@/lib/settings";
import { CopyButton } from "@/components/CopyButton";
import { IntegrationTestButton } from "@/components/IntegrationTestButton";
import { UpgradePlans } from "@/components/UpgradePlans";
import { billingConfigured } from "@/lib/subscription-billing";
import { getPlanLimits, isSubscriptionLocked } from "@/lib/subscription";
import { Card, PageTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Globe,
  MessageCircle,
  Settings,
  Target,
  Users,
} from "lucide-react";

export default async function PengaturanPage({
  searchParams,
}: {
  searchParams: Promise<{ locked?: string }>;
}) {
  const { locked } = await searchParams;
  const settings = await getSettings();
  const appUrl = resolveAppUrl(settings);
  const webhookUrl = `${appUrl}/api/xendit/webhook`;
  const hasXendit = xenditConfigured(settings);
  const hasWhatsapp = whatsappConfigured(settings);
  const limits = getPlanLimits(settings.subscriptionPlan);
  const lockedOut = isSubscriptionLocked(settings);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageTitle
        title="Pengaturan"
        description="Semua konfigurasi bisnis & integrasi — tanpa perlu edit file env"
      />

      {(locked === "1" || lockedOut) && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div>
            <p className="font-bold text-red-900">Akses terbatas — langganan perlu diperpanjang</p>
            <p className="mt-1 text-sm text-red-800">
              Trial habis atau paket kedaluwarsa. Pilih paket di bawah untuk melanjutkan semua fitur dashboard.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <StatusCard
          ok={!!settings.appUrl?.trim()}
          label="URL Aplikasi"
          detail={settings.appUrl?.trim() ? "Terisi" : "Belum diisi"}
        />
        <StatusCard
          ok={hasWhatsapp}
          label="WhatsApp"
          detail={hasWhatsapp ? (settings.whatsappProvider === "manual" ? "Mode manual" : "Terhubung") : "Mode simulasi"}
        />
        <StatusCard
          ok={hasXendit}
          label="Xendit"
          detail={hasXendit ? xenditModeLabel(settings) : "Mode demo"}
        />
      </div>

      <Card className="p-6">
        <form action={updateSettings} className="space-y-8">
          <section className="space-y-4">
            <SectionTitle icon={Settings} title="Profil Bisnis" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Nama Bisnis" name="businessName" defaultValue={settings.businessName} />
              <Input label="Email Pemilik" name="ownerEmail" type="email" defaultValue={settings.ownerEmail} />
            </div>
            <Input label="No. WhatsApp Pemilik" name="ownerPhone" defaultValue={settings.ownerPhone} placeholder="081234567890" />
            <div>
              <Input
                label="URL Aplikasi (domain kamu)"
                name="appUrl"
                defaultValue={settings.appUrl}
                placeholder="https://kos.saya.com"
              />
              <p className="mt-1.5 text-xs text-[var(--muted)]">
                Dipakai untuk link bayar, portal penyewa, dan webhook Xendit. Contoh: https://kos.saya.com
              </p>
            </div>
          </section>

          <hr className="border-[var(--border)]" />

          <section className="space-y-4">
            <SectionTitle icon={Target} title="Tagihan & Target" />
            <Input
              label="Target Pendapatan Bulanan (Rp)"
              name="monthlyRevenueTarget"
              type="number"
              min={0}
              step={100000}
              defaultValue={settings.monthlyRevenueTarget}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Tanggal Jatuh Tempo" name="dueDayOfMonth" type="number" min={1} max={28} defaultValue={settings.dueDayOfMonth} />
              <Input label="Reminder (hari sebelum)" name="reminderDaysBefore" type="number" min={1} max={14} defaultValue={settings.reminderDaysBefore} />
              <Input label="Denda Terlambat (%)" name="lateFeePercent" type="number" min={0} max={50} defaultValue={settings.lateFeePercent} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Deposit Default (Rp)" name="defaultDeposit" type="number" min={0} step={50000} defaultValue={settings.defaultDeposit} />
              <Input label="Tarif Listrik /kWh" name="electricityRate" type="number" min={0} defaultValue={settings.electricityRate} />
              <Input label="Tarif Air /m³" name="waterRate" type="number" min={0} defaultValue={settings.waterRate} />
            </div>
            <label className="flex items-center gap-2 text-sm text-[var(--ink)]">
              <input type="checkbox" name="autoReminderEnabled" defaultChecked={settings.autoReminderEnabled} />
              Aktifkan otomatis: generate tagihan, kirim portal & reminder WA
            </label>
            <p className="text-xs leading-relaxed text-[var(--muted)]">
              Jika aktif + Fonnte terhubung: tagihan bulan ini dibuat otomatis, link portal dikirim saat penyewa baru masuk,
              reminder H-{settings.reminderDaysBefore} sebelum jatuh tempo, dan notifikasi tagihan di hari jatuh tempo.
              Butuh <code className="rounded bg-white px-1">CRON_SECRET</code> di server (cron harian).
            </p>
          </section>

          <hr className="border-[var(--border)]" />

          <section className="space-y-4">
            <SectionTitle icon={MessageCircle} title="WhatsApp (Fonnte)" />
            <div className="rounded-xl bg-[var(--paper)] p-4 text-sm text-[var(--muted)]">
              <p className="font-semibold text-[var(--ink)]">Cara setup WhatsApp</p>
              <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-xs leading-relaxed">
                <li>Daftar di <strong>fonnte.com</strong> dan hubungkan nomor WhatsApp bisnis</li>
                <li>Salin <strong>API Token</strong> dari dashboard Fonnte → paste di bawah</li>
                <li>Simpan, lalu klik <strong>Tes Koneksi</strong></li>
              </ol>
              <p className="mt-2 text-xs text-[var(--teal)]">
                Tanpa API: pilih <strong>Manual (wa.me)</strong> — buka chat satu per satu.
              </p>
            </div>
            <Select label="Provider" name="whatsappProvider" defaultValue={settings.whatsappProvider}>
              <option value="fonnte">Fonnte — API otomatis</option>
              <option value="waba">WhatsApp Business API</option>
              <option value="manual">Manual — wa.me</option>
            </Select>
            <Input
              label="API Key Fonnte"
              name="whatsappApiKey"
              type="password"
              defaultValue={settings.whatsappApiKey}
              placeholder="Kosongkan untuk mode simulasi"
            />
            <Select label="Template Pesan" name="whatsappTemplate" defaultValue={settings.whatsappTemplate}>
              <option value="default">Default — Formal</option>
              <option value="friendly">Ramah — Santai</option>
              <option value="urgent">Urgent — Tegas</option>
            </Select>
            <IntegrationTestButton type="whatsapp" ownerPhone={settings.ownerPhone} />
          </section>

          <hr className="border-[var(--border)]" />

          <section className="space-y-4">
            <SectionTitle icon={CreditCard} title="Xendit" />
            <div className="rounded-xl bg-[var(--paper)] p-4 text-sm text-[var(--muted)]">
              <p className="font-semibold text-[var(--ink)]">Cara setup Xendit</p>
              <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-xs leading-relaxed">
                <li>Daftar di <strong>dashboard.xendit.co</strong></li>
                <li>Ambil <strong>Secret API Key</strong> (Test dulu: <code>xnd_development_...</code>)</li>
                <li>Di Xendit → Settings → Webhooks → tambah URL di bawah, event <strong>invoices.paid</strong></li>
                <li>Salin <strong>Callback Verification Token</strong> ke field Webhook Token</li>
                <li>Simpan → klik <strong>Tes Koneksi</strong></li>
              </ol>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <code className="rounded-lg bg-white px-2 py-1 text-xs text-[var(--ink)]">{webhookUrl}</code>
                <CopyButton text={webhookUrl} />
              </div>
            </div>
            <Input label="Secret API Key" name="xenditSecretKey" type="password" defaultValue={settings.xenditSecretKey} placeholder="xnd_development_..." />
            <Input label="Webhook Token" name="xenditWebhookToken" type="password" defaultValue={settings.xenditWebhookToken} placeholder="Token dari dashboard Xendit" />
            <IntegrationTestButton type="xendit" />
          </section>

          <hr className="border-[var(--border)]" />

          <section className="space-y-4">
            <SectionTitle icon={Users} title="Portal Penyewa" />
            <Textarea
              label="Pesan Selamat Datang"
              name="portalWelcomeMessage"
              defaultValue={settings.portalWelcomeMessage}
              rows={3}
            />
            <div className="flex items-start gap-2 rounded-xl bg-[var(--teal-soft)] p-3 text-xs text-[var(--teal)]">
              <Globe className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Link portal: <strong>{appUrl}/portal/[token]</strong> — unik per penyewa. Otomatis dikirim via WA saat penyewa baru ditambah (jika reminder otomatis aktif).
              </p>
            </div>
          </section>

          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Simpan Pengaturan
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="flex items-center gap-2 font-bold text-[var(--ink)]">
          <CreditCard className="h-5 w-5 text-[var(--accent)]" />
          Paket Langganan
        </h3>
        <div className="mt-4 rounded-2xl bg-[var(--ink)] p-6 text-white">
          <p className="text-sm text-white/50">Paket aktif</p>
          <p className="font-display text-2xl font-bold">{getSubscriptionLabel(settings)}</p>
          {settings.subscriptionPlan === "free" ? (
            <p className="mt-1 text-sm text-white/60">
              {limits.maxProperties} properti · {limits.maxRooms} kamar · Upgrade kapan saja
            </p>
          ) : settings.subscriptionPlan === "early_adopter" ? (
            <p className="mt-1 text-sm text-white/60">
              {isEarlyAdopterExpired(settings)
                ? "Masa Early Adopter habis — lanjut paket Gratis"
                : `${getTrialDaysLeft(settings.trialEndsAt)} hari tersisa`}{" "}
              · {limits.maxProperties} properti · {limits.maxRooms} kamar
            </p>
          ) : (
            <p className="mt-1 text-sm text-white/60">
              Status: {settings.subscriptionStatus}
              {settings.subscriptionEndsAt &&
                ` · Berlaku sampai ${new Date(settings.subscriptionEndsAt).toLocaleDateString("id-ID")}`}
              {limits.maxProperties
                ? ` · ${limits.maxProperties} properti · ${limits.maxRooms} kamar`
                : " · Tanpa batas properti & kamar"}
            </p>
          )}
        </div>
        <div className="mt-6">
          <UpgradePlans
            currentPlan={settings.subscriptionPlan}
            billingReady={billingConfigured()}
          />
        </div>
      </Card>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <h3 className="flex items-center gap-2 font-bold text-[var(--ink)]">
      <Icon className="h-5 w-5 text-[var(--accent)]" />
      {title}
    </h3>
  );
}

function StatusCard({ ok, label, detail }: { ok: boolean; label: string; detail: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-white p-4">
      {ok ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--success)]" />
      ) : (
        <AlertCircle className="h-5 w-5 shrink-0 text-[var(--warning)]" />
      )}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">{label}</p>
        <p className="text-sm font-semibold text-[var(--ink)]">{detail}</p>
      </div>
    </div>
  );
}