import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoGallery } from "@/components/interactive/PhotoGallery";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { getAlbum, getAlbums } from "@/lib/content/load";
import { Mdx } from "@/lib/content/mdx";
import { athensDate, formatDate } from "@/lib/dates";
import { tagLabel } from "@/lib/sections";

export function generateStaticParams() {
  return getAlbums().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/fotografies/[slug]">): Promise<Metadata> {
  const album = getAlbum((await params).slug);
  if (!album) return {};
  return { title: album.title, openGraph: { images: [album.cover] } };
}

export default async function AlbumPage({ params }: PageProps<"/fotografies/[slug]">) {
  const album = getAlbum((await params).slug);
  if (!album) notFound();
  return (
    <>
      <header className="on-dark border-b-4 border-scout-red bg-forest text-paper">
        <Container className="py-12 sm:py-16">
          <Link href="/fotografies/" className="heading text-lg text-paper/85 hover:underline">
            ← Όλα τα άλμπουμ
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge tone="red">{album.activity}</Badge>
            {album.sections.map((s) => (
              <Badge key={s} tone="outline">
                {tagLabel(s)}
              </Badge>
            ))}
          </div>
          <h1 className="mt-4 text-4xl sm:text-6xl">{album.title}</h1>
          <p className="mt-2 text-paper/85">
            {formatDate(athensDate(album.date))} · {album.photos.length} φωτογραφίες
          </p>
        </Container>
      </header>
      <section className="py-12 sm:py-16">
        <Container>
          <div className="mb-8">
            <Mdx source={album.body} />
          </div>
          <PhotoGallery photos={album.photos} />
        </Container>
      </section>
    </>
  );
}
