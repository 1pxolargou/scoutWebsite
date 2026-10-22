import type { Metadata } from "next";
import { siteConfig } from "@site-config";
import { SectionCard } from "@/components/cards/SectionCard";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/ui/PageHero";
import { sectionImages } from "@/lib/sections";

export const metadata: Metadata = {
  title: "Τμήματα",
  description:
    "Αγέλη Λυκοπούλων, Ομάδα Προσκόπων και Κοινότητα Ανιχνευτών: ηλικίες, τάξεις και συγκεντρώσεις.",
};

export default function SectionsPage() {
  return (
    <>
      <PageHero
        eyebrow="6 έως 18 ετών"
        title="Τα τμήματά μας"
        intro="Ο προσκοπισμός ακολουθεί το παιδί σε κάθε ηλικία. Κάθε τμήμα έχει δικό του πρόγραμμα, προσαρμοσμένο στις ανάγκες και τα ενδιαφέροντα της ηλικίας του."
        seed={11}
      />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {siteConfig.sections.map((s) => (
              <SectionCard key={s.slug} section={s} image={sectionImages[s.slug]} />
            ))}
          </div>

          {/* Πορεία ηλικιών */}
          <ol
            aria-label="Η πορεία ενός παιδιού στον προσκοπισμό"
            className="mt-16 grid gap-0 sm:grid-cols-3"
          >
            {siteConfig.sections.map((s, i) => (
              <li
                key={s.slug}
                className={`relative border-forest bg-sand p-6 text-center ${i === 0 ? "rounded-t-card sm:rounded-l-card sm:rounded-tr-none" : ""} ${i === 2 ? "rounded-b-card sm:rounded-r-card sm:rounded-bl-none" : ""} ${i > 0 ? "border-t-4 sm:border-t-0 sm:border-l-4" : ""}`}
              >
                <p className="heading text-4xl text-scout-red">{s.ageRange.replace(" ετών", "")}</p>
                <p className="heading mt-1 text-xl text-forest">{s.shortName}</p>
                <p className="text-sm text-ink/80">{s.grades}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
