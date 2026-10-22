import type { Metadata } from "next";
import { AlbumCard } from "@/components/cards/AlbumCard";
import { Container } from "@/components/layout/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAlbums } from "@/lib/content/load";

export const metadata: Metadata = {
  title: "Φωτογραφίες",
  description: "Άλμπουμ από τις εκδρομές, τις κατασκηνώσεις και τις δράσεις του Συστήματος.",
};

export default function GalleryPage() {
  const albums = getAlbums();
  const years = [...new Set(albums.map((a) => a.year))].sort((a, b) => b - a);
  return (
    <>
      <PageHero
        eyebrow="Άλμπουμ"
        title="Φωτογραφίες"
        intro="Στιγμές από τις δράσεις μας. Δημοσιεύουμε μόνο φωτογραφίες για τις οποίες έχουμε τη συγκατάθεση των γονέων."
        seed={99}
      />
      {years.map((year, i) => (
        <section
          key={year}
          aria-labelledby={`year-${year}`}
          className={`py-16 sm:py-20 ${i % 2 ? "bg-sand" : ""}`}
        >
          <Container>
            <SectionHeading id={`year-${year}`} title={String(year)} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {albums
                .filter((a) => a.year === year)
                .map((a) => (
                  <AlbumCard key={a.slug} album={a} />
                ))}
            </div>
          </Container>
        </section>
      ))}
    </>
  );
}
