import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  intro,
  actions,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  actions?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <section className={cn("border-b border-navy/5 bg-surface", className)}>
      <Container
        className={cn(
          "py-14 sm:py-18 lg:py-20",
          align === "center" ? "text-center" : "",
        )}
      >
        <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-800">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy/70 sm:text-lg">
              {intro}
            </p>
          )}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </Container>
    </section>
  );
}
