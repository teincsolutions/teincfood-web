"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
      <AlertTriangle size={48} className="text-orange" aria-hidden />
      <h1 className="text-2xl font-extrabold text-navy">{t("title")}</h1>
      <p className="text-navy/70">{t("description")}</p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex min-h-[48px] items-center rounded-full bg-orange px-6 font-bold text-white hover:bg-orange-700"
      >
        {t("retry")}
      </button>
    </main>
  );
}