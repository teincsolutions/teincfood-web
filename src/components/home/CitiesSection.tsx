import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";

const cities = ["Accra", "Kumasi", "Takoradi", "Tamale", "Cape Coast", "Tema"];

export function CitiesSection() {
  const t = useTranslations("home.cities");

  return (
    <Section className="bg-surface">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <SectionHeading
          title={t("title")}
          subtitle={t("coming")}
          align="left"
        />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {cities.map((city) => (
            <li
              key={city}
              className="flex min-h-16 items-center gap-2 rounded-xl border border-navy/10 bg-white px-4 text-sm font-semibold text-navy"
            >
              <MapPin className="size-4 text-orange-800" aria-hidden="true" />
              {city}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
