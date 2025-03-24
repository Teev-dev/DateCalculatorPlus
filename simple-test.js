// Simple test script to verify output
console.log('STARTING SIMPLE TEST');
process.stdout.write('This is a test message to stdout\n');
process.stderr.write('This is a test message to stderr\n');
console.log('Environment variables:');
Object.keys(process.env).slice(0, 10).forEach(key => {
  console.log(`${key}=${process.env[key]}`);
});
console.log('ENDING SIMPLE TEST'); 