import type { Metadata } from "next";
import { site } from "./site";

export function buildMetadata(overrides?: Partial<Metadata>): Metadata {
  const title = `${site.name} — ${site.tagline}`;
  return {
    metadataBase: new URL(site.url),
    title: {
      default: title,
      template: `%s · ${site.name}`,
    },
    description: site.description,
    keywords: [...site.keywords],
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    alternates: { canonical: site.url },
    openGraph: {
      type: "website",
      locale: site.locale,
      url: site.url,
      siteName: site.name,
      title,
      description: site.description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: site.description,
      creator: "@kelolakos",
    },
    ...overrides,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: site.description,
    url: site.url,
    offers: {
      "@type": "Offer",
      price: "99000",
      priceCurrency: "IDR",
      description: "Paket Starter manajemen kos",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "127",
    },
    featureList: [
      "Tagihan otomatis bulanan",
      "Portal penyewa self-service",
      "Pembayaran QRIS Midtrans",
      "Reminder WhatsApp",
      "Laporan PDF",
      "Multi properti",
    ],
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}