const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const db = require('./db/connection');

// Import routes
const authRoutes = require('./routes/auth');
const voiceRoutes = require('./routes/voice');
const complaintsRoutes = require('./routes/complaints');
const departmentsRoutes = require('./routes/departments');
const staffRoutes = require('./routes/staff');
const hotspotsRoutes = require('./routes/hotspots');
const analyticsRoutes = require('./routes/analytics');
const notificationsRoutes = require('./routes/notifications');
const streamRoutes = require('./routes/stream');
const locationsRoutes = require('./routes/locations');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging in development
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    if (!req.url.startsWith('/api/stream')) {
      console.log(`[${req.method}] ${req.url}`);
    }
    next();
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/hotspots', hotspotsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/stream', streamRoutes);
app.use('/api/locations', locationsRoutes);

// Root API Directory & Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'VOXENTRA Civic Command Platform',
    version: '1.0.0',
    mode: config.nodeEnv,
    smsProvider: config.sms.provider,
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    platform: 'VOXENTRA Civic Command Platform API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      complaints: 'GET /api/complaints',
      complaintById: 'GET /api/complaints/:id',
      createComplaint: 'POST /api/complaints',
      updateComplaint: 'PATCH /api/complaints/:id',
      duplicates: 'GET /api/complaints/:id/duplicates',
      voiceInteract: 'POST /api/voice/interact',
      departments: 'GET /api/departments',
      staff: 'GET /api/staff',
      hotspots: 'GET /api/hotspots',
      analytics: 'GET /api/analytics/summary',
      notifications: 'GET /api/notifications',
      liveStream: 'GET /api/stream/pulse (SSE)'
    },
    timestamp: new Date().toISOString()
  });
});

// Serve frontend build if available
const clientDist = path.join(__dirname, '../client/dist');
const fs = require('fs');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('/', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      status: 'online',
      platform: 'VOXENTRA Civic Command Platform API',
      message: 'Backend server is running smoothly. Visit /api for endpoint documentation or /api/health for system status.',
      healthCheck: '/api/health',
      apiDirectory: '/api',
      timestamp: new Date().toISOString()
    });
  });
}

// 404 handler for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    error: `API route not found: ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      '/api/health',
      '/api/complaints',
      '/api/voice/interact',
      '/api/departments',
      '/api/staff',
      '/api/hotspots',
      '/api/analytics/summary',
      '/api/notifications',
      '/api/stream/pulse'
    ]
  });
});

// Universal catch-all for SPA client routing if static client exists
if (fs.existsSync(clientDist)) {
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Initialize database and start server
async function startServer() {
  try {
    await db.initSchema();
    const server = app.listen(config.port, () => {
      console.log(`\n==========================================================`);
      console.log(`⚡ VOXENTRA Intelligent Civic Platform Server Running`);
      console.log(`⚡ API URL:    http://localhost:${config.port}`);
      console.log(`⚡ Health:     http://localhost:${config.port}/api/health`);
      console.log(`⚡ Mode:       ${config.nodeEnv}`);
      console.log(`==========================================================\n`);
    });
    return server;
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
