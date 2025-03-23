/**
 * Database schema for DateCalculatorPlus
 * 
 * This file defines the database tables and relationships using Drizzle ORM
 */
import { pgTable, serial, text, timestamp, boolean, integer, jsonb, uniqueIndex, foreignKey } from 'drizzle-orm/pg-core';

/**
 * Users table for storing user accounts
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  passwordHash: text('password_hash'),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Date calculations table for storing calculation history
 */
export const dateCalculations = pgTable('date_calculations', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(), // 'difference', 'addition', 'workdays', etc.
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  timeValue: integer('time_value'),
  timeUnit: text('time_unit'), // 'days', 'weeks', 'months', 'years'
  userId: integer('user_id').references(() => users.id),
  timezone: text('timezone'),
  excludeWeekends: boolean('exclude_weekends').default(false),
  excludeHolidays: boolean('exclude_holidays').default(false),
  holidayRegion: text('holiday_region'),
  result: jsonb('result'), // JSON with detailed calculation results
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * Saved dates table for storing user's important dates
 */
export const savedDates = pgTable('saved_dates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  date: timestamp('date').notNull(),
  notes: text('notes'),
  userId: integer('user_id').notNull().references(() => users.id),
  isRecurring: boolean('is_recurring').default(false),
  recurrenceRule: text('recurrence_rule'),
  tags: text('tags').array(),
  color: text('color'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * User preferences table for storing application settings
 */
export const userPreferences = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id).unique(),
  defaultTimezone: text('default_timezone').default('UTC'),
  dateFormat: text('date_format').default('yyyy-MM-dd'),
  timeFormat: text('time_format').default('HH:mm:ss'),
  workWeekStart: integer('work_week_start').default(1), // 1 = Monday
  workWeekEnd: integer('work_week_end').default(5),     // 5 = Friday
  workWeekDays: integer('work_week_days').array(),      // [1,2,3,4,5] for Mon-Fri
  defaultHolidayRegion: text('default_holiday_region'),
  theme: text('theme').default('light'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/**
 * Holiday table for storing custom and default holidays
 */
export const holidays = pgTable('holidays', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  date: timestamp('date').notNull(),
  recurringRule: text('recurring_rule'), // For annual holidays
  region: text('region').notNull(),
  type: text('type').notNull(), // 'public', 'bank', 'observance', 'custom'
  isCustom: boolean('is_custom').default(false),
  userId: integer('user_id').references(() => users.id), // For custom user holidays
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
  return {
    // Unique index for region-date combination (for non-custom holidays)
    regionDateIdx: uniqueIndex('region_date_idx').on(
      table.region, 
      table.date
    ).where(table.isCustom.eq(false)),
  };
});

/**
 * Timezone data table for storing timezone information
 */
export const timezones = pgTable('timezones', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(), // e.g., 'America/New_York'
  name: text('name').notNull(), // e.g., 'Eastern Time'
  countryCode: text('country_code'), // e.g., 'US'
  offsetMinutes: integer('offset_minutes'), // Offset from UTC in minutes
  hasDst: boolean('has_dst').default(false), // Whether timezone has DST
});

/**
 * API tokens table for external application access
 */
export const apiTokens = pgTable('api_tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  token: text('token').notNull().unique(),
  permissions: text('permissions').array(),
  expiresAt: timestamp('expires_at'),
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

/**
 * Export object for easier imports elsewhere
 */
export const schema = {
  users,
  dateCalculations,
  savedDates,
  userPreferences,
  holidays,
  timezones,
  apiTokens,
}; 