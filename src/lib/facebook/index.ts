import fs from "node:fs";
import path from "node:path";
import { siteConfig } from "@site-config";

/** Το σχήμα που επιστρέφει το Graph API για /{page-id}/posts. */
type GraphMedia = { media?: { image?: { src?: string } } };
type GraphPost = {
  id: string;
  message?: string;
  created_time: string;
  full_picture?: string;
  permalink_url: string;
  attachments?: { data: (GraphMedia & { subattachments?: { data: GraphMedia[] } })[] };
};

export type NewsPost = {
  id: string;
  title: string;
  /** Κείμενο χωρίς την πρώτη γραμμή (τίτλο) */
  text: string;
  date: Date;
  images: string[];
  permalink: string;
  categories: string[];
};

export type NewsResult = { posts: NewsPost[]; source: "facebook" | "mock" | "error" };

const DEFAULT_CATEGORY = siteConfig.defaultNewsCategory;

/** Χωρίς τόνους και πεζά, ώστε #Λυκοπουλα = #ΛΥΚΌΠΟΥΛΑ = #Λυκόπουλα. */
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("el");

export function categoriesFor(message: string) {
  const tags = new Set((message.match(/#[\p{L}\p{N}_]+/gu) ?? []).map(normalize));
  const found = siteConfig.newsCategories
    .filter((c) => c.hashtags.some((h) => tags.has(normalize(h))))
    .map((c) => c.slug);
  return found.length ? found : [DEFAULT_CATEGORY.slug];
}

export function categoryLabel(slug: string) {
  return (
    siteConfig.newsCategories.find((c) => c.slug === slug)?.label ??
    (slug === DEFAULT_CATEGORY.slug ? DEFAULT_CATEGORY.label : slug)
  );
}

export const allCategories = [
  ...siteConfig.newsCategories.map(({ slug, label }) => ({ slug, label })),
  DEFAULT_CATEGORY,
];

function toNewsPost(p: GraphPost): NewsPost | null {
  if (!p.message?.trim()) return null; // σκέτα shares ή αλλαγές εξωφύλλου
  const lines = p.message.trim().split("\n");
  const firstLine = lines[0].replace(/#[\p{L}\p{N}_]+/gu, "").trim();
  const title = firstLine.length > 90 ? `${firstLine.slice(0, 87).trimEnd()}…` : firstLine;
  const rest = (firstLine.length > 90 ? p.message.trim() : lines.slice(1).join("\n")).trim();

  const att = p.attachments?.data[0];
  const subImages = att?.subattachments?.data.map((s) => s.media?.image?.src) ?? [];
  const images = [...new Set([p.full_picture, ...subImages].filter((s): s is string => !!s))];

  return {
    id: p.id,
    title: title || "Νέα από το Σύστημα",
    text: rest,
    date: new Date(p.created_time),
    images,
    permalink: p.permalink_url,
    categories: categoriesFor(p.message),
  };
}

function readMock(): GraphPost[] {
  const file = path.join(process.cwd(), "content/mock/facebook-posts.json");
  return JSON.parse(fs.readFileSync(file, "utf8")).data;
}

async function fetchGraph(pageId: string, token: string): Promise<GraphPost[]> {
  const { graphVersion, postsToFetch } = siteConfig.facebook;
  const fields =
    "message,created_time,full_picture,permalink_url,attachments{media,subattachments{media}}";
  let url: string | undefined =
    `https://graph.facebook.com/${graphVersion}/${pageId}/posts?fields=${encodeURIComponent(fields)}&limit=50&access_token=${token}`;
  const all: GraphPost[] = [];
  while (url && all.length < postsToFetch) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Facebook Graph API ${res.status}`);
    const json = (await res.json()) as { data: GraphPost[]; paging?: { next?: string } };
    all.push(...json.data);
    url = json.paging?.next;
  }
  return all.slice(0, postsToFetch);
}

let cached: Promise<NewsResult> | undefined;

/**
 * Τα posts της σελίδας Facebook. Τρέχει μόνο στον server/κατά το build, οπότε το token
 * δεν φτάνει ποτέ στον browser. Χωρίς env μεταβλητές χρησιμοποιεί τα mock δεδομένα.
 */
export function getNews(): Promise<NewsResult> {
  cached ??= (async (): Promise<NewsResult> => {
    const { FB_PAGE_ID, FB_PAGE_ACCESS_TOKEN } = process.env;
    if (!FB_PAGE_ID || !FB_PAGE_ACCESS_TOKEN) {
      return { posts: mapPosts(readMock()), source: "mock" };
    }
    try {
      return {
        posts: mapPosts(await fetchGraph(FB_PAGE_ID, FB_PAGE_ACCESS_TOKEN)),
        source: "facebook",
      };
    } catch (err) {
      console.error("[facebook] Αποτυχία λήψης νέων:", err);
      return { posts: [], source: "error" };
    }
  })();
  return cached;
}

function mapPosts(raw: GraphPost[]) {
  return raw
    .map(toNewsPost)
    .filter((p): p is NewsPost => p !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getPost(id: string) {
  return (await getNews()).posts.find((p) => p.id === id);
}

export function paginate<T>(items: T[], page: number) {
  const per = siteConfig.facebook.perPage;
  const totalPages = Math.max(1, Math.ceil(items.length / per));
  return { items: items.slice((page - 1) * per, page * per), page, totalPages };
}
