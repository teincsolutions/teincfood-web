import { cn } from "@/lib/utils";
import { Apple, Play } from "lucide-react";
import { Link } from "@/i18n/routing";

export function StoreBadges({
  appStoreUrl,
  playStoreUrl,
  className,
  size = "md",
}: {
  appStoreUrl?: string;
  playStoreUrl?: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const badgeCls =
    size === "md"
      ? "px-5 py-2.5 text-sm gap-2.5"
      : "px-3.5 py-2 text-xs gap-1.5";

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {appStoreUrl && (
        <Link
          href={appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex min-h-[48px] items-center rounded-xl bg-navy text-white transition-colors hover:bg-navy-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy",
            badgeCls,
          )}
        >
          <Apple className="size-6" aria-hidden="true" />
          <span className="flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-wide opacity-80">
              Download on the
            </span>
            <span className="font-bold">App Store</span>
          </span>
        </Link>
      )}
      {playStoreUrl && (
        <Link
          href={playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex min-h-[48px] items-center rounded-xl bg-navy text-white transition-colors hover:bg-navy-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy",
            badgeCls,
          )}
        >
          <Play className="size-6 fill-current" aria-hidden="true" />
          <span className="flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-wide opacity-80">
              Get it on
            </span>
            <span className="font-bold">Google Play</span>
          </span>
        </Link>
      )}
    </div>
  );
}