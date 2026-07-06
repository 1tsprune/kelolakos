"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "./ui/Button";

export function BulkWhatsAppButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function send() {
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/whatsapp/bulk", { method: "POST" });
    const data = await res.json();
    setResult(
      data.simulated
        ? `${data.sent} reminder disimulasikan — set API key Fonnte di Pengaturan`
        : `${data.sent} reminder terkirim via WhatsApp`,
    );
    setLoading(false);
  }

  return (
    <div>
      <Button variant="whatsapp" onClick={send} disabled={loading} size="sm">
        <MessageCircle className="h-4 w-4" />
        {loading ? "Mengirim..." : "Reminder Semua"}
      </Button>
      {result && (
        <p className="mt-2 max-w-xs text-xs font-medium text-[var(--muted)]">{result}</p>
      )}
    </div>
  );
}