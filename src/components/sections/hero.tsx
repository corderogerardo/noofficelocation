import { Gamepad2 } from "lucide-react";
import Link from "next/link";

import { HeroCanvas } from "@/components/three/hero-canvas";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { GradientText } from "@/components/ui/gradient-text";
import { Lead } from "@/components/ui/lead";
import { Pill } from "@/components/ui/pill";
import { Reveal } from "@/components/ui/reveal";
import { HERO_STATS } from "@/lib/data/studio";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      {/* atmospheric sky */}
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 6%, var(--sky-glow) 0%, transparent 55%), linear-gradient(180deg, var(--sky-top) 0%, var(--sky-mid) 60%, var(--bg) 100%)",
        }}
      />
      <HeroCanvas className="pointer-events-none z-[1]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(180deg, transparent 40%, color-mix(in srgb, var(--bg) 92%, transparent) 100%)",
        }}
      />

      <Container className="relative z-[3] w-full pt-[120px] pb-[clamp(48px,9vh,110px)]">
        <Reveal as="div" delay={0}>
          <Pill dot>Available · taking new projects for 2026</Pill>
        </Reveal>

        <Reveal
          as="h1"
          delay={60}
          className="mt-5 max-w-[16ch] text-[clamp(44px,7.6vw,108px)] leading-[0.94] tracking-[-0.02em]"
        >
          We build <GradientText italic>worlds</GradientText>.
          <br />
          And the tech behind them.
        </Reveal>

        <Reveal as="div" delay={120}>
          <Lead className="mt-[26px] max-w-[52ch]">
            No Office Location is a fully-remote studio. Games are our craft —
            and we ship the full stack that makes them run: web, backend,
            mobile, and live play. No headquarters. No limits. Just great
            software, made anywhere the sun comes up.
          </Lead>
        </Reveal>

        <Reveal
          as="div"
          delay={180}
          className="mt-9 flex flex-wrap items-center gap-3.5"
        >
          <Link
            href="#showcase"
            className={buttonVariants({ variant: "primary", size: "pill" })}
          >
            <Gamepad2 /> See our games
          </Link>
          <Link
            href="#contact"
            className={buttonVariants({ variant: "brandGhost", size: "pill" })}
          >
            Pitch us your idea
          </Link>
        </Reveal>

        <Reveal
          as="dl"
          delay={240}
          className="border-hairline mt-[54px] flex flex-wrap gap-[clamp(20px,4vw,52px)] border-t pt-[26px]"
        >
          {HERO_STATS.map((stat) => (
            <div key={stat.label}>
              <dd className="font-display text-[clamp(30px,4vw,46px)] leading-none">
                <GradientText>{stat.value}</GradientText>
              </dd>
              <dt className="text-fg-3 mt-2 font-mono text-[11px] tracking-[0.16em] uppercase">
                {stat.label}
              </dt>
            </div>
          ))}
        </Reveal>
      </Container>

      <div
        aria-hidden
        className={cn(
          "absolute bottom-[22px] left-1/2 z-[3] flex -translate-x-1/2 flex-col items-center gap-2.5",
          "text-fg-3 font-mono text-[10.5px] tracking-[0.24em] uppercase",
        )}
      >
        <span>Scroll</span>
        <span className="h-[38px] w-px animate-[scrollpulse_2.4s_ease-in-out_infinite] bg-[linear-gradient(var(--accent),transparent)]" />
      </div>
    </section>
  );
}
