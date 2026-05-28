import {
  Clock,
  Globe,
  LayoutDashboard,
  Mail,
  Rocket,
  Server,
  Smartphone,
  Sparkles,
} from "lucide-react";

import type {
  ContactChannel,
  FeaturedService,
  ProcessStep,
  ServiceCard,
  Stat,
  ValueCard,
} from "@/types/content";

export const HERO_STATS: Stat[] = [
  { value: "10+", label: "Years shipping" },
  { value: "4", label: "Platforms covered" },
  { value: "∞", label: "Office locations" },
];

export const ABOUT_TAGS = [
  "Fully remote",
  "Game-first",
  "Full-stack",
  "Ships on time",
];

export const VALUES: ValueCard[] = [
  {
    icon: Sparkles,
    title: "Play comes first",
    body: "Every system we write serves the feel of the game. Tech is invisible when it's done right; the fun is what players remember.",
  },
  {
    icon: Globe,
    title: "Talent everywhere",
    body: "We hire for craft, not commute. The best collaborator might be ten timezones away — and that's a feature, not a problem.",
  },
  {
    icon: Rocket,
    title: "Always shipping",
    body: "Polished builds, reviewed code, real deadlines. We treat every release — a game, an API, an app — like it matters. Because it does.",
  },
];

export const FEATURED_SERVICE: FeaturedService = {
  badge: "Lead discipline · 01",
  title: "Game development",
  body: "Original titles and work-for-hire, from prototype to launch. Gameplay systems, engines, multiplayer, tools, and the live-ops that keep a world running long after release.",
  chips: ["Unity", "Unreal", "Godot", "WebGL", "Multiplayer", "Live-ops"],
  glyph: "// build · play · ship",
};

export const SERVICES: ServiceCard[] = [
  {
    icon: LayoutDashboard,
    number: "02",
    title: "Web platforms",
    body: "Marketing sites, web games, and dashboards. Fast, accessible, and built to scale with your player base.",
  },
  {
    icon: Server,
    number: "03",
    title: "Backend & live services",
    body: "APIs, matchmaking, accounts, economies, and infra. The unglamorous parts that decide whether a launch survives.",
  },
  {
    icon: Smartphone,
    number: "04",
    title: "Mobile apps",
    body: "iOS and Android — native and cross-platform. Games, companion apps, and the products around them.",
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "STEP 01",
    title: "Discover",
    body: "We pin down the fun, the scope, and the constraints. Pitch, prototype, and a plan you can trust.",
  },
  {
    number: "STEP 02",
    title: "Prototype",
    body: "A playable vertical slice early. We prove the core loop before we build the whole machine.",
  },
  {
    number: "STEP 03",
    title: "Produce",
    body: "Async-first sprints, reviewed code, weekly builds. Visible progress, no surprises.",
  },
  {
    number: "STEP 04",
    title: "Launch & live",
    body: "Ship it, watch the metrics, and keep the world alive with updates and live-ops.",
  },
];

export const CONTACT_CHANNELS: ContactChannel[] = [
  { icon: Mail, label: "Email", value: "hello@noofficelocation.com" },
  { icon: Globe, label: "Web", value: "noofficelocation.com" },
  { icon: Clock, label: "Hours", value: "Always-on · async across timezones" },
];

export const PROJECT_TYPES = [
  "Game development",
  "Web platform",
  "Backend / live services",
  "Mobile app",
  "Something else",
] as const;
