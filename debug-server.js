// Debug server script for troubleshooting 403 Forbidden errors
import os from 'os';
import http from 'http';
import fs from 'fs';
import { exec } from 'child_process';
import express from 'express';

const PORT = process.env.PORT || 3000;
const app = express();

// Enable JSON
app.use(express.json());

// 1. System Information
function getSystemInfo() {
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    release: os.release(),
    type: os.type(),
    arch: os.arch(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'not set',
    cpus: os.cpus().length,
    networkInterfaces: Object.entries(os.networkInterfaces()).map(([name, details]) => ({
      name,
      details: details.map(d => ({
        family: d.family,
        address: d.address,
        internal: d.internal
      }))
    }))
  };
}

// 2. Process Information
function getProcessInfo() {
  return {
    pid: process.pid,
    ppid: process.ppid,
    uptime: process.uptime(),
    cwd: process.cwd(),
    execPath: process.execPath,
    versions: process.versions,
    memoryUsage: process.memoryUsage()
  };
}

// 3. Network/Port Check
function checkPortAvailability(port, callback) {
  const testServer = http.createServer();
  
  testServer.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      callback(false, `Port ${port} is in use`);
    } else {
      callback(false, `Error checking port ${port}: ${err.message}`);
    }
  });
  
  testServer.once('listening', () => {
    testServer.close(() => {
      callback(true, `Port ${port} is available`);
    });
  });
  
  testServer.listen(port);
}

// 4. File system checks
function checkFileSystem() {
  const checks = [];
  const filesToCheck = [
    'server.js',
    'package.json',
    'public/index.html',
    '.env'
  ];
  
  for (const file of filesToCheck) {
    try {
      const stats = fs.statSync(file);
      checks.push({
        file,
        exists: true,
        size: stats.size,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        permissions: stats.mode.toString(8).slice(-3),
        modified: stats.mtime
      });
    } catch (error) {
      checks.push({
        file,
        exists: false,
        error: error.message
      });
    }
  }
  
  return checks;
}

// 5. Run network diagnostics
function runNetworkCommand(command, callback) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      callback({ success: false, error: error.message, stderr });
      return;
    }
    callback({ success: true, output: stdout });
  });
}

// Routes
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Server Diagnostics</title>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.5; }
          h1 { color: #2563eb; }
          h2 { margin-top: 20px; color: #4b5563; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
          pre { background: #f3f4f6; padding: 15px; border-radius: 6px; overflow-x: auto; }
          .card { background: white; border-radius: 8px; padding: 15px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); }
          .success { color: #16a34a; }
          .error { color: #dc2626; }
          .warning { color: #ca8a04; }
          .info { color: #2563eb; }
          button { background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
          button:hover { background: #1d4ed8; }
        </style>
      </head>
      <body>
        <h1>DateCalculatorPlus Server Diagnostics</h1>
        <p>This tool helps identify issues with your server configuration that might cause 403 Forbidden errors.</p>
        
        <div class="card">
          <h2>Quick Actions</h2>
          <button onclick="window.location.href='/api/debug'">Run Full Diagnostics</button>
          <button onclick="window.location.href='/api/port-check'">Check Ports</button>
          <button onclick="window.location.href='/api/fs-check'">Check File System</button>
          <button onclick="window.location.href='/api/network'">Run Network Tests</button>
        </div>

        <div class="card">
          <h2>Request Information</h2>
          <pre id="requestInfo">
Method: ${req.method}
URL: ${req.url}
Headers: ${JSON.stringify(req.headers, null, 2)}
          </pre>
        </div>
        
        <div class="card">
          <h2>Environment Variables (Safe)</h2>
          <pre>
NODE_ENV: ${process.env.NODE_ENV || 'not set'}
PORT: ${process.env.PORT || 'not set'}
PUBLIC_URL: ${process.env.PUBLIC_URL || 'not set'}
          </pre>
          <p class="warning">Note: For security, we're only showing select environment variables.</p>
        </div>
      </body>
    </html>
  `);
});

// API endpoints for diagnostics
app.get('/api/debug', (req, res) => {
  checkPortAvailability(PORT, (available, portMessage) => {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      system: getSystemInfo(),
      process: getProcessInfo(),
      fileSystem: checkFileSystem(),
      port: {
        configured: PORT,
        available,
        message: portMessage
      },
      headers: req.headers
    };
    
    res.json(diagnostics);
  });
});

app.get('/api/port-check', (req, res) => {
  const portsToCheck = [3000, 5000, 8000, 8080];
  const results = {};
  let completed = 0;
  
  portsToCheck.forEach(port => {
    checkPortAvailability(port, (available, message) => {
      results[port] = { available, message };
      completed++;
      
      if (completed === portsToCheck.length) {
        res.json(results);
      }
    });
  });
});

app.get('/api/fs-check', (req, res) => {
  res.json(checkFileSystem());
});

app.get('/api/network', (req, res) => {
  const command = process.platform === 'win32' 
    ? 'ipconfig'
    : 'ifconfig || ip addr';
    
  runNetworkCommand(command, (result) => {
    res.json(result);
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
====================================
🔍 DIAGNOSTICS SERVER RUNNING
====================================
URL: http://localhost:${PORT}
API: http://localhost:${PORT}/api/debug
====================================
  `);
}); 