"use client";

import { Building2, MapPin } from "lucide-react";
import { site } from "@/lib/site";

const cities = [
  "Bandung", "Jakarta", "Surabaya", "Depok", "Yogyakarta",
  "Semarang", "Malang", "Medan", "Makassar", "Bali",
];

const phrases = [
  (city: string) => `Pak Budi di ${city} kelola 24 kamar`,
  (city: string) => `Bu Siti di ${city} tinggalkan Excel`,
  (city: string) => `Pemilik kos ${city} — tagihan otomatis`,
  (city: string) => `${city}: reminder WA, bayar QRIS`,
];

function MarqueeGroup({ id }: { id: string }) {
  return (
    <div className="marquee-group flex shrink-0 items-center">
      {cities.map((city, i) => {
        const phrase = phrases[i % phrases.length](city);
        return (
          <span
            key={`${id}-${city}-${i}`}
            className="mx-8 inline-flex items-center gap-2.5 whitespace-nowrap text-sm font-semibold text-[var(--ink)]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-soft)]">
              {i % 2 === 0 ? (
                <Building2 className="h-3.5 w-3.5 text-[var(--accent)]" />
              ) : (
                <MapPin className="h-3.5 w-3.5 text-[var(--teal)]" />
              )}
            </span>
            {phrase}
            <span className="text-[var(--muted)]">·</span>
            <span className="text-[var(--accent)]">{site.name}</span>
          </span>
        );
      })}
    </div>
  );
}

export function CityMarquee() {
  return (
    <section className="marquee-shell relative overflow-hidden border-b border-[var(--border)] bg-white py-5">
      <div className="marquee-fade marquee-fade-left" />
      <div className="marquee-fade marquee-fade-right" />
      <div className="marquee-track flex w-max">
        <MarqueeGroup id="a" />
        <MarqueeGroup id="b" />
      </div>
    </section>
  );
}