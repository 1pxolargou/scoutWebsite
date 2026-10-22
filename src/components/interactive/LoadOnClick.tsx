"use client";

import { useState } from "react";

/**
 * Φορτώνει ένα iframe τρίτου (χάρτης, Google Form) μόνο μετά από κλικ,
 * ώστε να μη γίνεται καμία σύνδεση σε τρίτους κατά το άνοιγμα της σελίδας.
 */
export function LoadOnClick({
  src,
  title,
  buttonLabel,
  notice,
  height = 450,
}: {
  src: string;
  title: string;
  buttonLabel: string;
  notice: string;
  height?: number;
}) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        src={src}
        title={title}
        loading="lazy"
        className="w-full rounded-card border-2 border-forest/20 bg-paper"
        style={{ height }}
      />
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-card border-2 border-dashed border-forest/30 bg-sand p-6 text-center"
      style={{ minHeight: Math.min(height, 320) }}
    >
      <p className="max-w-md text-sm text-ink/80">{notice}</p>
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="heading rounded-md border-2 border-forest bg-forest px-5 py-2.5 text-lg text-paper hover:bg-forest-dark"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
