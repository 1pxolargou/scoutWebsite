"use client";

import { useState } from "react";
import type { ArchiveYear, Leader } from "@/lib/content/schemas";
import { leaderGroupOrder, leaderGroupTitle, sectionColors, tagLabel } from "@/lib/sections";
import { ArchiveMap } from "./ArchiveMap";
import { ArchiveYearPicker } from "./ArchiveYearPicker";
import { LeaderDialog } from "./LeaderDialog";

const formatMonth = (date: string) =>
  new Intl.DateTimeFormat("el-GR", { month: "long", year: "numeric" }).format(
    new Date(`${date.slice(0, 10)}T12:00:00`),
  );

/** Επιλογή χρονιάς → Βαθμοφόροι της χρονιάς + χάρτης με τις εκδρομές. */
export function ArchiveExplorer({ years, leaders }: { years: ArchiveYear[]; leaders: Leader[] }) {
  const [yearIndex, setYearIndex] = useState(0);
  const [mapOn, setMapOn] = useState(false);
  const [selected, setSelected] = useState<{ index: number; key: number } | null>(null);
  const [profile, setProfile] = useState<Leader | null>(null);

  const year = years[yearIndex];
  const byId = new Map(leaders.map((l) => [l.id, l]));
  const groups = leaderGroupOrder
    .map((key) => ({ key, people: year.leaders.filter((l) => l.section === key) }))
    .filter((g) => g.people.length);
  const sectionsInYear = [...new Set(year.trips.map((t) => t.section))];

  const showTrip = (index: number) => {
    setMapOn(true);
    setSelected((prev) => ({ index, key: (prev?.key ?? 0) + 1 }));
  };

  return (
    <div>
      <div className="mb-10">
        <ArchiveYearPicker
          years={years.map((y) => y.year)}
          index={yearIndex}
          onChange={(i) => {
            setYearIndex(i);
            setSelected(null);
          }}
        />
        {year.note && (
          <p className="mt-4 rounded-md border-l-4 border-scout-red bg-paper p-3 text-center">
            {year.note}
          </p>
        )}
      </div>

      <h2 className="sr-only">Προσκοπική χρονιά {year.year}</h2>

      <div className="grid gap-10 lg:grid-cols-[22rem_1fr]">
        {/* Βαθμοφόροι */}
        <section aria-labelledby="archive-leaders" className="lg:order-1">
          <h3 id="archive-leaders" className="mb-4 text-2xl text-forest">
            Βαθμοφόροι {year.year}
          </h3>
          <div className="space-y-5 rounded-card border-2 border-forest/15 bg-sand p-5">
            {!groups.length && (
              <p className="text-sm text-ink/75">
                Δεν έχουν καταγραφεί Βαθμοφόροι για αυτή τη χρονιά.
              </p>
            )}
            {groups.map((g) => (
              <div key={g.key}>
                <h4 className="mb-2 flex items-center gap-2 text-base tracking-wider text-forest">
                  <span
                    aria-hidden="true"
                    className="inline-block h-3 w-3 rotate-45"
                    style={{
                      background: sectionColors[g.key as keyof typeof sectionColors] ?? "#1c1c1c",
                    }}
                  />
                  {leaderGroupTitle(g.key)}
                </h4>
                <ul className="space-y-1">
                  {g.people.map((p) => {
                    const leader = p.leaderId ? byId.get(p.leaderId) : undefined;
                    const content = (
                      <>
                        <span className="font-semibold">{p.name}</span>
                        <span className="block text-sm text-ink/75">{p.role}</span>
                      </>
                    );
                    return (
                      <li key={p.name + p.role}>
                        {leader ? (
                          <button
                            type="button"
                            aria-haspopup="dialog"
                            onClick={() => setProfile(leader)}
                            className="w-full rounded-md px-2 py-1 text-left hover:bg-paper"
                          >
                            {content}
                            <span className="sr-only"> (προβολή προφίλ)</span>
                          </button>
                        ) : (
                          <div className="px-2 py-1">{content}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Χάρτης + λίστα εκδρομών */}
        <section aria-labelledby="archive-trips" className="min-w-0 lg:order-2">
          <h3 id="archive-trips" className="mb-4 text-2xl text-forest">
            Εκδρομές {year.year}
          </h3>

          <ul aria-label="Υπόμνημα" className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {sectionsInYear.map((s) => (
              <li key={s} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block h-3.5 w-3.5 rounded-sm"
                  style={{ background: sectionColors[s] }}
                />
                {tagLabel(s)}
              </li>
            ))}
            <li className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block w-7 border-t-4 border-dashed"
                style={{ borderColor: sectionColors["koinotita-anixneuton"] }}
              />
              Διαδρομή εξόρμησης
            </li>
          </ul>

          {mapOn ? (
            <ArchiveMap trips={year.trips} selected={selected} />
          ) : (
            <div className="flex h-[26rem] flex-col items-center justify-center gap-4 rounded-card border-2 border-dashed border-forest/30 bg-sand p-6 text-center sm:h-[32rem]">
              <span aria-hidden="true" className="text-5xl">
                🗺️
              </span>
              <p className="max-w-md text-sm text-ink/80">
                Ο χάρτης φορτώνεται από το OpenStreetMap μόνο αν πατήσετε το κουμπί.
              </p>
              <button
                type="button"
                onClick={() => setMapOn(true)}
                className="heading rounded-md border-2 border-forest bg-forest px-5 py-2.5 text-lg text-paper hover:bg-forest-dark"
              >
                Εμφάνιση χάρτη
              </button>
            </div>
          )}

          {!year.trips.length && (
            <p className="mt-6 rounded-card bg-sand p-4 text-center text-sm">
              Δεν έχουν καταγραφεί εκδρομές για αυτή τη χρονιά.
            </p>
          )}
          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {year.trips.map((t, i) => (
              <li key={`${t.section}-${i}`}>
                <button
                  type="button"
                  onClick={() => showTrip(i)}
                  className="flex h-full w-full gap-3 rounded-card border-2 border-forest/15 bg-paper p-3 text-left hover:border-forest"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1 h-full w-1.5 shrink-0 rounded-full"
                    style={{ background: sectionColors[t.section] }}
                  />
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold tracking-wider text-ink/70 uppercase">
                      {tagLabel(t.section)}
                      {t.date && ` · ${formatMonth(t.date)}`}
                    </span>
                    <span className="block font-bold text-forest">{t.title}</span>
                    <span className="block text-sm text-ink/80">
                      {t.type === "route"
                        ? `🥾 ${t.places.map((p) => p.name).join(" → ")}`
                        : `📍 ${t.places[0].name}`}
                    </span>
                    <span className="sr-only"> (εμφάνιση στον χάρτη)</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <LeaderDialog leader={profile} onClose={() => setProfile(null)} />
    </div>
  );
}
