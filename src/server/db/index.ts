/**
 * Database connection utility for DateCalculatorPlus
 * 
 * This file handles the database connection and exports the drizzle instance
 */
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

/**
 * Connection URL from environment variable
 */
const connectionString = process.env.DATABASE_URL;

/**
 * Database connection pool
 */
const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Connection limits
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection not established
});

/**
 * Drizzle ORM instance with our schema
 */
export const db = drizzle(pool, { schema });

/**
 * Function to test the database connection
 * 
 * @returns True if connection successful, throws error otherwise
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

/**
 * Function to close the database connection
 * This should be called when the server is shutting down
 */
export async function closeConnection(): Promise<void> {
  try {
    await pool.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
}

/**
 * Export the schema for convenience
 */
export { schema }; 