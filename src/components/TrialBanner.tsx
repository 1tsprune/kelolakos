import Link from "next/link";
import { AlertTriangle, Sparkles } from "lucide-react";
import { getTrialDaysLeft, isEarlyAdopterExpired, getSubscriptionLabel } from "@/lib/settings";
import type { Settings } from "@/lib/types";

export function TrialBanner({ settings }: { settings: Settings }) {
  if (settings.subscriptionPlan !== "early_adopter") return null;

  const daysLeft = getTrialDaysLeft(settings.trialEndsAt);
  const expired = isEarlyAdopterExpired(settings);

  if (expired) {
    return (
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-3">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Masa Early Adopter habis. Kamu masih bisa pakai paket Gratis (1 properti, 3 kamar).
          </p>
          <Link
            href="/pengaturan"
            className="rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-bold text-white hover:bg-[var(--accent-hover)]"
          >
            Upgrade ke Pro
          </Link>
        </div>
      </div>
    );
  }

  if (daysLeft > 7) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
          <Sparkles className="h-4 w-4 shrink-0" />
          {getSubscriptionLabel(settings)} — {daysLeft} hari tersisa (akses penuh seperti Pro)
        </p>
        <Link
          href="/pengaturan"
          className="rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-bold text-white hover:bg-[var(--accent-hover)]"
        >
          Lihat Paket
        </Link>
      </div>
    </div>
  );
}