import { Monitor, Apple, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformBadgeProps {
  platform: "windows" | "macos-intel" | "macos-silicon" | "linux";
  url: string;
  size?: "sm" | "md";
}

const platformConfig = {
  windows: {
    label: "Windows",
    icon: Monitor,
    fileName: ".exe",
  },
  "macos-intel": {
    label: "macOS (Intel)",
    icon: Apple,
    fileName: ".dmg",
  },
  "macos-silicon": {
    label: "macOS (Apple Silicon)",
    icon: Apple,
    fileName: ".dmg",
  },
  linux: {
    label: "Linux",
    icon: Terminal,
    fileName: ".deb",
  },
};

export function PlatformBadge({ platform, url, size = "md" }: PlatformBadgeProps) {
  const config = platformConfig[platform];
  const Icon = config.icon;

  return (
    <a
      href={url}
      download
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-navy/10 bg-white transition-colors hover:bg-navy/5",
        size === "sm" ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm",
      )}
    >
      <Icon className={cn("text-navy/70", size === "sm" ? "size-4" : "size-5")} />
      <div className="text-left">
        <div className="font-semibold text-navy">{config.label}</div>
        {size === "md" && (
          <div className="text-xs text-navy/50">{config.fileName}</div>
        )}
      </div>
    </a>
  );
}

export function PlatformBadges({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <PlatformBadge platform="windows" url="#" size={size} />
      <PlatformBadge platform="macos-silicon" url="#" size={size} />
      <PlatformBadge platform="macos-intel" url="#" size={size} />
      <PlatformBadge platform="linux" url="#" size={size} />
    </div>
  );
}
