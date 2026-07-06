import { getCalendarEvents } from "@/lib/queries";
import { formatRupiah } from "@/lib/utils";
import { Card, PageTitle } from "@/components/ui/Card";
import { MonthPicker } from "@/components/ui/MonthPicker";

export default async function KalenderPage({
  searchParams,
}: {
  searchParams: Promise<{ bulan?: string; tahun?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const month = Number(params.bulan) || now.getMonth() + 1;
  const year = Number(params.tahun) || now.getFullYear();
  const cal = await getCalendarEvents(month, year);

  const monthName = new Date(year, month - 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const firstDay = new Date(year, month - 1, 1).getDay();
  const days = Array.from({ length: cal.daysInMonth }, (_, i) => i + 1);

  const eventsByDay = new Map<number, { type: string; label: string; status: string }[]>();
  for (const p of cal.payments) {
    const day = new Date(p.dueDate).getDate();
    const list = eventsByDay.get(day) ?? [];
    list.push({ type: "sewa", label: `${p.tenant.name.split(" ")[0]} ${formatRupiah(p.amount)}`, status: p.status });
    eventsByDay.set(day, list);
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Kalender Pembayaran" description={monthName} />
      <MonthPicker month={month} year={year} />

      <Card className="p-4">
        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-bold text-[var(--muted)]">
          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {days.map((day) => {
            const events = eventsByDay.get(day) ?? [];
            const isToday = day === now.getDate() && month === now.getMonth() + 1 && year === now.getFullYear();
            return (
              <div
                key={day}
                className={`min-h-20 rounded-xl border p-1.5 text-xs ${
                  isToday ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-white"
                }`}
              >
                <span className={`font-bold ${isToday ? "text-[var(--accent)]" : "text-[var(--ink)]"}`}>{day}</span>
                {events.slice(0, 2).map((e, i) => (
                  <div
                    key={i}
                    className={`mt-1 truncate rounded px-1 py-0.5 text-[10px] font-semibold ${
                      e.status === "lunas" ? "bg-[var(--teal-soft)] text-[var(--teal)]" : "bg-red-50 text-[var(--danger)]"
                    }`}
                  >
                    {e.label}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="mb-3 font-bold text-[var(--ink)]">Legenda</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-[var(--teal-soft)]" /> Lunas</span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-red-50" /> Belum / Terlambat</span>
          <span className="flex items-center gap-2"><span className="h-3 w-3 rounded border-2 border-[var(--accent)]" /> Hari ini</span>
        </div>
      </Card>
    </div>
  );
}