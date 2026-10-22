import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoGallery } from "@/components/interactive/PhotoGallery";
import { Container } from "@/components/layout/Container";
import { ExternalIcon, ExternalLink, buttonClasses } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatLongDate } from "@/lib/dates";
import { categoryLabel, getNews, getPost } from "@/lib/facebook";

export async function generateStaticParams() {
  return (await getNews()).posts.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/nea/[id]">): Promise<Metadata> {
  const post = await getPost((await params).id);
  if (!post) return {};
  return {
    title: post.title,
    description: post.text.slice(0, 160),
    openGraph: post.images[0] ? { images: [post.images[0]] } : undefined,
  };
}

export default async function NewsPostPage({ params }: PageProps<"/nea/[id]">) {
  const post = await getPost((await params).id);
  if (!post) notFound();
  const [cover, ...rest] = post.images;

  return (
    <article>
      <header className="on-dark border-b-4 border-scout-red bg-forest text-paper">
        <Container className="max-w-4xl py-12 sm:py-16">
          <Link href="/nea/" className="heading text-lg text-paper/85 hover:underline">
            ← Όλα τα νέα
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {post.categories.map((c) => (
              <Badge key={c} tone="red">
                {categoryLabel(c)}
              </Badge>
            ))}
            <time dateTime={post.date.toISOString()} className="text-paper/85">
              {formatLongDate(post.date)}
            </time>
          </div>
          <h1 className="mt-4 font-sans text-3xl font-bold tracking-normal normal-case sm:text-5xl">
            {post.title}
          </h1>
        </Container>
      </header>

      <Container className="max-w-4xl py-12">
        {cover && (
          <div className="relative mb-10 aspect-[16/10] overflow-hidden rounded-card border-2 border-forest/15">
            <Image
              src={cover}
              alt=""
              fill
              priority
              sizes="(min-width: 896px) 896px, 100vw"
              className="object-cover"
            />
          </div>
        )}
        <div className="prose-scout text-lg whitespace-pre-line">{post.text}</div>

        {rest.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 text-2xl text-forest">Περισσότερες φωτογραφίες</h2>
            <PhotoGallery
              photos={rest.map((src, i) => ({
                src,
                alt: `Φωτογραφία ${i + 2} από την ανάρτηση «${post.title}»`,
                allowPublish: true,
              }))}
            />
          </div>
        )}

        <div className="mt-12 border-t-2 border-forest/15 pt-8">
          <ExternalLink href={post.permalink} className={buttonClasses("secondary")}>
            Δείτε την ανάρτηση στο Facebook <ExternalIcon />
          </ExternalLink>
        </div>
      </Container>
    </article>
  );
}
