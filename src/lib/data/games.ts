import type { Game } from "@/types/content";

/** Showcase titles — placeholder covers, ready for real art/trailers. */
export const GAMES: Game[] = [
  {
    id: "tidebreak",
    cover: 1,
    spanClass: "lg:col-span-7",
    tall: true,
    tag: "Action · Roguelike · PC / Console",
    title: "Tidebreak",
    body: "A sun-scorched survival roguelike set on a drowning archipelago. Built in-house on a custom engine.",
    meta: ["UNREAL 5", "ONLINE CO-OP", "2025"],
  },
  {
    id: "solstice",
    cover: 2,
    spanClass: "lg:col-span-5",
    tall: true,
    tag: "Puzzle · Mobile",
    title: "Solstice",
    body: "A meditative light-and-shadow puzzler. 4M+ installs across iOS and Android.",
    meta: ["UNITY", "iOS · ANDROID"],
  },
  {
    id: "nomad-protocol",
    cover: 3,
    spanClass: "lg:col-span-4",
    tag: "Web · Multiplayer",
    title: "Nomad Protocol",
    body: "Real-time browser strategy with a custom netcode backend.",
    meta: ["WEBGL", "2024"],
  },
  {
    id: "driftwood",
    cover: 4,
    spanClass: "lg:col-span-4",
    tag: "Platformer · Console",
    title: "Driftwood",
    body: "Hand-built 2.5D platformer with co-op and a level editor.",
    meta: ["GODOT", "SWITCH"],
  },
  {
    id: "horizon-api",
    cover: 5,
    spanClass: "lg:col-span-4",
    tag: "Live service · Backend",
    title: "Horizon API",
    body: "Matchmaking & economy backend powering three live titles.",
    meta: ["GO · RUST", "99.98% UPTIME"],
  },
];
