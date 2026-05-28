import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

/** Centered content column — the design's `.wrap` (max 1240px + fluid gutter). */
export function Container({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "max-w-site mx-auto w-full px-[clamp(20px,5vw,64px)]",
        className,
      )}
      {...props}
    />
  );
}
