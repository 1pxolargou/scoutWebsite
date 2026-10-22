// Μικρός στατικός server για να δείτε τοπικά το build (φάκελος out/), χωρίς εξαρτήσεις.
// Χρήση: npm run build && npm run preview  →  http://localhost:4173
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "out");
const port = Number(process.env.PORT) || 4173;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".ics": "text/calendar; charset=utf-8",
  ".xml": "application/xml",
};

createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
  let file = normalize(join(root, url));
  if (!file.startsWith(root)) return res.writeHead(403).end();
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) {
    res.writeHead(404, { "Content-Type": types[".html"] });
    return createReadStream(join(root, "404.html")).pipe(res);
  }
  res.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Στατικό site: http://localhost:${port}`));
