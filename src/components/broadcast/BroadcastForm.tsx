"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

const templates = [
  { label: "Pengumuman umum", text: "Halo semua penyewa,\n\nKami informasikan bahwa...\n\nTerima kasih.\n— Manajemen Kos" },
  { label: "Jadwal pembersihan", text: "Halo,\n\nBesok akan dilakukan pembersihan area umum pukul 08.00-10.00. Mohon barang pribadi di kamar tetap aman.\n\nTerima kasih." },
  { label: "Maintenance listrik", text: "Halo,\n\nAkan ada pemadaman listrik terjadwal untuk perawatan. Mohon persiapkan diri.\n\nTerima kasih." },
  { label: "Reminder tagihan", text: "Halo,\n\nMengingatkan tagihan sewa bulan ini jatuh tempo segera. Silakan bayar via portal penyewa atau hubungi admin.\n\nTerima kasih." },
];

export function BroadcastForm({
  tenantCount,
  action,
}: {
  tenantCount: number;
  action: (formData: FormData) => Promise<void>;
}) {
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-4">
      <form action={action} className="space-y-4">
        <Textarea
          label="Pesan Broadcast"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesan untuk semua penyewa..."
          required
          rows={6}
        />
        <Button type="submit" variant="whatsapp">Kirim ke {tenantCount} Penyewa</Button>
      </form>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Template — klik untuk isi</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {templates.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setMessage(t.text)}
              className="rounded-xl border border-[var(--border)] bg-[var(--paper)] p-3 text-left transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
            >
              <p className="text-xs font-bold text-[var(--ink)]">{t.label}</p>
              <p className="mt-1 line-clamp-2 text-[11px] text-[var(--muted)]">{t.text}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}