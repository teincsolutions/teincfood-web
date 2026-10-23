import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { locales } from "@/config/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AppInstallBanner } from "@/components/install/AppInstallBanner";
import { ServiceWorker } from "@/components/install/ServiceWorker";
import { TelemetryMount } from "@/components/telemetry/TelemetryMount";
import { Toaster } from "@/components/ui/Toaster";
import { ChatWidget } from "@/components/chat/ChatWidget";

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

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <AppInstallBanner />
        <ServiceWorker />
        <TelemetryMount />
        <Toaster />
        <ChatWidget />
      </div>
    </NextIntlClientProvider>
  );
}
