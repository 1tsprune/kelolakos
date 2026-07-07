import type { Metadata } from "next";
import { site } from "./site";

type PageMetaInput = {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
};

export function buildMetadata(overrides?: Partial<Metadata>): Metadata {
  const title = site.seo.homeTitle;
  const fullTitle = `${title} | ${site.name}`;

  return {
    metadataBase: new URL(site.url),
    title: {
      default: fullTitle,
      template: site.seo.titleTemplate,
    },
    description: site.description,
    keywords: [...site.keywords],
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    applicationName: site.name,
    category: "Business",
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
      title: fullTitle,
      description: site.description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: site.description,
      creator: "@koskit_id",
    },
    ...overrides,
  };
}

export function buildPageMetadata({
  title,
  description = site.description,
  path = "",
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = `${site.url}${path}`;
  const fullTitle = `${title} | ${site.name}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: site.locale,
      url,
      siteName: site.name,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    alternateName: ["Kos Kit", "aplikasi manajemen kos KosKit"],
    url: site.url,
    logo: `${site.url}/brand/icon.svg`,
    description: site.description,
    email: site.contactEmail,
    sameAs: [site.social.instagram, site.social.tiktok, site.social.twitter],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: site.contactEmail,
      availableLanguage: ["Indonesian", "English"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    alternateName: site.seo.defaultTitle,
    url: site.url,
    description: site.description,
    inLanguage: ["id", "en"],
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    alternateName: "Aplikasi Manajemen Kos & Kontrakan",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Property Management",
    operatingSystem: "Web",
    description: site.description,
    url: site.url,
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR",
        description: "Paket Gratis — 1 properti, 3 kamar",
      },
      {
        "@type": "Offer",
        price: "199000",
        priceCurrency: "IDR",
        description: "Paket Pro — 5 properti, 50 kamar",
      },
    ],
    featureList: [
      "Tagihan otomatis bulanan",
      "Portal penyewa self-service",
      "Pembayaran QRIS Xendit",
      "Reminder WhatsApp",
      "Laporan PDF & CSV",
      "Multi properti",
    ],
    audience: {
      "@type": "Audience",
      audienceType: "Pemilik kos dan pengelola kontrakan di Indonesia",
    },
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

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function webPageJsonLd({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${site.url}${path}`,
    isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
    about: {
      "@type": "SoftwareApplication",
      name: site.name,
      applicationCategory: "BusinessApplication",
    },
    inLanguage: "id",
  };
}