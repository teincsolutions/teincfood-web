import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales } from "@/config/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AppInstallBanner } from "@/components/install/AppInstallBanner";
import { ServiceWorker } from "@/components/install/ServiceWorker";
import { TelemetryMount } from "@/components/telemetry/TelemetryMount";
import { Toaster } from "@/components/ui/Toaster";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = (await import(`../../content/messages/${locale}.json`)).default;
  const nav = await getTranslations({ locale, namespace: "nav" });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:min-h-12 focus:items-center focus:rounded-lg focus:bg-navy focus:px-4 focus:text-sm focus:font-semibold focus:text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-orange"
        >
          {nav("skipToContent")}
        </a>
        <div className="flex min-h-screen flex-col">
          <AppInstallBanner />
          <Navbar />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <ServiceWorker />
          <TelemetryMount />
          <Toaster />
          <ChatWidget />
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
