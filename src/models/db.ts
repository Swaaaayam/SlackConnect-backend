import Database from 'better-sqlite3';
import { DB_PATH } from '../config';

const db = new Database(DB_PATH);

db.exec(`
CREATE TABLE IF NOT EXISTS workspaces (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id TEXT UNIQUE,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at INTEGER
);

CREATE TABLE IF NOT EXISTS scheduled_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id TEXT,
  channel_id TEXT,
  text TEXT,
  post_at INTEGER,
  status TEXT DEFAULT 'scheduled',
  slack_scheduled_message_id TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now'))
);
`);

export default db;

