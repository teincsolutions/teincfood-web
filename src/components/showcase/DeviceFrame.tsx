"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { getScreen, type ScreenKey } from "@/config/screens";
import { cn } from "@/lib/utils";
import { PlaceholderScreen } from "./PlaceholderScreen";
import { ImageLightbox } from "./ImageLightbox";

export function DeviceFrame({
  screenKey,
  className,
  device = "phone",
  priority = false,
}: {
  screenKey: ScreenKey;
  className?: string;
  device?: "phone" | "tablet";
  priority?: boolean;
}) {
  const screen = getScreen(screenKey);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const clickable = Boolean(screen.image);

  return (
    <>
      <div
        className={cn(
          "group relative select-none rounded-[2.5rem] border-[10px] border-navy bg-white shadow-2xl shadow-navy/20",
          device === "tablet" ? "aspect-[4/3]" : "aspect-[9/19]",
          clickable && "cursor-zoom-in",
          className,
        )}
        onClick={() => clickable && setLightboxOpen(true)}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        aria-label={clickable ? `View ${screen.label} fullscreen` : undefined}
        onKeyDown={(e) => {
          if (clickable && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setLightboxOpen(true);
          }
        }}
      >
        {/* Dynamic island / notch */}
        <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-navy" />

        <div className="absolute inset-0 overflow-hidden rounded-[1.9rem]">
          {screen.image ? (
            <Image
              src={screen.image}
              alt={screen.label}
              fill
              priority={priority}
              sizes="(max-width: 768px) 90vw, 420px"
              className="object-cover"
            />
          ) : (
            <PlaceholderScreen screen={screen} />
          )}
        </div>

        {/* Hover zoom indicator — only for real screenshots */}
        {clickable && (
          <span className="pointer-events-none absolute bottom-3 right-3 inline-flex size-7 items-center justify-center rounded-full bg-navy/70 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            <ZoomIn className="size-3.5" />
          </span>
        )}
      </div>

      {screen.image && (
        <ImageLightbox
          src={screen.image}
          alt={screen.label}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
