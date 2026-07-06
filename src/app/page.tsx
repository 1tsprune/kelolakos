import { LandingContent } from "@/components/landing/LandingContent";
import { LocaleProvider } from "@/components/landing/LocaleProvider";

export default function LandingPage() {
  return (
    <LocaleProvider>
      <LandingContent />
    </LocaleProvider>
  );
}