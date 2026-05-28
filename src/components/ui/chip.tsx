import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

/** Mono tech chip (the design's `.chip`). */
export function Chip({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "rounded-pill border-border text-fg-2 inline-flex border px-[13px] py-2 font-mono text-xs",
        className,
      )}
      {...props}
    />
  );
}
