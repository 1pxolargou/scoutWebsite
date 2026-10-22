# Βήμα 1 — Σχέδιο: Ιστοσελίδα 1ου Συστήματος Προσκόπων Χολαργού

Κατάσταση: **προς έγκριση**. Δεν έχει γραφτεί κώδικας ακόμα.

---

## 0. Τι βρήκα στον φάκελο

- Δεν υπάρχει ακόμα έργο ή `public/brand/`. Υπάρχουν φάκελοι με φωτογραφίες: `logo/` (θυρεός σε πράσινο + banner με ισοϋψείς), `αφισα/` (2 αφίσες), `αγελη/`, `ομαδα/`, `κοινοτητα/` (από 3), `ΕΚΣ/`, `βαθμοφοροι/` (από 2), `συστημα/` (άδειος).
- Η αφίσα δίνει πραγματικά στοιχεία, τα οποία θα χρησιμοποιήσω αντί για placeholders (αν συμφωνείς):
  - Αγέλη: Σάββατα 12:30–14:00 · Ομάδα: Κυριακές 11:00–13:30 · Κοινότητα: Σαββατοκύριακα, κατόπιν συνεννόησης
  - Email `1p_Xolargou@sep.org.gr`, γενικό τηλ. 694 715 2426 και ένα τηλέφωνο ανά τμήμα
  - Τόπος: Άλσος Χολαργού (Είσοδος Β. Μελά)
- Οι αφίσες έχουν και **εξάγωνα με κόκκινο περίγραμμα**. Προτείνω να το κρατήσουμε ως δεύτερο μοτίβο για τα πλαίσια φωτογραφιών, δίπλα στον θυρεό.
- Node 26 / npm 11 είναι εγκατεστημένα. Ο φάκελος **δεν είναι git repo** και θα κάνω `git init` στο Scaffold.

## 1. Έλεγχος αντίθεσης (WCAG AA)

| Ζεύγος                                       | Λόγος             |                                 |
| -------------------------------------------- | ----------------- | ------------------------------- |
| paper σε forest / forest-dark / forest-light | 10.2 / 13.4 / 6.3 | ✅                              |
| paper σε scout-red / scout-red-dark          | 5.9 / 8.1         | ✅                              |
| ink σε sand / paper                          | 15.1 / 17.0       | ✅                              |
| forest σε sand                               | 9.1               | ✅                              |
| scout-red σε sand / paper                    | 5.2 / 5.9         | ✅                              |
| **scout-red σε forest**                      | **1.74**          | ❌ ακόμα και για μεγάλο κείμενο |
| forest-light σε forest                       | 1.61              | μόνο διακοσμητικά               |

Δεν χρειάζεται καμία αλλαγή στα χρώματα. Χρειάζονται μόνο κανόνες χρήσης:

1. **Ποτέ κόκκινο κείμενο πάνω σε πράσινο.** Στο πράσινο, το κόκκινο εμφανίζεται μόνο ως γέμισμα κουμπιού (με λευκό κείμενο) ή ως διακοσμητικό περίγραμμα/θυρεός.
2. Τα κόκκινα κουμπιά πάνω σε πράσινο παίρνουν λεπτό λευκό περίγραμμα, ώστε το όριό τους να ξεχωρίζει (WCAG 1.4.11).
3. Το focus ring θα είναι λευκό σε πράσινο φόντο και forest σε ανοιχτό φόντο, ποτέ κόκκινο σε πράσινο.

## 2. Τεχνικές επιλογές

