# Deploy KelolaKos — Checklist Production

## 1. Environment variables

Copy `.env.example` → `.env` di server/hosting:

| Variable | Wajib | Keterangan |
|----------|-------|------------|
| `AUTH_SECRET` | ✅ | `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | `https://kelolakos.id` |
| `NEXT_PUBLIC_APP_URL` | ✅ | Sama dengan SITE_URL |
| `RESEND_API_KEY` | ✅* | Forgot password & welcome email |
| `EMAIL_FROM` | ✅* | Verified domain di Resend |

\* Wajib untuk fitur email production.

## 2. Hosting (Vercel / VPS)

```bash
npm run build
npm run start
```

**Vercel:** connect repo GitHub → set env vars → deploy.

**Catatan storage:** v0.1 memakai `data/koskit.json`. Di Vercel (serverless) file system **tidak persisten** — wajib migrasi ke PostgreSQL sebelum production serius. Lihat `supabase/schema.sql`.

## 3. Domain & HTTPS

- Arahkan DNS ke hosting
- Pastikan HTTPS aktif
- Isi **URL Aplikasi** di Pengaturan dashboard setelah deploy

## 4. Midtrans production

1. Verifikasi merchant Midtrans
2. Set webhook: `https://domain-kamu.id/api/midtrans/webhook`
3. Isi Server Key & Client Key di Pengaturan
4. Centang Mode Production setelah sandbox lolos tes

## 5. WhatsApp (Fonnte)

1. Daftar Fonnte, hubungkan nomor bisnis
2. Paste API token di Pengaturan
3. Tes koneksi

## 6. Email (Resend)

1. Verifikasi domain `kelolakos.id`
2. Set `EMAIL_FROM=KelolaKos <noreply@kelolakos.id>`
3. Tes forgot password di `/lupa-password`

## 7. Keamanan

- [ ] `AUTH_SECRET` unik & panjang
- [ ] `.env` tidak di-commit
- [ ] Rate limit aktif (login/register)
- [ ] Review `middleware.ts` security headers

## 8. Monitoring (opsional)

Tambahkan Sentry:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Set `SENTRY_DSN` di environment.

## 9. Backup

- Backup `data/koskit.json` & `data/users.json` harian (sampai migrasi Postgres)
- Setelah Postgres: enable automated backup di Supabase

## 10. Post-deploy smoke test

- [ ] Landing `/` — toggle ID/EN
- [ ] Register akun baru → email welcome
- [ ] Onboarding `/mulai`
- [ ] Generate tagihan + PDF laporan
- [ ] Portal penyewa `/portal/[token]`
- [ ] Webhook Midtrans (sandbox dulu)