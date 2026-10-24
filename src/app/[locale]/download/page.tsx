import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
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

  return localizeMetadata({
    locale,
    path: "/download",
    title: "Download TeincFood — Desktop, Business and Buyer apps",
    description:
      "Download TeincFood Desktop for Windows, macOS and Linux, plus the TeincFood and TeincFood Business mobile apps. The page detects your computer and offers the right installer.",
    images: ["/icon.png"],
  });
}

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const release = await getLatestDesktopRelease();

  return <DownloadHub release={release} stores={storeLinks} />;
}
