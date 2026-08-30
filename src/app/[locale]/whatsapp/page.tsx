import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { MessageCircle, Search, MapPin, ShoppingBag, Bot } from "lucide-react";
import { WhatsAppChatMockup } from "@/components/showcase/WhatsAppChatMockup";
import { DeviceFrame } from "@/components/showcase/DeviceFrame";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { StepsSection } from "@/components/sections/StepsSection";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { InstallCta } from "@/components/home/InstallCta";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { localizeMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.whatsapp" });
  return localizeMetadata({
    locale,
    path: "/whatsapp",
    title: t("title"),
    description: t("description"),
    images: ["/icon.png"],
  });
}

export default async function WhatsAppPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "whatsapp.hero" });

  return (
    <>
      {/* Hero */}
      <Section className="bg-surface">
        <Container className="grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-2 lg:py-28">
          <div>
            <Badge>{t("eyebrow")}</Badge>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy/70">
              {t("subtitle")}
            </p>
            <div className="mt-8">
              <a
                href="https://wa.me/233503981913"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-[#128C7E]"
              >
                <MessageCircle className="size-5" />
                {t("cta")}
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <WhatsAppChatMockup screenKey="whatsapp:chat" priority className="w-56 sm:w-64" />
          </div>
        </Container>
      </Section>

      {/* Features */}
      <FeatureCards ns="whatsapp.features" icons={[Bot, Search, MapPin, ShoppingBag]} />

      {/* How it works */}
      <StepsSection ns="whatsapp.steps" />

      {/* AI Capabilities Showcase */}
      <Section className="bg-white">
        <Container>
          <SectionHeading
            title="What our AI can do for you"
            subtitle="Our AI assistant understands natural language and can help with a wide range of tasks."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-navy/5 bg-surface p-8">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-orange/10 text-orange">
                <Search className="size-6" />
              </div>
              <h3 className="text-lg font-extrabold text-navy">Find restaurants</h3>
              <p className="mt-2 leading-relaxed text-navy/60">
                Tell us what you crave and we&apos;ll find restaurants near you that serve it.
              </p>
            </div>
            <div className="rounded-3xl border border-navy/5 bg-surface p-8">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-orange/10 text-orange">
                <ShoppingBag className="size-6" />
              </div>
              <h3 className="text-lg font-extrabold text-navy">Place orders</h3>
              <p className="mt-2 leading-relaxed text-navy/60">
                Browse menus, customize your order, and checkout — all through chat.
              </p>
            </div>
            <div className="rounded-3xl border border-navy/5 bg-surface p-8">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-orange/10 text-orange">
                <MapPin className="size-6" />
              </div>
              <h3 className="text-lg font-extrabold text-navy">Track deliveries</h3>
              <p className="mt-2 leading-relaxed text-navy/60">
                Get real-time updates on your order status and delivery location.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Desktop Support Chat */}
      <Section className="bg-surface">
        <Container>
          <SectionHeading
            title="Support across all platforms"
            subtitle="Our AI assistant is available on WhatsApp, in our mobile app, and on the desktop business app."
          />
          <div className="mt-12 flex justify-center">
            <DeviceFrame screenKey="desktop:support" priority className="w-full max-w-2xl" />
          </div>
        </Container>
      </Section>

      <InstallCta />
    </>
  );
}
