import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/sections/SectionHeading";

const cities = ["Accra", "Kumasi", "Takoradi", "Tamale", "Cape Coast", "Tema"];

export function CitiesSection() {
  const t = useTranslations("home.cities");

  return (
    <Section className="bg-surface">
      <SectionHeading title={t("title")} />
      <ul className="mt-10 flex flex-wrap justify-center gap-3">
        {cities.map((city) => (
          <li
            key={city}
            className="flex items-center gap-2 rounded-full border border-navy/10 bg-white px-5 py-2.5 text-sm font-semibold text-navy/80"
          >
            <MapPin className="size-4 text-orange-700" aria-hidden="true" />
            {city}
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center text-sm text-navy/50">{t("coming")}</p>
    </Section>
  );
}