import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig } from "@/config/site";

const manrope = localFont({
  src: "../fonts/Manrope-VariableFont_wght.ttf",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Teinc Food — Order food, grow your business, or deliver",
    template: "%s | Teinc Food",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "food delivery",
    "order food",
    "restaurant partner",
    "delivery rider",
    "Teinc Food",
  ],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
    title: "Teinc Food — Order food, grow your business, or deliver",
    description: siteConfig.description,
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
    description: siteConfig.description,
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#FF7622",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
