const axios = require('axios');

const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;
const TOMTOM_BASE_URL = 'https://api.tomtom.com';

// Validate API key at startup
if (!TOMTOM_API_KEY || TOMTOM_API_KEY === 'your_api_key_here') {
  console.error('ERROR: TOMTOM_API_KEY is not configured properly in .env file');
}

class TomTomService {
  /**
   * Get traffic flow data for a specific area
   */
  async getTrafficFlow(lat, lon, zoom = 10) {
    try {
      // Validate coordinates
      if (lat < -90 || lat > 90) {
        throw new Error('Invalid latitude: must be between -90 and 90');
      }
      if (lon < -180 || lon > 180) {
        throw new Error('Invalid longitude: must be between -180 and 180');
      }
      if (zoom < 0 || zoom > 22) {
        throw new Error('Invalid zoom: must be between 0 and 22');
      }

      const url = `${TOMTOM_BASE_URL}/traffic/services/4/flowSegmentData/relative/${zoom}/json`;
      const params = {
        key: TOMTOM_API_KEY,
        point: `${lat},${lon}`
      };
      
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching traffic flow:', error.response?.data || error.message);
      
      // Handle TomTom API 404 errors
      if (error.response?.status === 404) {
        const errorData = error.response?.data;
        const err = new Error(`TomTom API 404: ${errorData?.error?.description || 'Resource not found'}. Please check coordinates and API configuration.`);
        err.statusCode = 404;
        throw err;
      }
      
      // Handle authentication errors
      if (error.response?.status === 403 || error.response?.status === 401) {
        const err = new Error('TomTom API authentication failed. Please check your API key.');
        err.statusCode = error.response.status;
        throw err;
      }
      
      throw error;
    }
  }

  /**
   * Get traffic incidents in a bounding box
   */
  async getTrafficIncidents(bbox, maxIncidents = 10) {
    try {
      // Validate bbox format (should be: minLon,minLat,maxLon,maxLat)
      const bboxParts = bbox.split(',').map(v => parseFloat(v));
      if (bboxParts.length !== 4 || bboxParts.some(isNaN)) {
        throw new Error('Invalid bbox format: must be minLon,minLat,maxLon,maxLat');
      }
      const [minLon, minLat, maxLon, maxLat] = bboxParts;
      if (minLat < -90 || maxLat > 90 || minLon < -180 || maxLon > 180) {
        throw new Error('Invalid bbox coordinates: out of range');
      }

      const url = `${TOMTOM_BASE_URL}/traffic/services/5/incidentDetails`;
      const params = {
        key: TOMTOM_API_KEY,
        bbox: bbox,
        fields: '{incidents{type,geometry{type,coordinates},properties{id,iconCategory,magnitudeOfDelay,events{description,code,iconCategory},startTime,endTime,from,to,length,delay,roadNumbers,timeValidity}}}',
        language: 'vi-VN',
        maxIncidents: maxIncidents
      };
      
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching traffic incidents:', error.response?.data || error.message);
      
      // Handle TomTom API 404 errors
      if (error.response?.status === 404) {
        const errorData = error.response?.data;
        const err = new Error(`TomTom API 404: ${errorData?.error?.description || 'No incidents found in this area'}. This may be normal if there are no traffic incidents.`);
        err.statusCode = 404;
        throw err;
      }
      
      // Handle authentication errors
      if (error.response?.status === 403 || error.response?.status === 401) {
        const err = new Error('TomTom API authentication failed. Please check your API key.');
        err.statusCode = error.response.status;
        throw err;
      }
      
      throw error;
    }
  }

  /**
   * Calculate route with traffic
   */
  async calculateRoute(origin, destination) {
    try {
      const url = `${TOMTOM_BASE_URL}/routing/1/calculateRoute/${origin}:${destination}/json`;
      const params = {
        key: TOMTOM_API_KEY,
        traffic: true,
        travelMode: 'car',
        language: 'vi-VN'
      };
      
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error calculating route:', error.response?.data || error.message);
      
      // Handle TomTom API 404 errors
      if (error.response?.status === 404) {
        const errorData = error.response?.data;
        const err = new Error(`TomTom API 404: ${errorData?.error?.description || 'Route not found'}. Please check origin and destination coordinates.`);
        err.statusCode = 404;
        throw err;
      }
      
      // Handle authentication errors
      if (error.response?.status === 403 || error.response?.status === 401) {
        const err = new Error('TomTom API authentication failed. Please check your API key.');
        err.statusCode = error.response.status;
        throw err;
      }
      
      throw error;
    }
  }
}

module.exports = new TomTomService();
