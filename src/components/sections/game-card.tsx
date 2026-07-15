import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Game } from "@/types/content";

/** Layered placeholder cover gradients, keyed by the design's `data-cover`. */
const COVER_BG: Record<Game["cover"], string> = {
  1: "radial-gradient(120% 90% at 80% 10%, var(--sun-gold), transparent 55%), linear-gradient(160deg, #2a1530 0%, #0b1c4a 60%, #07101f 100%)",
  2: "radial-gradient(100% 80% at 20% 18%, var(--sun-core), transparent 50%), linear-gradient(160deg, #3a1c0a 0%, #1b3fa0 70%, #07101f 100%)",
  3: "radial-gradient(110% 90% at 85% 80%, var(--wave-azure), transparent 55%), linear-gradient(160deg, #0a2440 0%, #133a8a 60%, #07101f 100%)",
  4: "radial-gradient(110% 90% at 20% 20%, var(--sun-amber), transparent 50%), linear-gradient(160deg, #36210b 0%, #144b6b 70%, #07101f 100%)",
  5: "radial-gradient(120% 100% at 50% 100%, var(--wave-sky), transparent 55%), linear-gradient(160deg, #07294a 0%, #0c1b3a 60%, #07101f 100%)",
  // Stoic Piggy brand: imperial red + non-photo teal on Berkeley navy.
  6: "radial-gradient(110% 90% at 80% 15%, #E63946, transparent 50%), radial-gradient(90% 70% at 15% 85%, #A8DADC, transparent 45%), linear-gradient(160deg, #1D3557 0%, #13243B 70%, #07101f 100%)",
};

const OUTER =
  "group border-border bg-surface hover:border-edge hover:shadow-card relative flex h-full flex-col overflow-hidden rounded-[22px] border transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1.5";

function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-pill border-border bg-surface-2 text-fg-2 self-start border px-[11px] py-1.5 font-mono text-[10.5px] tracking-[0.16em] uppercase">
      {children}
    </span>
  );
}

function Meta({ items }: { items: string[] }) {
  return (
    <div className="text-fg-3 flex flex-wrap gap-3.5 font-mono text-[11px] tracking-[0.08em]">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function Links({ links }: { links: NonNullable<Game["links"]> }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="rounded-pill border-edge text-fg hover:border-brand hover:text-brand inline-flex items-center gap-1 border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors"
        >
          {link.label}
          <ArrowUpRight className="size-3" />
        </a>
      ))}
    </div>
  );
}

/**
 * Product card with a real screenshot: image sits in a framed band up top so
 * the capture reads on its own, and the copy lives on a solid panel below —
 * no text overlapping the screenshot's own UI.
 */
function ImageCard({ game }: { game: Game }) {
  return (
    <article className={OUTER}>
      <div className="bg-bg-2 relative h-[210px] w-full shrink-0 overflow-hidden">
        <Image
          src={game.image!}
          alt={game.imageAlt ?? ""}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
      </div>
      <div className="border-border flex flex-1 flex-col border-t p-[26px]">
        <Tag>{game.tag}</Tag>
        <h3 className="font-display text-fg mt-3.5 text-[30px]">{game.title}</h3>
        <p className="text-fg-2 mt-2 text-[14px]">{game.body}</p>
        <div className="mt-auto flex flex-col gap-4 pt-5">
          <Meta items={game.meta} />
          {game.links && game.links.length > 0 && <Links links={game.links} />}
        </div>
      </div>
    </article>
  );
}

/**
 * Gradient-cover card: the brand gradient fills the whole card and the copy is
 * overlaid at the bottom behind a readability scrim.
 */
function GradientCard({ game }: { game: Game }) {
  return (
    <article
      className={cn(
        OUTER,
        "min-h-[280px] justify-end p-[26px]",
        game.tall && "lg:min-h-[380px]",
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 z-0 opacity-90 transition-transform duration-500 group-hover:scale-[1.06]"
        style={{ background: COVER_BG[game.cover] }}
      >
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* readability scrim (flips for light theme) */}
      <div
        aria-hidden
        className="light:bg-[linear-gradient(180deg,transparent_35%,rgba(255,255,255,0.9)_100%)] absolute inset-0 z-[1] bg-[linear-gradient(180deg,transparent_30%,rgba(5,8,15,0.85)_100%)]"
      />

      <span className="rounded-pill light:border-border light:bg-white/60 light:text-fg relative z-[2] self-start border border-white/20 bg-black/55 px-[11px] py-1.5 font-mono text-[10.5px] tracking-[0.16em] text-white uppercase backdrop-blur-[6px]">
        {game.tag}
      </span>
      <h3 className="font-display text-fg relative z-[2] mt-3.5 text-[30px]">
        {game.title}
      </h3>
      <p className="text-fg-2 relative z-[2] mt-2 text-[14px]">{game.body}</p>
      <div className="relative z-[2] mt-4">
        <Meta items={game.meta} />
      </div>
      {game.links && game.links.length > 0 && (
        <div className="relative z-[2] mt-4 [&_a]:bg-black/30 [&_a]:backdrop-blur-[6px]">
          <Links links={game.links} />
        </div>
      )}
    </article>
  );
}

/** A single showcase title card. Fills its grid cell (sized by the Showcase). */
export function GameCard({ game }: { game: Game }) {
  return game.image ? <ImageCard game={game} /> : <GradientCard game={game} />;
}
