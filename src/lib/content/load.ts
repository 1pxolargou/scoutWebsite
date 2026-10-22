import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { z } from "zod";
import { athensDate } from "@/lib/dates";
import {
  albumSchema,
  archiveYearSchema,
  carouselSchema,
  eventSchema,
  faqSchema,
  historySchema,
  leadersSchema,
  sectionPageSchema,
  type Photo,
} from "./schemas";

const CONTENT = path.join(process.cwd(), "content");

function parse<T extends z.ZodType>(schema: T, data: unknown, file: string): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Μη έγκυρο περιεχόμενο στο content/${file}\n${issues}`);
  }
  return result.data;
}

function readJson<T extends z.ZodType>(file: string, schema: T): z.infer<T> {
  const raw = JSON.parse(fs.readFileSync(path.join(CONTENT, file), "utf8"));
  return parse(schema, raw, file);
}

function readMdxDir<T extends z.ZodType>(
  dir: string,
  schema: T,
): (z.infer<T> & { slug: string; body: string })[] {
  const full = path.join(CONTENT, dir);
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(full, file), "utf8"));
      return Object.assign(
        { slug: file.replace(/.mdx$/, ""), body: content },
        parse(schema, data, `${dir}/${file}`),
      );
    });
}

/** Κρατά μόνο φωτογραφίες με allowPublish: true και προειδοποιεί για τις υπόλοιπες. */
export function publishable(photos: Photo[], where: string) {
  return photos.filter((p) => {
    if (!p.allowPublish)
      console.warn(`[content] Παραλείπεται ${p.src} (${where}): allowPublish=false`);
    return p.allowPublish;
  });
}

// ---------- Εκδηλώσεις ----------

export type EventItem = ReturnType<typeof getEvents>[number];

export function getEvents() {
  return readMdxDir("events", eventSchema)
    .map((e) => {
      const start = athensDate(e.start);
      const end = e.end ? athensDate(e.end) : undefined;
      const cover = e.cover && e.cover.allowPublish ? e.cover : undefined;
      return {
        ...e,
        cover,
        startDate: start,
        endDate: end,
        allDay: e.allDay || !e.start.includes("T"),
      };
    })
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

/** Η εκδήλωση έχει τελειώσει (με βάση την ώρα του build). */
export function isPastEvent(e: EventItem, now = new Date()) {
  return (e.endDate ?? e.startDate).getTime() < now.getTime();
}

/** Επερχόμενες/παλαιότερες με βάση την ώρα του build (ή του revalidate). */
export function splitEvents(now = new Date()) {
  const events = getEvents();
  const isPast = (e: EventItem) => (e.endDate ?? e.startDate).getTime() < now.getTime();
  return {
    upcoming: events.filter((e) => !isPast(e)),
    past: events.filter(isPast).reverse(),
  };
}

export function getEvent(slug: string) {
  return getEvents().find((e) => e.slug === slug);
}

// ---------- Άλμπουμ ----------

export type Album = ReturnType<typeof getAlbums>[number];

export function getAlbums() {
  return readMdxDir("albums", albumSchema)
    .map((a) => ({
      ...a,
      year: Number(a.date.slice(0, 4)),
      photos: publishable(a.photos, `albums/${a.slug}`),
    }))
    .filter((a) => a.photos.length > 0)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getAlbum(slug: string) {
  return getAlbums().find((a) => a.slug === slug);
}

// ---------- Τμήματα ----------

export function getSectionPage(slug: string) {
  const page = readMdxDir("sections", sectionPageSchema).find((s) => s.slug === slug);
  if (!page) return undefined;
  return { ...page, gallery: publishable(page.gallery, `sections/${slug}`) };
}

// ---------- JSON ----------

export const getHistory = () => readJson("history.json", historySchema);
export const getLeaders = () => readJson("leaders.json", leadersSchema);
export const getFaq = () => readJson("faq.json", faqSchema);
export const getCarousel = () =>
  publishable(readJson("carousel.json", carouselSchema), "carousel.json");

/**
 * Ιστορικό αρχείο: ένα αρχείο ανά χρονιά στο content/archive/ (π.χ. 1985-86.json),
 * από την πιο πρόσφατη. Ελέγχει ότι το όνομα αρχείου ταιριάζει με τη χρονιά και ότι κάθε leaderId υπάρχει.
 */
export function getArchive() {
  const ids = new Set(getLeaders().map((l) => l.id));
  const dir = path.join(CONTENT, "archive");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_")) // _places.json κτλ. είναι βοηθητικά
    .map((file) => {
      const y = readJson(`archive/${file}`, archiveYearSchema);
      if (file !== `${y.year.replace("–", "-")}.json`)
        throw new Error(
          `content/archive/${file}: το όνομα αρχείου πρέπει να είναι ${y.year.replace("–", "-")}.json`,
        );
      for (const l of y.leaders)
        if (l.leaderId && !ids.has(l.leaderId))
          throw new Error(`content/archive/${file}: άγνωστο leaderId «${l.leaderId}»`);
      return y;
    })
    .sort((a, b) => b.year.localeCompare(a.year));
}
