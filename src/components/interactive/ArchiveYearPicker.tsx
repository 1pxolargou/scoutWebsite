"use client";

/**
 * Επιλογή χρονιάς για αρχείο πολλών δεκαετιών: δεκαετία → χρονιά, και βελάκια
 * για την προηγούμενη/επόμενη χρονιά. Οι χρονιές έρχονται από την πιο πρόσφατη.
 */
export function ArchiveYearPicker({
  years,
  index,
  onChange,
}: {
  years: string[];
  index: number;
  onChange: (index: number) => void;
}) {
  const decadeOf = (y: string) => Math.floor(Number(y.slice(0, 4)) / 10) * 10;
  const decades = [...new Set(years.map(decadeOf))].sort((a, b) => a - b);
  const current = decadeOf(years[index]);
  const inDecade = years
    .map((y, i) => ({ y, i }))
    .filter(({ y }) => decadeOf(y) === current)
    .reverse(); // χρονολογική σειρά μέσα στη δεκαετία

  const older = index < years.length - 1 ? index + 1 : null;
  const newer = index > 0 ? index - 1 : null;

  const chip = (active: boolean) =>
    `heading rounded-md border-2 transition-colors ${
      active
        ? "border-forest bg-forest text-paper"
        : "border-forest/30 bg-paper text-forest hover:border-forest"
    }`;
  const arrow =
    "grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-forest text-xl text-forest hover:bg-forest hover:text-paper disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className="rounded-card border-2 border-forest/15 bg-sand p-4 sm:p-6">
      {/* Τρέχουσα χρονιά με βελάκια */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <button
          type="button"
          className={arrow}
          disabled={older === null}
          onClick={() => older !== null && onChange(older)}
        >
          <span aria-hidden="true">←</span>
          <span className="sr-only">
            Προηγούμενη χρονιά{older !== null ? ` (${years[older]})` : ""}
          </span>
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wider text-ink/70 uppercase">
            Προσκοπική χρονιά
          </p>
          <p className="heading text-4xl text-forest sm:text-5xl" aria-live="polite">
            {years[index]}
          </p>
          <p className="text-sm text-ink/70">
            {years.length} χρονιές στο αρχείο · {years.at(-1)} έως {years[0]}
          </p>
        </div>
        <button
          type="button"
          className={arrow}
          disabled={newer === null}
          onClick={() => newer !== null && onChange(newer)}
        >
          <span aria-hidden="true">→</span>
          <span className="sr-only">
            Επόμενη χρονιά{newer !== null ? ` (${years[newer]})` : ""}
          </span>
        </button>
      </div>

      {/* Δεκαετίες */}
      <div role="group" aria-label="Δεκαετία" className="mb-3 flex flex-wrap justify-center gap-2">
        {decades.map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={d === current}
            onClick={() => {
              // Η πιο πρόσφατη χρονιά της δεκαετίας.
              const first = years.findIndex((y) => decadeOf(y) === d);
              if (first >= 0) onChange(first);
            }}
            className={`${chip(d === current)} px-3 py-1 text-lg`}
          >
            <span aria-hidden="true">’{String(d).slice(2)}</span>
            <span className="sr-only">Δεκαετία του {d}</span>
          </button>
        ))}
      </div>

      {/* Χρονιές της δεκαετίας */}
      <div
        role="group"
        aria-label={`Χρονιές της δεκαετίας του ${current}`}
        className="flex flex-wrap justify-center gap-2 border-t border-forest/15 pt-3"
      >
        {inDecade.map(({ y, i }) => (
          <button
            key={y}
            type="button"
            aria-pressed={i === index}
            onClick={() => onChange(i)}
            className={`${chip(i === index)} px-3 py-1.5 text-base`}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  );
}
