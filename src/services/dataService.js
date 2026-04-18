import axios from 'axios';
import { 
  mockZones, 
  mockMetrics, 
  mockMunicipalProjects, 
  mockListings, 
  mockTrendData 
} from '../utils/mockData.js';

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const USE_MOCK_DATA = import.meta.env.REACT_APP_USE_MOCK_DATA !== 'false';

/**
 * Fetch municipal declarations from government sources
 * @param {string} zone - Zone identifier
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Municipal declarations
 */
export const fetchMunicipalDeclarations = async (zone, options = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/municipal-declarations`, {
      params: {
        zone,
        ...options,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching municipal declarations:', error);
    throw error;
  }
};

/**
 * Fetch real estate listings from aggregated sources
 * @param {Object} filters - Filter criteria (zone, priceRange, propertyType, etc.)
 * @returns {Promise<Array>} Real estate listings
 */
export const fetchListings = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/listings`, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
};

/**
 * Fetch pricing velocity data
 * @param {string} zone - Zone identifier
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Pricing velocity data
 */
export const fetchPricingVelocity = async (zone, options = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pricing-velocity`, {
      params: {
        zone,
        ...options,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pricing velocity:', error);
    throw error;
  }
};

/**
 * Fetch rental absorption data
 * @param {string} zone - Zone identifier
 * @returns {Promise<Array>} Rental absorption data
 */
export const fetchRentalAbsorption = async (zone) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rental-absorption`, {
      params: { zone },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching rental absorption:', error);
    throw error;
  }
};

/**
 * Fetch market sentiment data
 * @param {string} zone - Zone identifier
 * @returns {Promise<Array>} Market sentiment data
 */
export const fetchMarketSentiment = async (zone) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/market-sentiment`, {
      params: { zone },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching market sentiment:', error);
    throw error;
  }
};

/**
 * Fetch pre-calculated growth velocity scores
 * @param {Object} options - Filter options
 * @returns {Promise<Array>} Growth velocity scores
 */
export const fetchGrowthScores = async (options = {}) => {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockZones);
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/growth-scores`, {
      params: options,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching growth scores:', error);
    return mockZones; // Fallback to mock data
  }
};

/**
 * Fetch trend analysis for zones
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Trend analysis data
 */
export const fetchTrendAnalysis = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/trend-analysis`, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trend analysis:', error);
    throw error;
  }
};

/**
 * Search zones by criteria
 * @param {string} query - Search query
 * @returns {Promise<Array>} Matching zones
 */
export const searchZones = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/zones/search`, {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching zones:', error);
    throw error;
  }
};

/**
 * Get all available zones
 * @returns {Promise<Array>} List of zones
 */
export const fetchAllZones = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/zones`);
    return response.data;
  } catch (error) {
    console.error('Error fetching zones:', error);
    throw error;
  }
};

/**
 * Get dashboard metrics/summary stats
 * @returns {Promise<Object>} Dashboard metrics
 */
export const fetchDashboardMetrics = async () => {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockMetrics);
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/metrics/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return mockMetrics; // Fallback to mock data
  }
};

/**
 * Trigger recalculation of growth scores for a zone
 * @param {string} zoneId - Zone identifier
 * @returns {Promise<Object>} Updated growth score
 */
export const recalculateGrowthScore = async (zoneId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/growth-scores/${zoneId}/recalculate`
    );
    return response.data;
  } catch (error) {
    console.error('Error recalculating growth score:', error);
    throw error;
  }
};

/**
 * Export report data for a zone
 * @param {string} zoneId - Zone identifier
 * @param {string} format - Export format ('pdf', 'csv', 'json')
 * @returns {Promise<Blob>} Report data
 */
export const exportZoneReport = async (zoneId, format = 'pdf') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reports/${zoneId}`, {
      params: { format },
      responseType: format === 'pdf' ? 'blob' : 'json',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting report:', error);
    throw error;
  }
};
