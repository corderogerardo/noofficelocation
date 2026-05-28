"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { IconButton } from "@/components/ui/icon-button";
import { useMounted } from "@/hooks/use-mounted";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = resolvedTheme !== "light";

  return (
    <IconButton
      aria-label="Toggle light and dark mode"
      title="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Default to the dark-mode icon until mounted to match SSR. */}
      {mounted && !isDark ? <Sun /> : <Moon />}
    </IconButton>
  );
}
