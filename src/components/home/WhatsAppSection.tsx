import { MessageCircle, Search, MapPin, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { WhatsAppChatMockup } from "@/components/showcase/WhatsAppChatMockup";

export function WhatsAppSection() {
  const t = useTranslations("home.whatsapp");

  const features = [
    { icon: MessageCircle, title: t("item1.title"), description: t("item1.description") },
    { icon: Search, title: t("item2.title"), description: t("item2.description") },
    { icon: MapPin, title: t("item3.title"), description: t("item3.description") },
    { icon: ShoppingBag, title: t("item4.title"), description: t("item4.description") },
  ];

  return (
    <Section className="bg-white">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading title={t("title")} subtitle={t("subtitle")} align="left" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange/10 text-orange">
                  <feature.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-navy">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-navy/60">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/whatsapp"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#128C7E]"
            >
              <MessageCircle className="size-4" />
              {t("cta")}
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <WhatsAppChatMockup screenKey="whatsapp:chat" priority className="w-56 sm:w-64" />
        </div>
      </div>
    </Section>
  );
}
