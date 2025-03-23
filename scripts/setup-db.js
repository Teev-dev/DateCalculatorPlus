// Database setup script for DateCalculatorPlus
// This script initializes the database and runs migrations

import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up migration directory
const migrationsFolder = path.join(__dirname, '../migrations');

// Create migrations folder if it doesn't exist
if (!fs.existsSync(migrationsFolder)) {
  console.log('Creating migrations folder...');
  fs.mkdirSync(migrationsFolder, { recursive: true });
}

// Main function to set up the database
const main = async () => {
  // Verify DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Test connection
    console.log('Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('Database connection successful');

    // Initialize Drizzle ORM
    const db = drizzle(pool);
    
    // Run migrations if they exist
    if (fs.readdirSync(migrationsFolder).length > 0) {
      console.log('Running migrations...');
      await migrate(db, { migrationsFolder });
      console.log('Migrations completed successfully');
    } else {
      console.log('No migrations found. Initialize the schema first.');
    }
    
    console.log('Database setup completed!');
  } catch (err) {
    console.error('Error during database setup:', err);
    process.exit(1);
  } finally {
    // Close pool
    await pool.end();
  }
};

// Run the main function
main().catch((err) => {
  console.error('Unhandled error during database setup:', err);
  process.exit(1);
}); 