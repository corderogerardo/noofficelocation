import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Eyebrow } from "@/components/ui/eyebrow";
import { Lead } from "@/components/ui/lead";
import { cn } from "@/lib/utils";

interface SectionHeadingProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "title"
> {
  eyebrow?: ReactNode;
  title?: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  titleClassName?: string;
}

/** Eyebrow + heading + lead block (the design's `.section-head`). */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
  titleClassName,
  children,
  ...props
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "mb-[clamp(40px,6vh,72px)] max-w-[760px]",
        centered && "mx-auto text-center",
        className,
      )}
      {...props}
    >
      {eyebrow ? <Eyebrow withLine={!centered}>{eyebrow}</Eyebrow> : null}
      {title ? (
        <h2
          className={cn(
            "mt-[18px] text-[clamp(34px,5.2vw,68px)] leading-none",
            titleClassName,
          )}
        >
          {title}
        </h2>
      ) : null}
      {lead ? <Lead className="mt-[22px]">{lead}</Lead> : null}
      {children}
    </div>
  );
}
