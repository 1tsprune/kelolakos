import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--paper-dark)]">
        <Icon className="h-7 w-7 text-[var(--muted)]" />
      </div>
      <h3 className="font-bold text-[var(--ink)]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[var(--muted)]">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}