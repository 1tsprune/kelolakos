"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BarChart3,
  Bell,
  Building2,
  Calendar,
  DoorOpen,
  Megaphone,
  Package,
  Search,
  UserPlus,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import { useLandingLocale } from "@/components/landing/LocaleProvider";
import type { LandingChapter, LandingCopy } from "@/lib/i18n/landing";

function PreviewShell({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-2xl shadow-[var(--ink)]/8">
      <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--paper)] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </div>
        <span className="ml-2 font-mono text-[10px] text-[var(--muted)]">{label}</span>
      </div>
      <div className="bg-[var(--ink)] p-6">{children}</div>
    </div>
  );
}

function buildPreview(id: string, p: LandingCopy["scrollStory"]["preview"]): ReactNode {
  switch (id) {
    case "kalender":
      return (
        <PreviewShell label="kalender">
          <div className="rounded-xl bg-[var(--ink-soft)] p-4">
            <p className="text-center text-xs font-bold text-white/40">July 2026</p>
            <div className="mt-3 grid grid-cols-7 gap-1.5 text-center text-[10px] text-white/25">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1.5">
              {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                <div
                  key={d}
                  className={`flex h-8 items-center justify-center rounded-lg text-xs font-bold ${
                    d === 5 ? "bg-[var(--accent)] text-white" : [12, 15, 22].includes(d) ? "bg-white/10 text-white/70" : "text-white/20"
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <p className="rounded-lg bg-orange-500/15 px-3 py-2 text-xs text-orange-200">{p.kalender.dueLine}</p>
              <p className="rounded-lg bg-white/5 px-3 py-2 text-xs text-white/50">{p.kalender.contractLine}</p>
            </div>
          </div>
        </PreviewShell>
      );
    case "pembayaran":
      return (
        <PreviewShell label="pembayaran">
          <div className="space-y-2">
            {[
              { n: "Andi Pratama", a: "Rp 850.000", s: p.pembayaran.paid, ok: true },
              { n: "Rina Wulandari", a: "Rp 850.000", s: p.pembayaran.unpaid, ok: false },
              { n: "Dewi Lestari", a: "Rp 1.260.000", s: p.pembayaran.late, ok: false },
            ].map((r) => (
              <div key={r.n} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">{r.n}</p>
                  <p className="text-xs text-white/40">{r.a}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${r.ok ? "bg-emerald-500/20 text-emerald-300" : "bg-orange-500/20 text-orange-200"}`}>
                  {r.s}
                </span>
              </div>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-[var(--accent)] py-2 text-center text-xs font-bold text-white">{p.pembayaran.reminder}</div>
              <div className="rounded-lg border border-white/15 py-2 text-center text-xs font-bold text-white/60">{p.pembayaran.generate}</div>
            </div>
          </div>
        </PreviewShell>
      );
    case "portal":
      return (
        <PreviewShell label="portal/andi">
          <div className="rounded-xl bg-white/5 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)]/30 text-sm font-bold text-orange-100">AP</div>
              <div>
                <p className="font-bold text-white">Andi Pratama</p>
                <p className="text-xs text-white/40">Kos Melati · Room A1</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-[var(--ink)] p-4">
              <p className="text-[10px] uppercase tracking-wider text-white/35">{p.portal.billLabel}</p>
              <p className="mt-1 text-2xl font-bold text-white">Rp 850.000</p>
            </div>
            <div className="mt-3 rounded-xl bg-[var(--accent)] py-3 text-center text-sm font-bold text-white">{p.portal.payNow}</div>
          </div>
        </PreviewShell>
      );
    case "wa":
      return (
        <PreviewShell label="whatsapp">
          <div className="rounded-xl bg-[#25D366]/10 p-4 ring-1 ring-[#25D366]/25">
            <p className="text-[10px] font-bold text-[#25D366]">{p.wa.sent}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/75">{p.wa.message}</p>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="rounded-lg bg-white/5 py-2 text-emerald-300">{p.wa.delivered}</div>
            <div className="rounded-lg bg-white/5 py-2 text-white/40">{p.wa.failed}</div>
            <div className="rounded-lg bg-white/5 py-2 text-white/40">{p.wa.pending}</div>
          </div>
        </PreviewShell>
      );
    case "data":
      return (
        <PreviewShell label="properti">
          <div className="space-y-2">
            {[
              { icon: Building2, n: "Kos Melati", s: p.data.occupied },
              { icon: DoorOpen, n: "Room A2", s: p.data.vacant },
              { icon: UserPlus, n: "Waitlist", s: p.data.waitlist },
              { icon: Package, n: "Inventory A1", s: p.data.inventory },
            ].map((r) => (
              <div key={r.n} className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
                <r.icon className="h-4 w-4 text-[var(--accent)]" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{r.n}</p>
                  <p className="text-xs text-white/40">{r.s}</p>
                </div>
              </div>
            ))}
          </div>
        </PreviewShell>
      );
    case "uang":
      return (
        <PreviewShell label="laporan">
          <div className="rounded-xl bg-white p-4 text-[var(--ink)]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">{p.uang.reportTitle}</p>
            <p className="font-display text-lg font-bold">Kos Melati</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[var(--muted)]">{p.uang.income}</span><span className="font-bold text-[var(--success)]">Rp 8.500.000</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">{p.uang.expense}</span><span className="font-bold text-[var(--danger)]">Rp 1.050.000</span></div>
              <div className="flex justify-between border-t border-[var(--border)] pt-2"><span className="font-bold">{p.uang.balance}</span><span className="font-bold text-[var(--accent)]">Rp 7.450.000</span></div>
            </div>
          </div>
          <div className="mt-3 flex h-14 items-end gap-1">
            {[35, 55, 48, 72, 65, 88].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-[var(--accent)] to-orange-300" style={{ height: `${h}%` }} />
            ))}
          </div>
        </PreviewShell>
      );
    case "ops":
      return (
        <PreviewShell label="perbaikan">
          <div className="space-y-2">
            {[
              { t: p.ops.roof, p: p.ops.urgent, c: "text-red-300" },
              { t: p.ops.faucet, p: p.ops.normal, c: "text-amber-200" },
              { t: p.ops.contract, p: p.ops.document, c: "text-emerald-300" },
            ].map((item) => (
              <div key={item.t} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
                <span className="text-xs text-white/80">{item.t}</span>
                <span className={`text-[10px] font-bold ${item.c}`}>{item.p}</span>
              </div>
            ))}
          </div>
        </PreviewShell>
      );
    default:
      return null;
  }
}

