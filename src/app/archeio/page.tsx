import type { Metadata } from "next";
import { ArchiveExplorer } from "@/components/interactive/ArchiveExplorer";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/ui/PageHero";
import { getArchive, getLeaders } from "@/lib/content/load";

export const metadata: Metadata = {
  title: "Ιστορικό Αρχείο",
  description:
    "Οι Βαθμοφόροι και οι εκδρομές του Συστήματος ανά προσκοπική χρονιά, πάνω στον χάρτη.",
};

export default function ArchivePage() {
  return (
    <>
      <PageHero
        eyebrow="Ανά χρονιά"
        title="Ιστορικό Αρχείο"
        intro="Ποιοι ήταν οι Βαθμοφόροι μας και πού ταξιδέψαμε κάθε χρονιά. Πατήστε σε μια εκδρομή για να τη δείτε στον χάρτη."
        seed={1945}
      />
      <section className="py-12 sm:py-16">
        <Container>
          <ArchiveExplorer years={getArchive()} leaders={getLeaders()} />
        </Container>
      </section>
    </>
  );
}
