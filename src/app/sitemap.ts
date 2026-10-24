import type { MetadataRoute } from "next";
import { locales } from "@/config/i18n";
import { siteConfig } from "@/config/site";

const staticRoutes = ["", "/order", "/business", "/business/fleet", "/rider", "/whatsapp", "/desktop", "/download", "/about", "/faq", "/contact", "/delete-account"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${siteConfig.url}/${locale}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteConfig.url}/${l}${route}`]),
        ),
      },
    })),
  );
}