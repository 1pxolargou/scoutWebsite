import { siteConfig } from "@site-config";
import type { SectionTag } from "@/lib/content/schemas";

export const systemTag = { slug: "systima", name: "Όλο το Σύστημα", shortName: "Σύστημα" } as const;

export function getSection(slug: string) {
  return siteConfig.sections.find((s) => s.slug === slug);
}

/** Σύντομο όνομα για badges, π.χ. «Λυκόπουλα» ή «Σύστημα». */
export function tagLabel(tag: SectionTag) {
  return tag === "systima" ? systemTag.shortName : (getSection(tag)?.shortName ?? tag);
}

/** Φωτογραφία κάρτας για κάθε τμήμα (αρχική, σελίδα τμημάτων, εγγραφές). */
export const sectionImages: Record<string, string> = {
  "agelh-lykopoulon": "/images/agelh/agelh-2.jpg",
  "omada-proskopon": "/images/omada/omada-1.jpg",
  "koinotita-anixneuton": "/images/koinotita/koinotita-3.jpg",
};

/** Χρώματα τμημάτων για πινέζες και υπόμνημα χάρτη. */
export const sectionColors: Record<SectionTag, string> = {
  systima: "#0f3621",
  "agelh-lykopoulon": "#c98a00",
  "omada-proskopon": "#2e6b48",
  "koinotita-anixneuton": "#c41e2f",
};

/** Ομάδες Βαθμοφόρων με τη σειρά εμφάνισης (σελίδα «Ποιοι είμαστε» και ιστορικό αρχείο). */
export const leaderGroupOrder = [
  "systima",
  "agelh-lykopoulon",
  "omada-proskopon",
  "koinotita-anixneuton",
  "diktyo",
  "eks",
] as const;

export function leaderGroupTitle(key: string) {
  if (key === "systima") return "Επιτελείο Συστήματος";
  if (key === "diktyo") return "Δίκτυο";
  if (key === "eks") return "Επιτροπή Κοινωνικής Συμπαράστασης";
  return getSection(key)?.name ?? key;
}
