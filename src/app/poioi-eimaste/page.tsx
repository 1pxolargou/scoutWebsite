import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@site-config";
import { Container } from "@/components/layout/Container";
import { ButtonLink, ExternalLink } from "@/components/ui/Button";
import { HexImage } from "@/components/ui/HexImage";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Shield } from "@/components/ui/Shield";
import { LeaderDirectory } from "@/components/interactive/LeaderDirectory";
import { getHistory, getLeaders } from "@/lib/content/load";
import { routes } from "@/lib/routes";
import { leaderGroupOrder, leaderGroupTitle } from "@/lib/sections";
import { currentScoutYear } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Ποιοι είμαστε",
  description: `Η ιστορία, οι αξίες και οι Βαθμοφόροι του ${siteConfig.name}, από το 1945.`,
};

// TODO: τελικά κείμενα από το Συμβούλιο Βαθμοφόρων
const values = [
  {
    icon: "🌲",
    title: "Ζωή στη φύση",
    text: "Μαθαίνουμε να αγαπάμε και να προστατεύουμε το περιβάλλον, ζώντας μέσα σε αυτό.",
  },
  {
    icon: "🤝",
    title: "Ομαδικότητα",
    text: "Στις μικρές ομάδες κάθε παιδί έχει ρόλο, φωνή και φίλους που μπορεί να εμπιστευτεί.",
  },
  {
    icon: "🧭",
    title: "Υπευθυνότητα",
    text: "Τα παιδιά αναλαμβάνουν σταδιακά ευθύνες και μαθαίνουν να αποφασίζουν μόνα τους.",
  },
  {
    icon: "❤️",
    title: "Προσφορά",
    text: "«Να κάνεις κάθε μέρα ένα καλό». Δράσεις για την πόλη μας και όσους μας χρειάζονται.",
  },
];

export default function AboutPage() {
  const history = getHistory();
  const leaders = getLeaders();
  const groups = leaderGroupOrder
    .map((key) => ({
      key,
      title: leaderGroupTitle(key),
      people: leaders.filter((l) => l.section === key),
    }))
    .filter((g) => g.people.length);

  return (
    <>
      <PageHero
        eyebrow="Από το 1945"
        title="Ποιοι είμαστε"
        intro={`Το ${siteConfig.name} είναι μέλος του Σώματος Ελλήνων Προσκόπων και εδώ και ${new Date().getFullYear() - siteConfig.foundedYear} χρόνια μεγαλώνει γενιές παιδιών στον Χολαργό.`}
      />

      {/* Τι είναι ο προσκοπισμός */}
      <section className="py-16 sm:py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading title="Τι είναι ο προσκοπισμός" />
            <div className="prose-scout">
              {/* TODO: τελικό κείμενο */}
              <p>
                Ο προσκοπισμός είναι ένα παγκόσμιο, εθελοντικό, μη κερδοσκοπικό κίνημα αγωγής νέων,
                ανοιχτό σε όλα τα παιδιά χωρίς διακρίσεις. Ιδρύθηκε το 1907 από τον Baden-Powell και
                σήμερα αριθμεί πάνω από 57 εκατομμύρια μέλη σε όλο τον κόσμο.
              </p>
              <p>
                Στόχος του είναι να βοηθά τα παιδιά να γίνουν{" "}
                <strong>αυτόνομοι, υπεύθυνοι και ενεργοί πολίτες</strong>, μέσα από τη ζωή στη φύση,
                τη μάθηση μέσω πράξης και τη δουλειά σε μικρές ομάδες.
              </p>
              <p>
                Το Σύστημά μας ανήκει στο{" "}
                <ExternalLink href={siteConfig.parentOrganization.url}>
                  {siteConfig.parentOrganization.name}
                </ExternalLink>
                , τη μεγαλύτερη οργάνωση νέων της χώρας.
              </p>
            </div>
          </div>
          <div aria-hidden="true" className="mx-auto grid w-full max-w-md grid-cols-2 gap-x-3">
            <HexImage src="/images/omada/omada-3.jpg" alt="" />
            <HexImage src="/images/koinotita/koinotita-1.jpg" alt="" />
            <HexImage
              src="/images/agelh/agelh-1.jpg"
              alt=""
              className="col-span-2 mx-auto -mt-[12%] w-1/2"
            />
          </div>
        </Container>
      </section>

      {/* Αξίες */}
      <section aria-labelledby="values-title" className="bg-sand py-16 sm:py-20">
        <Container>
          <SectionHeading id="values-title" title="Οι αξίες μας" />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <li
                key={v.title}
                className="rounded-card border-2 border-t-4 border-forest/15 border-t-scout-red bg-paper p-6"
              >
                <span aria-hidden="true" className="text-4xl">
                  {v.icon}
                </span>
                <h3 className="mt-3 text-2xl text-forest">{v.title}</h3>
                <p className="mt-2 text-ink/85">{v.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Ιστορία */}
      <section aria-labelledby="history-title" className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            id="history-title"
            title="Η ιστορία μας"
            intro="Οκτώ δεκαετίες προσκοπισμού στον Χολαργό."
          />
          <ol className="relative mx-auto max-w-3xl border-l-4 border-forest/20 pl-8 sm:pl-12">
            {history.map((h) => (
              <li key={h.year} className="relative pb-10 last:pb-0">
                <Shield className="absolute top-0 -left-[3.6rem] h-14 w-12 sm:-left-[4.6rem]">
                  <span aria-hidden="true" className="text-xs">
                    ⚜
                  </span>
                </Shield>
                <p className="heading text-3xl text-scout-red">{h.year}</p>
                <h3 className="mt-1 text-2xl text-forest">{h.title}</h3>
                <p className="mt-2 text-ink/85">{h.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 text-center">
            <ButtonLink href={routes.archive} variant="secondary">
              Ιστορικό αρχείο ανά χρονιά →
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Βαθμοφόροι */}
      <section
        aria-labelledby="leaders-title"
        className="on-dark border-t-4 border-scout-red bg-forest py-16 text-paper sm:py-20"
      >
        <Container>
          <div className="mb-10 grid items-center gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <span
                aria-hidden="true"
                className="mb-3 block h-1.5 w-14 rounded-full bg-scout-red"
              />
              <p className="heading mb-1 text-lg tracking-widest text-paper/85">
                Προσκοπική χρονιά {currentScoutYear()}
              </p>
              <h2 id="leaders-title" className="text-3xl sm:text-4xl">
                Οι Βαθμοφόροι μας
              </h2>
              <p className="mt-3 text-paper/90">
                Εθελοντές εκπαιδευμένοι από το Σώμα Ελλήνων Προσκόπων, που αφιερώνουν τον χρόνο τους
                για να ζήσουν τα παιδιά την περιπέτεια με ασφάλεια. Μαζί τους η Επιτροπή Κοινωνικής
                Συμπαράστασης (ΕΚΣ), γονείς και φίλοι που στηρίζουν το Σύστημα.
              </p>
            </div>
            <div className="relative aspect-[3/2] overflow-hidden rounded-card border-4 border-paper">
              <Image
                src="/images/vathmoforoi/vathmoforoi-1.jpg"
                alt="Οι Βαθμοφόροι και η ΕΚΣ του Συστήματος σε ομαδική φωτογραφία"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <LeaderDirectory groups={groups} />
          <p className="mt-10 text-sm text-paper/75">
            Πατήστε σε ένα όνομα για να δείτε το προφίλ.
          </p>
        </Container>
      </section>
    </>
  );
}
