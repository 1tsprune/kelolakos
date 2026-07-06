# KelolaKos

**Aplikasi manajemen kos & kontrakan Indonesia** — tagihan otomatis, portal penyewa, pembayaran QRIS, reminder WhatsApp, dan laporan keuangan dalam satu dashboard.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

---

## Tentang

**KelolaKos** membantu pemilik kos mengelola operasional harian tanpa spreadsheet: catat penyewa, generate tagihan bulanan, ingatkan lewat WhatsApp, terima bayar QRIS via Midtrans, dan export laporan PDF/CSV.

| | |
|---|---|
| **Nama produk** | KelolaKos |
| **Domain** | [kelolakos.id](https://kelolakos.id) |
| **Target user** | Pemilik kos, pengelola kost putra/putri, investor properti di Indonesia |
| **Model bisnis** | SaaS langganan bulanan (Starter / Pro / Business) |

Landing page tersedia dalam **Bahasa Indonesia** dan **English** (toggle ID/EN di navbar).

---

## Fitur utama

- **Multi-properti** — kelola banyak kos dari satu akun
- **Tagihan & pembayaran** — generate bulanan, status lunas/telat, denda
- **Portal penyewa** — link unik per penyewa, bayar QRIS sendiri
- **WhatsApp** — reminder massal via Fonnte atau mode manual wa.me
- **Midtrans Snap** — QRIS, GoPay, ShopeePay (BYOK — pemilik kos pakai akun sendiri)
- **Kalender** — jatuh tempo sewa, kontrak habis, utilitas
- **Keuangan** — pengeluaran, utilitas listrik/air, laporan PDF & CSV
- **Operasional** — tiket perbaikan, inventaris kamar, daftar tunggu, broadcast
- **Keamanan** — isolasi data per akun, rate limit login/register, webhook signature

---

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4
- **Auth:** JWT session (httpOnly cookie) + bcrypt
- **Storage:** JSON file (`data/koskit.json`) — lihat [Migrasi database](#migrasi-database-production)
- **PDF:** jsPDF + jspdf-autotable
- **Payments:** Midtrans Snap API
- **WhatsApp:** Fonnte API

---

## Mulai cepat

### Prasyarat

- Node.js 20+
- npm

### Instalasi

```bash
git clone https://github.com/YOUR_USERNAME/kelolakos.git
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

Buka [http://localhost:3000](http://localhost:3000)

**Akun demo** (auto-seed saat pertama jalan):

| Email | Password |
|-------|----------|
| `budi@kosmelati.id` | `password123` |

User baru dapat **trial 14 hari** otomatis saat registrasi.

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
│   ├── (app)/          # Dashboard & modul (auth required)
│   ├── api/            # API routes
│   ├── daftar/         # Registrasi
│   ├── masuk/          # Login
│   └── page.tsx        # Landing page
├── components/
│   └── landing/        # Landing + i18n (ID/EN)
├── lib/
│   ├── actions.ts      # Server actions
│   ├── auth.ts         # Session & users
│   ├── store.ts        # JSON database
│   ├── settings.ts     # Per-user settings
│   └── site.ts         # Branding & SEO
data/
├── koskit.json         # Database seed
└── users.json          # User accounts (auto-created)
```

---

## Konfigurasi

Semua integrasi bisnis dikonfigurasi lewat **Pengaturan** di dashboard — tanpa edit kode:

| Integrasi | Cara setup |
|-----------|------------|
| **URL aplikasi** | Domain production untuk link bayar & webhook |
| **Midtrans** | Server Key + Client Key + webhook URL |
| **WhatsApp** | API key Fonnte, atau mode manual wa.me |
| **Tagihan** | Tanggal jatuh tempo, denda, tarif listrik/air |

Variabel environment: lihat [.env.example](.env.example)

---

## Migrasi database (production)

Versi saat ini memakai **JSON file storage** — cocok untuk development dan demo.

Untuk production multi-tenant, migrasi ke **PostgreSQL (Supabase)** direkomendasikan. Schema awal tersedia di [`supabase/schema.sql`](supabase/schema.sql).

---

## Scripts

| Command | Keterangan |
|---------|------------|
| `npm run dev` | Development server |
| `npm run build` | Build production |
| `npm run start` | Jalankan build |
| `npm run lint` | ESLint |

---

## Roadmap

- [x] Landing page + Apple scroll + bilingual (ID/EN)
- [x] Multi-user SaaS + tenant isolation
- [x] Trial 14 hari + banner expiry
- [x] Laporan PDF polished
- [x] Forgot password + email (Resend)
- [x] Halaman legal (privasi & syarat)
- [ ] PostgreSQL / Supabase adapter
- [ ] Billing langganan Midtrans Subscription
- [ ] Staff roles & permissions
- [ ] Sentry error monitoring

---

## Lisensi

Proprietary — © 2026 KelolaKos. All rights reserved.

---

## Kontak

- Email: [halo@kelolakos.id](mailto:halo@kelolakos.id)
- Website: [kelolakos.id](https://kelolakos.id)