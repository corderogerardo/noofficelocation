import { Section } from "@/components/sections/section";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
import { GradientText } from "@/components/ui/gradient-text";
import { Lead } from "@/components/ui/lead";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { FEATURED_SERVICE, SERVICES } from "@/lib/data/studio";

export function Services() {
  return (
    <Section id="services" className="border-hairline bg-bg-2 border-t">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="What we build"
            title="Games are the headline. The full stack is the supporting cast."
            lead="We're a game studio first — but shipping a modern game means owning the whole pipeline. We do, end to end."
          />
        </Reveal>

        {/* featured discipline */}
        <Reveal
          className="border-edge relative grid grid-cols-1 items-center gap-10 overflow-hidden rounded-[30px] border p-[clamp(34px,5vw,60px)] lg:grid-cols-[1.1fr_0.9fr]"
          style={{
            background:
              "radial-gradient(80% 140% at 88% 0%, rgba(255,138,30,0.18), transparent 50%), radial-gradient(70% 120% at 0% 100%, rgba(31,68,224,0.18), transparent 55%), var(--surface)",
          }}
        >
          <div>
            <Badge>{FEATURED_SERVICE.badge}</Badge>
            <h3 className="mt-4 text-[clamp(30px,4vw,52px)]">
              <GradientText>{FEATURED_SERVICE.title}</GradientText>
            </h3>
            <Lead className="mt-[18px] max-w-[42ch] text-base">
              {FEATURED_SERVICE.body}
            </Lead>
            <div className="mt-[26px] flex flex-wrap gap-2.5">
              {FEATURED_SERVICE.chips.map((chip) => (
                <Chip key={chip}>{chip}</Chip>
              ))}
            </div>
          </div>

          <div
            className="border-border relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[22px] border"
            style={{
              background:
                "repeating-linear-gradient(135deg, transparent 0 14px, var(--grid-line) 14px 15px), linear-gradient(135deg, rgba(31,68,224,0.22), rgba(255,138,30,0.18))",
            }}
          >
            <span
              aria-hidden
              className="absolute size-[150px] animate-[floaty_6s_ease-in-out_infinite] rounded-full opacity-55 blur-[8px]"
              style={{ background: "var(--accent-grad)" }}
            />
            <span className="text-fg-2 relative font-mono text-[13px] tracking-[0.2em] uppercase">
              {FEATURED_SERVICE.glyph}
            </span>
          </div>
        </Reveal>

        {/* supporting strip */}
        <div className="mt-[22px] grid grid-cols-1 gap-[18px] lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal
                key={service.number}
                delay={i * 80}
                className="border-border bg-surface hover:border-brand hover:shadow-card rounded-[22px] border p-7 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1"
              >
                <div className="border-edge text-brand mb-[18px] grid size-[44px] place-items-center rounded-[12px] border [&_svg]:size-[21px]">
                  <Icon />
                </div>
                <div className="text-fg-3 font-mono text-[11px] tracking-[0.14em]">
                  {service.number}
                </div>
                <h4 className="mt-1 font-sans text-[17px] font-bold">
                  {service.title}
                </h4>
                <p className="text-fg-2 mt-2.5 text-[14px] leading-[1.55]">
                  {service.body}
                </p>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
