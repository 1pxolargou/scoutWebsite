import Link from "next/link";

/** Τίτλος ενότητας με κόκκινη γραμμή και προαιρετικό σύνδεσμο «Όλα». */
export function SectionHeading({
  title,
  intro,
  href,
  linkLabel,
  id,
}: {
  title: string;
  intro?: string;
  href?: string;
  linkLabel?: string;
  id?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <span aria-hidden="true" className="mb-3 block h-1.5 w-14 rounded-full bg-scout-red" />
        <h2 id={id} className="text-3xl text-forest sm:text-4xl">
          {title}
        </h2>
        {intro && <p className="mt-2 max-w-2xl text-ink/80">{intro}</p>}
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="heading text-lg text-forest underline decoration-scout-red decoration-2 underline-offset-8 hover:text-forest-dark"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
