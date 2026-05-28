"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";

type RevealOwnProps = {
  /** Element/component to render as. Defaults to `div`. */
  as?: ElementType;
  /** Stagger delay in milliseconds. */
  delay?: number;
};

type RevealProps<T extends ElementType> = RevealOwnProps &
  Omit<ComponentPropsWithoutRef<T>, keyof RevealOwnProps>;

/**
 * Reveal-on-scroll wrapper. Adds the `.nol-reveal` transition and flips
 * `data-revealed` when the element first enters the viewport. Respects
 * reduced-motion and degrades to visible without IntersectionObserver.
 */
export function Reveal<T extends ElementType = "div">({
  as,
  delay = 0,
  className,
  children,
  style,
  ...rest
}: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reveal immediately (next frame, to avoid a synchronous cascading render)
    // when motion is reduced or IntersectionObserver is unavailable. Flipping
    // `data-revealed` is more robust than relying on a media-query cascade.
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as Ref<HTMLElement>}
      className={cn("nol-reveal", className)}
      data-revealed={revealed ? "true" : "false"}
      style={
        {
          transitionDelay: delay ? `${delay}ms` : undefined,
          ...(style as CSSProperties),
        } satisfies CSSProperties
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}
