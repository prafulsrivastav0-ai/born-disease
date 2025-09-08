import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend-url.vercel.app/api'
  : process.env.NODE_ENV === 'development' 
    ? `http://${window.location.hostname}:3001/api`
    : 'http://localhost:3001/api';

// Cache for offline support
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fallback data for offline mode
const fallbackData = {
  dashboard: {
    success: true,
    data: {
      waterData: [{ sensorId: 'OFFLINE', pH: 7.0, turbidity: 2.0, contaminationLevel: 15, timestamp: new Date() }],
      healthCases: [{ patientId: 'OFFLINE', disease: 'No data', severity: 'unknown', timestamp: new Date() }],
      alerts: [{ type: 'system', severity: 'info', message: '⚠️ Device not connected - Check sensor connection', timestamp: new Date() }],
      stats: { activeSensors: 0, totalCases: 0, activeAlerts: 1, avgWaterQuality: [{ avgPH: 7.0, avgTurbidity: 2.0 }] },
      weather: { temperature: 25, humidity: 60, rainfall: 0, forecast: 'No data available' }
    }
  },
  sensor: {
    success: true,
    connected: false,
    lastUpdate: null,
    currentReading: null
  },
  alerts: {
    success: true,
    data: [{ type: 'system', severity: 'warning', message: '⚠️ Device not connected - Check sensor connection', timestamp: new Date() }]
  }
};

// Response interceptor with caching
api.interceptors.response.use(
  (response) => {
    const cacheKey = response.config.url;
    cache.set(cacheKey, {
      data: response.data,
      timestamp: Date.now()
    });
    return response;
  },
  (error) => {
    const cacheKey = error.config?.url;
    const cached = cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return Promise.resolve({ data: cached.data });
    }
    
    return Promise.reject(error);
  }
);

export const apiService = {
  // Dashboard with fallback
  getDashboardData: async () => {
    try {
      return await api.get('/dashboard');
    } catch (error) {
      console.warn('Dashboard API failed, using fallback data');
      return { data: fallbackData.dashboard };
    }
  },
  
  // Water Data
  submitWaterData: async (data) => {
    try {
      if (!navigator.onLine) {
        throw new Error('Cannot submit data while offline');
      }
      return await api.post('/water-data', data);
    } catch (error) {
      throw error;
    }
  },
  
  getWaterData: (params) => api.get('/water-data', { params }),
  
  // Health Data
  submitHealthData: async (data) => {
    try {
      if (!navigator.onLine) {
        throw new Error('Cannot submit data while offline');
      }
      return await api.post('/health-data', data);
    } catch (error) {
      throw error;
    }
  },
  
  getHealthData: (params) => api.get('/health-data', { params }),
  
  // Alerts with fallback
  getAlerts: async () => {
    try {
      return await api.get('/alerts');
    } catch (error) {
      console.warn('Alerts API failed, using fallback data');
      return { data: fallbackData.alerts };
    }
  },
  
  createAlert: (data) => api.post('/alerts', data),
  
  // Predictions
  triggerPrediction: async (data) => {
    try {
      if (!navigator.onLine) {
        throw new Error('Cannot run predictions while offline');
      }
      return await api.post('/predict', data);
    } catch (error) {
      throw error;
    }
  },
  
  // Sensor Status with fallback
  getSensorStatus: async () => {
    try {
      return await api.get('/sensor/status');
    } catch (error) {
      console.warn('Sensor API failed, using fallback data');
      return { data: fallbackData.sensor };
    }
  },
};

export default apiService;