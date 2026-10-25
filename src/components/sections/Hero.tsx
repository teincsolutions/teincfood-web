import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { DeviceFrame } from "@/components/showcase/DeviceFrame";
import { ScreenImage } from "@/components/showcase/ScreenImage";
import { getScreen } from "@/config/screens";
import type { DeviceChoice } from "@/components/showcase/DeviceFrame";
import type { ScreenKey } from "@/config/screens";
import { cn } from "@/lib/utils";

type HeroAction = {
  href: string;
  label: string;
  external?: boolean;
};

export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  screenKey,
  device,
  frameless = false,
  reverse = false,
  footnote,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryAction: HeroAction;
  secondaryAction?: HeroAction;
  screenKey: ScreenKey;
  device?: DeviceChoice;
  frameless?: boolean;
  reverse?: boolean;
  footnote?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-navy/5 bg-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top_left,rgba(255,118,34,0.13),transparent_62%)]"
      />
      <Container className="relative grid items-center gap-12 py-14 sm:py-18 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-24">
        <div className={cn(reverse && "lg:order-2")}>
          <Badge>{eyebrow}</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] text-navy sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-navy/70 sm:text-lg">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {primaryAction.external ? (
              <a
                href={primaryAction.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-800 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-orange-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800"
              >
                {primaryAction.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            ) : (
              <ButtonLink href={primaryAction.href} size="lg">
                {primaryAction.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </ButtonLink>
            )}
            {secondaryAction && (
              <ButtonLink
                href={secondaryAction.href}
                variant="outline"
                size="lg"
              >
                {secondaryAction.label}
              </ButtonLink>
            )}
          </div>
          {footnote && (
            <div className="mt-6 text-sm leading-relaxed text-navy/60">
              {footnote}
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex justify-center lg:justify-end",
            reverse && "lg:order-1 lg:justify-start",
          )}
        >
          <div className="relative w-full max-w-[22rem] sm:max-w-[24rem]">
            <div
              aria-hidden="true"
              className="absolute inset-x-6 bottom-0 top-8 rounded-[2rem] bg-gradient-to-br from-orange/10 via-white to-navy/[0.04] ring-1 ring-navy/5 dark:from-orange/5 dark:via-surface dark:to-navy/[0.02] dark:ring-white/5"
            />
            {frameless ? (
              <ScreenImage
                screen={getScreen(screenKey)}
                alt={title}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 78vw, 960px"
                priority
                className="w-full rounded-2xl"
              />
            ) : (
              <DeviceFrame
                screenKey={screenKey}
                device={device}
                priority
                className="relative mx-auto w-full max-w-[17.5rem] sm:max-w-[19rem]"
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