| Θέμα                  | Πρόταση                                                                                                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework             | Next.js τελευταία stable (App Router, Turbopack), React 19, TypeScript `strict`                                                                                                                |
| Styling               | Tailwind CSS v4. Τα tokens μπαίνουν στο `@theme` του `globals.css`, οπότε δεν χρειάζεται `tailwind.config`                                                                                     |
| Fonts                 | `next/font/google`: **Fira Sans Extra Condensed** (700) για τίτλους και **Noto Sans** για κείμενο, και τα δύο με subsets `greek` + `latin`                                                     |
| Κεφαλαία χωρίς τόνους | `text-transform: uppercase` με `<html lang="el">`. Θα το επαληθεύσω στο Scaffold σε Chrome/Firefox/Safari. Αν κάποιος browser αφήνει τόνους, θα προσθέσω ένα μικρό helper `toUpperNoAccents()` |
| MDX                   | `@mdx-js/mdx` (επίσημο) + `gray-matter` για YAML frontmatter, που είναι πιο φιλικό για βαθμοφόρους από `export const`                                                                          |
| Επικύρωση             | `zod`, για frontmatter, JSON, config και φόρμα επικοινωνίας                                                                                                                                    |
| Carousel              | `embla-carousel-react` + `embla-carousel-autoplay` (~7 KB)                                                                                                                                     |
| Lightbox              | Δικό μας μικρό component με native `<dialog>`, χωρίς βιβλιοθήκη                                                                                                                                |
| .ics                  | Χειροποίητο string (RFC 5545), χωρίς βιβλιοθήκη                                                                                                                                                |
| Email φόρμας          | Resend μέσω απλού `fetch` στο REST API τους, χωρίς SDK                                                                                                                                         |
| OG εικόνες            | `next/og` (ενσωματωμένο), με το TTF της γραμματοσειράς στο repo για ελληνικά                                                                                                                   |
| Lint/format           | ESLint (`eslint-config-next`) + Prettier + `prettier-plugin-tailwindcss` (dev)                                                                                                                 |

**Συνολικά runtime deps:** next, react, react-dom, zod, @mdx-js/mdx, gray-matter, embla-carousel-react, embla-carousel-autoplay.

## 3. Δομή φακέλων

```
/
├─ site.config.ts              # ΜΟΝΑΔΙΚΗ πηγή: αριθμοί, τμήματα, enrollmentFormUrl,
│                              #   social, επικοινωνία, hashtag→κατηγορία, analytics flag
├─ content/
│  ├─ _templates/              # event.mdx, album.mdx (+ README με οδηγίες)
│  ├─ events/                  # 2026-10-03-agiasmos.mdx …
│  ├─ sections/                # agelh.mdx, omada.mdx, koinotita.mdx (κείμενο σελίδας)
│  ├─ albums/                  # 2026-ekdromi-parnitha/index.mdx + φωτογραφίες
│  ├─ about.mdx                # «Τι είναι ο προσκοπισμός», αξίες
│  ├─ history.json             # χρονολόγιο
│  ├─ leaders.json             # μικρά ονόματα + ρόλοι
│  ├─ faq.json                 # FAQ εγγραφών
│  ├─ carousel.json            # επιλεγμένες φωτογραφίες αρχικής
│  └─ mock/facebook-posts.json # χρησιμοποιείται όταν λείπει το token
├─ public/
│  ├─ brand/                   # logo.png, banner.jpg (από τον φάκελο logo/)
│  └─ images/                  # φωτογραφίες τμημάτων/carousel/albums
├─ src/
│  ├─ app/                     # routes (βλ. §4)
│  ├─ components/
│  │  ├─ layout/               # Header, MobileNav, Footer, SkipLink, Container
│  │  ├─ ui/                   # Button, ButtonLink, ExternalCta, ShieldFrame,
│  │  │                        #   HexFrame, ContourPattern, Badge, Accordion,
│  │  │                        #   Pagination, SectionHeading, Prose
│  │  ├─ home/                 # Hero, StatsStrip, HighlightsCarousel
│  │  ├─ sections/             # SectionCard, SectionFacts
│  │  ├─ news/                 # NewsCard, NewsList, CategoryFilter
│  │  ├─ events/               # EventCard, EventMeta, AddToCalendar
│  │  ├─ gallery/              # AlbumCard, PhotoGrid, Lightbox (client)
│  │  ├─ about/                # Timeline, LeaderCard
│  │  ├─ contact/              # ContactForm (client), MapOnClick (client)
│  │  └─ enroll/               # FormEmbedOnClick (client), FaqAccordion
│  ├─ lib/
│  │  ├─ content/              # schemas.ts (zod), loaders: events, albums,
│  │  │                        #   sections, json; mdx.ts
│  │  ├─ facebook/             # client.ts (Graph API), map.ts (post→NewsPost),
│  │  │                        #   categories.ts (hashtags), mock.ts
│  │  ├─ ics.ts, dates.ts (el-GR, Europe/Athens), seo.ts, rate-limit.ts, mail.ts
│  └─ i18n/
│     └─ el.ts                 # όλα τα σταθερά UI strings, ώστε να προστεθεί en.ts αργότερα
├─ scripts/check-content.ts    # τρέχει στο prebuild: allowPublish, alt, ανήλικοι
├─ .env.example
└─ README.md
```

