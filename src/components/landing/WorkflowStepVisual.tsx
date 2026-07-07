"use client";

import { Check } from "lucide-react";
import { useLandingLocale } from "@/components/landing/LocaleProvider";

export function WorkflowStepVisual({ type }: { type: "verify" | "rooms" | "manage" }) {
  const { t } = useLandingLocale();

  if (type === "verify") {
    const v = t.workflow.visuals.verify;
    return (
      <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--paper)] p-4">
        <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-3 py-2.5">
          <span className="flex-1 truncate font-mono text-xs text-[var(--muted)]">{v.email}</span>
          <span className="flex items-center gap-1 rounded-full bg-[var(--success)]/10 px-2 py-0.5 text-[10px] font-bold text-[var(--success)]">
            <Check className="h-3 w-3" />
            {v.verified}
          </span>
        </div>
      </div>
    );
  }

  if (type === "rooms") {
    const v = t.workflow.visuals.rooms;
    return (
      <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--paper)] p-4">
        <div className="grid grid-cols-3 gap-1.5">
          {v.rooms.map((room) => (
            <div
              key={room}
              className={`flex h-9 items-center justify-center rounded-lg text-xs font-bold ${
                Number(room) <= 6 ? "bg-[var(--accent)]/15 text-[var(--accent)]" : "bg-white text-[var(--muted)]"
              }`}
            >
              {room}
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-[10px] font-medium text-[var(--muted)]">{v.caption}</p>
      </div>
    );
  }

  const v = t.workflow.visuals.manage;
  return (
    <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--paper)] p-4">
      <div className="mb-2 flex gap-1">
        {v.days.map((day, i) => (
          <div
            key={day}
            className={`flex-1 rounded-md py-1.5 text-center text-[10px] font-bold ${
              i === 2 ? "bg-[var(--accent)] text-white" : "bg-white text-[var(--muted)]"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        {v.payments.map((p) => (
          <div key={p.name} className="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 text-[10px]">
            <span className="text-[var(--ink)]">{p.name}</span>
            <span className={`font-bold ${p.ok ? "text-[var(--success)]" : "text-amber-600"}`}>{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}