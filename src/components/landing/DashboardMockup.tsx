"use client";

import { site } from "@/lib/site";
import { useLandingLocale } from "@/components/landing/LocaleProvider";

export function DashboardMockup() {
  const { t } = useLandingLocale();
  const m = t.hero.mockup;

  return (
    <div className="animate-float relative mx-auto w-full max-w-xl">
      <div className="absolute -right-6 -top-6 hidden h-24 w-24 rounded-2xl bg-[var(--accent)]/20 blur-2xl lg:block" />
      <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-[var(--teal)]/15 blur-3xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--ink-soft)] shadow-2xl shadow-black/50">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          </div>
          <div className="ml-3 flex-1 rounded-md bg-white/5 px-3 py-1 font-mono text-[10px] text-white/35">
            {site.url.replace(/^https?:\/\//, "")}/dashboard
          </div>
        </div>

        <div className="flex">
          <div className="hidden w-36 shrink-0 border-r border-white/10 bg-[var(--ink)] p-3 sm:block">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)] text-[10px] font-extrabold text-white">
                {site.logoLetter}
              </div>
              <span className="text-[11px] font-bold text-white">{site.name}</span>
            </div>
            {m.sidebar.map((item) => (
              <div
                key={item}
                className={`mb-0.5 rounded-lg px-2.5 py-1.5 text-[10px] font-medium ${
                  item === m.sidebarActive ? "bg-[var(--accent)]/15 text-amber-300" : "text-white/40"
                }`}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="flex-1 p-4">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-[9px] font-medium uppercase tracking-wider text-white/35">{m.month}</p>
                <p className="text-sm font-bold text-white">{m.greeting}</p>
              </div>
              <div className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                {m.targetBadge}
              </div>
            </div>

            <div className="mb-3 grid grid-cols-3 gap-1.5">
              {m.stats.map((s) => (
                <div key={s.l} className="rounded-lg bg-white/5 px-2 py-2">
                  <p className="text-[8px] text-white/35">{s.l}</p>
                  <p className={`text-[11px] font-bold ${s.c}`}>{s.v}</p>
                </div>
              ))}
            </div>

            <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)]" />
            </div>
            <p className="mb-3 text-[8px] text-white/30">{m.targetLine}</p>

            <div className="mb-3 flex h-14 items-end gap-1">
              {[38, 62, 50, 78, 68, 92].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-[var(--accent)]/80 to-blue-400/50"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            <div className="space-y-1">
              {m.tenants.map((t) => (
                <div key={t.n} className="flex items-center justify-between rounded-md bg-white/5 px-2.5 py-1.5">
                  <span className="text-[10px] text-white/75">{t.n}</span>
                  <span className={`text-[9px] font-bold ${t.ok ? "text-emerald-400" : "text-amber-300"}`}>{t.s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-3 top-[18%] z-10 hidden max-w-[11rem] rounded-xl border border-emerald-200 bg-white px-3 py-2.5 shadow-lg lg:block">
        <p className="text-[9px] font-bold text-[var(--success)]">{m.floatPayment.title}</p>
        <p className="text-[11px] font-extrabold leading-tight text-[var(--ink)]">{m.floatPayment.detail}</p>
      </div>

      <div className="absolute -left-5 bottom-[38%] z-10 hidden rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 shadow-lg lg:block">
        <p className="text-[9px] font-bold text-[var(--muted)]">{m.floatOccupancy.title}</p>
        <p className="text-sm font-extrabold text-[var(--accent)]">{m.floatOccupancy.value}</p>
      </div>

      <div className="absolute -right-6 bottom-[12%] hidden rounded-xl border border-[var(--border)] bg-white px-3 py-2 shadow-lg lg:block">
        <p className="text-[9px] font-bold text-[var(--muted)]">{m.floatReminder.title}</p>
        <p className="text-sm font-extrabold text-[var(--success)]">{m.floatReminder.value}</p>
      </div>
    </div>
  );
}