import Image from "next/image";

import { Section } from "@/components/sections/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Lead } from "@/components/ui/lead";
import { Pill } from "@/components/ui/pill";
import { Reveal } from "@/components/ui/reveal";
import { ABOUT_TAGS } from "@/lib/data/studio";

export function About() {
  return (
    <Section id="about" className="border-hairline bg-bg-2 border-y">
      <Container className="grid grid-cols-1 items-center gap-[clamp(36px,6vw,90px)] lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Reveal>
            <Eyebrow>About the studio</Eyebrow>
          </Reveal>
          <Reveal
            as="h2"
            delay={60}
            className="mt-[18px] text-[clamp(34px,5.2vw,68px)] leading-none"
          >
            A studio without an address, built around the work.
          </Reveal>
          <Reveal as="div" delay={120} className="mt-6 space-y-[18px]">
            <Lead>
              No Office Location started from a simple belief: the best games
              and software don&apos;t come from a building — they come from
              focused people with the freedom to do their best work, wherever
              they are.
            </Lead>
            <Lead>
              We&apos;re a distributed crew of engineers, designers, and game
              makers. By day our timezones span oceans; together we ship
              original games and the production-grade systems behind them —
              engines, backends, live services, and the apps players actually
              touch.
            </Lead>
          </Reveal>
          <Reveal as="div" delay={180} className="mt-7 flex flex-wrap gap-2.5">
            {ABOUT_TAGS.map((tag) => (
              <Pill key={tag}>{tag}</Pill>
            ))}
          </Reveal>
        </div>

        <Reveal
          as="div"
          delay={120}
          className="border-border relative grid aspect-square place-items-center overflow-hidden rounded-[30px] border"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 0%, rgba(255,138,30,0.16), transparent 55%), var(--surface)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
              backgroundSize: "38px 38px",
              maskImage:
                "radial-gradient(80% 80% at 50% 50%, #000, transparent)",
              WebkitMaskImage:
                "radial-gradient(80% 80% at 50% 50%, #000, transparent)",
            }}
          />
          <Image
            src="/brand/nol-mark.png"
            alt="No Office Location sun-and-ocean mark"
            width={400}
            height={400}
            sizes="(min-width: 1024px) 400px, 56vw"
            className="relative h-auto w-[56%] animate-[floaty_7s_ease-in-out_infinite] drop-shadow-[0_20px_50px_rgba(255,138,30,0.4)]"
          />
        </Reveal>
      </Container>
    </Section>
  );
}
