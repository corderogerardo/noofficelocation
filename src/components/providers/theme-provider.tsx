"use client";

import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Wraps next-themes and drives the `data-theme` attribute used by our tokens.
 * Also enables CSS color transitions only after the first paint, which avoids
 * the load-time "stuck transition" flash.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        document.documentElement.classList.add("theme-ready"),
      ),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      themes={["light", "dark"]}
      storageKey="nol-theme"
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
