"use client";

import { site } from "@/lib/site";

export function DashboardMockup() {
  return (
    <div className="animate-float relative mx-auto w-full max-w-xl">
      <div className="absolute -right-6 -top-6 hidden h-24 w-24 rounded-2xl bg-[var(--accent)]/20 blur-2xl lg:block" />
      <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-[var(--teal)]/15 blur-3xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--ink-soft)] shadow-2xl shadow-black/50">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          </div>
          <div className="ml-3 flex-1 rounded-md bg-white/5 px-3 py-1 font-mono text-[10px] text-white/35">
            {site.url.replace(/^https?:\/\//, "")}/dashboard
          </div>
        </div>

        <div className="flex">
          <div className="hidden w-36 shrink-0 border-r border-white/10 bg-[var(--ink)] p-3 sm:block">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)] text-[10px] font-extrabold text-white">{site.logoLetter}</div>
              <span className="text-[11px] font-bold text-white">{site.name}</span>
            </div>
            {[
              { l: "Dashboard", a: true },
              { l: "Pembayaran", a: false },
              { l: "Penyewa", a: false },
              { l: "Daftar Tunggu", a: false },
              { l: "Laporan", a: false },
            ].map((item) => (
              <div
                key={item.l}
                className={`mb-0.5 rounded-lg px-2.5 py-1.5 text-[10px] font-medium ${
                  item.a ? "bg-[var(--accent)]/15 text-amber-300" : "text-white/40"
                }`}
              >
                {item.l}
              </div>
            ))}
          </div>

          <div className="flex-1 p-4">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-[9px] font-medium uppercase tracking-wider text-white/35">Juli 2026</p>
                <p className="text-sm font-bold text-white">Selamat pagi, Pak Budi</p>
              </div>
              <div className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                33% target
              </div>
            </div>

            <div className="mb-3 grid grid-cols-3 gap-1.5">
              {[
                { l: "Terkumpul", v: "Rp 850rb", c: "text-emerald-400" },
                { l: "Tunggakan", v: "Rp 2,1jt", c: "text-amber-300" },
                { l: "Hunian", v: "60%", c: "text-white" },
              ].map((s) => (
                <div key={s.l} className="rounded-lg bg-white/5 px-2 py-2">
                  <p className="text-[8px] text-white/35">{s.l}</p>
                  <p className={`text-[11px] font-bold ${s.c}`}>{s.v}</p>
                </div>
              ))}
            </div>

            <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)]" />
            </div>
            <p className="mb-3 text-[8px] text-white/30">Target pendapatan Rp 10jt/bulan</p>

            <div className="mb-3 flex h-14 items-end gap-1">
              {[38, 62, 50, 78, 68, 92].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-[var(--accent)]/80 to-teal-400/50"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            <div className="space-y-1">
              {[
                { n: "Andi Pratama", s: "Lunas", ok: true },
                { n: "Rina Wulandari", s: "Belum", ok: false },
                { n: "Dewi Lestari", s: "Terlambat", ok: false },
              ].map((t) => (
                <div key={t.n} className="flex items-center justify-between rounded-md bg-white/5 px-2.5 py-1.5">
                  <span className="text-[10px] text-white/75">{t.n}</span>
                  <span className={`text-[9px] font-bold ${t.ok ? "text-emerald-400" : "text-amber-300"}`}>{t.s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-2 top-1/3 hidden rounded-xl border border-[var(--border)] bg-white px-3 py-2 shadow-lg lg:block">
        <p className="text-[9px] font-bold text-[var(--muted)]">Reminder terkirim</p>
        <p className="text-sm font-extrabold text-[var(--success)]">3 penyewa ✓</p>
      </div>

      <div className="absolute -left-4 bottom-1/4 hidden rounded-xl border border-[var(--border)] bg-white px-3 py-2 shadow-lg lg:block">
        <p className="text-[9px] font-bold text-[var(--muted)]">Kontrak habis</p>
        <p className="text-sm font-extrabold text-[var(--warning)]">14 hari lagi</p>
      </div>
    </div>
  );
}