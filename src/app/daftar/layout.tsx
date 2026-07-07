import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Daftar Gratis — Aplikasi Kelola Kos & Kontrakan",
  description:
    "Daftar KosKit gratis — aplikasi manajemen kos Indonesia. 1 properti, 3 kamar gratis selamanya. Tagihan otomatis, portal penyewa, reminder WhatsApp.",
  path: "/daftar",
});

export default function DaftarLayout({ children }: { children: React.ReactNode }) {
  return children;
}