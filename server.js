import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ES Modules setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();
const PORT = process.env.PORT || 8080; // Try a different port

// Configure Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS with permissive settings for development
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Basic test routes
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'operational', 
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Serve static files from the 'public' directory
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Specific route for browser-test.html to ensure it's accessible
app.get('/browser-test.html', (req, res) => {
  res.sendFile(path.join(publicDir, 'browser-test.html'));
});

// Specific route for test.html
app.get('/test.html', (req, res) => {
  res.sendFile(path.join(publicDir, 'test.html'));
});

// Catch-all route for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server - bind to all interfaces (important for some hosting environments)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`- Local URL: http://localhost:${PORT}`);
  console.log(`- API status: http://localhost:${PORT}/api/status`);
  console.log(`- Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`- Browser test: http://localhost:${PORT}/browser-test.html`);
  console.log(`- Simple test: http://localhost:${PORT}/test.html`);
});
