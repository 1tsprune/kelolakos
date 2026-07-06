"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, Plus, Search } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { site } from "@/lib/site";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/mulai": "Setup Kos",
  "/analitik": "Analitik",
  "/cari": "Pencarian",
  "/properti": "Properti",
  "/kamar": "Kamar",
  "/penyewa": "Penyewa",
  "/daftar-tunggu": "Daftar Tunggu",
  "/inventaris": "Inventaris",
  "/pembayaran": "Pembayaran",
  "/utilitas": "Utilitas",
  "/pengeluaran": "Pengeluaran",
  "/laporan": "Laporan",
  "/dokumen": "Dokumen",
  "/broadcast": "Broadcast",
  "/maintenance": "Perbaikan",
  "/kalender": "Kalender",
  "/notifikasi": "Notifikasi",
  "/pengaturan": "Pengaturan",
};

const quickAdd: Record<string, string> = {
  "/properti": "/properti",
  "/penyewa": "/penyewa",
  "/pembayaran": "/pembayaran",
};

export function TopBar({
  notificationCount,
  onMenuClick,
  userName = "Pemilik",
}: {
  notificationCount: number;
  onMenuClick: () => void;
  userName?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const title = Object.entries(titles).find(([k]) => pathname.startsWith(k))?.[1] ?? site.name;
  const addHref = Object.entries(quickAdd).find(([k]) => pathname.startsWith(k))?.[1];

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--paper)]/95 backdrop-blur-sm">
      <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
        <button onClick={onMenuClick} className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--paper-dark)] lg:hidden">
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="hidden text-base font-extrabold text-[var(--ink)] lg:block">{title}</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get("q") as string;
            router.push(`/cari?q=${encodeURIComponent(q)}`);
          }}
          className="relative mx-auto hidden max-w-sm flex-1 md:block"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            name="q"
            placeholder="Cari penyewa, kamar, properti..."
            className="w-full rounded-xl border border-[var(--border)] bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </form>

        <div className="ml-auto flex items-center gap-1.5">
          {addHref && (
            <Link href={addHref} className="hidden items-center gap-1.5 rounded-xl bg-[var(--accent)] px-3 py-2 text-xs font-bold text-white hover:bg-[var(--accent-hover)] sm:inline-flex">
              <Plus className="h-3.5 w-3.5" /> Tambah
            </Link>
          )}
          <Link href="/notifikasi" className="relative rounded-xl p-2 text-[var(--muted)] hover:bg-white">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--danger)] text-[9px] font-bold text-white">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </Link>
          <div className="hidden items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-2.5 py-1.5 sm:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--ink)] text-[10px] font-bold text-[var(--accent)]">
              {userName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <span className="text-sm font-semibold text-[var(--ink)]">{userName}</span>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}