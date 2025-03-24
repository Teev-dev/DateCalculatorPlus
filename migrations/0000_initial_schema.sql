-- Migration: 0000_initial_schema
-- Description: Initial database schema for DateCalculatorPlus

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "name" VARCHAR(255),
  "password_hash" VARCHAR(255),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create date_calculations table
CREATE TABLE IF NOT EXISTS "date_calculations" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID REFERENCES "users"("id") ON DELETE CASCADE,
  "start_date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "end_date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "calculation_type" VARCHAR(50) NOT NULL, -- 'difference', 'add', 'workdays', etc.
  "exclude_weekends" BOOLEAN DEFAULT FALSE,
  "exclude_holidays" BOOLEAN DEFAULT FALSE,
  "region" VARCHAR(10),
  "unit" VARCHAR(20) NOT NULL, -- 'days', 'weeks', 'months', 'years'
  "result" JSONB NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create saved_dates table
CREATE TABLE IF NOT EXISTS "saved_dates" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID REFERENCES "users"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "notes" TEXT,
  "tags" VARCHAR(255)[],
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS "user_preferences" (
  "user_id" UUID PRIMARY KEY REFERENCES "users"("id") ON DELETE CASCADE,
  "default_timezone" VARCHAR(100) DEFAULT 'UTC',
  "date_format" VARCHAR(50) DEFAULT 'yyyy-MM-dd',
  "work_week_start" SMALLINT DEFAULT 1, -- 0 = Sunday, 1 = Monday, etc.
  "work_week_end" SMALLINT DEFAULT 5, -- 4 = Friday, 5 = Saturday, etc.
  "default_region" VARCHAR(10) DEFAULT 'US',
  "theme" VARCHAR(20) DEFAULT 'light',
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create holidays table
CREATE TABLE IF NOT EXISTS "holidays" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "region" VARCHAR(10) NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "date" DATE NOT NULL,
  "is_half_day" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("region", "date", "name")
);

-- Create timezones table
CREATE TABLE IF NOT EXISTS "timezones" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL UNIQUE,
  "offset" VARCHAR(10) NOT NULL,
  "display_name" VARCHAR(255) NOT NULL
);

-- Create api_tokens table
CREATE TABLE IF NOT EXISTS "api_tokens" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "token" VARCHAR(255) NOT NULL UNIQUE,
  "expires_at" TIMESTAMP WITH TIME ZONE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "last_used_at" TIMESTAMP WITH TIME ZONE
);

-- Insert some common timezones
INSERT INTO "timezones" ("name", "offset", "display_name") VALUES
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
  ('Australia/Sydney', '+10:00', 'Sydney')
ON CONFLICT DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS "date_calculations_user_id_idx" ON "date_calculations"("user_id");
CREATE INDEX IF NOT EXISTS "saved_dates_user_id_idx" ON "saved_dates"("user_id");
CREATE INDEX IF NOT EXISTS "holidays_region_date_idx" ON "holidays"("region", "date"); 