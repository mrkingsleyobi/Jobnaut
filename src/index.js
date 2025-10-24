// Main entry point for JobNaut application

const express = require('express');
const envConfig = require('../config/env');
const { createTRPCExpressMiddleware } = require('./api/server');

// Load environment variables
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = envConfig.getPort();

// Middleware
app.use(express.json());

// Import routes
const userRoutes = require('./routes/user');

// tRPC middleware
const trpcMiddleware = createTRPCExpressMiddleware();
app.use('/trpc', trpcMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'JobNaut API'
  });
});

// Basic routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to JobNaut API',
    version: '1.0.0',
    documentation: '/docs',
    endpoints: {
      rest: '/api/v1/*',
      trpc: '/trpc/*',
      health: '/health'
    }
  });
});

// API routes
app.use('/api/v1/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: envConfig.isDevelopment() ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;