## 4. Σελίδες και URLs (greeklish slugs)

| Σελίδα              | Route                                                                             | Rendering                             |
| ------------------- | --------------------------------------------------------------------------------- | ------------------------------------- |
| Αρχική              | `/`                                                                               | Static + ISR 1h (λόγω νέων)           |
| Ποιοι είμαστε       | `/poioi-eimaste`                                                                  | Static                                |
| Τμήματα (ευρετήριο) | `/tmimata`                                                                        | Static                                |
| Τμήμα               | `/tmimata/[slug]` → `agelh-lykopoulon`, `omada-proskopon`, `koinotita-anixneuton` | Static (`generateStaticParams`)       |
| Νέα                 | `/nea`, `/nea/selida/[n]`                                                         | ISR 1h                                |
| Νέα ανά κατηγορία   | `/nea/katigoria/[cat]`, `/nea/katigoria/[cat]/selida/[n]`                         | ISR 1h                                |
| Άρθρο               | `/nea/[id]`                                                                       | ISR 1h, `dynamicParams` για νέα posts |
| Εκδηλώσεις          | `/ekdiloseis` (επερχόμενες + παλαιότερες)                                         | Static                                |
| Εκδήλωση            | `/ekdiloseis/[slug]`                                                              | Static                                |
| .ics                | `/ekdiloseis/[slug]/calendar.ics` (route handler, static)                         | Static                                |
| Φωτογραφίες         | `/fotografies` (ομαδοποίηση ανά έτος/δραστηριότητα)                               | Static                                |
| Άλμπουμ             | `/fotografies/[slug]`                                                             | Static                                |
| Εγγραφές            | `/eggrafes`                                                                       | Static                                |
| Επικοινωνία         | `/epikoinonia`                                                                    | Static + Server Action                |
| Απόρρητο / Cookies  | `/politiki-aporritou`, `/cookies`                                                 | Static                                |
| 404                 | `not-found.tsx`                                                                   | Static                                |
| SEO                 | `sitemap.ts`, `robots.ts`, `opengraph-image.tsx` (root + ανά τμήμα/εκδήλωση)      | Static                                |

Χρησιμοποιώ σελίδες με path segments αντί για `?page=` ώστε οι λίστες να μένουν static, χωρίς searchParams.

## 5. Content schema (zod)

**site.config.ts**

```ts
{
  name, shortName, foundedYear: 1945, url,
  enrollmentFormUrl, email, phone,
  meetingPlace: { name, address, lat, lng },
  social: { facebook, instagram?, youtube? },
  stats: [{ value: "80+", label: "χρόνια δράσης" }, …],   // «Από το 1945»
  sections: [{ slug, name, shortName, ageRange: "6–10", grades: "Α΄–Δ΄ Δημοτικού",
               meeting: "Σάββατα 12:30–14:00", phone?, color?, image }],
  newsCategories: [{ slug: "lykopoula", label: "Λυκόπουλα", hashtags: ["#Λυκόπουλα"] }, …],
  // + implicit "genika" = Γενικά
  facebook: { graphVersion: "v2x.0", postsToFetch: 90, perPage: 9, revalidate: 3600 },
  analytics: { enabled: false, provider: "plausible" | "umami", domain? },
  nav: [...]
}
```

**Event (`content/events/*.mdx`)**

```yaml
title: string
start: 2026-10-03T11:00 # Europe/Athens
end?: 2026-10-03T13:00
allDay?: boolean
location: string
mapUrl?: url
sections: [agelh-lykopoulon | omada-proskopon | koinotita-anixneuton | systima]
cover?: { src, alt (υποχρεωτικό), allowPublish: true }
summary: string (≤ 200)
```

