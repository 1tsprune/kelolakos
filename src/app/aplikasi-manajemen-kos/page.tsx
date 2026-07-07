import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  faqJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { site, supportWhatsAppUrl } from "@/lib/site";

const PAGE_PATH = "/aplikasi-manajemen-kos";

export const metadata = buildPageMetadata({
  title: "Aplikasi Manajemen Kos & Kontrakan untuk Pemilik Kos Indonesia",
  description:
    "KosKit — aplikasi manajemen kos & kontrakan: catat penyewa, tagihan otomatis, portal penyewa, pembayaran QRIS, reminder WhatsApp, dan laporan PDF. Gratis 1 properti, 3 kamar.",
  path: PAGE_PATH,
});

const FEATURES = [
  {
    title: "Tagihan kos otomatis",
    desc: "Generate tagihan bulanan per kamar, atur jatuh tempo & denda, kirim link bayar ke penyewa.",
  },
  {
    title: "Portal penyewa",
    desc: "Tiap penyewa punya link unik untuk cek tagihan, riwayat bayar, dan bayar QRIS sendiri.",
  },
  {
    title: "Reminder WhatsApp",
    desc: "Ingatkan penyewa yang belum bayar lewat Fonnte atau mode manual wa.me — tinggal klik.",
  },
  {
    title: "Multi-properti",
    desc: "Kelola beberapa kos dari satu akun. Cocok untuk pemilik yang punya kost putra, putri, atau cabang.",
  },
  {
    title: "Laporan keuangan",
    desc: "Export PDF & CSV untuk laporan bulanan, pendapatan, dan pengeluaran operasional.",
  },
  {
    title: "Operasional lengkap",
    desc: "Kalender jatuh tempo, tiket perbaikan, inventaris kamar, daftar tunggu, dan broadcast.",
  },
];

const FAQ = [
  {
    q: "Apa aplikasi terbaik untuk kelola kos di Indonesia?",
    a: "KosKit dirancang khusus untuk pemilik kos & kontrakan di Indonesia — dengan tagihan otomatis, portal penyewa, QRIS, dan reminder WhatsApp dalam satu dashboard berbahasa Indonesia.",
  },
  {
    q: "Apakah ada versi gratis?",
    a: "Ada. Paket Gratis selamanya untuk 1 properti dan 3 kamar. 50 pendaftar pertama dapat bonus Early Adopter 30 hari dengan fitur seperti Pro.",
  },
  {
    q: "Bisa dipakai di HP?",
    a: "Bisa. KosKit berjalan di browser HP atau laptop — tidak perlu instal aplikasi dari Play Store.",
  },
  {
    q: "Bedanya dengan Excel?",
    a: "Excel mudah berantakan saat kamar bertambah. KosKit menyatukan penyewa, pembayaran, reminder, dan laporan — tanpa rumus manual.",
  },
];

export default function AplikasiManajemenKosPage() {
  const jsonLd = [
    webPageJsonLd({
      title: "Aplikasi Manajemen Kos & Kontrakan untuk Pemilik Kos Indonesia",
      description: site.description,
      path: PAGE_PATH,
    }),
    breadcrumbJsonLd([
      { name: "Beranda", path: "/" },
      { name: "Aplikasi Manajemen Kos", path: PAGE_PATH },
    ]),
    faqJsonLd(FAQ.map((item) => ({ question: item.q, answer: item.a }))),
  ];

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-[var(--ink)]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--ink)] text-xs font-black text-[var(--accent)]">
              {site.logoLetter}
            </span>
            {site.name}
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/masuk" className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)]">
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--accent-hover)]"
            >
              Coba Gratis
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--ink)]">Beranda</Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--ink)]">Aplikasi Manajemen Kos</span>
        </nav>

        <h1 className="mt-6 font-display text-3xl font-bold leading-tight text-[var(--ink)] sm:text-4xl">
          Aplikasi Manajemen Kos & Kontrakan untuk Pemilik Kos Indonesia
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
          <strong>{site.name}</strong> adalah software manajemen kos yang membantu kamu catat penyewa,
          generate tagihan bulanan, kirim reminder WhatsApp, dan terima pembayaran QRIS — tanpa spreadsheet
          yang makin ribet.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/daftar"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3.5 text-sm font-bold text-white hover:bg-[var(--accent-hover)]"
          >
            Mulai Gratis <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={supportWhatsAppUrl("Halo KosKit, saya mau tanya tentang aplikasi manajemen kos.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-6 py-3.5 text-sm font-bold text-[var(--ink)] hover:bg-[var(--paper)]"
          >
            Tanya via WhatsApp
          </a>
        </div>

        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
          <li className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[var(--success)]" /> Gratis 1 properti · 3 kamar</li>
          <li className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[var(--success)]" /> Tanpa kartu kredit</li>
          <li className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[var(--success)]" /> Bahasa Indonesia</li>
        </ul>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
            Fitur aplikasi kelola kos yang dibutuhkan pemilik
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="rounded-2xl border border-[var(--border)] bg-white p-5"
              >
                <h3 className="font-bold text-[var(--ink)]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-[var(--border)] bg-white p-8">
          <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
            Siapa yang cocok pakai KosKit?
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
            <li>• Pemilik kos putra / putri dengan 5–50 kamar</li>
            <li>• Pengelola kontrakan yang capek ngejar tagihan lewat chat</li>
            <li>• Investor properti yang punya beberapa lokasi kos</li>
            <li>• Pemilik kos yang mau penyewa bayar mandiri lewat QRIS</li>
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold text-[var(--ink)]">Pertanyaan umum</h2>
          <div className="mt-6 space-y-4">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-[var(--border)] bg-white px-5 py-4"
              >
                <summary className="cursor-pointer font-semibold text-[var(--ink)] marker:content-none">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl bg-[var(--ink)] p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-white">
            Siap kelola kos tanpa ribet?
          </h2>
          <p className="mt-3 text-white/60">
            Daftar gratis — langsung kelola 1 properti dan 3 kamar. Upgrade kapan saja.
          </p>
          <Link
            href="/daftar"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-4 text-base font-bold text-white hover:bg-[var(--accent-hover)]"
          >
            Coba KosKit Gratis <ArrowRight className="h-5 w-5" />
          </Link>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] bg-white py-8 text-center text-sm text-[var(--muted)]">
        <p>© 2026 {site.name} — {site.tagline}</p>
        <div className="mt-3 flex justify-center gap-4">
          <Link href="/" className="hover:text-[var(--ink)]">Beranda</Link>
          <Link href="/kebijakan-privasi" className="hover:text-[var(--ink)]">Privasi</Link>
          <Link href="/syarat-ketentuan" className="hover:text-[var(--ink)]">Syarat</Link>
        </div>
      </footer>
    </div>
  );
}