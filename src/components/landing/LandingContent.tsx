"use client";

import Link from "next/link";
import { ArrowRight, Check, ChevronDown, ChevronRight, Clock, MessageCircle, Mail, Star, X } from "lucide-react";
import { SupportWhatsAppFab } from "@/components/SupportWhatsAppFab";
import { CityMarquee } from "@/components/landing/CityMarquee";
import { DashboardMockup } from "@/components/landing/DashboardMockup";
import { FAQ } from "@/components/landing/FAQ";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { FeatureScrollStory } from "@/components/landing/FeatureScrollStory";
import { LanguageToggle } from "@/components/landing/LanguageToggle";
import { useLandingLocale } from "@/components/landing/LocaleProvider";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { WorkflowStepVisual } from "@/components/landing/WorkflowStepVisual";
import { faqJsonLd, organizationJsonLd, softwareApplicationJsonLd, websiteJsonLd } from "@/lib/seo";
import { site, supportWhatsAppUrl } from "@/lib/site";

function formatPrice(price: number): string {
  if (price === 0) return "Rp 0";
  return `Rp${(price / 1000).toFixed(0)}rb`;
}

export function LandingContent() {
  const { t } = useLandingLocale();
  const jsonLd = [
    organizationJsonLd(),
    websiteJsonLd(),
    softwareApplicationJsonLd(),
    faqJsonLd(t.faq.items.map((item) => ({ question: item.q, answer: item.a }))),
  ];

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="sticky top-0 z-50 border-b border-[var(--border)]/80 bg-[var(--paper)]/92 backdrop-blur-lg">
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--ink)] shadow-sm">
              <span className="font-display text-sm font-black text-[var(--accent)]">{site.logoLetter}</span>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-[var(--ink)]">{site.name}</span>
              <p className="text-[10px] font-medium text-[var(--muted)]">{t.tagline}</p>
            </div>
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            <a href="#fitur" className="text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]">{t.nav.features}</a>
            <a href="#cara-kerja" className="text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]">{t.nav.howItWorks}</a>
            <a href="#harga" className="text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]">{t.nav.pricing}</a>
            <a href="#faq" className="text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]">{t.nav.faq}</a>
            <a href="#bantuan" className="text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]">{t.nav.support}</a>
          </div>
          <div className="flex items-center gap-2.5">
            <LanguageToggle />
            <Link href="/masuk" className="hidden px-3 py-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)] sm:block">{t.nav.login}</Link>
            <Link href="/daftar" className="pulse-ring rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-white hover:bg-[var(--accent-hover)]">
              {t.nav.tryFree}
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden grain">
        <div className="absolute inset-0 bg-[var(--ink)]" />
        <div className="hero-grid absolute inset-0" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(29,93,168,0.14),transparent)]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              {t.hero.badge}
            </span>
            <h1 className="font-display text-[2.75rem] font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.1rem]">
              {t.hero.titleBefore}{" "}
              <span className="text-shimmer italic">{t.hero.titleEmphasis}</span>
              {t.hero.titleAfter}
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/55">{t.hero.subtitle}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/daftar" className="group inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[var(--accent)]/25 transition-transform hover:scale-[1.02] hover:bg-[var(--accent-hover)]">
                {t.hero.ctaPrimary} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a href="#fitur" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10">
                {t.hero.ctaSecondary} <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/40">
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[var(--success)]" /> {t.hero.noCard}</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[var(--success)]" /> {t.hero.sampleData}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {t.hero.demo}</span>
            </div>

            <div className="mt-8 grid max-w-md grid-cols-3 gap-3 border-t border-white/10 pt-6">
              {t.hero.pills.map((pill) => (
                <div key={pill.label}>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-white/35">{pill.label}</p>
                  <p className="text-sm font-bold text-white">{pill.value}</p>
                </div>
              ))}
            </div>
          </div>

          <DashboardMockup />
        </div>

        <a
          href="#masalah"
          className="relative mx-auto mb-8 flex flex-col items-center gap-1 text-white/30 transition-colors hover:text-white/50"
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest">{t.hero.scrollHint}</span>
          <ChevronDown className="h-5 w-5 animate-scroll-hint" />
        </a>
      </section>

      <CityMarquee />

      <section id="masalah" className="border-b border-[var(--border)] bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold text-[var(--ink)]">{t.problems.title}</h2>
              <p className="mx-auto mt-3 max-w-lg text-[var(--muted)]">{t.problems.subtitle}</p>
            </div>
          </ScrollReveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {t.problems.items.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 80}>
                <div className="bento-card h-full p-6">
                  <span className="font-display text-3xl font-black text-[var(--accent)]/20">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 text-lg font-bold text-[var(--ink)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-[var(--ink)] sm:text-4xl">{t.comparison.title}</h2>
            <p className="mx-auto mt-3 max-w-lg text-[var(--muted)]">{t.comparison.subtitle}</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={120}>
          <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm">
            <div className="grid grid-cols-[1fr_100px_100px] border-b border-[var(--border)] bg-[var(--paper)] px-6 py-4 text-sm font-bold sm:grid-cols-[1fr_120px_120px]">
              <span>{t.comparison.featureCol}</span>
              <span className="text-center text-[var(--muted)]">{t.comparison.excelCol}</span>
              <span className="text-center text-[var(--accent)]">{site.name}</span>
            </div>
            {t.comparison.rows.map((row) => (
              <div key={row.feature} className="grid grid-cols-[1fr_100px_100px] items-center border-b border-[var(--border)] px-6 py-3.5 last:border-0 sm:grid-cols-[1fr_120px_120px]">
                <span className="text-sm font-medium text-[var(--ink)]">{row.feature}</span>
                <div className="flex justify-center">
                  {row.excel === false ? <X className="h-4 w-4 text-red-400" /> : <span className="text-xs text-[var(--muted)]">{t.comparison.manual}</span>}
                </div>
                <div className="flex justify-center">
                  <Check className="h-4 w-4 text-[var(--success)]" />
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <FeatureGrid />

      <section className="bg-[var(--ink)] py-14">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{t.midCta.title}</h2>
            <p className="mt-3 text-white/55">{t.midCta.subtitle}</p>
            <Link
              href="/daftar"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[var(--accent)]/30 transition-transform hover:scale-[1.02]"
            >
              {t.midCta.button} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <section id="fitur" className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <FeatureScrollStory />
        </div>
      </section>

      <section id="cara-kerja" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold text-[var(--ink)]">{t.workflow.title}</h2>
              <p className="mt-2 text-[var(--muted)]">{t.workflow.subtitle}</p>
            </div>
          </ScrollReveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {t.workflow.steps.map((w, i) => (
              <ScrollReveal key={w.step} delay={i * 100}>
                <div className="bento-card relative h-full overflow-hidden p-7">
                  <span className="font-display text-6xl font-black text-[var(--paper-dark)]">{w.step}</span>
                  <h3 className="mt-2 text-lg font-bold text-[var(--ink)]">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{w.desc}</p>
                  <WorkflowStepVisual type={w.visual} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <h2 className="font-display text-center text-3xl font-bold text-[var(--ink)]">{t.testimonials.title}</h2>
          </ScrollReveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {t.testimonials.items.map((item, i) => (
              <ScrollReveal key={item.name} delay={i * 80}>
                <div className="bento-card h-full p-6">
                  {item.stars ? (
                    <div className="mb-3 flex gap-0.5">
                      {Array.from({ length: item.stars }).map((_, starIdx) => (
                        <Star key={starIdx} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  ) : null}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ink)] text-xs font-bold text-[var(--accent)]">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-[var(--ink)]">{item.name}</p>
                      <p className="text-xs text-[var(--muted)]">{item.role}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--muted)]">&ldquo;{item.text}&rdquo;</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="harga" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold text-[var(--ink)]">{t.pricing.title}</h2>
              <p className="mt-2 text-[var(--muted)]">{t.pricing.subtitle}</p>
            </div>
          </ScrollReveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {t.pricing.plans.map((plan, i) => (
              <ScrollReveal key={plan.name} delay={i * 80}>
                <div
                  className={`relative flex h-full flex-col rounded-2xl p-6 transition-transform hover:scale-[1.02] ${
                    plan.pop
                      ? "bg-[var(--ink)] text-white ring-2 ring-[var(--accent)] shadow-xl shadow-[var(--ink)]/20"
                      : plan.accent
                        ? "border-2 border-amber-300 bg-amber-50/50"
                        : "bento-card"
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 left-4 rounded-full bg-amber-500 px-3 py-0.5 text-[10px] font-bold text-white">
                      {plan.badge}
                    </span>
                  )}
                  {plan.pop && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent)] px-4 py-1 text-xs font-bold text-white">
                      {t.pricing.popular}
                    </span>
                  )}
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <p className={`mt-1 text-sm ${plan.pop ? "text-white/50" : "text-[var(--muted)]"}`}>{plan.desc}</p>
                  <div className="mt-4">
                    <span className="font-display text-3xl font-bold">{formatPrice(plan.price)}</span>
                    {plan.price === 0 ? (
                      <span className={`ml-1 text-sm ${plan.pop ? "text-white/50" : "text-[var(--muted)]"}`}>
                        {plan.priceNote ?? t.pricing.freeForever}
                      </span>
                    ) : (
                      <span className={plan.pop ? "text-white/50" : "text-[var(--muted)]"}>{t.pricing.perMonth}</span>
                    )}
                  </div>
                  <ul className="mt-5 flex-1 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs leading-relaxed">
                        <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${plan.pop ? "text-[var(--accent)]" : "text-[var(--teal)]"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/daftar"
                    className={`mt-6 block rounded-xl py-3 text-center text-sm font-bold transition-colors ${
                      plan.pop
                        ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
                        : plan.accent
                          ? "bg-amber-500 text-white hover:bg-amber-600"
                          : "border border-[var(--border)] hover:bg-[var(--paper)]"
                    }`}
                  >
                    {plan.price === 0 ? t.pricing.ctaFree : t.pricing.cta}
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="bantuan" className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6">
          <ScrollReveal>
            <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--paper)] p-8 text-center md:p-12">
              <h2 className="font-display text-3xl font-bold text-[var(--ink)]">{t.support.title}</h2>
              <p className="mx-auto mt-3 max-w-lg text-[var(--muted)]">{t.support.subtitle}</p>
              <a
                href={supportWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#25D366]/25 transition-transform hover:scale-[1.02]"
              >
                <MessageCircle className="h-5 w-5" />
                {t.support.waCta}
              </a>
              <p className="mt-3 text-xs text-[var(--muted)]">{t.support.waNote}</p>
              <div className="mt-8 flex flex-col items-center gap-2 border-t border-[var(--border)] pt-6">
                <p className="text-sm text-[var(--muted)]">{t.support.emailLabel}</p>
                <a href={`mailto:${site.contactEmail}`} className="inline-flex items-center gap-2 font-semibold text-[var(--accent)] hover:underline">
                  <Mail className="h-4 w-4" />
                  {site.contactEmail}
                </a>
                <p className="text-xs text-[var(--muted)]">{t.support.responseNote}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="faq" className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <ScrollReveal>
            <h2 className="font-display text-center text-3xl font-bold text-[var(--ink)]">{t.faq.title}</h2>
          </ScrollReveal>
          <ScrollReveal delay={80}>
            <div className="mt-10"><FAQ /></div>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--ink)] py-24 grain">
        <div className="hero-orb hero-orb-1 opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(29,93,168,0.12),transparent_70%)]" />
        <ScrollReveal>
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">{t.cta.title}</h2>
            <p className="mt-4 text-white/55">{t.cta.subtitle}</p>
            <Link href="/daftar" className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[var(--accent)]/30 transition-transform hover:scale-[1.03] hover:bg-[var(--accent-hover)]">
              {t.cta.button} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <footer className="border-t border-[var(--border)] bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--ink)]">
                <span className="font-display text-xs font-black text-[var(--accent)]">{site.logoLetter}</span>
              </div>
              <div>
                <span className="font-extrabold text-[var(--ink)]">{site.name}</span>
                <p className="text-[10px] text-[var(--muted)]">{t.tagline}</p>
              </div>
            </div>
            <p className="text-sm text-[var(--muted)]">© 2026 {site.name}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-[var(--muted)] md:gap-6">
              <Link href="/aplikasi-manajemen-kos" className="hover:text-[var(--ink)]">Aplikasi Manajemen Kos</Link>
              <Link href="/kebijakan-privasi" className="hover:text-[var(--ink)]">Privasi</Link>
              <Link href="/syarat-ketentuan" className="hover:text-[var(--ink)]">Syarat</Link>
              <Link href="/masuk" className="hover:text-[var(--ink)]">{t.footer.login}</Link>
              <Link href="/daftar" className="hover:text-[var(--ink)]">{t.footer.register}</Link>
            </div>
          </div>
        </div>
      </footer>

      <SupportWhatsAppFab />
    </div>
  );
}