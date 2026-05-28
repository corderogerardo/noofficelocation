import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

/** Fluid lead paragraph (the design's `.lead`). */
export function Lead({ className, ...props }: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "text-fg-2 font-sans text-[clamp(17px,1.5vw,21px)] leading-[1.6] font-normal",
        className,
      )}
      {...props}
    />
  );
}