και ακολουθεί MDX περιγραφή.

**Album (`content/albums/<slug>/index.mdx`)**

```yaml
title, date, year (υπολογίζεται), activity: enum(εκδρομή, κατασκήνωση, …)
sections: [...]
cover: <filename>
photos:
  - { src, alt (υποχρεωτικό), allowPublish: boolean, caption? }
```

**Section (`content/sections/*.mdx`):** `slug` (πρέπει να υπάρχει στο config), `intro`, `activities: string[]`, `gallery: Photo[]`, και MDX σώμα «Τι κάνουμε».

**history.json:** `[{ year, title, text, image? }]` · **leaders.json:** `[{ firstName, role, section?, photo? }]` · **carousel.json:** `[{ src, alt, allowPublish, caption? }]` · **faq.json:** `[{ q, a }]`

**NewsPost (Facebook → εσωτερικό):** `{ id, title (1η γραμμή, ≤ 90 χαρ.), text, date, images[], permalink, categories[] }`

**Κανόνες ασφαλείας παιδιών στον loader / `check-content`:**

- Το `allowPublish` λείπει → **το build αποτυγχάνει**. Το `allowPublish: false` → η φωτογραφία παραλείπεται με προειδοποίηση.
- Το `alt` είναι υποχρεωτικό σε όλες τις εικόνες.
- Στο `leaders.json` υπάρχει μόνο το `firstName`, και το schema απορρίπτει πεδία όπως `lastName`/`surname`/`school` (`.strict()`).
- Το build προειδοποιεί αν βρει μοτίβα τηλεφώνων/email ή λέξεις όπως «σχολείο» μέσα σε frontmatter άλμπουμ/εκδηλώσεων.

## 6. Facebook integration

