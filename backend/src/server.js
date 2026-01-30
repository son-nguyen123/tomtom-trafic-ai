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
