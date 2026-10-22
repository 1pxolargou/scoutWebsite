// Εισαγωγή του ιστορικού αρχείου από CSV (εξαγωγή από Excel / Google Sheets).
//
// Χρήση:
//   npm run import:archive -- archeio.csv            εισαγωγή + εύρεση συντεταγμένων
//   npm run import:archive -- archeio.csv --offline  χωρίς σύνδεση (μόνο γνωστοί τόποι)
//   npm run import:archive -- archeio.csv --clean    σβήνει χρονιές που δεν υπάρχουν στο CSV
//   npm run import:archive -- archeio.csv --year-ends  σκέτο «1999» σημαίνει 1998–99 (όχι 1999–00)
//
// Αναμενόμενες στήλες (η σειρά δεν παίζει ρόλο, τόνοι/κεφαλαία αγνοούνται):
//   Χρονιά | Επιτελείο Συστήματος | Επιτελείο Αγέλης | Επιτελείο Ομάδας | Επιτελείο Κοινότητας
//   | Κατασκήνωση Αγέλης | Κατασκήνωση Ομάδας | Μεγάλη Δράση Κοινότητας
//
// Κελιά επιτελείου: ονόματα χωρισμένα με κόμμα, ερωτηματικό ή αλλαγή γραμμής.
//   Ρόλος προαιρετικά σε παρένθεση: «Γιώργος Παπαδόπουλος (Αρχηγός)».
// Κελιά κατασκήνωσης: ο τόπος. Αν υπάρχουν πολλές, χωρίστε με ερωτηματικό ή αλλαγή γραμμής.
// Μεγάλη Δράση Κοινότητας: οι στάσεις με τη σειρά, χωρισμένες με «-», «–», «→» ή αλλαγή γραμμής.
//   Προαιρετικός τίτλος πριν από άνω-κάτω τελεία: «Φαράγγια Κρήτης: Χανιά - Ομαλός - Σφακιά».
//
// Οι συντεταγμένες αναζητούνται στο OpenStreetMap (Nominatim) και αποθηκεύονται στο
// content/archive/_places.json, όπου μπορείτε να τις διορθώσετε με το χέρι.
// Στέλνονται μόνο ονόματα τόπων, κανένα προσωπικό στοιχείο.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ARCHIVE = path.join(ROOT, "content", "archive");
const PLACES_FILE = path.join(ARCHIVE, "_places.json");
const LEADERS_FILE = path.join(ROOT, "content", "leaders.json");

const args = process.argv.slice(2);
const csvFile = args.find((a) => !a.startsWith("--"));
const OFFLINE = args.includes("--offline");
const CLEAN = args.includes("--clean");
const YEAR_ENDS = args.includes("--year-ends");

if (!csvFile) {
  console.error("Δώστε το αρχείο CSV: npm run import:archive -- archeio.csv");
  process.exit(1);
}

// ---------- Βοηθητικά ----------

const norm = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("el")
    .replace(/\s+/g, " ")
    .trim();

/** Διαβάζει UTF-8 ή, αν αποτύχει, Windows-1253 (παλιό «CSV» του ελληνικού Excel). */
function readText(file) {
  const buf = fs.readFileSync(file);
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buf).replace(/^﻿/, "");
  } catch {
    console.warn("⚠ Το αρχείο δεν είναι UTF-8. Διαβάζεται ως Windows-1253 (ελληνικό Excel).");
    return new TextDecoder("windows-1253").decode(buf);
  }
}

/** CSV κατά RFC 4180: εισαγωγικά, αλλαγές γραμμής μέσα σε κελιά, διαχωριστικό , ; ή tab. */
function parseCsv(text) {
  const firstLine = text.slice(0, text.indexOf("\n") >>> 0);
  const delim = [";", "\t", ","].sort(
    (a, b) => firstLine.split(b).length - firstLine.split(a).length,
  )[0];
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === delim) {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (cell || row.length) rows.push([...row, cell]);
  return rows.filter((r) => r.some((c) => c.trim()));
}

/**
 * «1985-86», «1985–1986», «85-86» → «1985–86».
 * Σκέτο «1986»: εξ ορισμού 1986–87· με --year-ends γίνεται 1985–86 (η χρονιά που τελειώνει το 1986).
 */
function parseYear(raw) {
  const m = String(raw).match(/(\d{2,4})\s*(?:[-–/]\s*(\d{2,4}))?/);
  if (!m) return null;
  let start = Number(m[1]);
  if (start < 100) start += start > 40 ? 1900 : 2000;
  if (!m[2] && YEAR_ENDS) start -= 1;
  if (start < 1940 || start > 2100) return null;
  return `${start}–${String(start + 1).slice(2)}`;
}

