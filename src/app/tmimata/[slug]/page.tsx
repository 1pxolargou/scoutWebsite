import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { siteConfig } from "@site-config";
import { EventCard } from "@/components/cards/EventCard";
import { PhotoGallery } from "@/components/interactive/PhotoGallery";
import { Container } from "@/components/layout/Container";
import { ContourPattern } from "@/components/ui/ContourPattern";
import { EnrollButton } from "@/components/ui/EnrollButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Shield } from "@/components/ui/Shield";
import { getSectionPage, splitEvents } from "@/lib/content/load";
import { Mdx } from "@/lib/content/mdx";
import { routes } from "@/lib/routes";
import { getSection } from "@/lib/sections";

export function generateStaticParams() {
  return siteConfig.sections.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/tmimata/[slug]">): Promise<Metadata> {
  const section = getSection((await params).slug);
  if (!section) return {};
  return {
    title: section.name,
    description: `${section.name}: ${section.ageRange} (${section.grades}). ${section.meeting}.`,
  };
}

export default async function SectionPage({ params }: PageProps<"/tmimata/[slug]">) {
  const { slug } = await params;
  const section = getSection(slug);
  const page = getSectionPage(slug);
  if (!section || !page) notFound();
  const events = splitEvents()
    .upcoming.filter((e) => e.sections.includes(section.slug) || e.sections.includes("systima"))
    .slice(0, 3);

  const facts = [
    { label: "Ηλικία", value: section.ageRange },
    { label: "Τάξεις", value: section.grades },
    { label: "Συγκέντρωση", value: section.meeting },
    { label: "Τόπος", value: siteConfig.contact.meetingPlace.name },
  ];

  return (
    <>
      <section className="on-dark relative overflow-hidden border-b-4 border-scout-red bg-forest text-paper">
        <ContourPattern seed={slug.length * 7} className="text-forest-light opacity-60" />
        <Container className="relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="heading mb-3 text-lg tracking-widest text-paper/85">
              <a href={routes.sections} className="hover:underline">
                Τμήματα
              </a>{" "}
              / {section.shortName}
            </p>
            <h1 className="text-5xl sm:text-7xl">{section.name}</h1>
            <p className="mt-5 max-w-xl text-lg text-paper/90">{page.intro}</p>
            <div className="mt-8">
              <EnrollButton label="Αίτηση Εκδήλωσης Ενδιαφέροντος" />
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-card border-4 border-paper">
              <Image
                src={page.cover.src}
                alt={page.cover.alt}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <Shield className="absolute -bottom-6 -left-4 h-28 w-24 sm:h-32 sm:w-28">
              <span className="heading block text-2xl leading-none">
                {section.ageRange.replace(" ετών", "")}
              </span>
              <span className="text-sm">ετών</span>
            </Shield>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_20rem]">
          <div>
            <Mdx source={page.body} />
          </div>
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <dl className="rounded-card border-2 border-forest/20 bg-sand p-6">
              <h2 className="mb-4 text-2xl text-forest">Με μια ματιά</h2>
              {facts.map((f) => (
                <div key={f.label} className="border-b border-forest/15 py-2 last:border-0">
                  <dt className="text-sm font-semibold text-forest">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="rounded-card border-2 border-forest/20 p-6">
              <h2 className="mb-4 text-2xl text-forest">Τυπικές δραστηριότητες</h2>
              <ul className="space-y-2">
                {page.activities.map((a) => (
                  <li key={a} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-scout-red"
                    />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Container>
      </section>

      {page.gallery.length > 0 && (
        <section aria-labelledby="gallery-title" className="bg-sand py-16 sm:py-20">
          <Container>
            <SectionHeading
              id="gallery-title"
              title="Φωτογραφίες"
              href={routes.gallery}
              linkLabel="Όλα τα άλμπουμ"
            />
            <PhotoGallery photos={page.gallery} />
          </Container>
        </section>
      )}

      {events.length > 0 && (
        <section aria-labelledby="events-title" className="py-16 sm:py-20">
          <Container>
            <SectionHeading
              id="events-title"
              title="Επόμενες εκδηλώσεις"
              href={routes.events}
              linkLabel="Όλες"
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
