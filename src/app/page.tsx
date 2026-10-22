import { siteConfig } from "@site-config";
import { AlbumCard } from "@/components/cards/AlbumCard";
import { EventCard } from "@/components/cards/EventCard";
import { NewsCard } from "@/components/cards/NewsCard";
import { SectionCard } from "@/components/cards/SectionCard";
import { HighlightsCarousel } from "@/components/interactive/HighlightsCarousel";
import { Container } from "@/components/layout/Container";
import { BrandShield } from "@/components/ui/BrandShield";
import { ButtonLink } from "@/components/ui/Button";
import { ContourPattern } from "@/components/ui/ContourPattern";
import { EnrollButton } from "@/components/ui/EnrollButton";
import { HexImage } from "@/components/ui/HexImage";
import { OrdinalText } from "@/components/ui/OrdinalText";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getAlbums, getCarousel, splitEvents } from "@/lib/content/load";
import { getNews } from "@/lib/facebook";
import { routes } from "@/lib/routes";
import { sectionImages } from "@/lib/sections";

export default async function HomePage() {
  const { posts } = await getNews();
  const { upcoming } = splitEvents();
  const slides = getCarousel();
  const albums = getAlbums().slice(0, 3);
  const years = new Date().getFullYear() - siteConfig.foundedYear;

  return (
    <>
      {/* Hero */}
      <section className="on-dark relative overflow-hidden bg-forest text-paper">
        <ContourPattern className="text-forest-light opacity-60" />
        <Container className="relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <BrandShield
              size={150}
              priority
              alt={`Θυρεός του ${siteConfig.name}`}
              className="-my-3 mb-2 -ml-5"
            />
            <p className="heading mb-2 text-lg tracking-widest text-paper/85">
              <OrdinalText text="1ο Σύστημα · από το 1945" />
            </p>
            <h1 className="text-6xl sm:text-8xl">Πρόσκοποι Χολαργού</h1>
            <p className="mt-5 max-w-xl text-lg sm:text-xl">{siteConfig.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <EnrollButton />
              <ButtonLink href={routes.about} variant="ghost-light">
                Γνώρισέ μας
              </ButtonLink>
            </div>
          </div>

          {/* Κηρήθρα φωτογραφιών, όπως στις αφίσες */}
          <div aria-hidden="true" className="relative mx-auto hidden w-full max-w-lg sm:block">
            <div className="grid grid-cols-2 gap-x-3">
              <HexImage src="/images/omada/omada-2.jpg" alt="" priority sizes="260px" />
              <HexImage src="/images/koinotita/koinotita-3.jpg" alt="" priority sizes="260px" />
              <HexImage
                src="/images/agelh/agelh-2.jpg"
                alt=""
                priority
                sizes="260px"
                className="col-span-2 mx-auto -mt-[12%] w-1/2"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Από το 1945 */}
      <section aria-labelledby="stats-title" className="border-b-4 border-scout-red bg-sand">
        <Container className="grid gap-8 py-10 sm:grid-cols-[auto_1fr] sm:items-center">
          <h2 id="stats-title" className="text-3xl text-forest sm:text-4xl">
            Από το {siteConfig.foundedYear}
          </h2>
          <dl className="grid grid-cols-3 gap-4 text-center sm:border-l-2 sm:border-forest/20 sm:pl-8">
            {siteConfig.stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dt className="order-2 text-sm text-ink/80 sm:text-base">{s.label}</dt>
                <dd className="heading order-1 text-4xl text-forest sm:text-6xl">
                  {s.value === "auto" ? years : s.value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Τμήματα */}
      <section aria-labelledby="sections-title" className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            id="sections-title"
            title="Τα τμήματά μας"
            intro="Κάθε ηλικία έχει τη δική της περιπέτεια. Βρείτε το τμήμα που ταιριάζει στο παιδί σας."
            href={routes.sections}
            linkLabel="Όλα τα τμήματα"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {siteConfig.sections.map((s) => (
              <SectionCard key={s.slug} section={s} image={sectionImages[s.slug]} />
            ))}
          </div>
        </Container>
      </section>

      {/* Νέα + εκδηλώσεις */}
      <section className="bg-sand py-16 sm:py-20">
        <Container className="grid gap-14 lg:grid-cols-[2fr_1fr]">
          <div>
            <SectionHeading title="Τελευταία νέα" href={routes.news} linkLabel="Όλα τα νέα" />
            {posts.length ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {posts.slice(0, 3).map((p) => (
                  <NewsCard key={p.id} post={p} />
                ))}
              </div>
            ) : (
              <p>
                Δείτε τα νέα μας στο{" "}
                <a href={siteConfig.social.facebook} className="font-semibold underline">
                  Facebook
                </a>
                .
              </p>
            )}
          </div>
          <div>
            <SectionHeading title="Επόμενες εκδηλώσεις" href={routes.events} linkLabel="Όλες" />
            <div className="space-y-4">
              {upcoming.slice(0, 3).map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
              {!upcoming.length && <p>Σύντομα θα ανακοινώσουμε τις επόμενες εκδηλώσεις.</p>}
            </div>
          </div>
        </Container>
      </section>

      {/* Carousel */}
      <section
        aria-labelledby="highlights-title"
        className="on-dark relative overflow-hidden bg-forest-dark py-16 text-paper sm:py-20"
      >
        <ContourPattern seed={21} className="text-forest-light opacity-40" />
        <Container className="relative">
          <h2 id="highlights-title" className="mb-8 text-3xl sm:text-4xl">
            Στιγμές από τις δράσεις μας
          </h2>
          <HighlightsCarousel slides={slides} />
        </Container>
      </section>

      {/* Άλμπουμ */}
      <section aria-labelledby="albums-title" className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            id="albums-title"
            title="Φωτογραφίες"
            href={routes.gallery}
            linkLabel="Όλα τα άλμπουμ"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((a) => (
              <AlbumCard key={a.slug} album={a} />
            ))}
          </div>
        </Container>
      </section>

      {/* Κάλεσμα εγγραφής */}
      <section className="pb-16 sm:pb-20">
        <Container>
          <div className="on-dark relative overflow-hidden rounded-card border-4 border-scout-red bg-forest px-6 py-12 text-center text-paper sm:px-12">
            <ContourPattern seed={88} className="text-forest-light opacity-50" />
            <div className="relative">
              <h2 className="text-3xl sm:text-5xl">Έλα στην παρέα μας!</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg">
                Οι εγγραφές για τη χρονιά {new Date().getFullYear()}–
                {String(new Date().getFullYear() + 1).slice(2)} είναι ανοιχτές. Οι θέσεις ανά τμήμα
                είναι περιορισμένες.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <EnrollButton label="Αίτηση Εκδήλωσης Ενδιαφέροντος" />
                <ButtonLink href={routes.join} variant="ghost-light">
                  Πώς γίνεται η εγγραφή
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