- `lib/facebook/client.ts` (`server-only`): `GET /{FB_PAGE_ID}/posts?fields=message,created_time,full_picture,attachments{media,subattachments},permalink_url&limit=…` με cursor paging μέχρι `postsToFetch`, και `fetch(..., { next: { revalidate: 3600, tags: ['fb'] } })`.
- Αν λείπουν τα env, χρησιμοποιείται το `content/mock/facebook-posts.json` με ένα log. Αν το API επιστρέψει σφάλμα, το Next κρατά την τελευταία επιτυχημένη ISR έκδοση (πετάμε error ώστε να μην αντικατασταθεί). Αν δεν υπάρχει καμία, εμφανίζεται το «Δείτε τα νέα μας στο Facebook».
- Οι εικόνες περνούν από `next/image` με `remotePatterns` για `*.fbcdn.net`, οπότε ο browser δεν μιλά καθόλου με το Facebook. Τα URLs του fbcdn λήγουν, αλλά το hourly revalidate τα ανανεώνει.
- Hashtags: η αντιστοίχιση αγνοεί πεζά/κεφαλαία και τόνους (#Λυκοπουλα = #ΛΥΚΟΠΟΥΛΑ = #Λυκόπουλα). Τα posts χωρίς γνωστό hashtag πάνε στα «Γενικά». Τα posts χωρίς κείμενο ή που είναι απλά shares φιλτράρονται.
- Προαιρετικά, route `/api/revalidate?secret=…` για χειροκίνητη ανανέωση μετά από ανάρτηση.

## 7. Φόρμα επικοινωνίας

Server Action → zod (το ίδιο schema client/server) → honeypot → rate limit (in-memory ανά IP, 5/10 λεπτά) → `fetch` στο Resend. Περιλαμβάνει υποχρεωτικό checkbox συγκατάθεσης, `useActionState` για καταστάσεις επιτυχίας/σφάλματος στα ελληνικά, και fallback `mailto:` όταν λείπει το `RESEND_API_KEY`.
⚠️ Το in-memory rate limit στο Vercel είναι best-effort (κάθε instance έχει τη δική του μνήμη). Για κανονικό όριο θα χρειαζόταν Upstash/Vercel KV, κάτι που **δεν προσθέτω** χωρίς έγκριση.

## 8. Components (μικρά, επαναχρησιμοποιήσιμα)

Client components (μόνο όπου υπάρχει αλληλεπίδραση): `MobileNav` (drawer με focus trap και Esc), `HighlightsCarousel`, `Lightbox`, `Accordion` (ή native `<details>`, που δεν χρειάζεται JS), `ContactForm`, `MapOnClick`, `FormEmbedOnClick`, `CategoryFilter` (απλά links, άρα server).

Όλα τα υπόλοιπα είναι Server Components. Οπτικά primitives:

- `ContourPattern`: inline SVG ισοϋψείς, παραγόμενο ντετερμινιστικά, με `currentColor` σε χαμηλό opacity
- `ShieldFrame`: σχήμα θυρεού με κόκκινο περίγραμμα, για τις κάρτες τμημάτων
- `HexFrame`: εξάγωνο κάδρο φωτογραφίας με κόκκινο περίγραμμα, όπως στην αφίσα
- `ExternalCta`: σύνδεσμος Google Form με `target="_blank"`, `rel="noopener noreferrer"` και `aria-label="… (ανοίγει τη φόρμα Google σε νέα καρτέλα)"`

## 9. Static export: σημείωση

Το `output: 'export'` **δεν** υποστηρίζει ISR, Server Actions, route handlers με runtime, ούτε βελτιστοποίηση `next/image`. Προτείνω:

- **Vercel ως κύριο deploy** (όλα λειτουργούν).
- Ένα script `npm run build:static` (`STATIC_EXPORT=1`) που βγάζει static site. Σε αυτό τα νέα παγώνουν στη στιγμή του build, οι εικόνες μένουν unoptimized και η φόρμα επικοινωνίας γίνεται `mailto:`. Το .ics λειτουργεί κανονικά, γιατί είναι static.

## 10. Σειρά εργασιών (μετά την έγκριση)

1. **Scaffold:** create-next-app, Tailwind tokens, fonts, layout, lint/prettier, git init, μεταφορά logo σε `public/brand/`
2. **Pages:** μία-μία με placeholder κείμενα που φέρουν `TODO` (Αρχική → Τμήματα → Εγγραφές → Ποιοι είμαστε → Εκδηλώσεις → Φωτογραφίες → Νέα → Επικοινωνία → Legal/404)
3. **Content system + Facebook**
4. **Polish:** SEO/OG/JSON-LD, a11y, Lighthouse, 360/768/1280
5. **README** + λίστα ανοιχτών ερωτημάτων

## 11. Ερωτήσεις πριν το Scaffold

1. **Πραγματικά στοιχεία από την αφίσα** (ώρες, τηλέφωνα τμημάτων, email, Άλσος Χολαργού): να μπουν ήδη στο config; Τα τηλέφωνα είναι πιθανότατα προσωπικά κινητά βαθμοφόρων. Είναι εντάξει να δημοσιευτούν;
2. **Φωτογραφίες στους φακέλους** (αγελη/ομαδα/κοινοτητα κλπ.) με παιδιά: έχετε συγκατάθεση γονέων για δημοσίευση στο site; Μέχρι να απαντήσεις θα τις βάλω με `allowPublish: false`, οπότε δεν θα εμφανίζονται, και θα χρησιμοποιήσω ουδέτερα placeholders.
3. **Resend** (δωρεάν tier 3.000 email/μήνα, χρειάζεται επαλήθευση domain): ΟΚ ως πάροχος; Αλλιώς υπάρχει μόνο `mailto:`.
4. **Domain**: υπάρχει ήδη (π.χ. `proskopoi-xolargou.gr`); Χρειάζεται για sitemap, OG και Resend.
5. **Slugs σε greeklish** (`/eggrafes`, `/nea`…): ΟΚ, ή προτιμάς ελληνικά URLs;
6. **Instagram / YouTube**: υπάρχουν λογαριασμοί για τα social links;
7. **Τμήμα «Σύστημα»/Βαθμοφόροι** (υπάρχουν φάκελοι `ΕΚΣ`, `βαθμοφοροι`, `συστημα`): θέλεις ξεχωριστή σελίδα/κατηγορία, ή μόνο ως μέρος του «Ποιοι είμαστε» και ως κατηγορία εκδηλώσεων «Όλο το Σύστημα»;
