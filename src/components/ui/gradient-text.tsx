import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

interface GradientTextProps extends ComponentPropsWithoutRef<"span"> {
  italic?: boolean;
}

/** Text painted with the active accent gradient (the design's `.grad-text`). */
export function GradientText({
  className,
  italic,
  style,
  ...props
}: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-clip-text text-transparent",
        italic && "italic",
        className,
      )}
      style={{ backgroundImage: "var(--accent-grad)", ...style }}
      {...props}
    />
  );
}
