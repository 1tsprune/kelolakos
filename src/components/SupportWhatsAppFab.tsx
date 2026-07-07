"use client";

import { MessageCircle } from "lucide-react";
import { supportWhatsAppUrl } from "@/lib/site";

export function SupportWhatsAppFab({ label = "Chat Admin" }: { label?: string }) {
  return (
    <a
      href={supportWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-105 hover:bg-[#1fb855]"
      aria-label="Hubungi admin via WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}