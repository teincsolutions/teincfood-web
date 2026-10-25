import { useTranslations } from "next-intl";
import type { ScreenDef } from "@/config/screens";
import { cn } from "@/lib/utils";

export function PlaceholderScreen({
  screen,
  className,
}: {
  screen: ScreenDef;
  className?: string;
}) {
  const t = useTranslations("showcase");

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[linear-gradient(145deg,#fff9f4_0%,#f5f7fb_55%,#fff1e7_100%)] p-4 text-center",
        className,
      )}
    >
      <div className="absolute -right-10 -top-10 size-32 rounded-full bg-orange/10" aria-hidden="true" />
      <div className="absolute -bottom-12 -left-12 size-40 rounded-full bg-navy/5" aria-hidden="true" />
      <svg
        viewBox="0 0 48 48"
        className="relative mb-3 size-10 text-orange sm:size-12"
        fill="none"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="42" height="42" rx="14" fill="currentColor" />
        <path d="M14 17h20M18 17v15m12-15v15M15 32h18" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <p className="relative max-w-full text-xs font-bold text-navy sm:text-sm">
        {t(`screens.${screen.labelKey}`)}
      </p>
      <p className="relative mt-1 text-[10px] font-medium text-navy/50 sm:text-xs">
        {t("controls.placeholder")}
      </p>
    </div>
  );
}
