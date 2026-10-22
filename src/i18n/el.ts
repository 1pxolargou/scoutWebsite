/**
 * Σταθερά κείμενα του UI. Όταν προστεθούν αγγλικά, φτιάχνουμε en.ts με το ίδιο σχήμα.
 */
export const el = {
  skipToContent: "Μετάβαση στο περιεχόμενο",
  nav: {
    label: "Κύρια πλοήγηση",
    home: "Αρχική",
    about: "Ποιοι είμαστε",
    sections: "Τμήματα",
    news: "Νέα",
    events: "Εκδηλώσεις",
    gallery: "Φωτογραφίες",
    join: "Εγγραφές",
    contact: "Επικοινωνία",
    archive: "Αρχείο",
    members: "Περιοχή Μελών",
    openMenu: "Άνοιγμα μενού",
    closeMenu: "Κλείσιμο μενού",
  },
  enroll: {
    cta: "Εγγραφές",
    apply: "Αίτηση Εκδήλωσης Ενδιαφέροντος",
    applyShort: "Κάνε αίτηση",
    newTabHint: "(ανοίγει τη φόρμα Google σε νέα καρτέλα)",
  },
  footer: {
    meetingPlace: "Τόπος συγκέντρωσης",
    contact: "Επικοινωνία",
    links: "Σύνδεσμοι",
    memberOf: "Μέλος του",
    privacy: "Πολιτική Απορρήτου",
    cookies: "Cookies",
    rights: "Με την επιφύλαξη παντός δικαιώματος.",
  },
  externalLink: "(ανοίγει σε νέα καρτέλα)",
} as const;

export type Dictionary = typeof el;

export const t = el;
