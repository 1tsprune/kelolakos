"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PrintDocButton({ content, filename, label }: { content: string; filename: string; label: string }) {
  function print() {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>${filename}</title><style>body{font-family:Georgia,serif;padding:40px;line-height:1.8;white-space:pre-wrap;font-size:14px}</style></head><body>${content}</body></html>`);
    w.document.close();
    w.print();
  }
  return (
    <Button variant="secondary" size="sm" className="mt-3" onClick={print}>
      <Printer className="h-3.5 w-3.5" /> {label}
    </Button>
  );
}