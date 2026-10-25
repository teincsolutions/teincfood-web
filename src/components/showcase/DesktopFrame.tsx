import { DeviceFrame } from "./DeviceFrame";
import type { ScreenKey } from "@/config/screens";

/** Legacy desktop showcase wrapper. The iMac chassis is the unified default. */
export function DesktopFrame({
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
      device="imac"
      priority={priority}
      className={className}
    />
  );
}
