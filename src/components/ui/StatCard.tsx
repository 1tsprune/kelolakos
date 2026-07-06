import type { LucideIcon } from "lucide-react";

const accents = {
  orange: "bg-[var(--accent-soft)] text-[var(--accent)]",
  teal: "bg-[var(--teal-soft)] text-[var(--teal)]",
  ink: "bg-[var(--ink)]/5 text-[var(--ink)]",
  success: "bg-emerald-50 text-[var(--success)]",
  warning: "bg-amber-50 text-[var(--warning)]",
  danger: "bg-red-50 text-[var(--danger)]",
} as const;

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "orange",
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  accent?: keyof typeof accents;
  trend?: { value: string; up: boolean };
}) {
  return (
    <div className="app-stat group p-5">
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accents[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span className={`text-xs font-bold ${trend.up ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
            {trend.up ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <p className="mt-4 text-sm font-medium text-[var(--muted)]">{label}</p>
      <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-[var(--ink)]">{value}</p>
      {sub && <p className="mt-1 text-xs text-[var(--muted)]">{sub}</p>}
    </div>
  );
}