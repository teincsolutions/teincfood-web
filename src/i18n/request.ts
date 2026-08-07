import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/config/i18n";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested ?? "en";

  if (!(locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const messages = (await import(`../content/messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});