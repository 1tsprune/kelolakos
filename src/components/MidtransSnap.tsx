"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";
function getSnapScriptUrl(isProduction: boolean) {
  const base = isProduction ? "https://app.midtrans.com" : "https://app.sandbox.midtrans.com";
  return `${base}/snap/snap.js`;
}

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}

function loadSnapScript(clientKey: string, isProduction: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.snap) {
      resolve();
      return;
    }
    const existing = document.querySelector('script[data-midtrans="snap"]');
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.src = getSnapScriptUrl(isProduction);
    script.setAttribute("data-client-key", clientKey);
    script.setAttribute("data-midtrans", "snap");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Gagal load Midtrans Snap"));
    document.body.appendChild(script);
  });
}

export function MidtransSnap({
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
      const res = await fetch("/api/midtrans/snap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal membuat pembayaran");

      if (data.isSimulated || !data.token) {
        router.push(`/bayar/${paymentId}?success=1`);
        return;
      }

      await loadSnapScript(data.clientKey, data.isProduction);
      window.snap?.pay(data.token, {
        onSuccess: () => {
          router.push(`/bayar/${paymentId}?done=1`);
          router.refresh();
        },
        onPending: () => {
          router.refresh();
        },
        onError: () => {
          setError("Pembayaran gagal. Coba lagi.");
          setLoading(false);
        },
        onClose: () => setLoading(false),
      });
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
            : "Bayar via Midtrans Snap"}
      </Button>
      {isSimulated && (
        <p className="mt-2 text-center text-xs text-[var(--muted)]">
          Isi Server Key & Client Key di Pengaturan untuk Midtrans asli
        </p>
      )}
      {error && <p className="mt-2 text-center text-xs font-medium text-[var(--danger)]">{error}</p>}
    </div>
  );
}