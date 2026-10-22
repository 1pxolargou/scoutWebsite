import { t } from "@/i18n/el";

export const routes = {
  home: "/",
  about: "/poioi-eimaste",
  sections: "/tmimata",
  section: (slug: string) => `/tmimata/${slug}`,
  news: "/nea",
  events: "/ekdiloseis",
  gallery: "/fotografies",
  join: "/eggrafes",
  contact: "/epikoinonia",
  archive: "/archeio",
  members: "/melh",
  privacy: "/politiki-aporritou",
  cookies: "/cookies",
} as const;

export const mainNav = [
  { href: routes.about, label: t.nav.about },
  { href: routes.sections, label: t.nav.sections },
  { href: routes.news, label: t.nav.news },
  { href: routes.events, label: t.nav.events },
  { href: routes.gallery, label: t.nav.gallery },
  { href: routes.archive, label: t.nav.archive },
  { href: routes.join, label: t.nav.join },
  { href: routes.contact, label: t.nav.contact },
] as const;
