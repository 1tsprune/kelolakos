import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/aplikasi-manajemen-kos",
        "/masuk",
        "/daftar",
        "/kebijakan-privasi",
        "/syarat-ketentuan",
      ],
      disallow: [
        "/dashboard",
        "/api/",
        "/portal/",
        "/bayar/",
        "/mulai",
        "/pengaturan",
        "/properti",
        "/kamar",
        "/penyewa",
        "/pembayaran",
        "/laporan",
        "/analitik",
        "/broadcast",
        "/kalender",
        "/utilitas",
        "/pengeluaran",
        "/maintenance",
        "/inventaris",
        "/daftar-tunggu",
        "/notifikasi",
        "/dokumen",
        "/cari",
        "/lupa-password",
        "/reset-password",
        "/verifikasi-email",
      ],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}