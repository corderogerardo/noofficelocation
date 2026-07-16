import type { Game } from "@/types/content";

/** Showcase titles — real products, in-development games, and concepts. */
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
      { label: "Landing", href: "https://stoic-piggy.noofficelocation.com" },
      {
        label: "Parents app",
        href: "https://stoic-piggy-parents.noofficelocation.com",
      },
    ],
  },
  {
    id: "torres-del-sisal",
    cover: 5,
    spanClass: "lg:col-span-6",
    tall: true,
    tag: "Game · Survival Horror · Web (Three.js)",
    title: "Torres del Sisal",
    body: "First-person horror steeped in Venezuelan llano folklore. You wake possessed in a cursed tower whose only law is siempre hacia arriba — always upward. Recover the mementos of who you were, reach the rooftop, and resist the jump until rescue arrives.",
    meta: ["THREE.JS · WEB AUDIO · NO BUILD STEP", "LIVE"],
    links: [
      { label: "Play", href: "https://torres-del-sisal.noofficelocation.com" },
    ],
  },
  {
    id: "venezuela-survivor",
    cover: 4,
    image: "/projects/venezuela-survivor.png",
    imageAlt:
      "Pixel-art level map of Venezuela Survivor — an Andean border town with the Simón Bolívar bridge, buildings, and numbered enemy waves leading to a boss arena.",
    spanClass: "lg:col-span-6",
    tall: true,
    tag: "Game · Horde Survivor · Unity",
    title: "Venezuela Survivor",
    body: "A Vampire-Survivors-style horde game set in crisis-era Venezuela. Out-hustle the swarm with creative combos — the fantasy is resolver — and end every stage in a fistfight with a corrupt politician. Our first Unity title, and the studio's Unity learning journey.",
    meta: ["UNITY 6 · C# · PIXEL ART", "IN DEV"],
  },
  {
    id: "pawwalk",
    cover: 3,
    image: "/projects/pawwalk.png",
    imageAlt:
      "PawWalk app screen showing an upcoming 45-minute neighborhood dog walk with a vetted walker and a Track live button.",
    spanClass: "lg:col-span-6",
    tag: "Booking · Payments · iOS / Android / API",
    title: "PawWalk",
    body: "A dog-walking booking and payments platform, built four ways at once — native iOS, native Android, and a Python AI backend — all sharing one API contract. A real product that doubles as a native-mobile and backend learning track.",
    meta: ["SWIFT · KOTLIN · FASTAPI · NEXT.JS", "IN DEV"],
  },
  {
    id: "standup-roast",
    cover: 2,
    image: "/projects/standup-roast.png",
    imageAlt:
      "Standup & Roast stage mockup — a lit comedy stage with a laugh meter and an audience of warm and cold reaction dots facing the comedian.",
    spanClass: "lg:col-span-6",
    tag: "Game · Comedy · Concept",
    title: "Standup & Roast",
    body: "A two-player Spanish-language comedy game: one holds the mic, the other is the room. Read the crowd, land the line, and survive the heckle across a seven-city tour that gets colder and louder until a basement roast battle in New York.",
    meta: ["DESIGN SPEC · 7 LEVELS", "IN DESIGN"],
  },
];
