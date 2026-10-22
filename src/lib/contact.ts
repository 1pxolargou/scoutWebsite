import { z } from "zod";

/** Κοινό schema για τον έλεγχο στον browser και (αργότερα) στον server. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Γράψτε το όνομά σας."),
  email: z.email("Το email δεν φαίνεται σωστό."),
  subject: z.enum(["eggrafi", "genika", "synergasia"], "Επιλέξτε θέμα."),
  message: z.string().trim().min(10, "Το μήνυμα είναι πολύ σύντομο (τουλάχιστον 10 χαρακτήρες)."),
  consent: z.literal(true, "Χρειάζεται η συγκατάθεσή σας για να απαντήσουμε."),
  /** Honeypot: πρέπει να μείνει κενό. Το συμπληρώνουν μόνο bots. */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const subjectLabels: Record<ContactInput["subject"], string> = {
  eggrafi: "Εγγραφή παιδιού",
  genika: "Γενική ερώτηση",
  synergasia: "Συνεργασία / χορηγία",
};
