/** Satu file untuk branding & SEO — ganti nama di sini saja */
export const site = {
  name: "KosKit",
  /** Huruf untuk logo mark */

  tagline: "Toolkit manajemen kos & kontrakan",
  description:
    "Aplikasi manajemen kos & kontrakan Indonesia: tagihan otomatis, portal penyewa, pembayaran QRIS Xendit, reminder WhatsApp, dan laporan PDF. Kelola multi-properti dari satu dashboard.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "id_ID",
  keywords: [
    "aplikasi manajemen kos",
    "aplikasi kelola kos",
    "software manajemen kos",
    "software kos",
    "aplikasi kost",
    "aplikasi kontrakan",
    "kelola kos online",
    "tagihan kos otomatis",
    "portal penyewa kos",
    "pembayaran kos QRIS",
    "reminder whatsapp kos",
    "manajemen kost putra putri",
    "catat penyewa kos",
    "laporan keuangan kos",
    "koskit",
    "koskit aplikasi",
  ],
  seo: {
    /** Title homepage — keyword dulu, brand di belakang */
    homeTitle: "Aplikasi Manajemen Kos & Kontrakan — Tagihan, Portal Penyewa, QRIS",
    /** Default title halaman lain */
    defaultTitle: "Aplikasi Manajemen Kos & Kontrakan Indonesia",
    titleTemplate: "%s | KosKit",
  },
  social: {
    instagram: "https://instagram.com/koskit.id",
    tiktok: "https://tiktok.com/@koskit.id",
    twitter: "https://x.com/koskit_id",
  },
  contactEmail: process.env.CONTACT_EMAIL ?? "halo@koskit.id",
  /** Nomor WA admin tanpa + (untuk wa.me) */
  supportWhatsApp: process.env.SUPPORT_WHATSAPP ?? "6287863520135",
} as const;

export function supportWhatsAppUrl(message?: string): string {
  const text = message ?? `Halo ${site.name}, saya mau tanya tentang aplikasi manajemen kos.`;
  return `https://wa.me/${site.supportWhatsApp}?text=${encodeURIComponent(text)}`;
}