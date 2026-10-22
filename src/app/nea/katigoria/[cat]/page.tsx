import type { Metadata } from "next";
import { NewsListing } from "@/components/news/NewsListing";
import { allCategories, categoryLabel } from "@/lib/facebook";

export function generateStaticParams() {
  return allCategories.map((c) => ({ cat: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/nea/katigoria/[cat]">): Promise<Metadata> {
  return { title: `Νέα · ${categoryLabel((await params).cat)}` };
}

export default async function NewsCategoryPage({ params }: PageProps<"/nea/katigoria/[cat]">) {
  return <NewsListing page={1} category={(await params).cat} />;
}
