import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@site-config";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { EnrollButton } from "@/components/ui/EnrollButton";
import { getEvent, getEvents, isPastEvent } from "@/lib/content/load";
import { Mdx } from "@/lib/content/mdx";
import { formatRange } from "@/lib/dates";
import { tagLabel } from "@/lib/sections";

export function generateStaticParams() {
  return getEvents().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/ekdiloseis/[slug]">): Promise<Metadata> {
  const event = getEvent((await params).slug);
  if (!event) return {};
  return {
    title: event.title,
    description: event.summary,
    openGraph: event.cover ? { images: [event.cover.src] } : undefined,
  };
}

export default async function EventPage({ params }: PageProps<"/ekdiloseis/[slug]">) {
  const event = getEvent((await params).slug);
  if (!event) notFound();
  const isPast = isPastEvent(event);

  const mapUrl =
    event.mapUrl ??
    `https://www.openstreetmap.org/search?query=${encodeURIComponent(event.location)}`;

  return (
    <article>
      <header className="on-dark border-b-4 border-scout-red bg-forest text-paper">
        <Container className="py-12 sm:py-16">
          <Link href="/ekdiloseis/" className="heading text-lg text-paper/85 hover:underline">
            ← Όλες οι εκδηλώσεις
          </Link>
          <div className="mt-4 flex flex-wrap gap-2">
            {isPast && <Badge tone="outline">Ολοκληρώθηκε</Badge>}
            {event.sections.map((s) => (
              <Badge key={s} tone="red">
                {tagLabel(s)}
              </Badge>
            ))}
          </div>
          <h1 className="mt-4 max-w-4xl text-4xl sm:text-6xl">{event.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-paper/90">{event.summary}</p>
        </Container>
      </header>

      <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_22rem]">
        <div>
          {event.cover && (
            <div className="relative mb-10 aspect-[4/3] max-h-[34rem] overflow-hidden rounded-card border-2 border-forest/15 bg-sand">
              <Image
                src={event.cover.src}
                alt={event.cover.alt}
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-contain"
              />
            </div>
          )}
          <Mdx source={event.body} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <dl className="space-y-4 rounded-card border-2 border-forest/20 bg-sand p-6">
            <div>
              <dt className="text-sm font-semibold text-forest">Πότε</dt>
              <dd>
                <time dateTime={event.startDate.toISOString()}>
                  {formatRange(event.startDate, event.endDate, event.allDay)}
                </time>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-forest">Πού</dt>
              <dd>
                {event.location}{" "}
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-forest underline"
                >
                  χάρτης<span className="sr-only"> (ανοίγει σε νέα καρτέλα)</span>
                </a>
              </dd>
            </div>
          </dl>
          {!isPast && (
            <a
              href={`/ekdiloseis/${event.slug}/calendar.ics`}
              download
              className={buttonClasses("secondary", "w-full")}
            >
              <span aria-hidden="true">📅</span> Προσθήκη στο ημερολόγιο
            </a>
          )}
          <div className="rounded-card border-2 border-forest/15 p-6 text-center">
            <p className="mb-4">Θέλετε το παιδί σας να συμμετέχει σε δράσεις σαν αυτή;</p>
            <EnrollButton label="Εγγραφές" />
            <p className="mt-3 text-sm text-ink/75">{siteConfig.contact.email}</p>
          </div>
        </aside>
      </Container>
    </article>
  );
}
