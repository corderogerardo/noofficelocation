import type { Game } from "@/types/content";

/** Showcase titles — real products in active development. */
export const GAMES: Game[] = [
  {
    id: "stoic-piggy",
    cover: 6,
    spanClass: "lg:col-span-12",
    tall: true,
    tag: "Fintech · Kids · Web / iOS / Android",
    title: "Stoic Piggy",
    body: "Turns household chores into money lessons. Parents assign tasks, kids complete them and earn — and learn to save and spend with calm, guided by a stoic piggy mascot.",
    meta: ["NEXT.JS · NESTJS · EXPO", "WEB LIVE · MOBILE IN DEV"],
    links: [
      { label: "Landing", href: "https://stoic-piggy-landing.pages.dev" },
      { label: "Parents app", href: "https://stoic-piggy-parents.pages.dev" },
    ],
  },
];
