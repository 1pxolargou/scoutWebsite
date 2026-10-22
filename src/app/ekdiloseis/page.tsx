import type { Metadata } from "next";
import { EventCard } from "@/components/cards/EventCard";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { splitEvents } from "@/lib/content/load";

export const metadata: Metadata = {
  title: "Εκδηλώσεις",
  description: "Επερχόμενες και παλαιότερες εκδηλώσεις, εκδρομές και κατασκηνώσεις του Συστήματος.",
};

export default function EventsPage() {
  const { upcoming, past } = splitEvents();
  return (
    <>
      <PageHero
        eyebrow="Ημερολόγιο"
        title="Εκδηλώσεις"
        intro="Εκδρομές, κατασκηνώσεις και γιορτές του Συστήματος. Προσθέστε όποια σας ενδιαφέρει στο ημερολόγιό σας."
        seed={77}
      />
      <section aria-labelledby="upcoming-title" className="py-16 sm:py-20">
        <Container>
          <SectionHeading id="upcoming-title" title="Επερχόμενες" />
          {upcoming.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {upcoming.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          ) : (
            <p className="rounded-card bg-sand p-8 text-center">
              Σύντομα θα ανακοινώσουμε τις επόμενες εκδηλώσεις.
            </p>
          )}
        </Container>
      </section>
      {past.length > 0 && (
        <section aria-labelledby="past-title" className="bg-sand py-16 sm:py-20">
          <Container>
            <SectionHeading id="past-title" title="Παλαιότερες" />
            <div className="grid gap-4 md:grid-cols-2">
              {past.map((e) => (
                <EventCard key={e.slug} event={e} past />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
