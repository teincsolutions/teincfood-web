import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { locales } from "@/config/i18n";

export function pageUrl(locale: string, path = "") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}/${locale}${cleanPath === "/" ? "" : cleanPath}`;
}

export function localizeMetadata({
  title,
  description,
  path,
  locale,
  images,
}: {
  title: string;
  description: string;
  path: string;
  locale: string;
  images?: string[];
}): Metadata {
  const url = pageUrl(locale, path);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        locales.map((l) => [l, pageUrl(l, path)]),
      ),
    },
    openGraph: {
      title,
      description,
      url,
      images,
    },
  };
}