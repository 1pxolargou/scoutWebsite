import type { Metadata } from "next";
import { NewsListing } from "@/components/news/NewsListing";

export const metadata: Metadata = {
  title: "Νέα",
  description: "Τα τελευταία νέα του 1ου Συστήματος Προσκόπων Χολαργού.",
};

export default function NewsPage() {
  return <NewsListing page={1} />;
}
