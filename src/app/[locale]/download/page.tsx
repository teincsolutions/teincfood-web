import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DownloadHub } from "@/components/download/DownloadHub";
import { storeLinks } from "@/config/site";
import { getLatestDesktopRelease } from "@/lib/downloads";
import { localizeMetadata } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.download" });

  return localizeMetadata({
    locale,
    path: "/download",
    title: t("title"),
    description: t("description"),
    images: ["/icon.png"],
  });
}

export default async function DownloadPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ app?: string }>;
}) {
  const { locale } = await params;
  const { app } = await searchParams;
  setRequestLocale(locale);

  const release = await getLatestDesktopRelease();
  const initialApp =
    app === "buyer" || app === "business" || app === "desktop"
      ? app
      : undefined;

  return (
    <DownloadHub
      release={release}
      stores={storeLinks}
      initialApp={initialApp}
    />
  );
}
