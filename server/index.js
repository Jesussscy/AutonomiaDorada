import "dotenv/config";
import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readCatalog } from "./catalog.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const dbPath = path.resolve(
  root,
  process.env.DATABASE_PATH || "./data/prueba1.sqlite",
);
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.exec(fs.readFileSync(path.join(here, "schema.sql"), "utf8"));

const app = express();
app.disable("x-powered-by");
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
  );
  next();
});
const localWebOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);
if (process.env.WEB_ORIGIN) localWebOrigins.add(process.env.WEB_ORIGIN);
app.use(
  cors({
    origin(origin, callback) {
      callback(null, !origin || localWebOrigins.has(origin));
    },
  }),
);
app.use(express.json({ limit: "32kb" }));
app.get("/api/health", (_req, res) => res.json({ ok: true, name: "Autonomía Dorada" }));

app.get("/api/catalog", (_req, res) => res.json(readCatalog(db)));

app.get("/api/guides/:id", (req, res) => {
  const guide = db
    .prepare(
      "SELECT g.*, e.name AS entity_name, s.title AS source_title, s.url AS source_url, s.checked_at AS source_checked_at FROM guides g JOIN entities e ON e.id = g.entity_id LEFT JOIN sources s ON s.id = g.source_id WHERE g.id = ?",
    )
    .get(req.params.id);
  if (!guide) return res.status(404).json({ error: "Guía no encontrada" });
  guide.steps = db
    .prepare("SELECT * FROM steps WHERE guide_id = ? ORDER BY position")
    .all(req.params.id);
  return res.json(guide);
});

const webBuild = path.join(root, "dist");
if (fs.existsSync(path.join(webBuild, "index.html"))) {
  app.use(express.static(webBuild));
  app.get("/{*path}", (_req, res) =>
    res.sendFile(path.join(webBuild, "index.html")),
  );
}

const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || "127.0.0.1";
app.listen(port, host, () =>
  console.log(`API de Autonomía Dorada disponible en http://localhost:${port}`),
);
