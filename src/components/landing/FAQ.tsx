"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLandingLocale } from "@/components/landing/LocaleProvider";

export function FAQ() {
  const { t } = useLandingLocale();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-white">
      {t.faq.items.map((f, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-[var(--paper)]/60"
          >
            <span className="pr-4 font-semibold text-[var(--ink)]">{f.q}</span>
            <ChevronDown className={`h-5 w-5 shrink-0 text-[var(--muted)] transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
          </button>
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-out"
            style={{ gridTemplateRows: open === i ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <p className="px-6 pb-5 text-sm leading-relaxed text-[var(--muted)]">{f.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}