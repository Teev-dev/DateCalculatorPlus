#!/usr/bin/env node
// Environment Checker and Fixer for DateCalculatorPlus
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`
=============================================
DateCalculatorPlus Environment Fix Script
=============================================
`);

// 1. Check essential directories
const requiredDirs = ['public', 'src'];
const missingDirs = [];

console.log("🔍 Checking project structure...");
for (const dir of requiredDirs) {
  if (!fs.existsSync(dir)) {
    missingDirs.push(dir);
    console.log(`❌ Missing directory: ${dir}`);
  } else {
    console.log(`✅ Directory exists: ${dir}`);
  }
}

// 2. Check essential files
const requiredFiles = [
  'package.json',
  'server.js',
  'public/index.html',
  '.env'
];
const missingFiles = [];

console.log("\n🔍 Checking essential files...");
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    missingFiles.push(file);
    console.log(`❌ Missing file: ${file}`);
  } else {
    console.log(`✅ File exists: ${file}`);
  }
}

// 3. Fix missing directories
if (missingDirs.length > 0) {
  console.log("\n🛠️ Creating missing directories...");
  for (const dir of missingDirs) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
}

// 4. Create basic files if missing
if (missingFiles.includes('public/index.html')) {
  console.log("\n🛠️ Creating basic index.html...");
  
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }
  
  const basicHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DateCalculatorPlus</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #2563eb; }
  </style>
</head>
<body>
  <h1>DateCalculatorPlus</h1>
  <p>Welcome to DateCalculatorPlus! This is a placeholder page created by the fix-env.js script.</p>
</body>
</html>`;

  fs.writeFileSync('public/index.html', basicHtml);
  console.log("✅ Created public/index.html");
}

if (missingFiles.includes('.env')) {
  console.log("\n🛠️ Creating basic .env file...");
  
  const basicEnv = `# DateCalculatorPlus Environment Variables
PORT=8080
NODE_ENV=development

# API Configuration
API_TIMEOUT=30000
API_RATE_LIMIT=100

# Database Configuration (for future use)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=datecalculator
DB_USER=postgres
DB_PASSWORD=postgres

# Feature Flags
ENABLE_HOLIDAYS=true
ENABLE_TIMEZONES=true
ENABLE_WORKDAYS=true`;

  fs.writeFileSync('.env', basicEnv);
  console.log("✅ Created .env file");
}

// 5. Check .replit configuration
if (fs.existsSync('.replit')) {
  console.log("\n🔍 Checking .replit configuration...");
  const replitConfig = fs.readFileSync('.replit', 'utf8');
  
  // Check if port 8080 is defined
  if (!replitConfig.includes('localPort = 8080')) {
    console.log("⚠️ .replit file may need port 8080 configuration");
    console.log("⚠️ Consider adding the following to your .replit file:");
    console.log(`
[[ports]]
localPort = 8080
externalPort = 8080`);
  } else {
    console.log("✅ .replit has port 8080 configured");
  }
} else {
  console.log("\n⚠️ No .replit file found. This might be needed for Replit hosting.");
}

// 6. Check package.json scripts
console.log("\n🔍 Checking package.json scripts...");
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const requiredScripts = ['dev', 'start', 'debug', 'fix-replit'];
const missingScripts = [];

for (const script of requiredScripts) {
  if (!packageJson.scripts || !packageJson.scripts[script]) {
    missingScripts.push(script);
    console.log(`❌ Missing script: ${script}`);
  } else {
    console.log(`✅ Script exists: ${script}`);
  }
}

// 7. Check dependencies
console.log("\n🔍 Checking essential dependencies...");
const essentialDeps = ['express', 'cors', 'dotenv'];
const missingDeps = [];

for (const dep of essentialDeps) {
  if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
    missingDeps.push(dep);
    console.log(`❌ Missing dependency: ${dep}`);
  } else {
    console.log(`✅ Dependency exists: ${dep} (${packageJson.dependencies[dep]})`);
  }
}

// 8. Install missing dependencies
if (missingDeps.length > 0) {
  console.log(`\n🛠️ Installing ${missingDeps.length} missing dependencies...`);
  try {
    const installCmd = `npm install --save ${missingDeps.join(' ')}`;
    console.log(`Running: ${installCmd}`);
    execSync(installCmd, { stdio: 'inherit' });
    console.log("✅ Dependencies installed successfully");
  } catch (error) {
    console.error("❌ Error installing dependencies:", error.message);
  }
}

// 9. Summary and suggested next steps
console.log(`
=============================================
✅ Environment Check Complete
=============================================

🔹 Fixed directories: ${missingDirs.length}
🔹 Fixed files: ${missingFiles.length}
🔹 Fixed dependencies: ${missingDeps.length}

Next Steps:
1. Run the test server:
   npm run test-server

2. If you're on Replit and getting 403 errors:
   npm run fix-replit

3. For detailed diagnostics:
   npm run debug

4. Read the troubleshooting guide:
   docs/403-troubleshooting.md
=============================================
`);

// Exit with success
process.exit(0); 