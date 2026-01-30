require('dotenv').config();
const express = require('express');
const cors = require('cors');
const trafficRouter = require('./routes/traffic');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configure CORS for development (restrict in production)
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || []
    : ['http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:8080'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TomTom Traffic AI Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/traffic', trafficRouter);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found. Please check the API documentation.`,
    availableRoutes: [
      'GET /health - Health check',
      'GET /api/traffic/flow?lat={lat}&lon={lon}&zoom={zoom} - Get traffic flow',
      'GET /api/traffic/incidents?bbox={bbox}&maxIncidents={max} - Get traffic incidents',
      'GET /api/traffic/route?origin={origin}&destination={destination} - Calculate route'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  res.status(500).json({ 
    error: 'Internal server error',
    message: message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API base URL: http://localhost:${PORT}/api`);
});
