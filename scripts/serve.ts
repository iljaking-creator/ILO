/**
 * Tiny static file server for the `web/` folder.
 * Usage: npm run serve  →  http://localhost:5173
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../web", import.meta.url));
const PORT = Number(process.env.PORT ?? 5173);

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url ?? "/").split("?")[0]!);
    const rel = urlPath === "/" ? "/index.html" : urlPath;
    const filePath = join(ROOT, normalize(rel).replace(/^(\.\.[/\\])+/, ""));
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": TYPES[extname(filePath)] ?? "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
}).listen(PORT, () => {
  console.error(`Serving web/ at http://localhost:${PORT}`);
});
