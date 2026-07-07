import { LandingContent } from "@/components/landing/LandingContent";
import { LocaleProvider } from "@/components/landing/LocaleProvider";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = buildMetadata({
  title: site.seo.homeTitle,
  description: site.description,
  alternates: { canonical: site.url },
  openGraph: {
    title: `${site.seo.homeTitle} | ${site.name}`,
    description: site.description,
    url: site.url,
  },
});

export default function LandingPage() {
  return (
    <LocaleProvider>
      <LandingContent />
    </LocaleProvider>
  );
}