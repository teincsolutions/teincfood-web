import { redirect } from "next/navigation";

/**
 * The download hub moved to the top-level /download page so it can cover the
 * desktop and mobile apps together. Keep the old URL working.
 */
export default async function DesktopDownloadsRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/download`);
}
