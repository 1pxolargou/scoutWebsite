"use client";

import { useState } from "react";

/** Αντιγράφει κείμενο (π.χ. IBAN) στο πρόχειρο και το ανακοινώνει στους αναγνώστες οθόνης. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value.replace(/\s/g, ""));
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          setCopied(false);
        }
      }}
      className="inline-flex items-center gap-2 rounded-md border-2 border-forest px-3 py-1.5 text-sm font-semibold text-forest hover:bg-forest hover:text-paper"
    >
      <span aria-live="polite">{copied ? "Αντιγράφηκε ✓" : label}</span>
    </button>
  );
}
