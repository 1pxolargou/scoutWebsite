/**
 * Ισοϋψείς καμπύλες (όπως στο banner), παραγόμενες ντετερμινιστικά από seed.
 * Server component: βγαίνει ως στατικό inline SVG, χωρίς JS στον browser.
 */

const WIDTH = 1200;
const HEIGHT = 600;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Κλειστή ομαλή καμπύλη: τετραγωνικές Bézier μέσω των μέσων διαδοχικών σημείων. */
function closedPath(points: [number, number][]) {
  const mid = (a: [number, number], b: [number, number]) =>
    [Math.round((a[0] + b[0]) / 2), Math.round((a[1] + b[1]) / 2)] as const;
  const n = points.length;
  const start = mid(points[n - 1], points[0]);
  let d = `M${start[0]} ${start[1]}`;
  for (let i = 0; i < n; i++) {
    const p = points[i];
    const m = mid(p, points[(i + 1) % n]);
    d += `Q${Math.round(p[0])} ${Math.round(p[1])} ${m[0]} ${m[1]}`;
  }
  return d + "Z";
}

function buildContours(seed: number) {
  const rand = mulberry32(seed);
  const paths: string[] = [];
  const peaks = 6;
  const steps = 28;

  for (let c = 0; c < peaks; c++) {
    const cx = rand() * WIDTH;
    const cy = rand() * HEIGHT;
    const rings = 5 + Math.floor(rand() * 5);
    const gap = 22 + rand() * 16;
    const phases = [rand(), rand(), rand()].map((p) => p * Math.PI * 2);
    const amps = [0.18 + rand() * 0.12, 0.08 + rand() * 0.08, 0.04 + rand() * 0.05];

    for (let r = 1; r <= rings; r++) {
      const base = r * gap;
      // Οι εξωτερικοί δακτύλιοι «παραμορφώνονται» λίγο περισσότερο, όπως σε πραγματικό χάρτη.
      const wobble = 1 + r * 0.06;
      const points: [number, number][] = [];
      for (let i = 0; i < steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const k =
          1 +
          wobble *
            (amps[0] * Math.sin(2 * a + phases[0]) +
              amps[1] * Math.sin(3 * a + phases[1]) +
              amps[2] * Math.sin(5 * a + phases[2]));
        points.push([cx + Math.cos(a) * base * k * 1.4, cy + Math.sin(a) * base * k]);
      }
      paths.push(closedPath(points));
    }
  }
  return paths.join("");
}

const cache = new Map<number, string>();

export function ContourPattern({
  seed = 1945,
  className = "",
}: {
  seed?: number;
  className?: string;
}) {
  let d = cache.get(seed);
  if (!d) {
    d = buildContours(seed);
    cache.set(seed, d);
  }
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
