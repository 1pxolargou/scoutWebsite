// Μετά το στατικό export: ο browser ζητά τα αρχεία προφόρτωσης του Next.js με «επίπεδα» ονόματα
// (π.χ. nea/__next.nea.__PAGE__.txt), ενώ το build τα γράφει σε υποφακέλους
// (nea/__next.nea/__PAGE__.txt). Δημιουργούμε αντίγραφα με τα επίπεδα ονόματα ώστε η γρήγορη
// πλοήγηση να δουλεύει σε οποιονδήποτε στατικό hosting, χωρίς ρυθμίσεις rewrite.
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");
if (!fs.existsSync(OUT)) process.exit(0);

let count = 0;

function filesUnder(dir, prefix = []) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? filesUnder(path.join(dir, e.name), [...prefix, e.name])
        : [[...prefix, e.name]],
    );
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.")) {
      for (const parts of filesUnder(full)) {
        const alias = path.join(dir, [entry.name, ...parts].join("."));
        if (!fs.existsSync(alias)) {
          fs.copyFileSync(path.join(full, ...parts), alias);
          count++;
        }
      }
    } else if (entry.name !== "_next") {
      walk(full);
    }
  }
}

walk(OUT);
console.log(`postexport: ${count} αρχεία προφόρτωσης`);
