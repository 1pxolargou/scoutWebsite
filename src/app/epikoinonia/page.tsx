import type { Metadata } from "next";
import { siteConfig } from "@site-config";
import { ContactForm } from "@/components/interactive/ContactForm";
import { LoadOnClick } from "@/components/interactive/LoadOnClick";
import { Container } from "@/components/layout/Container";
import { ExternalLink } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Επικοινωνία",
  description: "Πού θα μας βρείτε και πώς να επικοινωνήσετε με το 1ο Σύστημα Προσκόπων Χολαργού.",
};

export default function ContactPage() {
  const { contact, social, sections } = siteConfig;
  const { lat, lng } = contact.meetingPlace;
  const d = 0.006;
  const osm = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d}%2C${lat - d / 2}%2C${lng + d}%2C${lat + d / 2}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <>
      <PageHero
        eyebrow="Είμαστε εδώ"
        title="Επικοινωνία"
        intro="Ελάτε να μας γνωρίσετε σε μια συγκέντρωση ή στείλτε μας μήνυμα."
        seed={123}
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-8">
            <div>
              <SectionHeading title="Πού θα μας βρείτε" />
              <address className="text-lg not-italic">
                <strong className="text-forest">{contact.meetingPlace.name}</strong>
                <br />
                {contact.meetingPlace.address}
              </address>
            </div>

            <div>
              <h2 className="mb-3 text-2xl text-forest">Συγκεντρώσεις</h2>
              <ul className="divide-y divide-forest/15 rounded-card border-2 border-forest/15">
                {sections.map((s) => (
                  <li key={s.slug} className="flex flex-wrap justify-between gap-2 p-4">
                    <span className="font-semibold">{s.name}</span>
                    <span className="text-ink/85">{s.meeting}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-2xl text-forest">Στοιχεία επικοινωνίας</h2>
              <ul className="space-y-2">
                <li>
                  ✉️{" "}
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-semibold text-forest underline"
                  >
                    {contact.email}
                  </a>
                </li>
                {contact.publishPhones && <li>📞 {contact.phone}</li>}
                <li>
                  👍{" "}
                  <ExternalLink
                    href={social.facebook}
                    className="font-semibold text-forest underline"
                  >
                    Facebook
                  </ExternalLink>
                </li>
              </ul>
            </div>

            <LoadOnClick
              src={osm}
              title={`Χάρτης: ${contact.meetingPlace.name}`}
              buttonLabel="Εμφάνιση χάρτη"
              notice="Ο χάρτης φορτώνεται από το OpenStreetMap μόνο αν πατήσετε το κουμπί."
              height={360}
            />
          </div>

          <div className="rounded-card border-2 border-forest/15 bg-sand p-6 sm:p-8">
            <SectionHeading title="Στείλτε μας μήνυμα" />
            <ContactForm email={contact.email} />
          </div>
        </Container>
      </section>
    </>
  );
}
