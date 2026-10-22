"use client";

import "leaflet/dist/leaflet.css";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import { useEffect, useRef, useState } from "react";
import type { ArchiveYear } from "@/lib/content/schemas";
import { sectionColors, tagLabel } from "@/lib/sections";

type Trip = ArchiveYear["trips"][number];

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Πινέζα σε σχήμα θυρεού, στο χρώμα του τμήματος. */
const pinSvg = (color: string) =>
  `<svg viewBox="0 0 28 34" width="28" height="34" aria-hidden="true"><path d="M2 2h24v15c0 7-6 11-12 15C8 28 2 24 2 17z" fill="${color}" stroke="#fff" stroke-width="2.5"/><circle cx="14" cy="13" r="4" fill="#fff"/></svg>`;

const stopSvg = (n: number) =>
  `<span style="display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#fff;border:3px solid ${sectionColors["koinotita-anixneuton"]};font:700 11px/1 sans-serif;color:#1c1c1c">${n}</span>`;

/**
 * Χάρτης Leaflet με τις εκδρομές μιας χρονιάς: πινέζες για σταθερά μέρη,
 * γραμμή με αριθμημένες στάσεις για κινητές εξορμήσεις.
 * Το Leaflet φορτώνεται δυναμικά, μόνο όταν εμφανιστεί ο χάρτης.
 */
export function ArchiveMap({
  trips,
  selected,
}: {
  trips: Trip[];
  /** Η εκδρομή που επιλέχθηκε από τη λίστα (το key αλλάζει σε κάθε κλικ). */
  selected: { index: number; key: number } | null;
}) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const tripLayers = useRef<{ fit: () => void }[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current) return;
      const map = L.map(el.current, { scrollWheelZoom: false, zoomSnap: 0.5 });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 17,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      map.setView([38.5, 23], 6);
      mapRef.current = map;
      layerRef.current = L.layerGroup().addTo(map);
      setReady(true);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Σχεδίαση των εκδρομών της επιλεγμένης χρονιάς.
  useEffect(() => {
    if (!ready || !mapRef.current || !layerRef.current) return;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current || !layerRef.current) return;
      const map = mapRef.current;
      const group = layerRef.current;
      group.clearLayers();
      tripLayers.current = [];
      const all: [number, number][] = [];

      for (const trip of trips) {
        const color = sectionColors[trip.section];
        const coords = trip.places.map((p) => [p.lat, p.lng] as [number, number]);
        all.push(...coords);
        const when = trip.date ? ` · ${trip.date.slice(0, 7).split("-").reverse().join("/")}` : "";
        const label = `${esc(tagLabel(trip.section))}${esc(when)}`;

        if (trip.type === "route") {
          const line = L.polyline(coords, { color, weight: 5, opacity: 0.9, dashArray: "10 8" })
            .bindPopup(
              `<strong>${esc(trip.title)}</strong><br>${label}<br>${trip.places.map((p) => esc(p.name)).join(" → ")}`,
            )
            .addTo(group);
          trip.places.forEach((p, i) =>
            L.marker([p.lat, p.lng], {
              icon: L.divIcon({ html: stopSvg(i + 1), className: "", iconSize: [22, 22] }),
              title: `${i + 1}. ${p.name}`,
              alt: `${trip.title}: στάση ${i + 1}, ${p.name}`,
            })
              .bindPopup(`<strong>${i + 1}. ${esc(p.name)}</strong><br>${esc(trip.title)}`)
              .addTo(group),
          );
          tripLayers.current.push({
            fit: () => {
              map.fitBounds(line.getBounds(), { padding: [40, 40], maxZoom: 11 });
              line.openPopup();
            },
          });
        } else {
          const p = trip.places[0];
          const marker = L.marker([p.lat, p.lng], {
            icon: L.divIcon({
              html: pinSvg(color),
              className: "",
              iconSize: [28, 34],
              iconAnchor: [14, 32],
              popupAnchor: [0, -28],
            }),
            title: `${trip.title}: ${p.name}`,
            alt: `${trip.title}: ${p.name}`,
          })
            .bindPopup(`<strong>${esc(trip.title)}</strong><br>${esc(p.name)}<br>${label}`)
            .addTo(group);
          tripLayers.current.push({
            fit: () => {
              map.setView([p.lat, p.lng], 10);
              marker.openPopup();
            },
          });
        }
      }
      if (all.length) map.fitBounds(all, { padding: [40, 40], maxZoom: 9 });
    })();
    return () => {
      cancelled = true;
    };
  }, [trips, ready]);

  useEffect(() => {
    if (ready && selected) tripLayers.current[selected.index]?.fit();
  }, [selected, ready]);

  return (
    <div
      ref={el}
      role="region"
      aria-label="Χάρτης με τα μέρη των εκδρομών"
      className="isolate h-[26rem] w-full rounded-card border-2 border-forest/20 bg-sand sm:h-[32rem]"
    />
  );
}
