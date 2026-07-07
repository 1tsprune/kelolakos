"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";
import type { PaidPlan } from "@/lib/subscription";

const PLANS: {
  id: PaidPlan;
  name: string;
  price: number;
  desc: string;
  features: string[];
  popular?: boolean;
}[] = [
  {
    id: "pro",
    name: "Pro",
    price: 199000,
    desc: "5 properti · 50 kamar",
    features: ["Portal penyewa + QRIS", "Kalender & notifikasi", "Broadcast WA", "Laporan PDF & CSV"],
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: 399000,
    desc: "Properti & kamar tanpa batas",
    features: ["Semua fitur Pro", "Prioritas support", "Domain sendiri", "Onboarding call 30 menit"],
  },
];

export function UpgradePlans({
  currentPlan,
  billingReady,
}: {
  currentPlan: string;
  billingReady: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<PaidPlan | null>(null);
  const [error, setError] = useState("");

  async function handleUpgrade(plan: PaidPlan) {
    setError("");
    setLoading(plan);
    try {
      const res = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal membuat pembayaran");

      if (data.isSimulated || !data.invoiceUrl) {
        const sim = await fetch("/api/subscription/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
        });
        if (!sim.ok) {
          const err = await sim.json();
          throw new Error(err.error ?? "Simulasi gagal");
        }
        router.refresh();
        return;
      }

      window.location.href = data.invoiceUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      {!billingReady && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
          Mode demo: klik upgrade akan langsung aktifkan paket (tanpa Xendit). Untuk production,
          set <code className="font-mono">BILLING_XENDIT_*</code> di env server.
        </p>
      )}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-800">{error}</p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-5 ${
                plan.popular
                  ? "border-[var(--accent)] bg-[var(--accent)]/5"
                  : "border-[var(--border)] bg-white"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold text-white">
                  <Sparkles className="h-3 w-3" />
                  Populer
                </span>
              )}
              <p className="font-bold text-[var(--ink)]">{plan.name}</p>
              <p className="text-xs text-[var(--muted)]">{plan.desc}</p>
              <p className="mt-3 font-display text-xl font-bold text-[var(--accent)]">
                {formatRupiah(plan.price)}
                <span className="text-xs font-normal text-[var(--muted)]">/bulan</span>
              </p>
              <ul className="mt-3 space-y-1 text-xs text-[var(--muted)]">
                {plan.features.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
              <Button
                className="mt-4 w-full"
                variant={plan.popular ? "primary" : "secondary"}
                disabled={isCurrent || loading !== null}
                onClick={() => handleUpgrade(plan.id)}
              >
                <CreditCard className="h-4 w-4" />
                {loading === plan.id
                  ? "Memproses..."
                  : isCurrent
                    ? "Paket Aktif"
                    : `Upgrade ${plan.name}`}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}