import {
  GithubIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/icons/social-icons";
import type { NavLink, SocialLink } from "@/types/content";

export const NAV_LINKS: NavLink[] = [
  { href: "#about", label: "About" },
  { href: "#mission", label: "Mission" },
  { href: "#services", label: "What we build" },
  { href: "#showcase", label: "Games" },
  { href: "#process", label: "Process" },
  { href: "#team", label: "Crew" },
];

export const FOOTER_SECTIONS: { title: string; links: NavLink[] }[] = [
  {
    title: "Studio",
    links: [
      { href: "#about", label: "About" },
      { href: "#mission", label: "Mission" },
      { href: "#team", label: "Crew" },
      { href: "#process", label: "Process" },
    ],
  },
  {
    title: "Work",
    links: [
      { href: "#showcase", label: "Games" },
      { href: "#services", label: "Web" },
      { href: "#services", label: "Backend" },
      { href: "#services", label: "Mobile" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "#contact", label: "Contact" },
      { href: "mailto:hello@noofficelocation.com", label: "Email" },
      { href: "#", label: "LinkedIn" },
      { href: "#", label: "Discord" },
    ],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { href: "#", label: "X", icon: XIcon },
  { href: "#", label: "GitHub", icon: GithubIcon },
  { href: "#", label: "LinkedIn", icon: LinkedinIcon },
];
