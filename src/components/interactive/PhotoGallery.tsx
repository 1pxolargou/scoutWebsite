"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/content/schemas";

/** Πλέγμα φωτογραφιών με lightbox (native <dialog>: Esc, focus trap, βελάκια). */
export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    const onClose = () => setIndex(null);
    dialog.addEventListener("keydown", onKey);
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("keydown", onKey);
      dialog.removeEventListener("close", onClose);
    };
  }, [step]);

  const current = index !== null ? photos[index] : null;
  const ctrl =
    "grid h-12 w-12 place-items-center rounded-full border-2 border-paper bg-forest-dark/80 text-xl text-paper hover:bg-scout-red";

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {photos.map((p, i) => (
          <li key={p.src}>
            <button
              type="button"
              onClick={() => open(i)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-card border-2 border-forest/15"
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                loading="lazy"
                className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
              />
              <span className="sr-only"> (μεγέθυνση)</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Προβολή φωτογραφίας"
        className="on-dark m-auto h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-paper backdrop:bg-ink/80"
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
      >
        {current && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-4">
              <p aria-live="polite" className="text-sm">
                {index! + 1} / {photos.length}
              </p>
              <button type="button" className={ctrl} onClick={() => dialogRef.current?.close()}>
                <span className="sr-only">Κλείσιμο</span>
                <span aria-hidden="true">✕</span>
              </button>
            </div>
            <figure className="relative mx-4 flex-1">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </figure>
            <div className="flex items-center justify-between gap-4 p-4">
              <button type="button" className={ctrl} onClick={() => step(-1)}>
                <span className="sr-only">Προηγούμενη</span>
                <span aria-hidden="true">←</span>
              </button>
              <p className="text-center text-sm">{current.caption ?? current.alt}</p>
              <button type="button" className={ctrl} onClick={() => step(1)}>
                <span className="sr-only">Επόμενη</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
