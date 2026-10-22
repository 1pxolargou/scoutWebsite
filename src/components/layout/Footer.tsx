import Link from "next/link";
import { siteConfig } from "@site-config";
import { t } from "@/i18n/el";
import { mainNav, routes } from "@/lib/routes";
import { ExternalLink } from "@/components/ui/Button";
import { BrandShield } from "@/components/ui/BrandShield";
import { ContourPattern } from "@/components/ui/ContourPattern";
import { OrdinalText } from "@/components/ui/OrdinalText";
import { EnrollButton } from "@/components/ui/EnrollButton";
import { Container } from "./Container";

export function Footer() {
  const year = new Date().getFullYear();
  const { contact, social, parentOrganization } = siteConfig;
  return (
    <footer className="on-dark relative overflow-hidden border-t-4 border-scout-red bg-forest-dark text-paper">
      <ContourPattern seed={7} className="text-forest-light opacity-50" />
      <Container className="relative grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <BrandShield size={112} className="-m-3" />
          <p className="heading text-2xl">
            <OrdinalText text={siteConfig.name} />
          </p>
          <p className="text-sm">
            {t.footer.memberOf}{" "}
            <ExternalLink href={parentOrganization.url} className="underline underline-offset-4">
              {parentOrganization.name}
            </ExternalLink>
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl">{t.footer.meetingPlace}</h2>
          <address className="not-italic">
            {contact.meetingPlace.name}
            <br />
            {contact.meetingPlace.address}
          </address>
        </div>

        <div>
          <h2 className="mb-3 text-xl">{t.footer.contact}</h2>
          <ul className="space-y-1">
            <li>
              <a href={`mailto:${contact.email}`} className="underline underline-offset-4">
                {contact.email}
              </a>
            </li>
            {contact.publishPhones && (
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="underline underline-offset-4"
                >
                  {contact.phone}
                </a>
              </li>
            )}
            <li>
              <ExternalLink href={social.facebook} className="underline underline-offset-4">
                Facebook
              </ExternalLink>
            </li>
          </ul>
          <EnrollButton label={t.enroll.apply} className="mt-5 text-base" />
        </div>

        <nav aria-label={t.footer.links}>
          <h2 className="mb-3 text-xl">{t.footer.links}</h2>
          <ul className="space-y-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:underline hover:underline-offset-4">
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href={routes.members}
                className="inline-flex items-center gap-1.5 rounded border border-paper/60 px-2 py-0.5 font-semibold hover:bg-paper hover:text-forest"
              >
                <span aria-hidden="true">🔒</span> {t.nav.members}
              </Link>
            </li>
          </ul>
        </nav>
      </Container>

      <div className="relative border-t border-forest-light">
        <Container className="flex flex-col gap-2 py-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {siteConfig.foundedYear}–{year} {siteConfig.name}. {t.footer.rights}
          </p>
          <ul className="flex gap-4">
            <li>
              <Link href={routes.privacy} className="underline underline-offset-4">
                {t.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href={routes.cookies} className="underline underline-offset-4">
                {t.footer.cookies}
              </Link>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
