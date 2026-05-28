import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Mission } from "@/components/sections/mission";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { Showcase } from "@/components/sections/showcase";
import { Team } from "@/components/sections/team";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <span id="top" aria-hidden className="absolute top-0" />
        <Hero />
        <About />
        <Mission />
        <Services />
        <Showcase />
        <Process />
        <Team />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
