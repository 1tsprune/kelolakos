import { MessageCircle } from "lucide-react";

type WhatsAppButtonProps = {
  href: string;
  label?: string;
};

export function WhatsAppButton({
  href,
  label = "Kirim WA",
}: WhatsAppButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--teal)] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90"
    >
      <MessageCircle className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}