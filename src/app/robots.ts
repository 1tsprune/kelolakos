import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/masuk", "/daftar"],
      disallow: [
        "/dashboard",
        "/api/",
        "/portal/",
        "/bayar/",
        "/mulai",
        "/pengaturan",
      ],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}