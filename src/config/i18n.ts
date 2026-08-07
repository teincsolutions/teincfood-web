export const defaultLocale = "en";
export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const localePrefix = "always";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};