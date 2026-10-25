import { DeviceFrame } from "./DeviceFrame";
import type { ScreenKey } from "@/config/screens";

/** WhatsApp keeps its dedicated entry point but uses the unified phone frame. */
export function WhatsAppChatMockup({
  screenKey,
  priority = false,
  className,
}: {
  screenKey: ScreenKey;
  priority?: boolean;
  className?: string;
}) {
  return (
    <DeviceFrame
      screenKey={screenKey}
      device="iphone"
      priority={priority}
      className={className}
    />
  );
}
