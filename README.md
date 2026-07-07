# KosKit

**Toolkit manajemen kos & kontrakan Indonesia** — tagihan otomatis, portal penyewa, pembayaran QRIS, reminder WhatsApp, dan laporan keuangan dalam satu dashboard.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

---

## Tentang

**KosKit** membantu pemilik kos mengelola operasional harian tanpa spreadsheet: catat penyewa, generate tagihan bulanan, ingatkan lewat WhatsApp, terima bayar QRIS via Xendit, dan export laporan PDF/CSV.

| | |
|---|---|
| **Nama produk** | KosKit |
| **Domain** | `koskit.id` / set via `NEXT_PUBLIC_SITE_URL` |
| **Target user** | Pemilik kos, pengelola kost putra/putri, investor properti di Indonesia |
| **Model bisnis** | SaaS langganan bulanan (Gratis / Pro / Business) |

Landing page tersedia dalam **Bahasa Indonesia** dan **English** (toggle ID/EN di navbar).

> **Brand:** KosKit — deploy ke `koskit.id` atau domain kamu (`NEXT_PUBLIC_SITE_URL`).

---

## Fitur utama

- **Multi-properti** — kelola banyak kos dari satu akun
- **Tagihan & pembayaran** — generate bulanan, status lunas/telat, denda otomatis
- **Portal penyewa** — link unik per penyewa (per kamar), cek tagihan & bayar QRIS sendiri
- **WhatsApp otomatis** — kirim link portal saat penyewa baru, reminder H-X & notifikasi jatuh tempo via Fonnte
- **Xendit Invoice** — QRIS, e-wallet, transfer bank (BYOK — pemilik kos pakai akun sendiri)
- **Kalender** — jatuh tempo sewa, kontrak habis, utilitas
- **Keuangan** — pengeluaran, utilitas listrik/air, laporan PDF & CSV
- **Operasional** — tiket perbaikan, inventaris kamar, daftar tunggu, broadcast
- **Keamanan** — isolasi data per akun, CSRF, rate limit login/register, verifikasi email
- **SEO** — halaman `/aplikasi-manajemen-kos`, sitemap, structured data (JSON-LD)

---

## Paket langganan

| Paket | Properti | Kamar | Harga |
|-------|----------|-------|-------|
| **Gratis** | 1 | 3 | Rp 0 |
| **Early Adopter** | 5 | 50 | 30 hari trial (50 slot pertama) |
| **Pro** | 5 | 50 | Rp 199rb/bulan |
| **Business** | ∞ | ∞ | Rp 399rb/bulan |

---

## Portal penyewa

Setiap penyewa punya **link unik** — bukan login, bukan berdasarkan nama.

```
https://koskit.id/portal/portal_tenant_andi_xxxxx
```

- Satu orang di 2 kos = 2 link berbeda (terikat kamar + token)
- Salin link: **Penyewa → detail penyewa → Portal Penyewa**
- Otomatis dikirim via WA saat penyewa baru ditambah (jika reminder otomatis aktif)

---

## Reminder & tagihan otomatis

Aktifkan di **Pengaturan** → *"Aktifkan otomatis: generate tagihan, kirim portal & reminder WA"*.

| Kapan | Apa yang terjadi |
|-------|------------------|
| Penyewa baru | WA selamat datang + link portal |
| Setiap hari (cron) | Generate tagihan bulan berjalan (jika belum ada) |
| H-X sebelum jatuh tempo | Reminder WA + link portal & bayar |
| Hari jatuh tempo | Notifikasi tagihan WA + link portal & bayar |

**Syarat kirim otomatis:** Fonnte API key terhubung (bukan mode manual).  
**Cron production:** set `CRON_SECRET` → `GET /api/cron/reminders` (Vercel: jam 07:00 via `vercel.json`).

---

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4
- **Auth:** JWT session (httpOnly cookie) + bcrypt + Google OAuth
- **Storage:** Supabase PostgreSQL (production) atau JSON file (development)
- **PDF:** jsPDF + jspdf-autotable
- **Payments:** Xendit Invoice API
- **WhatsApp:** Fonnte API
- **Email:** Resend (verifikasi, forgot password, welcome)

---

## Mulai cepat

### Prasyarat

- Node.js 20+
- npm

### Instalasi

```bash
git clone https://github.com/1tsprune/kelolakos.git
cd kelolakos
npm install
cp .env.example .env
```

Edit `.env` — minimal set `AUTH_SECRET` (string random 32+ karakter):

```bash
openssl rand -base64 32
```

### Development

```bash
npm run dev
```

Dev server bind ke `0.0.0.0` — akses dari HP di WiFi yang sama: `http://<IP-LAN>:3000`.  
Tambahkan IP LAN di `ALLOWED_DEV_ORIGINS` (lihat `next.config.ts`) jika konten tidak load di HP.

