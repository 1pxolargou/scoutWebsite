import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { EventItem } from "@/lib/content/load";
import { formatDay, formatMonthShort, formatRange } from "@/lib/dates";
import { tagLabel } from "@/lib/sections";

/** Οριζόντια κάρτα εκδήλωσης με «ημερολογιακό» πλακίδιο ημερομηνίας. */
export function EventCard({ event, past = false }: { event: EventItem; past?: boolean }) {
  return (
    <article
      className={`group relative flex gap-5 rounded-card border-2 bg-paper p-4 shadow-sm transition-shadow hover:shadow-lg sm:p-5 ${past ? "border-forest/10" : "border-forest/20"}`}
    >
      <div
        aria-hidden="true"
        className={`flex w-16 shrink-0 flex-col items-center justify-center self-start overflow-hidden rounded-md border-2 text-center sm:w-20 ${past ? "border-forest/30" : "border-scout-red"}`}
      >
        <span
          className={`heading w-full py-0.5 text-sm text-paper ${past ? "bg-forest-light" : "bg-scout-red"}`}
        >
          {formatMonthShort(event.startDate)}
        </span>
        <span className="heading py-1 text-3xl text-forest sm:text-4xl">
          {formatDay(event.startDate)}
        </span>
      </div>
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {event.sections.map((s) => (
            <Badge key={s} tone={s === "systima" ? "forest" : "outline"}>
              {tagLabel(s)}
            </Badge>
          ))}
        </div>
        <h3 className="font-sans text-lg leading-snug font-bold tracking-normal text-forest normal-case">
          <Link href={`/ekdiloseis/${event.slug}/`} className="after:absolute after:inset-0">
            {event.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-ink/80">
          <time dateTime={event.startDate.toISOString()}>
            {formatRange(event.startDate, event.endDate, event.allDay)}
          </time>
        </p>
        <p className="text-sm text-ink/80">📍 {event.location}</p>
      </div>
    </article>
  );
}
