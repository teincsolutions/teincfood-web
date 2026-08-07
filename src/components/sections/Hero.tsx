import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { StoreBadges } from "@/components/brand/StoreBadges";
import { DeviceFrame } from "@/components/showcase/DeviceFrame";
import type { ScreenKey } from "@/config/screens";

export function Hero({
  eyebrow,
  title,
  subtitle,
  storeLinks,
  screenKey,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  storeLinks: { appStore: string; playStore: string };
  screenKey: ScreenKey;
  reverse?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[480px] rounded-full bg-orange/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 size-[420px] rounded-full bg-navy/5 blur-3xl"
      />

      <Container className="relative grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-2 lg:py-28">
        <div className={reverse ? "lg:order-2" : ""}>
          <Badge>{eyebrow}</Badge>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy/70">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <StoreBadges
              appStoreUrl={storeLinks.appStore}
              playStoreUrl={storeLinks.playStore}
            />
          </div>
        </div>

        <div className={`flex justify-center lg:justify-end ${reverse ? "lg:order-1" : ""}`}>
          <DeviceFrame
            screenKey={screenKey}
            priority
            className="w-56 sm:w-64 lg:w-[300px]"
          />
        </div>
      </Container>
    </section>
  );
}