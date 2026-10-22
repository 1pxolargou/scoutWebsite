import type { Metadata } from "next";
import { NewsListing, pageParams } from "@/components/news/NewsListing";
import { allCategories, categoryLabel } from "@/lib/facebook";

export async function generateStaticParams() {
  const all = await Promise.all(
    allCategories.map(async (c) => (await pageParams(c.slug)).map((n) => ({ cat: c.slug, n }))),
  );
  return all.flat();
}

export async function generateMetadata({
  params,
}: PageProps<"/nea/katigoria/[cat]/selida/[n]">): Promise<Metadata> {
  const { cat, n } = await params;
  return { title: `Νέα · ${categoryLabel(cat)} · Σελίδα ${n}` };
}

export default async function NewsCategoryPageN({
  params,
}: PageProps<"/nea/katigoria/[cat]/selida/[n]">) {
  const { cat, n } = await params;
  return <NewsListing page={Number(n)} category={cat} />;
}
