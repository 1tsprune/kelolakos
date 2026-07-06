"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

export function PortalLinkCopy({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}/portal/${token}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--teal-soft)] px-3 py-2 text-xs font-bold text-[var(--teal)] hover:bg-[var(--teal)] hover:text-white transition-colors"
    >
      <ExternalLink className="h-3.5 w-3.5" />
      {copied ? "Link disalin!" : "Portal Penyewa"}
    </button>
  );
}