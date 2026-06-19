import type { Metadata, Viewport } from "next";
import {
  Hanken_Grotesk,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import { cn } from "@/lib/utils";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hanken",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

const SITE_URL = "https://noofficelocation.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "No Office Location — We build worlds. Work anywhere.",
    template: "%s · No Office Location",
  },
  description:
    "No Office Location is a fully-remote game studio crafting original games and the full-stack tech behind them — web, backend, mobile, and play.",
  keywords: [
    "game studio",
    "remote game development",
    "full-stack",
    "web",
    "backend",
    "mobile games",
    "No Office Location",
  ],
  authors: [{ name: "No Office Location" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "No Office Location",
    title: "No Office Location — We build worlds. Work anywhere.",
    description:
      "A fully-remote game studio building original worlds and the full-stack tech behind them.",
  },
  twitter: {
    card: "summary_large_image",
    title: "No Office Location — We build worlds. Work anywhere.",
    description:
      "A fully-remote game studio building original worlds and the full-stack tech behind them.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05080f" },
    { media: "(prefers-color-scheme: light)", color: "#f4faff" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        instrumentSerif.variable,
        hanken.variable,
        jetbrainsMono.variable,
      )}
    >
      <body className="min-h-dvh" suppressHydrationWarning>
        <noscript>
          {/* Progressive enhancement: reveal-on-scroll content stays visible without JS. */}
          <style>{`.nol-reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <a
          href="#main"
          className="focus:bg-brand focus:text-fg-on-accent sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
