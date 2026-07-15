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

interface GameBase {
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

/**
 * A showcase entry. Either a gradient-cover card (no screenshot) or a real
 * screenshot card — and the union makes `imageAlt` mandatory whenever `image`
 * is set, so a content-bearing capture can never ship without alt text.
 * `image` paths are under /public and override the gradient `cover`.
 */
export type Game = GameBase &
  (
    | { image?: undefined; imageAlt?: undefined }
    | { image: string; imageAlt: string }
  );

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
