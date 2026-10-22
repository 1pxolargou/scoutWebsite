import Link from "next/link";
import { siteConfig } from "@site-config";
import { NewsCard } from "@/components/cards/NewsCard";
import { Container } from "@/components/layout/Container";
import { ExternalLink } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { Pagination } from "@/components/ui/Pagination";
import { allCategories, categoryLabel, getNews, paginate } from "@/lib/facebook";

/** Κοινή σελίδα λίστας νέων για /nea, /nea/selida/n και /nea/katigoria/... */
export async function NewsListing({ page, category }: { page: number; category?: string }) {
  const { posts, source } = await getNews();
  const filtered = category ? posts.filter((p) => p.categories.includes(category)) : posts;
  const { items, totalPages } = paginate(filtered, page);
  const base = category ? `/nea/katigoria/${category}` : "/nea";

  const chip = "rounded-full border-2 px-4 py-1.5 text-sm font-semibold";
  return (
    <>
      <PageHero
        eyebrow="Νέα"
        title={category ? categoryLabel(category) : "Τα νέα μας"}
        intro="Ό,τι συμβαίνει στο Σύστημα, όπως το μοιραζόμαστε στη σελίδα μας στο Facebook."
        seed={60}
      />
      <section className="py-12 sm:py-16">
        <Container>
          <nav aria-label="Κατηγορίες νέων" className="mb-10">
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link
                  href="/nea/"
                  aria-current={!category ? "page" : undefined}
                  className={`${chip} ${!category ? "border-forest bg-forest text-paper" : "border-forest/30 text-forest hover:border-forest"}`}
                >
                  Όλα
                </Link>
              </li>
              {allCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/nea/katigoria/${c.slug}/`}
                    aria-current={category === c.slug ? "page" : undefined}
                    className={`${chip} ${category === c.slug ? "border-forest bg-forest text-paper" : "border-forest/30 text-forest hover:border-forest"}`}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {source === "mock" && (
            <p className="mb-8 rounded-md border-l-4 border-scout-red bg-sand p-3 text-sm">
              TODO: Ενδεικτικά νέα. Όταν οριστούν τα FB_PAGE_ID και FB_PAGE_ACCESS_TOKEN, εδώ θα
              εμφανίζονται τα πραγματικά posts της σελίδας Facebook.
            </p>
          )}

          {items.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <NewsCard key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <p className="rounded-card bg-sand p-8 text-center">
              {source === "error"
                ? "Δεν μπορέσαμε να φορτώσουμε τα νέα αυτή τη στιγμή. "
                : "Δεν υπάρχουν ακόμα νέα σε αυτή την κατηγορία. "}
              Δείτε τα νέα μας στο{" "}
              <ExternalLink
                href={siteConfig.social.facebook}
                className="font-semibold text-forest underline"
              >
                Facebook
              </ExternalLink>
              .
            </p>
          )}

          <Pagination base={base} page={page} totalPages={totalPages} />
        </Container>
      </section>
    </>
  );
}

/** Όλες οι σελίδες (και η 1, ώστε η λίστα να μην είναι ποτέ κενή στο static export). */
export async function pageParams(category?: string) {
  const { posts } = await getNews();
  const count = category
    ? posts.filter((p) => p.categories.includes(category)).length
    : posts.length;
  const total = Math.max(1, Math.ceil(count / siteConfig.facebook.perPage));
  return Array.from({ length: total }, (_, i) => String(i + 1));
}
