import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readCatalog } from "../server/catalog.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dbPath = path.join(root, "data", "prueba1.sqlite");
const outputPath = path.join(root, "api", "catalog-data.json");

if (!fs.existsSync(dbPath)) {
  throw new Error("No se encontró el catálogo local. Ejecuta npm run seed primero.");
}

const db = new Database(dbPath, { readonly: true, fileMustExist: true });
try {
  const catalog = readCatalog(db);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  console.log(`Catálogo de despliegue generado: ${path.relative(root, outputPath)}`);
} finally {
  db.close();
}
