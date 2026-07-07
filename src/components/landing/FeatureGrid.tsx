"use client";

import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { useLandingLocale } from "@/components/landing/LocaleProvider";

function FeatureDemo({ id }: { id: string }) {
  const { t } = useLandingLocale();
  const demos = t.featureGrid.demos;

  if (id === "tenants") {
    const d = demos.tenants as { avatars: string[] };
    return (
      <div className="mt-4 flex items-center gap-1">
        {d.avatars.map((letter: string) => (
          <div
            key={letter}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ink)] text-[10px] font-bold text-[var(--accent)]"
          >
            {letter}
          </div>
        ))}
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-[var(--border)] text-[10px] text-[var(--muted)]">
          +
        </div>
      </div>
    );
  }

  if (id === "payments") {
    const d = demos.payments as { rows: { room: string; status: string; ok: boolean }[] };
    return (
      <div className="mt-4 space-y-1.5">
        {d.rows.map((row) => (
          <div key={row.room} className="flex items-center justify-between rounded-lg bg-[var(--paper)] px-3 py-2 text-xs">
            <span className="font-medium text-[var(--ink)]">{row.room}</span>
            <span className={`font-bold ${row.ok ? "text-[var(--success)]" : "text-amber-600"}`}>{row.status}</span>
          </div>
        ))}
      </div>
    );
  }

  if (id === "rooms") {
    const d = demos.rooms as { cells: { label: string; filled: boolean }[] };
    return (
      <div className="mt-4 grid grid-cols-4 gap-1.5">
        {d.cells.map((cell) => (
          <div
            key={cell.label}
            className={`rounded-lg py-2 text-center text-[10px] font-bold ${
              cell.filled ? "bg-[var(--accent)]/15 text-[var(--accent)]" : "bg-[var(--paper)] text-[var(--muted)]"
            }`}
          >
            {cell.label}
          </div>
        ))}
      </div>
    );
  }

  const d = demos.reports as { title: string; lines: { label: string; value: string }[] };
  return (
    <div className="mt-4 rounded-lg bg-[var(--paper)] p-3">
      <p className="text-[10px] font-bold text-[var(--muted)]">{d.title}</p>
      <div className="mt-2 space-y-1 text-xs">
        {d.lines.map((line) => (
          <div key={line.label} className="flex justify-between">
            <span className="text-[var(--muted)]">{line.label}</span>
            <span className="font-semibold text-[var(--ink)]">{line.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeatureGrid() {
  const { t } = useLandingLocale();

  return (
    <section className="border-b border-[var(--border)] bg-[var(--paper)] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-[var(--ink)]">{t.featureGrid.title}</h2>
            <p className="mx-auto mt-3 max-w-lg text-[var(--muted)]">{t.featureGrid.subtitle}</p>
          </div>
        </ScrollReveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {t.featureGrid.items.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 80}>
              <div className="bento-card h-full p-6">
                <h3 className="text-lg font-bold text-[var(--ink)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.desc}</p>
                <FeatureDemo id={item.id} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}