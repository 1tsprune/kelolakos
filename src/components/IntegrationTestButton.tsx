"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Loader2, Zap } from "lucide-react";

export function IntegrationTestButton({
  type,
  ownerPhone,
}: {
  type: "xendit" | "whatsapp";
  ownerPhone?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function handleTest() {
    setLoading(true);
    setResult(null);
    const url =
      type === "xendit"
        ? "/api/integrations/test-xendit"
        : "/api/integrations/test-whatsapp";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: ownerPhone }),
    });
    const data = await res.json();
    setResult({ ok: data.ok, message: data.message });
    setLoading(false);
  }

  return (
    <div>
      <Button type="button" variant="secondary" onClick={handleTest} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
        Tes Koneksi
      </Button>
      {result && (
        <p
          className={`mt-2 text-xs font-medium ${result.ok ? "text-[var(--success)]" : "text-[var(--danger)]"}`}
        >
          {result.message}
        </p>
      )}
    </div>
  );
}