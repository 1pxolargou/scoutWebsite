"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Leader } from "@/lib/content/schemas";

/** Παράθυρο προφίλ Βαθμοφόρου (native <dialog>: Esc, focus trap, κλικ έξω για κλείσιμο). */
export function LeaderDialog({
  leader,
  groupTitle,
  onClose,
}: {
  leader: Leader | null;
  groupTitle?: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (leader && !dialog.open) dialog.showModal();
    if (!leader && dialog.open) dialog.close();
  }, [leader]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="leader-dialog-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className="m-auto w-[min(32rem,calc(100vw-2rem))] overflow-visible rounded-card bg-transparent p-0 backdrop:bg-ink/70"
    >
      {leader && (
        <div className="overflow-hidden rounded-card border-4 border-scout-red bg-paper text-ink">
          <div className="on-dark relative flex items-end gap-5 bg-forest p-6 pr-14 text-paper">
            <PhotoSlot leader={leader} />
            <div className="min-w-0 pb-1">
              {groupTitle && (
                <p className="text-xs font-semibold tracking-wider text-paper/80 uppercase">
                  {groupTitle}
                </p>
              )}
              <h2 id="leader-dialog-title" className="text-3xl">
                {leader.firstName} {leader.lastName}
              </h2>
              <p className="text-paper/90">{leader.role}</p>
              {leader.scoutName && (
                <p className="mt-2 text-sm text-paper/85">
                  Προσκοπικό όνομα{" "}
                  <span className="heading block text-2xl text-paper">{leader.scoutName}</span>
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full border-2 border-paper/70 hover:bg-paper hover:text-forest"
            >
              <span className="sr-only">Κλείσιμο</span>
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <dl className="space-y-5 p-6">
            {leader.joinedYear && (
              <div>
                <dt className="text-sm font-semibold text-forest">Στο Σύστημα από</dt>
                <dd className="heading text-2xl text-scout-red">{leader.joinedYear}</dd>
              </div>
            )}
            {leader.trainings.length > 0 && (
              <div>
                <dt className="text-sm font-semibold text-forest">Εκπαιδεύσεις</dt>
                <dd>
                  <ul className="mt-1 space-y-1">
                    {leader.trainings.map((tr) => (
                      <li key={tr} className="flex gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-scout-red"
                        />
                        {tr}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </dialog>
  );
}

/** Πορτρέτο στο παράθυρο προφίλ: η φωτογραφία ή κενή θέση μέχρι να προστεθεί. */
function PhotoSlot({ leader }: { leader: Leader }) {
  const photo = leader.photo?.allowPublish ? leader.photo : null;
  return (
    <div className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-md border-4 border-paper bg-forest-dark sm:w-32">
      {photo ? (
        <Image src={photo.src} alt={photo.alt} fill sizes="128px" className="object-cover" />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-1 border-2 border-dashed border-paper/40 p-2 text-center text-paper/70">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
            <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5z" />
          </svg>
          <span className="text-xs leading-tight">Φωτογραφία σύντομα</span>
        </div>
      )}
    </div>
  );
}

/** Θυρεός με φωτογραφία ή το αρχικό του ονόματος. */
export function ShieldAvatar({ leader, small = false }: { leader: Leader; small?: boolean }) {
  const size = small ? "h-14 w-12" : "h-24 w-20";
  const clip = { clipPath: "polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%)" };
  return (
    <span className={`relative inline-block shrink-0 bg-scout-red p-[3px] ${size}`} style={clip}>
      <span className="relative grid h-full w-full place-items-center bg-paper" style={clip}>
        {leader.photo?.allowPublish ? (
          <Image src={leader.photo.src} alt="" fill sizes="80px" className="object-cover" />
        ) : (
          <span
            aria-hidden="true"
            className={`heading -mt-2 text-forest ${small ? "text-xl" : "text-4xl"}`}
          >
            {leader.firstName[0]}
          </span>
        )}
      </span>
    </span>
  );
}
