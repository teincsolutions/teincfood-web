import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "orange",
}: {
  children: ReactNode;
  className?: string;
  tone?: "orange" | "navy";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest",
        tone === "orange"
          ? "bg-orange/10 text-orange-700"
          : "bg-navy/10 text-navy",
        className,
      )}
    >
      {children}
    </span>
  );
}