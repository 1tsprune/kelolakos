import { LegalLayout } from "@/components/LegalLayout";
import { buildPageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Syarat & Ketentuan",
  description: `Syarat dan ketentuan penggunaan ${site.name} — aplikasi manajemen kos & kontrakan berbasis langganan untuk pemilik kos di Indonesia.`,
  path: "/syarat-ketentuan",
});

export default function SyaratKetentuanPage() {
  return (
    <LegalLayout title="Syarat & Ketentuan">
      <p>
        Dengan mendaftar dan menggunakan {site.name}, kamu menyetujui syarat berikut.
      </p>

      <h2 className="pt-4 text-lg font-bold">1. Layanan</h2>
      <p>{site.name} menyediakan software manajemen kos berbasis langganan (SaaS). Fitur dapat berubah seiring pengembangan produk.</p>

      <h2 className="pt-4 text-lg font-bold">2. Akun & tanggung jawab</h2>
      <p>Kamu bertanggung jawab atas keakuratan data yang dimasukkan dan menjaga kerahasiaan password. Aktivitas di akun kamu dianggap dilakukan oleh kamu.</p>

      <h2 className="pt-4 text-lg font-bold">3. Paket & langganan</h2>
      <p>Akun baru mendapat paket Gratis (1 properti, 3 kamar). 50 pendaftar pertama mendapat bonus Early Adopter (30 hari akses penuh). Untuk fitur dan kapasitas lebih besar, kamu bisa upgrade ke paket Pro atau Business.</p>

      <h2 className="pt-4 text-lg font-bold">4. Integrasi pihak ketiga</h2>
      <p>Pembayaran (Xendit) dan WhatsApp (Fonnte) dikonfigurasi oleh kamu sendiri. Biaya dan ketentuan layanan pihak ketiga mengikuti kebijakan masing-masing provider.</p>

      <h2 className="pt-4 text-lg font-bold">5. Larangan</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Menggunakan layanan untuk aktivitas ilegal</li>
        <li>Mencoba mengakses data akun lain</li>
        <li>Menyalahgunakan API atau mengotomatisasi spam</li>
      </ul>

      <h2 className="pt-4 text-lg font-bold">6. Pembatasan tanggung jawab</h2>
      <p>Layanan diberikan &quot;sebagaimana adanya&quot;. Kami tidak bertanggung jawab atas kerugian tidak langsung akibat gangguan layanan atau kesalahan data yang dimasukkan pengguna.</p>

      <h2 className="pt-4 text-lg font-bold">7. Kontak</h2>
      <p>Hubungi kami di <a href={`mailto:${site.contactEmail}`} className="font-semibold text-[var(--accent)]">{site.contactEmail}</a></p>
    </LegalLayout>
  );
}