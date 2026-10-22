const TZ = "Europe/Athens";

/** Ώρα Ελλάδας ("2026-11-08T09:00" ή "2026-11-08") → Date (UTC instant). */
export function athensDate(value: string): Date {
  const [datePart, timePart = "00:00"] = value.split("T");
  const asUtc = new Date(`${datePart}T${timePart.length === 5 ? `${timePart}:00` : timePart}Z`);
  // Offset της Αθήνας εκείνη τη μέρα (+2 ή +3 λόγω θερινής ώρας).
  const offsetName = new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "shortOffset" })
    .formatToParts(asUtc)
    .find((p) => p.type === "timeZoneName")?.value;
  const hours = Number(offsetName?.replace("GMT", "") || 0);
  return new Date(asUtc.getTime() - hours * 3600_000);
}

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("el-GR", { timeZone: TZ, ...opts });

const longDate = fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
const shortDate = fmt({ day: "numeric", month: "long", year: "numeric" });
const time = fmt({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const dayNum = fmt({ day: "numeric" });
const monthShort = fmt({ month: "short" });

export const formatLongDate = (d: Date) => longDate.format(d);
export const formatDate = (d: Date) => shortDate.format(d);
export const formatTime = (d: Date) => time.format(d);
export const formatDay = (d: Date) => dayNum.format(d);
/** Σύντομος μήνας χωρίς τελεία, π.χ. «Νοε» */
export const formatMonthShort = (d: Date) => monthShort.format(d).replace(".", "");

export function sameDay(a: Date, b: Date) {
  return shortDate.format(a) === shortDate.format(b);
}

/** Κείμενο εύρους: «Σάββατο 8 Νοεμβρίου 2026, 09:00–16:00» ή «10 Ιουλίου – 19 Ιουλίου 2026» */
export function formatRange(start: Date, end: Date | undefined, allDay: boolean) {
  if (!end)
    return allDay ? formatLongDate(start) : `${formatLongDate(start)}, ${formatTime(start)}`;
  if (sameDay(start, end)) {
    return allDay
      ? formatLongDate(start)
      : `${formatLongDate(start)}, ${formatTime(start)}–${formatTime(end)}`;
  }
  return allDay
    ? `${formatDate(start)} – ${formatDate(end)}`
    : `${formatDate(start)} ${formatTime(start)} – ${formatDate(end)} ${formatTime(end)}`;
}

/** Η τρέχουσα προσκοπική χρονιά (αλλάζει τον Σεπτέμβριο), π.χ. «2026–27». */
export function currentScoutYear(now = new Date()) {
  const start = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
  return `${start}–${String(start + 1).slice(2)}`;
}
