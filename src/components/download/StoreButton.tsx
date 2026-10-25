import { Apple, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type StoreKind = "apple" | "play";

export function StoreButton({
  kind,
  href,
  label,
  soonLabel,
  tone = "solid",
  className,
}: {
  kind: StoreKind;
  href?: string;
  label: string;
  soonLabel: string;
  tone?: "solid" | "light";
  className?: string;
}) {
  const Icon = kind === "apple" ? Apple : Play;
  const icon = (
    <Icon
      aria-hidden="true"
      className={cn("size-5", kind === "play" && "fill-current")}
    />
  );

  const base =
    "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl px-4 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

  if (!href) {
    return (
      <button
        type="button"
        disabled
        title={soonLabel}
        className={cn(
          base,
          "cursor-not-allowed",
          tone === "light"
            ? "border border-white/15 bg-white/5 text-white/45"
            : "border border-navy/10 bg-surface text-navy/40",
          className,
        )}
      >
        {icon}
        {soonLabel}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        base,
        tone === "light"
          ? "bg-[#ffffff] text-[#1e1e2e] hover:bg-[#f2f2f2] focus-visible:outline-white"
          : "bg-navy text-white hover:bg-navy-deep focus-visible:outline-navy",
        className,
      )}
    >
      {icon}
      {label}
    </a>
  );
}
