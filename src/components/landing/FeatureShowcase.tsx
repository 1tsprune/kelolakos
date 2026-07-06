"use client";

import { useState } from "react";
import {
  BarChart3,
  Calendar,
  FileText,
  MessageSquare,
  QrCode,
  Users,
  Wrench,
} from "lucide-react";

const features = [
  {
    id: "tagihan",
    label: "Tagihan & QRIS",
    icon: QrCode,
    title: "Tagihan bulanan kebentuk sendiri",
    desc: "Tanggal 1 tiap bulan, tagihan penyewa udah siap. Tinggal kirim link bayar — lunas langsung masuk catatan.",
    preview: (
      <div className="space-y-2">
        {[
          { n: "Andi Pratama", a: "Rp 850.000", s: "Lunas", ok: true },
          { n: "Rina Wulandari", a: "Rp 850.000", s: "Belum bayar", ok: false },
          { n: "Dewi Lestari", a: "Rp 1.260.000", s: "Telat + denda", ok: false },
        ].map((r) => (
          <div key={r.n} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">{r.n}</p>
              <p className="text-xs text-white/40">{r.a}</p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${r.ok ? "bg-[var(--success)]/20 text-[var(--success)]" : "bg-orange-500/20 text-orange-300"}`}>
              {r.s}
            </span>
          </div>
        ))}
        <div className="mt-3 flex gap-2">
          <div className="flex-1 rounded-lg bg-[var(--accent)] px-3 py-2 text-center text-xs font-bold text-white">Ingatkan lewat WA</div>
          <div className="flex-1 rounded-lg border border-white/20 px-3 py-2 text-center text-xs font-bold text-white/70">Buat tagihan bulan ini</div>
        </div>
      </div>
    ),
  },
  {
    id: "portal",
    label: "Portal Penyewa",
    icon: Users,
    title: "Penyewa cek sendiri, kamu nggak diserbu chat",
    desc: "Tiap penyewa dapat link khusus. Mereka lihat tagihan, riwayat bayar, dan bisa bayar QRIS tanpa nanya kamu tiap bulan.",
    preview: (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/30 text-sm font-bold text-orange-200">AP</div>
          <div>
            <p className="text-sm font-bold text-white">Andi Pratama</p>
            <p className="text-xs text-white/40">Kos Melati · Kamar A1</p>
          </div>
        </div>
        <div className="mb-3 rounded-lg bg-[var(--ink)] p-3">
          <p className="text-[10px] uppercase tracking-wider text-white/40">Tagihan Juli 2026</p>
          <p className="text-xl font-bold text-white">Rp 850.000</p>
          <p className="text-xs text-[var(--success)]">✓ Sudah lunas</p>
        </div>
        <div className="rounded-lg bg-white/10 p-3 text-center text-xs font-bold text-white">Bayar lewat QRIS →</div>
      </div>
    ),
  },
  {
    id: "wa",
    label: "WhatsApp",
    icon: MessageSquare,
    title: "Ingatkan bayar sekaligus lewat WA",
    desc: "Yang belum bayar bisa diingatkan satu klik. Mau umumkan aturan baru ke semua penyewa? Bisa juga.",
    preview: (
      <div className="space-y-2">
        <div className="rounded-xl bg-[#25D366]/10 p-3 ring-1 ring-[#25D366]/20">
          <p className="text-[10px] font-bold text-[#25D366]">Terkirim ✓</p>
          <p className="mt-1 text-xs leading-relaxed text-white/70">
            Halo Rina, tagihan kos Melati kamar A2 Rp 850.000 jatuh tempo 5 Juli ya. Link bayar: kelolakos.id/bayar/...
          </p>
        </div>
        <div className="flex gap-2 text-center text-[10px]">
          <div className="flex-1 rounded-lg bg-white/5 py-2 text-white/50">3 terkirim</div>
          <div className="flex-1 rounded-lg bg-white/5 py-2 text-white/50">0 gagal</div>
        </div>
      </div>
    ),
  },
  {
    id: "laporan",
    label: "Laporan",
    icon: FileText,
    title: "Laporan buat catatan & pembukuan",
    desc: "Pendapatan, pengeluaran, sisa piutang — tinggal export PDF atau CSV. Mau print buat arsip juga bisa.",
    preview: (
      <div className="rounded-xl border border-white/10 bg-white p-4 text-[var(--ink)]">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Laporan Juli 2026</p>
        <p className="font-display text-lg font-bold">Kos Melati</p>
        <div className="mt-3 space-y-1.5 text-xs">
          <div className="flex justify-between"><span className="text-[var(--muted)]">Masuk</span><span className="font-bold text-[var(--success)]">Rp 8.500.000</span></div>
          <div className="flex justify-between"><span className="text-[var(--muted)]">Keluar</span><span className="font-bold text-[var(--danger)]">Rp 1.050.000</span></div>
          <div className="flex justify-between border-t border-[var(--border)] pt-1.5"><span className="font-bold">Sisa</span><span className="font-bold text-[var(--accent)]">Rp 7.450.000</span></div>
        </div>
      </div>
    ),
  },
  {
    id: "kalender",
    label: "Kalender",
    icon: Calendar,
    title: "Jatuh tempo & kontrak kelihatan per tanggal",
    desc: "Buka kalender langsung lihat: siapa harus bayar tanggal berapa, kontrak siapa mau habis, tagihan listrik jatuh kapan.",
    preview: (
      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-wider text-white/40">Juli 2026</p>
        <div className="grid grid-cols-7 gap-1 text-center text-[9px] text-white/30">
          {["S", "S", "R", "K", "J", "S", "M"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => {
            const marked = [5, 12, 15, 22].includes(d);
            const urgent = d === 5;
            return (
              <div
                key={d}
                className={`flex h-7 items-center justify-center rounded-md text-[10px] font-medium ${
                  urgent
                    ? "bg-[var(--accent)] text-white"
                    : marked
                      ? "bg-white/15 text-white"
                      : "text-white/40"
                }`}
              >
                {d}
              </div>
            );
          })}
        </div>
        <div className="mt-3 space-y-1.5 text-[10px]">
          <p className="text-orange-300">● 5 Jul — 4 tagihan jatuh tempo</p>
          <p className="text-white/50">● 15 Jul — kontrak Andi habis</p>
        </div>
      </div>
    ),
  },
  {
    id: "analitik",
    label: "Ringkasan",
    icon: BarChart3,
    title: "Langsung keliatan kos mana yang untung",
    desc: "Okupansi, pendapatan per kos, target bulanan — biar kamu tahu harus fokus ke mana.",
    preview: (
      <div>
        <div className="mb-3 flex h-20 items-end gap-1.5">
          {[35, 55, 48, 72, 65, 88].map((h, i) => (
            <div
              key={i}
              className="flex-1 origin-bottom rounded-t-md bg-gradient-to-t from-[var(--accent)] to-orange-300 animate-[feature-in_0.5s_ease-out_both]"
              style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
          <div className="rounded-lg bg-white/5 py-2"><p className="text-white/40">Terisi</p><p className="font-bold text-white">80%</p></div>
          <div className="rounded-lg bg-white/5 py-2"><p className="text-white/40">Target bulan ini</p><p className="font-bold text-orange-300">85%</p></div>
        </div>
      </div>
    ),
  },
  {
    id: "ops",
    label: "Operasional",
    icon: Wrench,
    title: "Perbaikan, listrik, antrian calon — sekalian",
    desc: "Atap bocor, keran rusak, tagihan listrik kamar, calon yang nunggu kamar kosong — semua dicatat di sini.",
    preview: (
      <div className="space-y-2">
        {[
          { t: "Atap bocor · Kamar 102", p: "Urgent", c: "text-red-400" },
          { t: "Keran bocor · Kamar A1", p: "Biasa", c: "text-amber-400" },
          { t: "3 orang nunggu kamar kosong", p: "Antrian", c: "text-[var(--success)]" },
        ].map((item) => (
          <div key={item.t} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
            <span className="text-xs text-white/80">{item.t}</span>
            <span className={`text-[10px] font-bold ${item.c}`}>{item.p}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export function FeatureShowcase() {
  const [active, setActive] = useState(features[0].id);
  const current = features.find((f) => f.id === active) ?? features[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <div className="flex flex-wrap gap-2 lg:flex-col">
        {features.map((f) => {
          const Icon = f.icon;
          const isActive = active === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActive(f.id)}
              data-active={isActive}
              className={`landing-feature-tab flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm font-semibold ${
                isActive ? "" : "border-[var(--border)] bg-white text-[var(--muted)] hover:border-[var(--ink)]/20 hover:text-[var(--ink)]"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--ink)] p-8 lg:p-10">
        <div key={active} className="feature-panel-enter grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="font-display text-2xl font-bold leading-tight text-white">{current.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55">{current.desc}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[var(--ink-soft)] p-5">
            {current.preview}
          </div>
        </div>
      </div>
    </div>
  );
}