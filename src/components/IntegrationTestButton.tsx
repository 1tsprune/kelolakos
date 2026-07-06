"use client";

import { useState } from "react";
import { Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function IntegrationTestButton({
  type,
  ownerPhone,
}: {
  type: "midtrans" | "whatsapp";
  ownerPhone?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function runTest() {
    setLoading(true);
    setResult(null);
    const url =
      type === "midtrans"
        ? "/api/integrations/test-midtrans"
        : "/api/integrations/test-whatsapp";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(type === "whatsapp" ? { phone: ownerPhone } : {}),
    });
    const data = (await res.json()) as { ok: boolean; message: string };
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={runTest}
        disabled={loading}
        className="gap-2"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
        {loading ? "Mengecek..." : "Tes Koneksi"}
      </Button>
      {result && (
        <p
          className={`text-xs font-medium ${result.ok ? "text-[var(--success)]" : "text-[var(--danger)]"}`}
        >
          {result.message}
        </p>
      )}
      {type === "whatsapp" && ownerPhone && (
        <p className="text-[10px] text-[var(--muted)]">
          Tes WA akan dikirim ke nomor pemilik: {ownerPhone}
        </p>
      )}
    </div>
  );
}