"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";
import { generatePaymentLinkAction } from "@/lib/actions";
import { Button } from "@/components/ui/Button";

export function PaymentLinkButton({ paymentId }: { paymentId: string }) {
  const [url, setUrl] = useState<string | null>(null);

  async function generate() {
    const link = await generatePaymentLinkAction(paymentId);
    setUrl(link.paymentUrl);
    await navigator.clipboard.writeText(link.paymentUrl);
  }

  return (
    <Button variant="secondary" size="sm" onClick={generate}>
      <Link2 className="h-3.5 w-3.5" />
      {url ? "Tersalin!" : "Link Bayar"}
    </Button>
  );
}