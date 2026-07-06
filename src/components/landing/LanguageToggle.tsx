"use client";

import { useLandingLocale } from "@/components/landing/LocaleProvider";
import type { Locale } from "@/lib/i18n/landing";

const options: { value: Locale; label: string }[] = [
  { value: "id", label: "ID" },
  { value: "en", label: "EN" },
];

export function LanguageToggle() {
  const { locale, setLocale } = useLandingLocale();

  return (
    <div
      className="flex rounded-lg border border-[var(--border)] bg-[var(--paper)] p-0.5"
      role="group"
      aria-label="Language"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setLocale(opt.value)}
          className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
            locale === opt.value
              ? "bg-[var(--ink)] text-white"
              : "text-[var(--muted)] hover:text-[var(--ink)]"
          }`}
          aria-pressed={locale === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}