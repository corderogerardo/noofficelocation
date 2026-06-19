"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Brand } from "@/components/layout/brand";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { IconButton } from "@/components/ui/icon-button";
import { useScrolled } from "@/hooks/use-scrolled";
import { NAV_LINKS } from "@/lib/data/navigation";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const scrolled = useScrolled(24);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close on Escape and lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus into the menu when it opens.
    document.querySelector<HTMLElement>("#mobile-menu a")?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      // Return focus to the toggle when the menu closes.
      document.getElementById("nav-toggle")?.focus();
    };
  }, [menuOpen]);

  return (
    <header
      id="nav"
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled &&
          "border-hairline bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] backdrop-blur-[16px] backdrop-saturate-[140%]",
      )}
    >
      <Container className="relative z-50 flex h-[76px] items-center justify-between">
        <Brand />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1.5 lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-pill text-fg-2 hover:bg-surface-3 hover:text-fg px-3.5 py-2.5 text-sm font-semibold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="#contact"
            className={cn(
              buttonVariants({ variant: "primary", size: "pillSm" }),
              "hidden sm:inline-flex",
            )}
          >
            Start a project
          </Link>
          <IconButton
            id="nav-toggle"
            className="lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </IconButton>
        </div>
      </Container>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
