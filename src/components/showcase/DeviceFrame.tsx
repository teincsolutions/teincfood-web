import Image from "next/image";
import { getScreen, type ScreenKey } from "@/config/screens";
import { cn } from "@/lib/utils";
import { PlaceholderScreen } from "./PlaceholderScreen";

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

  return (
    <div
      className={cn(
        "relative select-none rounded-[2.5rem] border-[10px] border-navy bg-white shadow-2xl shadow-navy/20",
        device === "tablet" ? "aspect-[4/3]" : "aspect-[9/19]",
        className,
      )}
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
    </div>
  );
}