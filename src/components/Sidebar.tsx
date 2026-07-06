"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Building2,
  Calendar,
  DoorOpen,
  FileText,
  LayoutDashboard,
  Megaphone,
  Package,
  Receipt,
  Rocket,
  Search,
  Settings,
  UserPlus,
  Users,
  Wallet,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { site } from "@/lib/site";

const navSections = [
  {
    label: "Utama",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/mulai", label: "Mulai / Setup", icon: Rocket },
      { href: "/analitik", label: "Analitik", icon: BarChart3 },
      { href: "/cari", label: "Pencarian", icon: Search },
      { href: "/notifikasi", label: "Notifikasi", icon: Bell },
      { href: "/kalender", label: "Kalender", icon: Calendar },
    ],
  },
  {
    label: "Manajemen",
    items: [
      { href: "/properti", label: "Properti", icon: Building2 },
      { href: "/kamar", label: "Kamar", icon: DoorOpen },
      { href: "/penyewa", label: "Penyewa", icon: Users },
      { href: "/daftar-tunggu", label: "Daftar Tunggu", icon: UserPlus },
      { href: "/inventaris", label: "Inventaris", icon: Package },
    ],
  },
  {
    label: "Keuangan",
    items: [
      { href: "/pembayaran", label: "Pembayaran", icon: Wallet },
      { href: "/utilitas", label: "Utilitas", icon: Zap },
      { href: "/pengeluaran", label: "Pengeluaran", icon: Receipt },
      { href: "/laporan", label: "Laporan", icon: FileText },
    ],
  },
  {
    label: "Operasional",
    items: [
      { href: "/dokumen", label: "Dokumen", icon: FileText },
      { href: "/broadcast", label: "Broadcast", icon: Megaphone },
      { href: "/maintenance", label: "Perbaikan", icon: Wrench },
      { href: "/pengaturan", label: "Pengaturan", icon: Settings },
    ],
  },
];

export function Sidebar({ open, onClose, className = "" }: { open: boolean; onClose: () => void; className?: string }) {
  const pathname = usePathname();

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[var(--sidebar-w)] flex-col bg-[var(--ink)] transition-transform duration-200 lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"} ${className}`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)]">
              <span className="text-sm font-extrabold text-white">{site.logoLetter}</span>
            </div>
            <div>
              <p className="text-base font-extrabold text-white">{site.name}</p>
              <p className="text-[10px] font-medium text-white/40">Manajemen Kos</p>
            </div>
          </Link>
          <button onClick={onClose} className="rounded-lg p-1.5 text-white/40 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {navSections.map((section) => (
            <div key={section.label} className="mb-4">
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-white/30">
                {section.label}
              </p>
              {section.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-semibold transition-all ${
                      active ? "sidebar-link-active text-blue-300" : "text-white/55 hover:bg-white/5 hover:text-white/90"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl bg-white/5 p-3.5 ring-1 ring-white/10">
            <p className="text-xs font-bold text-white/80">Pro Trial</p>
            <p className="text-[10px] text-white/40">12 hari tersisa</p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-3/5 rounded-full bg-[var(--accent)]" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}