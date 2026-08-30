"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { getScreen, type ScreenKey } from "@/config/screens";
import { ImageLightbox } from "./ImageLightbox";

export function DesktopFrame({
  screenKey,
  priority = false,
  className,
}: {
  screenKey: ScreenKey;
  priority?: boolean;
  className?: string;
}) {
  const screen = getScreen(screenKey);
  const hasImage = Boolean(screen.image);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <div className={cn("relative", className)}>
        <div
          className={cn(
            "group overflow-hidden rounded-xl border border-navy/10 bg-white shadow-2xl",
            hasImage && "cursor-zoom-in transition-shadow hover:shadow-navy/10",
          )}
          onClick={() => hasImage && setLightboxOpen(true)}
          role={hasImage ? "button" : undefined}
          tabIndex={hasImage ? 0 : undefined}
          aria-label={hasImage ? `View ${screen.label} fullscreen` : undefined}
          onKeyDown={(e) => {
            if (hasImage && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              setLightboxOpen(true);
            }
          }}
        >
          <div className="relative aspect-[16/10] w-full">
            {hasImage ? (
              <>
                <Image
                  src={screen.image!}
                  alt={screen.label}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  priority={priority}
                  className="object-cover object-top"
                />
                {/* Hover zoom indicator */}
                <span className="pointer-events-none absolute bottom-3 right-3 inline-flex size-8 items-center justify-center rounded-full bg-navy/70 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <ZoomIn className="size-4" />
                </span>
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-50 p-8">
                <div className="text-center">
                  <div className="mx-auto mb-3 size-12 rounded-xl bg-navy/10" />
                  <p className="text-sm font-medium text-navy/50">{screen.label}</p>
                </div>
              </div>
            )}
          </div>
        </div>
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
