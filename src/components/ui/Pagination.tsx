import Link from "next/link";

/** Σελιδοποίηση με στατικά URLs: page 1 → base, page n → base/selida/n/ */
export function Pagination({
  base,
  page,
  totalPages,
}: {
  base: string;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const href = (n: number) => (n === 1 ? `${base}/` : `${base}/selida/${n}/`);
  const item =
    "inline-flex h-11 min-w-11 items-center justify-center rounded-md border-2 px-3 font-semibold";
  return (
    <nav aria-label="Σελίδες" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={href(page - 1)} className={`${item} border-forest text-forest hover:bg-sand`}>
          ← Προηγούμενη
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          href={href(n)}
          aria-current={n === page ? "page" : undefined}
          className={`${item} ${n === page ? "border-forest bg-forest text-paper" : "border-forest/30 text-forest hover:border-forest"}`}
        >
          {n}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={href(page + 1)} className={`${item} border-forest text-forest hover:bg-sand`}>
          Επόμενη →
        </Link>
      )}
    </nav>
  );
}
