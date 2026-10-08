import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'veriflow.db');
const db = new Database(dbPath);

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password_hash TEXT,
      name TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      title TEXT DEFAULT 'Untitled Draft',
      content TEXT DEFAULT '',
      logs TEXT DEFAULT '[]',
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      document_id TEXT REFERENCES documents(id),
      user_id TEXT REFERENCES users(id),
      content TEXT,
      score INTEGER,
      flags TEXT DEFAULT '[]',
      stats TEXT DEFAULT '{}',
      submitted_at TEXT
    );
  `);
}

export default db;
