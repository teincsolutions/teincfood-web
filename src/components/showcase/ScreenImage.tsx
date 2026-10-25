"use client";

import Image from "next/image";
import { useState } from "react";
import type { ScreenDef } from "@/config/screens";
import { cn } from "@/lib/utils";
import { PlaceholderScreen } from "./PlaceholderScreen";

export function ScreenImage({
  screen,
  image,
  alt,
  sizes,
  priority = false,
  className,
  onLoadError,
}: {
  screen: ScreenDef;
  image?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  onLoadError?: (_src: string) => void;
}) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const src = image ?? screen.image;

  if (!src || failedSrc === src) {
    return <PlaceholderScreen screen={screen} className={className} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={screen.width ?? 1170}
      height={screen.height ?? 2532}
      sizes={sizes}
      preload={priority}
      draggable={false}
      className={cn("h-full w-full object-contain", className)}
      onError={() => {
        setFailedSrc(src);
        onLoadError?.(src);
      }}
    />
  );
}
