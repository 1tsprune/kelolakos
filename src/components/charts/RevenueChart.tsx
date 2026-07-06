import { formatRupiah } from "@/lib/utils";

type DataPoint = { label: string; total: number };

export function RevenueChart({ data }: { data: DataPoint[] }) {
  const max = Math.max(...data.map((d) => d.total), 1);
  const hasData = data.some((d) => d.total > 0);

  if (!hasData) {
    return (
      <div className="flex h-44 items-center justify-center rounded-xl bg-[var(--paper)] text-sm text-[var(--muted)]">
        Belum ada pendapatan tercatat
      </div>
    );
  }

  return (
    <div className="flex h-48 items-end gap-2 pt-2 sm:gap-3">
      {data.map((d) => {
        const barH = Math.max((d.total / max) * 160, 6);
        const short = d.total >= 1000000 ? `${(d.total / 1000000).toFixed(1)}jt` : `${Math.round(d.total / 1000)}rb`;
        return (
          <div key={d.label} className="group flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[10px] font-bold text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">
              {short}
            </span>
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-[var(--accent)] to-orange-300 transition-all group-hover:brightness-110"
                style={{ height: barH }}
                title={formatRupiah(d.total)}
              />
            </div>
            <span className="text-[11px] font-semibold text-[var(--muted)]">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}