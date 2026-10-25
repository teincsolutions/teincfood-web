"use client";

import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Languages } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/routing";
import { localeLabels, locales, type Locale } from "@/config/i18n";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");

  return (
    <label className={cn("relative inline-flex items-center", className)}>
      <span className="sr-only">{t("language")}</span>
      <Languages
        aria-hidden="true"
        className="pointer-events-none absolute left-3 size-4 text-navy/60"
      />
      <select
        value={locale}
        onChange={(event) => {
          router.replace(pathname, { locale: event.target.value as Locale });
        }}
        className="min-h-10 cursor-pointer appearance-none rounded-lg border border-navy/10 bg-transparent py-1.5 pl-9 pr-9 text-sm font-semibold text-navy outline-none transition-colors hover:bg-navy/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800 sm:min-h-11 sm:py-2"
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {localeLabels[item]}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 size-3.5 text-navy/50"
      />
    </label>
  );
}
