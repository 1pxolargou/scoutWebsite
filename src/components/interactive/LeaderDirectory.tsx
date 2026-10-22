"use client";

import { useState } from "react";
import type { Leader } from "@/lib/content/schemas";
import { LeaderDialog, ShieldAvatar } from "./LeaderDialog";

export type LeaderGroup = { key: string; title: string; people: Leader[] };

/** Λίστα Βαθμοφόρων ανά ομάδα. Κάθε όνομα ανοίγει το προφίλ του. */
export function LeaderDirectory({ groups }: { groups: LeaderGroup[] }) {
  const [active, setActive] = useState<{ leader: Leader; group: string } | null>(null);

  return (
    <>
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <div key={g.key}>
            <h3 className="mb-4 border-b border-forest-light pb-2 text-xl">{g.title}</h3>
            <ul className="space-y-2">
              {g.people.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setActive({ leader: p, group: g.title })}
                    aria-haspopup="dialog"
                    className="group flex w-full items-center gap-4 rounded-md p-1.5 text-left transition-colors hover:bg-forest-light/40"
                  >
                    <ShieldAvatar leader={p} small />
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold">
                        {p.firstName} {p.lastName}
                        {p.scoutName && (
                          <span className="font-normal text-paper/80"> · «{p.scoutName}»</span>
                        )}
                      </span>
                      <span className="block text-sm text-paper/85">{p.role}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-paper/60 transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <LeaderDialog
        leader={active?.leader ?? null}
        groupTitle={active?.group}
        onClose={() => setActive(null)}
      />
    </>
  );
}
