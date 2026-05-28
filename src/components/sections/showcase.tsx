import { GameCard } from "@/components/sections/game-card";
import { Section } from "@/components/sections/section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { GAMES } from "@/lib/data/games";

export function Showcase() {
  return (
    <Section id="showcase">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Selected work"
            title="Worlds we've shipped."
            lead="A sample of original games and client titles. (Placeholder covers — drop in real art and trailers whenever you're ready.)"
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-12">
          {GAMES.map((game, i) => (
            <Reveal
              key={game.id}
              delay={(i % 3) * 70}
              className={`${game.spanClass} col-span-12`}
            >
              <GameCard game={game} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
