import Link from "next/link";
import { siteConfig } from "@site-config";
import { t } from "@/i18n/el";
import { routes } from "@/lib/routes";
import { BrandShield } from "@/components/ui/BrandShield";
import { EnrollButton } from "@/components/ui/EnrollButton";
import { Container } from "./Container";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";

export function Header() {
  return (
    <header className="on-dark sticky top-0 z-40 border-b-4 border-scout-red bg-forest text-paper">
      <Container wide className="flex h-16 items-center justify-between gap-4 xl:h-20">
        <Link href={routes.home} className="flex items-center gap-3">
          <BrandShield size={58} priority className="-mx-1" />
          <span className="heading text-xl leading-none sm:text-2xl">
            {siteConfig.shortName}
            <span className="sr-only"> · {t.nav.home}</span>
          </span>
        </Link>

        <nav aria-label={t.nav.label} className="hidden xl:block">
          <NavLinks
            className="flex items-center gap-5"
            linkClassName="font-heading text-lg font-semibold whitespace-nowrap uppercase tracking-wide hover:underline hover:underline-offset-8"
          />
        </nav>

        <div className="flex items-center gap-3">
          {/* Σε κινητά η αίτηση βρίσκεται μέσα στο μενού, ώστε να μη στριμώχνεται ο τίτλος. */}
          <div className="hidden md:block">
            <EnrollButton
              label={t.enroll.applyShort}
              className="px-4 py-2 text-base whitespace-nowrap"
            />
          </div>
          <MobileNav>
            <EnrollButton label={t.enroll.apply} className="w-full text-base" />
            <Link
              href={routes.members}
              className="mt-3 flex items-center justify-center gap-2 rounded-md border-2 border-paper/70 py-2 font-semibold"
            >
              <span aria-hidden="true">🔒</span> {t.nav.members}
            </Link>
          </MobileNav>
        </div>
      </Container>
    </header>
  );
}