const splitList = (cell) =>
  String(cell ?? "")
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

// ---------- Στήλες ----------

const columns = {
  year: (h) => /^(χρονια|ετος|σχολικο ετος|προσκοπικο ετος|ετη)/.test(h),
  staffSystem: (h) => h.includes("επιτελει") && h.includes("συστημ"),
  staffCubs: (h) => h.includes("επιτελει") && h.includes("αγελ"),
  staffScouts: (h) => h.includes("επιτελει") && h.includes("ομαδ"),
  staffVenturers: (h) => h.includes("επιτελει") && h.includes("κοινοτ"),
  campCubs: (h) => h.includes("κατασκην") && h.includes("αγελ"),
  campScouts: (h) => h.includes("κατασκην") && h.includes("ομαδ"),
  actionVenturers: (h) => h.includes("δραση") && h.includes("κοινοτ"),
};

const staffConfig = [
  ["staffSystem", "systima", "Επιτελείο Συστήματος"],
  ["staffCubs", "agelh-lykopoulon", "Βαθμοφόρος Αγέλης"],
  ["staffScouts", "omada-proskopon", "Βαθμοφόρος Ομάδας"],
  ["staffVenturers", "koinotita-anixneuton", "Βαθμοφόρος Κοινότητας"],
];

const tripConfig = [
  ["campCubs", "agelh-lykopoulon", "Κατασκήνωση Αγέλης", "point"],
  ["campScouts", "omada-proskopon", "Κατασκήνωση Ομάδας", "point"],
  ["actionVenturers", "koinotita-anixneuton", "Μεγάλη Δράση Κοινότητας", "route"],
];

// ---------- Συντεταγμένες ----------

const places = fs.existsSync(PLACES_FILE) ? JSON.parse(fs.readFileSync(PLACES_FILE, "utf8")) : {};

// Οι τόποι που υπάρχουν ήδη στα αρχεία χρονιών είναι γνωστοί και δεν χρειάζονται αναζήτηση.
for (const f of fs.readdirSync(ARCHIVE).filter((f) => /^\d{4}-\d{2}\.json$/.test(f))) {
  for (const t of JSON.parse(fs.readFileSync(path.join(ARCHIVE, f), "utf8")).trips ?? [])
    for (const p of t.places) places[p.name] ??= { lat: p.lat, lng: p.lng, source: "αρχείο" };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let lastRequest = 0;

async function geocode(name) {
  const known = places[name];
  if (known && known.lat != null) return known;
  // Τόπος που δεν βρέθηκε σε προηγούμενη εισαγωγή: δεν ξαναρωτάμε, συμπληρώνεται με το χέρι.
  if (known || OFFLINE) return null;

  // Πολιτική χρήσης Nominatim: έως 1 αίτημα το δευτερόλεπτο, με αναγνωριστικό εφαρμογής.
  const wait = 1100 - (Date.now() - lastRequest);
  if (wait > 0) await sleep(wait);
  lastRequest = Date.now();
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=gr&accept-language=el&q=${encodeURIComponent(name)}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "proskopoi-xolargou-archive-import/1.0" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const [hit] = await res.json();
    places[name] = hit
      ? {
          lat: Number(Number(hit.lat).toFixed(4)),
          lng: Number(Number(hit.lon).toFixed(4)),
          source: "OpenStreetMap",
          found: hit.display_name,
        }
      : { lat: null, lng: null, source: "δεν βρέθηκε" };
  } catch (err) {
    console.warn(`⚠ Αποτυχία αναζήτησης «${name}»: ${err.message}`);
    return null;
  }
  return places[name].lat != null ? places[name] : null;
}

// ---------- Εισαγωγή ----------

const leaders = JSON.parse(fs.readFileSync(LEADERS_FILE, "utf8"));
const leaderByName = new Map(leaders.map((l) => [norm(`${l.firstName} ${l.lastName}`), l.id]));

const rows = parseCsv(readText(csvFile));
const header = rows.shift().map(norm);
const colIndex = Object.fromEntries(
  Object.entries(columns).map(([key, test]) => [key, header.findIndex(test)]),
);

const missing = Object.entries(colIndex).filter(([, i]) => i < 0);
if (colIndex.year < 0) {
  console.error("✖ Δεν βρέθηκε στήλη χρονιάς (π.χ. «Χρονιά»). Επικεφαλίδες:", header.join(" | "));
  process.exit(1);
}
if (missing.length) console.warn("⚠ Δεν βρέθηκαν οι στήλες:", missing.map(([k]) => k).join(", "));

const report = { years: 0, leaders: 0, trips: 0, notFound: new Map(), badYears: [], dropped: [] };
const written = new Set();

