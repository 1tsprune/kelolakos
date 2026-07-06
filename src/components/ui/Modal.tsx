"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--ink)]/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${widths[size]} rounded-2xl border border-[var(--border)] bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200`}>
        <div className="flex items-start justify-between border-b border-[var(--border)] px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--ink)]">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-[var(--muted)]">{description}</p>}
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-[var(--paper)] hover:text-[var(--ink)]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}