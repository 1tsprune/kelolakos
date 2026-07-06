/** Satu file untuk branding & SEO — ganti nama di sini saja */
export const site = {
  name: "KelolaKos",
  /** Huruf untuk logo mark */
  logoLetter: "K",
  tagline: "Aplikasi Manajemen Kos & Kontrakan Indonesia",
  description:
    "Software manajemen kos Indonesia: tagihan otomatis, portal penyewa, pembayaran QRIS Midtrans, reminder WhatsApp, kontrak, inventaris, dan laporan PDF. Aman & multi-properti.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kelolakos.id",
  locale: "id_ID",
  keywords: [
    "aplikasi manajemen kos",
    "software kos",
    "aplikasi kost",
    "sistem informasi kos",
    "kelola kos online",
    "tagihan kos otomatis",
    "portal penyewa kos",
    "pembayaran kos QRIS",
    "reminder whatsapp kos",
    "aplikasi kontrakan",
    "manajemen kost putra putri",
  ],
  social: {
    instagram: "https://instagram.com/kelolakos",
    tiktok: "https://tiktok.com/@kelolakos",
    twitter: "https://x.com/kelolakos",
  },
  contactEmail: "halo@kelolakos.id",
} as const;