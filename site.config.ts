/**
 * Κεντρικές ρυθμίσεις του site. Ό,τι αλλάζει συχνά (αριθμοί, τμήματα, σύνδεσμοι)
 * αλλάζει μόνο εδώ.
 */

export type SectionSlug = "agelh-lykopoulon" | "omada-proskopon" | "koinotita-anixneuton";

export type SectionInfo = {
  slug: SectionSlug;
  name: string;
  /** Σύντομο όνομα για badges/φίλτρα */
  shortName: string;
  ageRange: string;
  grades: string;
  meeting: string;
  /** Τηλέφωνο υπευθύνου, εμφανίζεται μόνο αν contact.publishPhones = true */
  phone?: string;
};

export const siteConfig = {
  name: "1ο Σύστημα Προσκόπων Χολαργού",
  shortName: "Πρόσκοποι Χολαργού",
  tagline: "Περιπέτεια, φιλία και υπευθυνότητα στη φύση, από το 1945.", // TODO: τελικό κείμενο
  foundedYear: 1945,
  // TODO: πραγματικό domain
  url: "https://proskopoi-xolargou.gr",
  locale: "el_GR",

  enrollmentFormUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSes0nSQ7CdzFJILd7PLI5xX5cTfZX22nA7RBCS5NDOsXUyhIg/viewform",

  parentOrganization: {
    name: "Σώμα Ελλήνων Προσκόπων",
    url: "https://www.sep.org.gr",
  },

  contact: {
    email: "1p_Xolargou@sep.org.gr",
    phone: "694 715 2426",
    // Τα τηλέφωνα είναι προσωπικά κινητά βαθμοφόρων. Μένουν κρυφά μέχρι να επιβεβαιωθεί.
    publishPhones: false,
    meetingPlace: {
      name: "Άλσος Χολαργού",
      address: "Είσοδος Β. Μελά, Χολαργός", // TODO: πλήρης διεύθυνση / Τ.Κ.
      // TODO: ακριβείς συντεταγμένες της εισόδου
      lat: 38.0046,
      lng: 23.7994,
    },
  },

  /** Περιοχή Μελών: έντυπα και στοιχεία πληρωμής για τις οικογένειες των μελών. */
  members: {
    // TODO: το πραγματικό αρχείο στο public/files/ (PDF ή DOCX)
    healthForm: {
      url: "/files/deltio-ygeias.pdf",
      label: "Δελτίο Υγείας Μέλους",
      format: "PDF",
      updated: "Σεπτέμβριος 2026",
    },
    payment: {
      // TODO: πραγματικά στοιχεία λογαριασμού
      beneficiary: "1ο Σύστημα Προσκόπων Χολαργού",
      bank: "TODO Τράπεζα",
      iban: "GR00 0000 0000 0000 0000 0000 000",
      annualFee: "TODO € ανά μέλος",
      deadline: "έως 31 Οκτωβρίου",
      reference: "Συνδρομή – Μικρό όνομα & επώνυμο μέλους – Τμήμα",
    },
  },

  social: {
    facebook: "https://www.facebook.com/", // TODO: URL της σελίδας Facebook
    instagram: undefined as string | undefined,
    youtube: undefined as string | undefined,
  },

  /** Λωρίδα «Από το 1945» στην αρχική */
  stats: [
    // Τα χρόνια δράσης υπολογίζονται αυτόματα από το foundedYear.
    { value: "auto", label: "χρόνια δράσης" },
    { value: "120+", label: "μέλη" }, // TODO: πραγματικός αριθμός
    { value: "3", label: "τμήματα" },
  ],

  sections: [
    {
      slug: "agelh-lykopoulon",
      name: "Αγέλη Λυκοπούλων",
      shortName: "Λυκόπουλα",
      ageRange: "6–10 ετών",
      grades: "Α΄ – Δ΄ Δημοτικού",
      meeting: "Σάββατα 12:30–14:00",
      phone: "698 005 0536",
    },
    {
      slug: "omada-proskopon",
      name: "Ομάδα Προσκόπων",
      shortName: "Πρόσκοποι",
      ageRange: "10–14 ετών",
      grades: "Ε΄ Δημοτικού – Β΄ Γυμνασίου",
      meeting: "Κυριακές 11:00–13:30",
      phone: "694 650 4435",
    },
    {
      slug: "koinotita-anixneuton",
      name: "Κοινότητα Ανιχνευτών",
      shortName: "Ανιχνευτές",
      ageRange: "14–18 ετών",
      grades: "Γ΄ Γυμνασίου – Γ΄ Λυκείου",
      meeting: "Σαββατοκύριακα, κατόπιν συνεννόησης",
      phone: "694 750 9210",
    },
  ] satisfies SectionInfo[],

  /** Hashtag στα posts του Facebook → κατηγορία νέων. Χωρίς γνωστό hashtag → «Γενικά». */
  newsCategories: [
    { slug: "lykopoula", label: "Λυκόπουλα", hashtags: ["#Λυκόπουλα", "#Αγέλη"] },
    { slug: "proskopoi", label: "Πρόσκοποι", hashtags: ["#Πρόσκοποι", "#Ομάδα"] },
    { slug: "anixneutes", label: "Ανιχνευτές", hashtags: ["#Ανιχνευτές", "#Κοινότητα"] },
    { slug: "ekdromi", label: "Εκδρομές", hashtags: ["#Εκδρομή"] },
    { slug: "kataskinosi", label: "Κατασκηνώσεις", hashtags: ["#Κατασκήνωση"] },
  ],
  defaultNewsCategory: { slug: "genika", label: "Γενικά" },

  facebook: {
    graphVersion: "v23.0",
    postsToFetch: 90,
    perPage: 9,
    revalidateSeconds: 3600,
  },

  /** Cookieless analytics, απενεργοποιημένο εξ ορισμού. */
  analytics: {
    enabled: false,
    provider: "plausible" as "plausible" | "umami",
    domain: undefined as string | undefined,
  },
} as const;

export type SiteConfig = typeof siteConfig;
