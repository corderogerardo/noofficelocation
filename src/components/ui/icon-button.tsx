import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

/** Shared styling for circular icon controls — reused by anchors too. */
export const iconButtonClassName =
  "inline-grid size-[42px] shrink-0 place-items-center rounded-full border border-border bg-surface text-fg-2 transition hover:-translate-y-px hover:border-brand hover:text-brand focus-visible:border-brand [&_svg]:size-[18px]";

/** Circular icon button (the design's `.icon-btn`). */
export function IconButton({
  className,
  type = "button",
  ...props
}: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type={type}
      className={cn(iconButtonClassName, className)}
      {...props}
    />
  );
}
