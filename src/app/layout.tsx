import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { getLocale, getTranslations } from "next-intl/server";
import "./globals.css";
import { siteConfig, storeLinks } from "@/config/site";

const manrope = localFont({
  src: "../fonts/Manrope-VariableFont_wght.ttf",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

function appleAppId(): string {
  const url = storeLinks.buyer.appStore;
  if (!url) return "";
  return url.match(/\/id(\d+)/)?.[1] ?? "";
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "meta.default" });
  const ogLocale = locale === "fr" ? "fr_FR" : "en_US";

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("title"),
      template: "%s | Teinc Food",
    },
    description: t("description"),
    applicationName: siteConfig.name,
    keywords: t("keywords").split(",").map((keyword) => keyword.trim()),
    icons: {
      icon: "/icon.png",
      apple: "/icon.png",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Teinc Food",
    },
    itunes: {
      appId: appleAppId(),
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: ogLocale,
      title: t("title"),
      description: t("description"),
      url: siteConfig.url,
      images: [
        {
          url: "/icon.png",
          width: 1200,
          height: 630,
          alt: "Teinc Food",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Teinc Food",
      description: t("description"),
      images: ["/icon.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#FF7622",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={manrope.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
