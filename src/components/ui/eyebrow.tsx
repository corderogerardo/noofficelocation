import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

interface EyebrowProps extends ComponentPropsWithoutRef<"span"> {
  /** Show the short leading rule (hidden for centered headings). */
  withLine?: boolean;
}

/** Mono uppercase kicker above a heading (the design's `.eyebrow`). */
export function Eyebrow({
  className,
  withLine = true,
  children,
  ...props
}: EyebrowProps) {
  return (
    <span
      className={cn(
        "tracking-label text-brand inline-flex items-center gap-2.5 font-mono text-xs font-medium uppercase",
        className,
      )}
      {...props}
    >
      {withLine ? (
        <span aria-hidden className="bg-brand h-px w-[22px] opacity-70" />
      ) : null}
      {children}
    </span>
  );
}