for (const [n, row] of rows.entries()) {
  const year = parseYear(row[colIndex.year]);
  if (!year) {
    report.badYears.push(`γραμμή ${n + 2}: «${row[colIndex.year]}»`);
    continue;
  }
  const file = path.join(ARCHIVE, `${year.replace("–", "-")}.json`);
  const previous = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};

  const yearLeaders = [];
  for (const [key, section, defaultRole] of staffConfig) {
    if (colIndex[key] < 0) continue;
    for (const entry of splitList(row[colIndex[key]])) {
      const m = entry.match(/^(.*?)\s*\((.+)\)\s*$/);
      const name = (m ? m[1] : entry).trim();
      const role = m ? m[2].trim() : defaultRole;
      const leaderId = leaderByName.get(norm(name));
      yearLeaders.push({ name, role, section, ...(leaderId ? { leaderId } : {}) });
    }
  }

  const trips = [];
  for (const [key, section, defaultTitle, kind] of tripConfig) {
    if (colIndex[key] < 0) continue;
    // Κατασκηνώσεις: πολλές χωρίζονται με ; ή αλλαγή γραμμής (το κόμμα επιτρέπεται, π.χ. «Ελάτη, Τρικάλων»).
    const cell = String(row[colIndex[key]] ?? "");
    const entries = kind === "route" ? [cell.trim()] : cell.split(/[;\n]+/).map((x) => x.trim());
    for (const entry of entries.filter(Boolean)) {
      const colon = entry.indexOf(":");
      const title = colon > 0 ? entry.slice(0, colon).trim() : defaultTitle;
      const body = colon > 0 ? entry.slice(colon + 1) : entry;
      const names =
        kind === "route"
          ? body
              .split(/\s*(?:→|->|>|[-–—]|\n)\s*/)
              .map((s) => s.trim())
              .filter(Boolean)
          : [body.trim()];

      const resolved = [];
      for (const name of names) {
        const hit = await geocode(name);
        if (hit) resolved.push({ name, lat: hit.lat, lng: hit.lng });
        else report.notFound.set(name, `${year} · ${title}`);
      }
      if (!resolved.length) {
        report.dropped.push(`${year} · ${title} (κανένας τόπος δεν βρέθηκε)`);
        continue;
      }
      trips.push({
        title,
        section,
        type: resolved.length >= 2 ? "route" : "point",
        places: resolved,
      });
    }
  }

  const out = {
    year,
    // Η σημείωση της χρονιάς γράφεται με το χέρι και διατηρείται σε κάθε νέα εισαγωγή.
    ...(previous.note ? { note: previous.note } : {}),
    leaders: yearLeaders,
    trips,
  };
  fs.writeFileSync(file, JSON.stringify(out, null, 2) + "\n");
  written.add(path.basename(file));
  report.years++;
  report.leaders += yearLeaders.length;
  report.trips += trips.length;
}

fs.writeFileSync(PLACES_FILE, JSON.stringify(places, null, 2) + "\n");

const stale = fs
  .readdirSync(ARCHIVE)
  .filter((f) => /^\d{4}-\d{2}\.json$/.test(f) && !written.has(f));
if (CLEAN) for (const f of stale) fs.rmSync(path.join(ARCHIVE, f));

// ---------- Αναφορά ----------

console.log(
  `\n✔ Χρονιές: ${report.years} · Βαθμοφόροι: ${report.leaders} · Εκδρομές: ${report.trips}`,
);
if (report.badYears.length)
  console.log(`\n⚠ Γραμμές χωρίς έγκυρη χρονιά:\n  ${report.badYears.join("\n  ")}`);
if (report.notFound.size) {
  console.log(
    `\n⚠ Τόποι χωρίς συντεταγμένες (συμπληρώστε lat/lng στο content/archive/_places.json και τρέξτε ξανά):`,
  );
  for (const [name, where] of report.notFound) console.log(`  • ${name}  (${where})`);
}
if (report.dropped.length)
  console.log(`\n⚠ Εκδρομές που παραλείφθηκαν:\n  ${report.dropped.join("\n  ")}`);
if (stale.length)
  console.log(
    CLEAN
      ? `\n🗑 Σβήστηκαν χρονιές που δεν υπάρχουν στο CSV: ${stale.join(", ")}`
      : `\nℹ Υπάρχουν χρονιές που δεν είναι στο CSV (π.χ. τα ενδεικτικά): ${stale.join(", ")}\n  Τρέξτε με --clean για να σβηστούν.`,
  );
console.log(
  "\nΕλέγξτε στον χάρτη τους τόπους που βρέθηκαν αυτόματα: ονόματα όπως «Άγιος Νικόλαος» μπορεί να αντιστοιχούν σε λάθος μέρος.",
);
