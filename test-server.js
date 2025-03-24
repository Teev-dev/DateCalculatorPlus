import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add CORS headers manually
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(
    path.join(publicDir, 'index.html'),
    `<html>
      <head><title>DateCalculatorPlus</title></head>
      <body>
        <h1>Welcome to DateCalculatorPlus</h1>
        <p>This is a test server instance.</p>
      </body>
    </html>`
  );
}

// Serve static files
app.use(express.static(publicDir, {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.js') res.setHeader('Content-Type', 'application/javascript');
    if (ext === '.css') res.setHeader('Content-Type', 'text/css');
    if (ext === '.html') res.setHeader('Content-Type', 'text/html');
    if (ext === '.json') res.setHeader('Content-Type', 'application/json');
  }
}));

// Simple route for testing
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>DateCalculatorPlus Test Server</title>
        <style>
          body { font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .success { color: green; }
          pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>DateCalculatorPlus Test Server</h1>
        <p class="success">✅ If you can see this page, the test server is running correctly!</p>
        <h2>Server Information</h2>
        <pre>
Port: ${PORT}
Node Version: ${process.version}
Process ID: ${process.pid}
Platform: ${process.platform}
        </pre>
        <h2>Request Headers</h2>
        <pre>${JSON.stringify(req.headers, null, 2)}</pre>
      </body>
    </html>
  `);
});

// JSON endpoint for testing API access
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'DateCalculatorPlus API is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    request: {
      path: req.path,
      method: req.method,
      headers: req.headers
    }
  });
});

// Start server with detailed logging
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
======================================
🟢 DATECALCULATOR PLUS TEST SERVER
======================================
✅ Port: ${PORT}
✅ URL: http://localhost:${PORT}
✅ API: http://localhost:${PORT}/api/status
======================================
`);
}); 