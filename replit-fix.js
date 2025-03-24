// Script to fix common Replit 403 Forbidden issues
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Modules setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();
const PORT = process.env.PORT || 4000;

// CRITICAL FIX: Add permissive CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Basic middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REPLIT FIX: Explicitly serve static files with proper MIME types
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir, {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    
    // Set proper content types for common files
    if (ext === '.js') res.setHeader('Content-Type', 'application/javascript');
    if (ext === '.css') res.setHeader('Content-Type', 'text/css');
    if (ext === '.json') res.setHeader('Content-Type', 'application/json');
    if (ext === '.html') res.setHeader('Content-Type', 'text/html');
    
    // Set caching headers
    res.setHeader('Cache-Control', 'no-cache');
  }
}));

// Create public directory if it doesn't exist
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
  
  // Create a basic index.html if it doesn't exist
  const indexPath = path.join(staticDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    const basicHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DateCalculatorPlus (Fixed)</title>
  <style>
    body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #2563eb; }
    .success { color: #16a34a; }
  </style>
</head>
<body>
  <h1>DateCalculatorPlus Replit Fix</h1>
  <p class="success">✅ If you're seeing this page, the 403 fix is working correctly!</p>
  <p>This page was automatically created by the replit-fix.js script.</p>
  <p>You can now try accessing your regular server endpoints.</p>
</body>
</html>
    `;
    
    fs.writeFileSync(indexPath, basicHtml);
    console.log('Created basic index.html in public directory');
  }
}

// REPLIT FIX: Add explicit status route 
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Replit fix server is working correctly',
    fixApplied: true,
    timestamp: new Date().toISOString(),
    clientIp: req.headers['x-forwarded-for'] || req.connection.remoteAddress
  });
});

// REPLIT FIX: Check Replit-specific configurations
app.get('/api/replit-check', (req, res) => {
  // Check for .replit file
  const hasReplitConfig = fs.existsSync('.replit');
  
  // Try to read the .replit file
  let replitConfig = null;
  if (hasReplitConfig) {
    try {
      replitConfig = fs.readFileSync('.replit', 'utf8');
    } catch (error) {
      console.error('Error reading .replit file:', error);
    }
  }
  
  // Check for replit.nix file
  const hasReplitNix = fs.existsSync('replit.nix');
  
  res.json({
    hasReplitConfig,
    replitConfig,
    hasReplitNix,
    environment: {
      REPL_ID: process.env.REPL_ID || 'not set',
      REPL_OWNER: process.env.REPL_OWNER || 'not set',
      REPL_SLUG: process.env.REPL_SLUG || 'not set'
    },
    ports: {
      current: PORT,
      env: process.env.PORT || 'not set'
    }
  });
});

// Catch-all route (fallback)
app.get('*', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>403 Fix - Fallback</title>
        <style>
          body { font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #2563eb; }
          pre { background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; }
        </style>
      </head>
      <body>
        <h1>DateCalculatorPlus 403 Fix</h1>
        <p>This is a fallback page from the replit-fix server. The requested path <code>${req.path}</code> was not found.</p>
        
        <h2>Request Information</h2>
        <pre>${JSON.stringify({
          method: req.method,
          url: req.url,
          headers: req.headers,
          params: req.params,
          query: req.query
        }, null, 2)}</pre>
        
        <p>Try accessing the <a href="/api/status">status API</a> or <a href="/api/replit-check">Replit check endpoint</a>.</p>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
====================================
🛠️  REPLIT 403 FIX SERVER RUNNING
====================================
URL: http://localhost:${PORT}
API: http://localhost:${PORT}/api/status
Replit Check: http://localhost:${PORT}/api/replit-check
====================================
  `);
}); 