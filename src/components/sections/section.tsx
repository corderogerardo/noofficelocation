import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

/** Vertical rhythm wrapper for a page section (the design's `.section`). */
export function Section({
  className,
  ...props
}: ComponentPropsWithoutRef<"section">) {
  return (
    <section
      className={cn("relative py-[clamp(80px,13vh,150px)]", className)}
      {...props}
    />
  );
}
