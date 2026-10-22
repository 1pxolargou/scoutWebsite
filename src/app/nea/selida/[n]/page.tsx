import type { Metadata } from "next";
import { NewsListing, pageParams } from "@/components/news/NewsListing";

export async function generateStaticParams() {
  return (await pageParams()).map((n) => ({ n }));
}

export async function generateMetadata({
  params,
}: PageProps<"/nea/selida/[n]">): Promise<Metadata> {
  const { n } = await params;
  return { title: `Νέα · Σελίδα ${n}`, alternates: { canonical: n === "1" ? "/nea/" : undefined } };
}

export default async function NewsPageN({ params }: PageProps<"/nea/selida/[n]">) {
  return <NewsListing page={Number((await params).n)} />;
}
