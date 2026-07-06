import Link from "next/link";
import { completeOnboarding } from "@/lib/actions";
import { getOnboardingStatus } from "@/lib/queries";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { ArrowRight, Check, Circle } from "lucide-react";

export default async function MulaiPage() {
  const status = await getOnboardingStatus();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-[var(--accent)]">Onboarding</p>
        <h2 className="font-display mt-2 text-3xl font-bold text-[var(--ink)]">Setup {site.name} kamu</h2>
        <p className="mt-2 text-[var(--muted)]">Ikuti 5 langkah ini untuk mulai operasikan kos dengan benar</p>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-[var(--ink)] px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/60">Progress setup</span>
            <span className="text-sm font-bold text-[var(--accent)]">{status.percent}%</span>
          </div>
          <div className="progress-bar mt-3">
            <div style={{ width: `${status.percent}%` }} />
          </div>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {status.steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-4 px-6 py-5">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${step.done ? "bg-[var(--success)] text-white" : "bg-[var(--paper-dark)] text-[var(--muted)]"}`}>
                {step.done ? <Check className="h-5 w-5" /> : <span className="text-sm font-bold">{i + 1}</span>}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${step.done ? "text-[var(--muted)] line-through" : "text-[var(--ink)]"}`}>
                  {step.label}
                </p>
                {!step.done && <p className="text-xs text-[var(--muted)]">Belum selesai</p>}
              </div>
              {!step.done ? (
                <Link href={step.href}>
                  <Button size="sm">Mulai <ArrowRight className="h-3.5 w-3.5" /></Button>
                </Link>
              ) : (
                <Circle className="h-5 w-5 text-[var(--success)]" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {status.percent === 100 && !status.isComplete && (
        <form action={completeOnboarding}>
          <Button type="submit" size="lg" className="w-full">
            Selesai — Masuk Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      )}

      {status.isComplete && (
        <div className="text-center">
          <p className="text-sm text-[var(--muted)]">Setup sudah selesai!</p>
          <Link href="/dashboard" className="mt-3 inline-flex items-center gap-2 font-bold text-[var(--accent)] hover:underline">
            Ke Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      <Card className="p-5">
        <h3 className="font-bold text-[var(--ink)]">Tips cepat</h3>
        <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
          <li>· Isi URL aplikasi & integrasi di Pengaturan — semua lewat web, tanpa edit env</li>
          <li>· Set target pendapatan di Pengaturan untuk tracking bulanan</li>
          <li>· Aktifkan Fonnte & Midtrans di Pengaturan untuk bayar & reminder otomatis</li>
          <li>· Bagikan portal link ke penyewa supaya mereka bayar sendiri</li>
        </ul>
      </Card>
    </div>
  );
}