const icons = [Calendar, Bell, Wallet, Users, Megaphone, BarChart3, Wrench, Search];

export function FeatureScrollStory() {
  const { t } = useLandingLocale();
  const chapters: LandingChapter[] = t.scrollStory.chapters;
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ratiosRef = useRef<Record<number, number>>({});

  useEffect(() => {
    setActive(0);
    ratiosRef.current = {};
  }, [t]);

  useEffect(() => {
    const nodes = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!nodes.length) return;

    const pickActive = () => {
      let best = 0;
      let bestRatio = -1;
      for (const [key, ratio] of Object.entries(ratiosRef.current)) {
        const idx = Number(key);
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = idx;
        }
      }
      setActive(best);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = Number(entry.target.getAttribute("data-step"));
          if (Number.isNaN(idx)) continue;
          ratiosRef.current[idx] = entry.intersectionRatio;
        }
        pickActive();
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: [0, 0.15, 0.35, 0.55, 0.75, 1] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [chapters.length]);

  const scrollToStep = (i: number) => {
    stepRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="scroll-story">
      <div className="mb-8 max-w-2xl">
        <h2 className="font-display text-3xl font-bold text-[var(--ink)] sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
          {t.scrollStory.title}
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-[var(--muted)]">
          {t.scrollStory.subtitle}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        <div className="relative hidden lg:block">
          <div className="scroll-story-sticky">
            <div className="scroll-story-progress mb-4 flex gap-1.5">
              {chapters.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`${t.scrollStory.viewChapter} ${chapters[i].tag}`}
                  onClick={() => scrollToStep(i)}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    i === active ? "bg-[var(--accent)]" : i < active ? "bg-[var(--accent)]/40" : "bg-[var(--border)]"
                  }`}
                />
              ))}
            </div>
            <div className="scroll-story-preview-stack">
              {chapters.map((chapter, i) => (
                <div
                  key={chapter.id}
                  className={`scroll-story-preview-layer ${i === active ? "scroll-story-preview-layer-active" : ""}`}
                  aria-hidden={i !== active}
                  inert={i !== active ? true : undefined}
                >
                  {buildPreview(chapter.id, t.scrollStory.preview)}
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-xs font-medium text-[var(--muted)]">
              {chapters[active].tag}
            </p>
          </div>
        </div>

        <div className="scroll-story-steps">
          {chapters.map((chapter, i) => {
            const Icon = icons[i % icons.length];
            const isActive = active === i;
            return (
              <div
                key={chapter.id}
                ref={(el) => { stepRefs.current[i] = el; }}
                data-step={i}
                className={`scroll-story-step ${isActive ? "scroll-story-step-active" : ""}`}
              >
                <div className="mb-4 lg:hidden">{buildPreview(chapter.id, t.scrollStory.preview)}</div>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-500 ${
                      isActive ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/25" : "bg-[var(--paper-dark)] text-[var(--muted)]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isActive ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}>
                    {chapter.tag}
                  </span>
                </div>

                <h3 className={`mt-4 font-display text-2xl font-bold transition-colors sm:text-3xl ${isActive ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}>
                  {chapter.title}
                </h3>
                <p className="mt-2 max-w-md text-base leading-relaxed text-[var(--muted)]">{chapter.desc}</p>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {chapter.bullets.map((b) => (
                    <li
                      key={b}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                        isActive ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "bg-[var(--paper)] text-[var(--muted)]"
                      }`}
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}