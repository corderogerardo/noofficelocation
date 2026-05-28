"use client";

import Link from "next/link";

import { NAV_LINKS } from "@/lib/data/navigation";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const itemClass =
  "border-b border-hairline py-2 font-display text-[clamp(34px,9vw,56px)] leading-tight";

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className={cn(
        "fixed inset-0 z-[49] flex-col justify-center gap-2 px-[clamp(20px,5vw,64px)] backdrop-blur-[20px] lg:hidden",
        open
          ? "animate-in fade-in slide-in-from-bottom-3 flex duration-300"
          : "hidden",
      )}
      style={{
        background: "color-mix(in srgb, var(--bg) 96%, transparent)",
      }}
    >
      <nav aria-label="Mobile" className="flex flex-col">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={onClose}
            className={itemClass}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="#contact"
          onClick={onClose}
          className={cn(itemClass, "text-brand")}
        >
          Contact →
        </Link>
      </nav>
    </div>
  );
}
