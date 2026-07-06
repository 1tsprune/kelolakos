"use client";

import { Button } from "./Button";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function MonthPicker({
  month,
  year,
  action,
}: {
  month: number;
  year: number;
  action?: string;
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <form action={action} method="get" className="flex flex-wrap items-center gap-2">
      <select
        name="bulan"
        defaultValue={month}
        className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium text-[var(--ink)] outline-none focus:border-[var(--accent)]"
      >
        {MONTHS.map((m, i) => (
          <option key={m} value={i + 1}>{m}</option>
        ))}
      </select>
      <select
        name="tahun"
        defaultValue={year}
        className="rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium text-[var(--ink)] outline-none focus:border-[var(--accent)]"
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <Button type="submit" variant="secondary" size="sm">Terapkan</Button>
    </form>
  );
}