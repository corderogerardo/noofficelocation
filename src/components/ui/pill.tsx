import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

interface PillProps extends ComponentPropsWithoutRef<"span"> {
  /** Render a glowing status dot before the label. */
  dot?: boolean;
}

/** Small mono uppercase pill / tag (the design's `.pill`). */
export function Pill({ className, dot, children, ...props }: PillProps) {
  return (
    <span
      className={cn(
        "rounded-pill border-edge text-fg-2 inline-flex items-center gap-2 border px-[13px] py-[7px] font-mono text-[11.5px] font-medium tracking-[0.12em] uppercase",
        className,
      )}
      {...props}
    >
      {dot ? (
        <span
          aria-hidden
          className="size-[7px] rounded-full bg-[#34d17a] shadow-[0_0_10px_#34d17a]"
        />
      ) : null}
      {children}
    </span>
  );
}
