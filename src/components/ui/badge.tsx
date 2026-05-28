import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

/** Mono uppercase accent label (the design's `.badge`). */
export function Badge({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "text-brand font-mono text-[11px] tracking-[0.2em] uppercase",
        className,
      )}
      {...props}
    />
  );
}
