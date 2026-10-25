"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const nextTheme =
    theme === "system" ? "light" : theme === "light" ? "dark" : "system";

  const Icon = !mounted
    ? Monitor
    : theme === "system"
      ? Monitor
      : resolvedTheme === "dark"
        ? Moon
        : Sun;

  const label = !mounted
    ? "System theme"
    : theme === "system"
      ? "System theme"
      : resolvedTheme === "dark"
        ? "Dark theme"
        : "Light theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={`${label}. Switch theme.`}
      title={label}
      suppressHydrationWarning
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-lg border border-navy/10 bg-white/80 text-navy/70 transition-colors hover:bg-navy/5 hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-800 dark:border-white/10 dark:bg-white/5",
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}
