PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS entities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  note TEXT
);

CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  publisher TEXT NOT NULL,
  checked_at TEXT NOT NULL,
  result TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS guides (
  id TEXT PRIMARY KEY,
  entity_id TEXT NOT NULL REFERENCES entities(id),
  title TEXT NOT NULL,
  task TEXT NOT NULL,
  description TEXT NOT NULL,
  preparation TEXT,
  status TEXT NOT NULL CHECK(status IN ('verified', 'demo', 'pending')),
  updated_at TEXT,
  source_id TEXT REFERENCES sources(id),
  common_errors TEXT,
  aliases TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS steps (
  id TEXT PRIMARY KEY,
  guide_id TEXT NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  image_path TEXT,
  image_alt TEXT,
  UNIQUE(guide_id, position)
);

CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY,
  entity_id TEXT NOT NULL REFERENCES entities(id),
  purpose TEXT NOT NULL,
  url TEXT NOT NULL,
  checked_at TEXT NOT NULL,
  result TEXT NOT NULL,
  explanation TEXT NOT NULL
);
