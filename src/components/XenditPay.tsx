"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function XenditPay({
  paymentId,
  isSimulated,
  amount,
}: {
  paymentId: string;
  isSimulated: boolean;
  amount: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    setError("");
    setLoading(true);

    if (isSimulated) {
      router.push(`/bayar/${paymentId}?success=1`);
      return;
    }

    try {
      const res = await fetch("/api/xendit/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal membuat pembayaran");

      if (data.isSimulated || !data.invoiceUrl) {
        router.push(`/bayar/${paymentId}?success=1`);
        return;
      }

      window.location.href = data.invoiceUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
      setLoading(false);
    }
  }

  return (
    <div>
      <Button className="mt-4 w-full" onClick={handlePay} disabled={loading}>
        <CreditCard className="h-4 w-4" />
        {loading
          ? "Memproses..."
          : isSimulated
            ? `Bayar ${(amount / 1000).toFixed(0)}rb (Mode Demo)`
            : "Bayar via Xendit"}
      </Button>
      {isSimulated && (
        <p className="mt-2 text-center text-xs text-[var(--muted)]">
          Isi Secret API Key Xendit di Pengaturan untuk pembayaran asli
        </p>
      )}
      {error && (
        <p className="mt-2 text-center text-xs font-medium text-[var(--danger)]">{error}</p>
      )}
    </div>
  );
}