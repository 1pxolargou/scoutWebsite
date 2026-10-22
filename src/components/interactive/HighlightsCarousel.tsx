"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/lib/content/schemas";

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function HighlightsCarousel({ slides }: { slides: Photo[] }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true }, [
    Autoplay({
      delay: 5000,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
      stopOnInteraction: false,
      active: !reducedMotion(),
    }),
  ]);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  const go = useCallback((i: number) => embla?.scrollTo(i), [embla]);

  const btn =
    "grid h-12 w-12 place-items-center rounded-full border-2 border-paper bg-forest-dark/80 text-paper hover:bg-scout-red";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Στιγμές από τις δράσεις μας"
      className="relative"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") embla?.scrollPrev();
        if (e.key === "ArrowRight") embla?.scrollNext();
      }}
    >
      <div ref={emblaRef} className="overflow-hidden rounded-card border-4 border-paper">
        <div className="flex touch-pan-y">
          {slides.map((s, i) => (
            <div
              key={s.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} από ${slides.length}`}
              aria-hidden={i !== selected}
              className="relative aspect-[16/10] min-w-0 flex-[0_0_100%] sm:aspect-[21/9]"
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes="(min-width: 1152px) 1152px, 100vw"
                priority={i === 0}
                loading={i === 0 ? undefined : "lazy"}
                className="object-cover"
              />
              {s.caption && (
                <p className="absolute bottom-0 left-0 m-4 rounded-md bg-forest-dark/85 px-4 py-2 font-semibold text-paper">
                  {s.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button type="button" className={btn} onClick={() => embla?.scrollPrev()}>
          <span className="sr-only">Προηγούμενη φωτογραφία</span>
          <span aria-hidden="true">←</span>
        </button>
        <div className="flex gap-1">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => go(i)}
              aria-current={i === selected}
              className="grid h-6 w-6 place-items-center"
            >
              <span className="sr-only">Φωτογραφία {i + 1}</span>
              <span
                aria-hidden="true"
                className={`block h-3 rounded-full transition-all ${i === selected ? "w-6 bg-scout-red" : "w-3 bg-paper/70"}`}
              />
            </button>
          ))}
        </div>
        <button type="button" className={btn} onClick={() => embla?.scrollNext()}>
          <span className="sr-only">Επόμενη φωτογραφία</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
