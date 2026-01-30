const express = require('express');
const router = express.Router();
const tomtomService = require('../services/tomtom');

/**
 * GET /api/traffic/flow
 * Get traffic flow data
 */
router.get('/flow', async (req, res) => {
  try {
    const { lat, lon, zoom = 10 } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ 
        error: 'Missing required parameters: lat, lon' 
      });
    }

    const data = await tomtomService.getTrafficFlow(
      parseFloat(lat), 
      parseFloat(lon), 
      parseInt(zoom)
    );
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch traffic flow data',
      message: error.message 
    });
  }
});

/**
 * GET /api/traffic/incidents
 * Get traffic incidents in a bounding box
 */
router.get('/incidents', async (req, res) => {
  try {
    const { bbox, maxIncidents = 10 } = req.query;
    
    if (!bbox) {
      return res.status(400).json({ 
        error: 'Missing required parameter: bbox (minLon,minLat,maxLon,maxLat)' 
      });
    }

    const data = await tomtomService.getTrafficIncidents(bbox, parseInt(maxIncidents));
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch traffic incidents',
      message: error.message 
    });
  }
});

/**
 * GET /api/traffic/route
 * Calculate route with traffic
 */
router.get('/route', async (req, res) => {
  try {
    const { origin, destination } = req.query;
    
    if (!origin || !destination) {
      return res.status(400).json({ 
        error: 'Missing required parameters: origin, destination' 
      });
    }

    const data = await tomtomService.calculateRoute(origin, destination);
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to calculate route',
      message: error.message 
    });
  }
});

module.exports = router;
