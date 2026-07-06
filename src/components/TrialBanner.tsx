import Link from "next/link";
import { AlertTriangle, Sparkles } from "lucide-react";
import { getTrialDaysLeft, isTrialExpired, getSubscriptionLabel } from "@/lib/settings";
import type { Settings } from "@/lib/types";

export function TrialBanner({ settings }: { settings: Settings }) {
  if (settings.subscriptionPlan !== "trial") return null;

  const daysLeft = getTrialDaysLeft(settings.trialEndsAt);
  const expired = isTrialExpired(settings);

  if (expired) {
    return (
      <div className="border-b border-red-200 bg-red-50 px-4 py-3">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-red-800">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Trial kamu sudah habis. Upgrade untuk terus pakai semua fitur.
          </p>
          <Link
            href="/pengaturan"
            className="rounded-lg bg-red-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-800"
          >
            Upgrade Paket
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
          {getSubscriptionLabel(settings)} — {daysLeft} hari tersisa
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