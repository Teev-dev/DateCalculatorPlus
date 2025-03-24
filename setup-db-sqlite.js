// setup-db-sqlite.js
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('DateCalculatorPlus SQLite Database Setup');
console.log('=======================================');

try {
  // Create database directory if it doesn't exist
  const dbPath = './database.db';
  console.log(`Using database path: ${path.resolve(dbPath)}`);
  
  // Initialize SQLite database
  console.log('Initializing SQLite database...');
  const sqlite = new Database(dbPath);
  console.log('SQLite database initialized successfully!');
  
  // Create drizzle instance
  const db = drizzle(sqlite);
  
  // Create SQLite-specific migrations
  const migrationsFolder = path.join(__dirname, 'migrations-sqlite');
  if (!fs.existsSync(migrationsFolder)) {
    console.log(`Creating migrations folder: ${migrationsFolder}`);
    fs.mkdirSync(migrationsFolder, { recursive: true });
    
    // Create initial migration file
    const initialMigration = `-- Migration: 0000_initial_schema
-- Description: Initial database schema for DateCalculatorPlus (SQLite version)

-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "password_hash" TEXT,
  "created_at" TEXT DEFAULT (datetime('now')),
  "updated_at" TEXT DEFAULT (datetime('now'))
);

-- Create date_calculations table
CREATE TABLE IF NOT EXISTS "date_calculations" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT REFERENCES "users"("id") ON DELETE CASCADE,
  "start_date" TEXT NOT NULL,
  "end_date" TEXT NOT NULL,
  "calculation_type" TEXT NOT NULL,
  "exclude_weekends" INTEGER DEFAULT 0,
  "exclude_holidays" INTEGER DEFAULT 0,
  "region" TEXT,
  "unit" TEXT NOT NULL,
  "result" TEXT NOT NULL,
  "created_at" TEXT DEFAULT (datetime('now'))
);

-- Create saved_dates table
CREATE TABLE IF NOT EXISTS "saved_dates" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT REFERENCES "users"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "notes" TEXT,
  "tags" TEXT,
  "created_at" TEXT DEFAULT (datetime('now')),
  "updated_at" TEXT DEFAULT (datetime('now'))
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS "user_preferences" (
  "user_id" TEXT PRIMARY KEY REFERENCES "users"("id") ON DELETE CASCADE,
  "default_timezone" TEXT DEFAULT 'UTC',
  "date_format" TEXT DEFAULT 'yyyy-MM-dd',
  "work_week_start" INTEGER DEFAULT 1,
  "work_week_end" INTEGER DEFAULT 5,
  "default_region" TEXT DEFAULT 'US',
  "theme" TEXT DEFAULT 'light',
  "updated_at" TEXT DEFAULT (datetime('now'))
);

-- Create holidays table
CREATE TABLE IF NOT EXISTS "holidays" (
  "id" TEXT PRIMARY KEY,
  "region" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "is_half_day" INTEGER DEFAULT 0,
  "created_at" TEXT DEFAULT (datetime('now')),
  UNIQUE ("region", "date", "name")
);

-- Create timezones table
CREATE TABLE IF NOT EXISTS "timezones" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL UNIQUE,
  "offset" TEXT NOT NULL,
  "display_name" TEXT NOT NULL
);

-- Create api_tokens table
CREATE TABLE IF NOT EXISTS "api_tokens" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expires_at" TEXT,
  "created_at" TEXT DEFAULT (datetime('now')),
  "last_used_at" TEXT
);

-- Insert some common timezones
INSERT OR IGNORE INTO "timezones" ("name", "offset", "display_name") VALUES
  ('UTC', '+00:00', 'UTC'),
  ('America/New_York', '-05:00', 'Eastern Time (US & Canada)'),
  ('America/Chicago', '-06:00', 'Central Time (US & Canada)'),
  ('America/Denver', '-07:00', 'Mountain Time (US & Canada)'),
  ('America/Los_Angeles', '-08:00', 'Pacific Time (US & Canada)'),
  ('Europe/London', '+00:00', 'London'),
  ('Europe/Paris', '+01:00', 'Paris'),
  ('Europe/Berlin', '+01:00', 'Berlin'),
  ('Asia/Tokyo', '+09:00', 'Tokyo'),
  ('Asia/Shanghai', '+08:00', 'Shanghai'),
  ('Australia/Sydney', '+10:00', 'Sydney');

-- Create indexes
CREATE INDEX IF NOT EXISTS "date_calculations_user_id_idx" ON "date_calculations"("user_id");
CREATE INDEX IF NOT EXISTS "saved_dates_user_id_idx" ON "saved_dates"("user_id");
CREATE INDEX IF NOT EXISTS "holidays_region_date_idx" ON "holidays"("region", "date");`;
    
    fs.writeFileSync(
      path.join(migrationsFolder, '0000_initial_schema.sql'),
      initialMigration
    );
    console.log('Created initial migration file.');
  }
  
  // Run migrations
  console.log('Running migrations...');
  migrate(db, { migrationsFolder });
  console.log('Migrations completed successfully!');
  
  // Verify tables exist
  const tables = sqlite.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'
  `).all();
  
  console.log(`Created ${tables.length} tables:`);
  tables.forEach(table => console.log(`- ${table.name}`));
  
  console.log('\nDatabase setup completed successfully!');
} catch (error) {
  console.error('Error during database setup:');
  console.error(error);
  process.exit(1);
} 