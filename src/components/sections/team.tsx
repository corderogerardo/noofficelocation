import { Section } from "@/components/sections/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TEAM } from "@/lib/data/team";

export function Team() {
  return (
    <Section id="team">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="The crew"
            title="Scattered across the map. One studio."
            lead="A core team that has shipped together for years — from kitchen tables, co-working spaces, and beaches with good Wi-Fi. (Placeholder profiles.)"
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member, i) => (
            <Reveal key={member.initial} delay={(i % 4) * 70} className="group">
              <div
                className="border-border group-hover:border-brand relative grid aspect-[3/4] place-items-center overflow-hidden rounded-[22px] border transition-colors"
                style={{
                  background:
                    "linear-gradient(160deg, var(--surface-3), var(--surface))",
                }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-60"
                  style={{
                    backgroundImage:
                      "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
                    backgroundSize: "26px 26px",
                  }}
                />
                <span className="text-fg-3 absolute top-3 left-3 font-mono text-[10px] tracking-[0.14em] uppercase">
                  {"// photo"}
                </span>
                <span className="font-display text-fg-3 text-[64px]">
                  {member.initial}
                </span>
              </div>
              <h3 className="mt-4 font-sans text-[17px] font-bold">
                {member.name}
              </h3>
              <div className="text-brand mt-1.5 font-mono text-[12px] tracking-[0.04em]">
                {member.role}
              </div>
              <div className="text-fg-3 mt-1 text-[13px]">
                {member.location}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
