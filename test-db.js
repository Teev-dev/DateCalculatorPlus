const { Client } = require('pg');
require('dotenv').config();

// Log info about the environment
console.log('Node version:', process.version);
console.log('Environment variables:');
console.log('- DATABASE_URL:', process.env.DATABASE_URL || 'Not set');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'Not set');

async function testConnection() {
  console.log('\nTesting PostgreSQL connection...');
  
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/datecalcplus';
  console.log('Using connection string:', connectionString);
  
  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 5000
  });
  
  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();
    console.log('Connection successful!');
    
    console.log('Querying database...');
    const res = await client.query('SELECT NOW() as time');
    console.log('Current database time:', res.rows[0].time);
    
    await client.end();
    console.log('Connection closed.');
    
    return true;
  } catch (err) {
    console.error('Error connecting to PostgreSQL:');
    console.error(err.message);
    
    if (err.message.includes('ECONNREFUSED')) {
      console.log('\nPossible solutions:');
      console.log('1. Ensure PostgreSQL is running');
      console.log('2. Check if the database exists');
      console.log('3. Verify username and password are correct');
      console.log('4. Check if the port is correct');
    }
    
    try {
      await client.end();
    } catch (e) {
      // Ignore errors on closing
    }
    
    return false;
  }
}

testConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ PostgreSQL connection test passed!');
      process.exit(0);
    } else {
      console.log('\n❌ PostgreSQL connection test failed.');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  }); 