import type { ComponentType, SVGProps } from "react";
import type { LucideIcon } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
}

export interface SocialLink {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface Stat {
  value: string;
  label: string;
}

export interface ValueCard {
  icon: LucideIcon;
  title: string;
  body: string;
}

export interface FeaturedService {
  badge: string;
  title: string;
  body: string;
  chips: string[];
  glyph: string;
}

export interface ServiceCard {
  icon: LucideIcon;
  number: string;
  title: string;
  body: string;
}

export interface Game {
  id: string;
  cover: 1 | 2 | 3 | 4 | 5 | 6;
  spanClass: string;
  tall?: boolean;
  tag: string;
  title: string;
  body: string;
  meta: string[];
  links?: { label: string; href: string }[];
}

export interface ProcessStep {
  number: string;
  title: string;
  body: string;
}

export interface TeamMember {
  initial: string;
  name: string;
  role: string;
  location: string;
}

export interface ContactChannel {
  icon: LucideIcon;
  label: string;
  value: string;
}
