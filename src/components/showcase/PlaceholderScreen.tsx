import type { ScreenDef } from "@/config/screens";

export function PlaceholderScreen({ screen }: { screen: ScreenDef }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* Faux status bar */}
      <div className="flex items-center justify-between px-5 pt-3 text-[10px] font-semibold text-navy/60">
        <span>AM 9:41</span>
        <svg
          className="size-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path d="M5 2v14M12 2v20M19 2v10" strokeLinecap="round" />
        </svg>
      </div>

      {/* App header */}
      <div className="flex items-baseline gap-2 px-4 pt-4">
        <span className="text-sm font-extrabold text-navy">TeincFood</span>
        <span className="h-1.5 w-1.5 rounded-full bg-orange" />
      </div>

      {/* Search skeleton */}
      <div className="mx-4 mt-3 flex items-center gap-2 rounded-full bg-navy/5 px-3 py-2">
        <span className="h-3 w-3 rounded-full bg-navy/10" />
        <span className="h-2 flex-1 rounded bg-navy/10" />
      </div>

      {/* Section label chip */}
      <div className="mt-3 px-4">
        <span className="inline-block rounded-full bg-orange px-3 py-1 text-[9px] font-bold text-white">
          {screen.label}
        </span>
      </div>

      {/* Card skeletons */}
      <div className="mt-4 flex flex-col gap-3 px-4 pb-6">
        <div className="rounded-2xl bg-navy/5 p-3">
          <div className="h-16 rounded-xl bg-gradient-to-br from-orange/70 to-orange" />
          <div className="mt-3 h-2 w-3/4 rounded bg-navy/15" />
          <div className="mt-2 h-2 w-1/2 rounded bg-navy/10" />
        </div>
        <div className="rounded-2xl bg-navy/5 p-3">
          <div className="h-16 rounded-xl bg-gradient-to-br from-navy/60 to-navy" />
          <div className="mt-3 h-2 w-2/3 rounded bg-navy/15" />
          <div className="mt-2 h-2 w-1/3 rounded bg-navy/10" />
        </div>
      </div>

      {/* Watermark label */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-8">
        <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold text-navy/50 shadow-sm">
          {screen.label}
        </span>
      </div>
    </div>
  );
}