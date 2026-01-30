const axios = require('axios');

const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;
const TOMTOM_BASE_URL = 'https://api.tomtom.com';

class TomTomService {
  /**
   * Get traffic flow data for a specific area
   */
  async getTrafficFlow(lat, lon, zoom = 10) {
    try {
      const url = `${TOMTOM_BASE_URL}/traffic/services/4/flowSegmentData/relative/${zoom}/json`;
      const params = {
        key: TOMTOM_API_KEY,
        point: `${lat},${lon}`
      };
      
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching traffic flow:', error.message);
      throw error;
    }
  }

  /**
   * Get traffic incidents in a bounding box
   */
  async getTrafficIncidents(bbox, maxIncidents = 10) {
    try {
      const url = `${TOMTOM_BASE_URL}/traffic/services/5/incidentDetails`;
      const params = {
        key: TOMTOM_API_KEY,
        bbox: bbox, // minLon,minLat,maxLon,maxLat
        fields: '{incidents{type,geometry{type,coordinates},properties{id,iconCategory,magnitudeOfDelay,events{description,code,iconCategory},startTime,endTime,from,to,length,delay,roadNumbers,timeValidity}}}',
        language: 'vi-VN',
        maxIncidents: maxIncidents
      };
      
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching traffic incidents:', error.message);
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
      console.error('Error calculating route:', error.message);
      throw error;
    }
  }
}

module.exports = new TomTomService();
