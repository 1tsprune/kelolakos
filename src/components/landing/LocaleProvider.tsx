"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getLandingCopy, LOCALE_STORAGE_KEY, type LandingCopy, type Locale } from "@/lib/i18n/landing";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: LandingCopy;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "id";
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === "en" ? "en" : "id";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(readStoredLocale());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale, ready]);

  const setLocale = (next: Locale) => setLocaleState(next);
  const t = getLandingCopy(locale);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLandingLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLandingLocale must be used within LocaleProvider");
  return ctx;
}