Buka [http://localhost:3000](http://localhost:3000)

**Akun demo** (auto-seed saat pertama jalan):

| Email | Password |
|-------|----------|
| `budi@kosmelati.id` | `password123` |

**Portal demo:** [http://localhost:3000/portal/portal_andi_demo](http://localhost:3000/portal/portal_andi_demo)

### Production

```bash
npm run build
npm run start
```

Lihat [docs/DEPLOY.md](docs/DEPLOY.md) untuk checklist deploy lengkap.

---

## Struktur proyek

```
src/
├── app/
│   ├── (app)/              # Dashboard & modul (auth required)
│   ├── api/
│   │   ├── xendit/         # Invoice + webhook pembayaran penyewa
│   │   ├── cron/           # Reminder & tagihan otomatis
│   │   └── subscription/   # Billing langganan SaaS
│   ├── aplikasi-manajemen-kos/  # Landing SEO
│   ├── portal/[token]/     # Portal penyewa (publik)
│   └── page.tsx            # Landing page
├── components/
│   └── landing/            # Landing + i18n (ID/EN)
├── lib/
│   ├── xendit.ts           # Xendit BYOK + billing
│   ├── reminder-scheduler.ts
│   ├── subscription.ts     # Limit paket
│   └── seo.ts              # Metadata & JSON-LD
data/
├── koskit.json             # Database seed (dev)
└── users.json              # User accounts (auto-created)
```

---

## Konfigurasi

Semua integrasi bisnis dikonfigurasi lewat **Pengaturan** di dashboard — tanpa edit kode:

| Integrasi | Cara setup |
|-----------|------------|
| **URL aplikasi** | Domain production untuk link portal, bayar & webhook |
| **Xendit** | Secret API Key + webhook token → `/api/xendit/webhook` |
| **WhatsApp** | API key Fonnte, atau mode manual wa.me |
| **Tagihan** | Tanggal jatuh tempo, reminder H-X, denda, tarif listrik/air |
| **Reminder otomatis** | Centang di Pengaturan + `CRON_SECRET` di production |

### Environment variables

| Variable | Wajib | Keterangan |
|----------|-------|------------|
| `AUTH_SECRET` | ✅ | Session JWT |
| `NEXT_PUBLIC_SITE_URL` | ✅ | URL publik (tanpa trailing slash) |
| `CRON_SECRET` | ✅* | Reminder otomatis (production) |
| `BILLING_XENDIT_SECRET_KEY` | ✅* | Billing upgrade paket SaaS |
| `BILLING_XENDIT_WEBHOOK_TOKEN` | ✅* | Webhook billing SaaS |
| `RESEND_API_KEY` | ✅* | Email verifikasi & forgot password |
| `GOOGLE_CLIENT_ID` / `SECRET` | opsional | Login dengan Google |
| `DATABASE_URL` | opsional | Postgres production |
| `ALLOWED_DEV_ORIGINS` | opsional | IP LAN untuk dev di HP |

Lihat [.env.example](.env.example) untuk daftar lengkap.

---

## Database (Supabase)

Set `DATABASE_URL` di `.env` → app otomatis pakai **PostgreSQL**. Tanpa itu, fallback ke `data/koskit.json` (dev lokal).

```bash
# 1. Jalankan supabase/schema.sql di SQL Editor Supabase
# 2. Set DATABASE_URL di .env
npm run db:migrate   # impor data dari koskit.json
```

---

## Scripts

| Command | Keterangan |
|---------|------------|
| `npm run dev` | Dev server (`0.0.0.0:3000`) |
| `npm run dev:local` | Dev server localhost saja |
| `npm run build` | Build production |
| `npm run start` | Jalankan build |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Impor JSON → Supabase Postgres |

---

## Roadmap

- [x] Landing page + scroll story + bilingual (ID/EN)
- [x] Multi-user SaaS + tenant isolation
- [x] Portal penyewa + link unik per kamar
- [x] Xendit Invoice (ganti Midtrans)
- [x] Reminder WA otomatis + link portal di pesan
- [x] SEO: keyword-first meta, `/aplikasi-manajemen-kos`, JSON-LD
- [x] Verifikasi email + Google OAuth
- [x] Billing langganan via Xendit (`BILLING_XENDIT_*`)
- [x] Limit properti/kamar per paket + Early Adopter
- [x] PostgreSQL / Supabase adapter
- [ ] Staff roles & permissions
- [ ] Sentry error monitoring

---

## Lisensi

Proprietary — © 2026 KosKit. All rights reserved.

---

## Kontak

- Email: [halo@koskit.id](mailto:halo@koskit.id)
- WhatsApp Admin: +62 878-6352-0135
- Website: [koskit.id](https://koskit.id)