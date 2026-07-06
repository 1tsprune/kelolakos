export function OccupancyDonut({
  occupied,
  empty,
  maintenance,
}: {
  occupied: number;
  empty: number;
  maintenance: number;
}) {
  const total = occupied + empty + maintenance || 1;
  const pct = Math.round((occupied / total) * 100);
  const r = 40;
  const c = 2 * Math.PI * r;

  const segments = [
    { value: occupied, color: "var(--teal)" },
    { value: empty, color: "var(--border)" },
    { value: maintenance, color: "var(--warning)" },
  ];

  let offset = 0;
  const arcs = segments.map((seg, i) => {
    const dash = (seg.value / total) * c;
    const arc = (
      <circle
        key={i}
        cx="50" cy="50" r={r}
        fill="none"
        stroke={seg.color}
        strokeWidth="11"
        strokeDasharray={`${dash} ${c - dash}`}
        strokeDashoffset={-offset}
        className="transition-all duration-700"
      />
    );
    offset += dash;
    return arc;
  });

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-28 w-28">
        <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--paper-dark)" strokeWidth="11" />
          {arcs}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-[var(--ink)]">{pct}%</span>
          <span className="text-[10px] font-medium text-[var(--muted)]">Hunian</span>
        </div>
      </div>
      <div className="space-y-2.5 text-sm">
        <Legend color="bg-[var(--teal)]" label="Terisi" value={occupied} />
        <Legend color="bg-[var(--border)]" label="Kosong" value={empty} />
        <Legend color="bg-[var(--warning)]" label="Maintenance" value={maintenance} />
      </div>
    </div>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-bold text-[var(--ink)]">{value}</span>
    </div>
  );
}