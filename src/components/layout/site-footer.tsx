import Link from "next/link";

import { Brand } from "@/components/layout/brand";
import { Container } from "@/components/ui/container";
import { iconButtonClassName } from "@/components/ui/icon-button";
import { FOOTER_SECTIONS, SOCIAL_LINKS } from "@/lib/data/navigation";
import { SITE } from "@/lib/data/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-hairline bg-bg border-t pt-[clamp(56px,8vh,90px)] pb-9">
      <Container>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Brand imgClassName="size-[46px]" />
            <p className="text-fg-2 mt-5 max-w-[34ch] text-sm leading-[1.6]">
              {SITE.blurb}
            </p>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-fg-3 mb-[18px] font-mono text-[11px] font-normal tracking-[0.16em] uppercase">
                {section.title}
              </h3>
              {section.links.map((link, i) => (
                <Link
                  key={`${link.label}-${i}`}
                  href={link.href}
                  className="text-fg-2 hover:text-brand block py-[7px] text-sm transition-[color,transform] hover:translate-x-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="border-hairline mt-14 flex flex-wrap items-center justify-between gap-4 border-t pt-[26px]">
          <span className="text-fg-3 font-mono text-xs tracking-[0.04em]">
            © {year} {SITE.name} · {SITE.domain} · Work anywhere.
          </span>
          <div className="flex gap-2.5">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={iconButtonClassName}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      </Container>
    </footer>
  );
}
