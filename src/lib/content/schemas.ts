import { z } from "zod";

export const sectionTags = [
  "systima",
  "agelh-lykopoulon",
  "omada-proskopon",
  "koinotita-anixneuton",
] as const;
export type SectionTag = (typeof sectionTags)[number];

/** Το YAML μετατρέπει τα σκέτα «2026-07-10» σε Date. Τα επαναφέρουμε σε string. */
const dateString = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/, "Μορφή: ΕΕΕΕ-ΜΜ-ΗΗ ή ΕΕΕΕ-ΜΜ-ΗΗTΩΩ:ΛΛ"),
);

/**
 * Κάθε εικόνα χρειάζεται alt και ρητό allowPublish (συγκατάθεση γονέων).
 * Αν λείπει το allowPublish, το build αποτυγχάνει.
 */
export const photoSchema = z.strictObject({
  src: z.string().startsWith("/", "Η διαδρομή ξεκινά με /images/..."),
  alt: z.string().min(3, "Το alt είναι υποχρεωτικό"),
  caption: z.string().optional(),
  allowPublish: z.boolean({ error: "Λείπει το allowPublish (true/false)" }),
});
export type Photo = z.infer<typeof photoSchema>;

export const eventSchema = z.strictObject({
  title: z.string().min(3),
  start: dateString,
  end: dateString.optional(),
  allDay: z.boolean().default(false),
  location: z.string().min(2),
  mapUrl: z.url().optional(),
  sections: z.array(z.enum(sectionTags)).min(1),
  summary: z.string().max(220),
  cover: photoSchema.optional(),
});

export const albumSchema = z.strictObject({
  title: z.string().min(3),
  date: dateString,
  activity: z.string().min(2),
  sections: z.array(z.enum(sectionTags)).min(1),
  cover: z.string().startsWith("/"),
  photos: z.array(photoSchema).min(1),
});

export const sectionPageSchema = z.strictObject({
  slug: z.enum(["agelh-lykopoulon", "omada-proskopon", "koinotita-anixneuton"]),
  intro: z.string(),
  cover: photoSchema,
  activities: z.array(z.string()).min(1),
  gallery: z.array(photoSchema),
});

export const historySchema = z.array(
  z.strictObject({ year: z.number().int(), title: z.string(), text: z.string() }),
);

/** Ομάδες ενηλίκων: τα τμήματα + Δίκτυο + ΕΚΣ. */
export const leaderGroups = [...sectionTags, "diktyo", "eks"] as const;

/**
 * Βαθμοφόροι (ενήλικες). Το id συνδέει τον Βαθμοφόρο με το ιστορικό αρχείο.
 * Το strictObject απορρίπτει πεδία που δεν προβλέπονται (π.χ. τηλέφωνα, διευθύνσεις).
 */
export const leaderSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/, "Μόνο λατινικά πεζά, αριθμοί και παύλες"),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  scoutName: z.string().optional(),
  role: z.string(),
  section: z.enum(leaderGroups),
  /** Η χρονιά που ήρθε στο Σύστημα ως Βαθμοφόρος */
  joinedYear: z.number().int().min(1945).max(2100).optional(),
  trainings: z.array(z.string()).default([]),
  /** Φωτογραφία: /images/vathmoforoi/<id>.jpg. Χωρίς αυτήν εμφανίζεται κενή θέση. */
  photo: photoSchema.optional(),
});
export type Leader = z.infer<typeof leaderSchema>;

export const leadersSchema = z.array(leaderSchema);

export const faqSchema = z.array(z.strictObject({ q: z.string(), a: z.string() }));

export const carouselSchema = z.array(photoSchema).min(1);

const placeSchema = z.strictObject({
  name: z.string(),
  lat: z.number().min(34).max(42, "Γεωγραφικό πλάτος εκτός Ελλάδας;"),
  lng: z.number().min(19).max(30, "Γεωγραφικό μήκος εκτός Ελλάδας;"),
});

/** Μία προσκοπική χρονιά του ιστορικού αρχείου (ένα αρχείο ανά χρονιά στο content/archive/). */
export const archiveYearSchema = z.strictObject({
  year: z.string().regex(/^\d{4}–\d{2}$/, "Μορφή: 2025–26 (με μεσαία παύλα –)"),
  /** Προαιρετική σημείωση για τη χρονιά, π.χ. επέτειος ή σημαντικό γεγονός */
  note: z.string().optional(),
  leaders: z.array(
    z.strictObject({
      name: z.string(),
      role: z.string(),
      section: z.enum(leaderGroups),
      leaderId: z.string().optional(),
    }),
  ),
  trips: z.array(
    z
      .strictObject({
        title: z.string(),
        section: z.enum(sectionTags),
        /** Προαιρετική: το αρχείο συχνά έχει μόνο τη χρονιά */
        date: dateString.optional(),
        type: z.enum(["point", "route"]),
        places: z.array(placeSchema).min(1),
      })
      .refine((t) => t.type === "point" || t.places.length >= 2, {
        message: "Μια διαδρομή (route) χρειάζεται τουλάχιστον 2 σημεία",
      }),
  ),
});
export type ArchiveYear = z.infer<typeof archiveYearSchema>;
