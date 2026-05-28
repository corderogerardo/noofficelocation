import { ContactFormLazy } from "@/components/sections/contact-form-lazy";
import { Section } from "@/components/sections/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { CONTACT_CHANNELS } from "@/lib/data/studio";
import { cn } from "@/lib/utils";

export function Contact() {
  return (
    <Section
      id="contact"
      style={{
        background:
          "radial-gradient(80% 120% at 100% 0%, rgba(31,68,224,0.16), transparent 50%), radial-gradient(70% 110% at 0% 100%, rgba(255,138,30,0.13), transparent 55%), var(--bg)",
      }}
    >
      <Container className="grid grid-cols-1 gap-[clamp(36px,6vw,80px)] lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Reveal>
            <Eyebrow>Contact us</Eyebrow>
          </Reveal>
          <Reveal
            as="h2"
            delay={60}
            className="mt-[18px] text-[clamp(34px,5.2vw,68px)] leading-none"
          >
            Got a world you
            <br />
            want built?
          </Reveal>
          <Reveal
            as="p"
            delay={120}
            className="text-fg-2 mt-5 max-w-[38ch] leading-[1.6]"
          >
            Tell us about your game or product. We reply to every serious
            inquiry — usually within a day, wherever the sun happens to be up.
          </Reveal>

          <Reveal delay={180} className="mt-9 flex flex-col">
            {CONTACT_CHANNELS.map((channel, i) => {
              const Icon = channel.icon;
              const isLast = i === CONTACT_CHANNELS.length - 1;
              return (
                <div
                  key={channel.label}
                  className={cn(
                    "border-hairline flex items-center gap-4 border-t py-4",
                    isLast && "border-b",
                  )}
                >
                  <div className="text-brand grid size-[42px] shrink-0 place-items-center rounded-[12px] bg-[var(--accent-soft)] [&_svg]:size-[19px]">
                    <Icon />
                  </div>
                  <div>
                    <div className="text-fg-3 font-mono text-[10.5px] tracking-[0.16em] uppercase">
                      {channel.label}
                    </div>
                    <div className="mt-[3px] text-[15px] font-semibold">
                      {channel.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>

        <Reveal
          delay={120}
          className="border-border bg-surface shadow-card relative overflow-hidden rounded-[30px] border p-[clamp(28px,4vw,44px)]"
        >
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[3px]"
            style={{ background: "var(--accent-grad)" }}
          />
          <ContactFormLazy />
        </Reveal>
      </Container>
    </Section>
  );
}
