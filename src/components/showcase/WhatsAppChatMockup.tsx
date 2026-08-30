"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getScreen, type ScreenKey } from "@/config/screens";
import { ImageLightbox } from "./ImageLightbox";

export function WhatsAppChatMockup({
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
      <div
        className={cn(
          "relative select-none rounded-[2.5rem] border-[10px] border-navy bg-white shadow-2xl shadow-navy/20",
          "aspect-[9/19]",
          hasImage && "cursor-zoom-in",
          className,
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
        <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-navy" />
        <div className="absolute inset-0 overflow-hidden rounded-[1.9rem]">
          {hasImage ? (
            <Image
              src={screen.image!}
              alt={screen.label}
              fill
              sizes="280px"
              priority={priority}
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#ECE5DD] p-4">
              <div className="text-center">
                <div className="mx-auto mb-3 size-12 rounded-xl bg-white/80" />
                <p className="text-xs font-medium text-gray-500">{screen.label}</p>
              </div>
            </div>
          )}
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
