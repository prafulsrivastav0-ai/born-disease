const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app', 'https://your-frontend-domain.netlify.app']
    : true,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mock data
const mockWaterData = [
  { sensorId: 'S1', location: 'Guwahati', pH: 7.2, turbidity: 3.5, contaminationLevel: 25, timestamp: new Date() },
  { sensorId: 'S2', location: 'Shillong', pH: 6.8, turbidity: 4.2, contaminationLevel: 30, timestamp: new Date() }
];

const mockHealthData = [
  { patientId: 'P1', location: 'Guwahati', symptoms: ['fever', 'diarrhea'], disease: 'gastroenteritis', severity: 'mild', timestamp: new Date() }
];

const mockAlerts = [
  { type: 'water_quality', severity: 'medium', location: 'Guwahati', message: 'pH levels slightly elevated', timestamp: new Date() }
];

// Routes
app.get('/api/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      waterData: mockWaterData,
      healthCases: mockHealthData,
      alerts: mockAlerts,
      stats: {
        activeSensors: 2,
        totalCases: 1,
        activeAlerts: 1,
        avgWaterQuality: [{ avgPH: 7.0, avgTurbidity: 3.8 }]
      },
      weather: {
        temperature: 28.5,
        humidity: 75,
        rainfall: 12,
        forecast: 'Partly cloudy'
      }
    }
  });
});

app.get('/api/alerts', (req, res) => {
  res.json({ success: true, data: mockAlerts });
});

app.post('/api/water-data', (req, res) => {
  mockWaterData.push({ ...req.body, timestamp: new Date() });
  res.json({ success: true, data: req.body });
});

app.post('/api/health-data', (req, res) => {
  mockHealthData.push({ ...req.body, timestamp: new Date() });
  res.json({ success: true, data: req.body });
});

app.post('/api/predict', (req, res) => {
  const riskLevel = Math.random() * 0.8;
  const prediction = {
    risk_level: riskLevel,
    risk_category: riskLevel > 0.6 ? 'high' : riskLevel > 0.3 ? 'medium' : 'low',
    factors: ['High contamination levels', 'Recent cases in area']
  };
  
  // Auto-create alert if high risk
  if (riskLevel > 0.7) {
    mockAlerts.push({
      type: 'outbreak',
      severity: 'high',
      location: req.body.location || 'Unknown',
      message: `High outbreak risk detected: ${(riskLevel * 100).toFixed(1)}%`,
      prediction: prediction,
      timestamp: new Date()
    });
  }
  
  res.json({ success: true, prediction });
});

// Sensor status endpoint
app.get('/api/sensor/status', (req, res) => {
  // Simulate sensor connection status (80% chance connected)
  const connected = Math.random() > 0.2;
  const lastReading = mockWaterData.length > 0 ? mockWaterData[mockWaterData.length - 1] : null;
  
  res.json({
    success: true,
    connected: connected,
    lastUpdate: connected ? new Date().toISOString() : null,
    currentReading: connected && lastReading ? {
      pH: lastReading.pH,
      turbidity: lastReading.turbidity,
      contaminationLevel: lastReading.contaminationLevel,
      location: lastReading.location
    } : null
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📱 Local access: http://localhost:${PORT}`);
  }
});