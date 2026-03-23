import fs from 'node:fs';
import path from 'node:path';

import Database from 'better-sqlite3';

import { env } from '@/lib/env';

declare global {
  var __veredictoDb: Database.Database | undefined;
}

function resolveDatabasePath() {
  if (path.isAbsolute(env.databasePath)) return env.databasePath;
  return path.join(process.cwd(), env.databasePath);
}

function ensureDatabaseDirectory(databasePath: string) {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
}

function initializeAppSchema(db: Database.Database) {
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS billing_state (
      user_id TEXT PRIMARY KEY,
      plan TEXT NOT NULL DEFAULT 'free',
      status TEXT NOT NULL DEFAULT 'inactive',
      polar_customer_id TEXT,
      polar_subscription_id TEXT,
      current_period_end TEXT,
      raw_state_json TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS usage_ledger (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      case_id TEXT,
      type TEXT NOT NULL,
      delta INTEGER NOT NULL DEFAULT 1,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS usage_ledger_user_id_idx ON usage_ledger(user_id);
    CREATE INDEX IF NOT EXISTS usage_ledger_case_id_idx ON usage_ledger(case_id);

    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      prompt TEXT NOT NULL,
      meta TEXT NOT NULL,
      kind TEXT NOT NULL,
      verdict TEXT NOT NULL,
      summary TEXT NOT NULL,
      research_json TEXT NOT NULL,
      elevenlabs_conversation_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS cases_user_id_idx ON cases(user_id, updated_at DESC);

    CREATE TABLE IF NOT EXISTS case_messages (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      source TEXT NOT NULL,
      text TEXT NOT NULL,
      sequence INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS case_messages_case_id_idx ON case_messages(case_id, sequence ASC);

    CREATE TABLE IF NOT EXISTS webhook_events (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      processed_at TEXT NOT NULL
    );
  `);
}

export function getDb() {
  if (!global.__veredictoDb) {
    const databasePath = resolveDatabasePath();
    ensureDatabaseDirectory(databasePath);
    global.__veredictoDb = new Database(databasePath);
    initializeAppSchema(global.__veredictoDb);
  }

  return global.__veredictoDb;
}

export function nowIso() {
  return new Date().toISOString();
}

export function toDisplayDate(value: string) {
  return new Date(value).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function randomId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}
