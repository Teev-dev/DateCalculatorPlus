import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const { Pool } = pg;

const main = async () => {
  console.log('DateCalculatorPlus Database Setup');
  console.log('=================================');
  
  try {
    // Check if .env file exists and DATABASE_URL is configured
    console.log('Checking environment configuration...');
    if (!process.env.DATABASE_URL) {
      console.warn('WARNING: DATABASE_URL not found in environment. Using default connection string.');
    }
    
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/datecalcplus';
    console.log(`Using connection string: ${connectionString}`);
    
    // Check if migrations folder exists
    const migrationsFolder = path.join(__dirname, 'migrations');
    console.log(`Checking migrations folder: ${migrationsFolder}`);
    if (!fs.existsSync(migrationsFolder)) {
      console.error('ERROR: Migrations folder not found!');
      process.exit(1);
    }
    
    const migrationFiles = fs.readdirSync(migrationsFolder);
    console.log(`Found ${migrationFiles.length} migration files: ${migrationFiles.join(', ')}`);
    
    // Check if meta journal file exists
    const journalPath = path.join(__dirname, 'meta', '_journal.json');
    console.log(`Checking journal file: ${journalPath}`);
    if (!fs.existsSync(journalPath)) {
      console.error('ERROR: Journal file not found!');
      process.exit(1);
    }
    
    // Connect to database
    console.log('Connecting to database...');
    const pool = new Pool({
      connectionString
    });
    
    // Test connection
    console.log('Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('Database connection successful!');
    
    const db = drizzle(pool);
    
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder });
    console.log('Migrations completed successfully!');
    
    // Count tables to verify migration
    const { rows } = await pool.query(`
      SELECT COUNT(*) as table_count FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log(`Database now has ${rows[0].table_count} tables.`);
    
    await pool.end();
    console.log('Database connection closed.');
    console.log('Setup completed successfully!');
  } catch (error) {
    console.error('Error during database setup:');
    console.error(error);
    process.exit(1);
  }
};

main();
