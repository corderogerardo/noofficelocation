import { Section } from "@/components/sections/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { GradientText } from "@/components/ui/gradient-text";
import { Reveal } from "@/components/ui/reveal";
import { VALUES } from "@/lib/data/studio";

export function Mission() {
  return (
    <Section
      id="mission"
      style={{
        background:
          "radial-gradient(90% 120% at 80% 0%, rgba(31,68,224,0.14), transparent 55%), radial-gradient(70% 100% at 0% 100%, rgba(255,138,30,0.10), transparent 55%), var(--bg)",
      }}
    >
      <Container>
        <Reveal className="mb-[clamp(40px,6vh,72px)]">
          <Eyebrow>Our mission</Eyebrow>
        </Reveal>

        <Reveal
          as="p"
          className="font-display max-w-[22ch] text-[clamp(30px,4.6vw,60px)] leading-[1.1] tracking-[-0.01em]"
        >
          Make games and software worth playing — and prove that{" "}
          <GradientText italic>great work has no address.</GradientText>
        </Reveal>

        <div className="mt-[clamp(48px,7vh,80px)] grid grid-cols-1 gap-[22px] lg:grid-cols-3">
          {VALUES.map((value, i) => {
            const Icon = value.icon;
            return (
              <Reveal
                key={value.title}
                delay={i * 80}
                className="border-border bg-surface hover:border-edge hover:shadow-card rounded-[22px] border p-[30px] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1"
              >
                <div className="text-brand mb-5 grid size-[46px] place-items-center rounded-[12px] bg-[var(--accent-soft)] [&_svg]:size-[22px]">
                  <Icon />
                </div>
                <h3 className="font-sans text-[19px] font-bold tracking-normal">
                  {value.title}
                </h3>
                <p className="text-fg-2 mt-3 text-[15px] leading-[1.6]">
                  {value.body}
                </p>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
