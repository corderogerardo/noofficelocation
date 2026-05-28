import Image from "next/image";
import Link from "next/link";

import { SITE } from "@/lib/data/site";
import { cn } from "@/lib/utils";

interface BrandProps {
  className?: string;
  imgClassName?: string;
}

/** Logo mark + wordmark lockup, linking home. Reused in header & footer. */
export function Brand({ className, imgClassName }: BrandProps) {
  return (
    <Link
      href="#top"
      aria-label={`${SITE.name} home`}
      className={cn("flex items-center gap-3", className)}
    >
      <Image
        src="/brand/nol-mark.png"
        alt=""
        width={46}
        height={46}
        priority
        className={cn(
          "size-[38px] drop-shadow-[0_2px_10px_rgba(255,138,30,0.35)]",
          imgClassName,
        )}
      />
      <span className="font-sans text-[15px] leading-none font-extrabold tracking-[0.02em]">
        {SITE.shortName}
        <small className="text-fg-3 mt-1 block font-mono text-[9.5px] font-medium tracking-[0.26em]">
          {SITE.tagline}
        </small>
      </span>
    </Link>
  );
}
