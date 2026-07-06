import { LegalLayout } from "@/components/LegalLayout";
import { site } from "@/lib/site";

export const metadata = {
  title: `Kebijakan Privasi — ${site.name}`,
};

export default function KebijakanPrivasiPage() {
  return (
    <LegalLayout title="Kebijakan Privasi">
      <p>
        {site.name} (&quot;kami&quot;) menghormati privasi pemilik kos dan penyewa yang menggunakan platform kami.
        Kebijakan ini menjelaskan data apa yang kami kumpulkan dan bagaimana kami menggunakannya.
      </p>

      <h2 className="pt-4 text-lg font-bold">1. Data yang dikumpulkan</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Data akun pemilik: nama, email, nomor telepon</li>
        <li>Data operasional kos: properti, kamar, penyewa, tagihan, pembayaran</li>
        <li>Data teknis: log akses, IP (untuk keamanan & rate limiting)</li>
      </ul>

      <h2 className="pt-4 text-lg font-bold">2. Penggunaan data</h2>
      <p>Data digunakan untuk menjalankan layanan manajemen kos, menghasilkan laporan, mengirim reminder, dan memproses pembayaran melalui integrasi pihak ketiga (Midtrans, Fonnte) yang kamu konfigurasi sendiri.</p>

      <h2 className="pt-4 text-lg font-bold">3. Isolasi data</h2>
      <p>Setiap akun pemilik kos terpisah. Data kamu tidak dibagikan ke pemilik kos lain. Kami tidak menjual data penyewa.</p>

      <h2 className="pt-4 text-lg font-bold">4. Keamanan</h2>
      <p>Password di-hash dengan bcrypt. Sesi menggunakan cookie httpOnly. Akses API dilindungi autentikasi dan isolasi tenant.</p>

      <h2 className="pt-4 text-lg font-bold">5. Hak kamu</h2>
      <p>Kamu dapat meminta penghapusan akun dan data dengan menghubungi {site.contactEmail}.</p>

      <h2 className="pt-4 text-lg font-bold">6. Kontak</h2>
      <p>Pertanyaan privasi: <a href={`mailto:${site.contactEmail}`} className="font-semibold text-[var(--accent)]">{site.contactEmail}</a></p>
    </LegalLayout>
  );
}