import { siteConfig } from "@site-config";
import type { EventItem } from "@/lib/content/load";

const stamp = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
const dateOnly = (d: Date) =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Athens" }).format(d).replace(/-/g, "");

/** Διαφυγή χαρακτήρων κατά RFC 5545 */
const esc = (s: string) => s.replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");

export function eventToIcs(e: EventItem) {
  const end = e.endDate ?? new Date(e.startDate.getTime() + 2 * 3600_000);
  const timing = e.allDay
    ? [
        `DTSTART;VALUE=DATE:${dateOnly(e.startDate)}`,
        // Στο iCalendar το DTEND ολοήμερων είναι η επόμενη μέρα (αποκλειστικό).
        `DTEND;VALUE=DATE:${dateOnly(new Date(end.getTime() + 24 * 3600_000))}`,
      ]
    : [`DTSTART:${stamp(e.startDate)}`, `DTEND:${stamp(end)}`];

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${siteConfig.shortName}//el`,
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${e.slug}@${new URL(siteConfig.url).host}`,
    `DTSTAMP:${stamp(e.startDate)}`,
    ...timing,
    `SUMMARY:${esc(e.title)}`,
    `LOCATION:${esc(e.location)}`,
    `DESCRIPTION:${esc(e.summary)}`,
    `URL:${siteConfig.url}/ekdiloseis/${e.slug}/`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
