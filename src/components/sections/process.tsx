import { Section } from "@/components/sections/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { PROCESS_STEPS } from "@/lib/data/studio";

export function Process() {
  return (
    <Section id="process" className="border-hairline bg-bg-2 border-t">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="How we work"
            title="Remote by design, rigorous by habit."
            lead="No office, no chaos. A tight loop that keeps distributed teams shipping the same way a great in-person studio does."
          />
        </Reveal>

        <div className="mt-5 grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, i) => (
            <Reveal
              key={step.number}
              delay={i * 70}
              className="border-edge relative border-t-2 pt-[30px] pr-[26px] pb-[30px]"
            >
              <span
                aria-hidden
                className="bg-brand absolute -top-[5px] left-0 size-2 rounded-full shadow-[0_0_12px_var(--accent)]"
              />
              <div className="text-brand font-mono text-[12px] tracking-[0.12em]">
                {step.number}
              </div>
              <h3 className="mt-3.5 font-sans text-[19px] font-bold">
                {step.title}
              </h3>
              <p className="text-fg-2 mt-2.5 pr-[18px] text-[14px] leading-[1.55]">
                {step.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
