import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "default",
  as: Heading = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  tone?: "default" | "inverse";
  as?: "h1" | "h2";
  className?: string;
}) {
  const inverse = tone === "inverse";

  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-bold uppercase tracking-[0.16em]",
            inverse ? "text-orange-300" : "text-orange-800",
          )}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          "text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]",
          inverse ? "text-white" : "text-navy",
        )}
      >
        {title}
      </Heading>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            inverse ? "text-white/70" : "text-navy/70",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}