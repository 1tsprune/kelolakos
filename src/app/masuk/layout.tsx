import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Masuk — Login Aplikasi Manajemen Kos",
  description:
    "Login ke KosKit — aplikasi manajemen kos & kontrakan. Kelola penyewa, tagihan, portal penyewa, dan laporan keuangan dari dashboard.",
  path: "/masuk",
});

export default function MasukLayout({ children }: { children: React.ReactNode }) {
  return children;
}