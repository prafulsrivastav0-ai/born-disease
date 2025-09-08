const express = require('express');
const WaterData = require('../models/WaterData');
const HealthData = require('../models/HealthData');
const Alert = require('../models/Alert');
const axios = require('axios');
const router = express.Router();

// Get dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Recent water quality data
    const recentWaterData = await WaterData.find({ timestamp: { $gte: last24h } })
      .sort({ timestamp: -1 })
      .limit(10);

    // Recent health cases
    const recentHealthCases = await HealthData.find({ timestamp: { $gte: last7d } })
      .sort({ timestamp: -1 })
      .limit(20);

    // Active alerts
    const activeAlerts = await Alert.find({ isActive: true })
      .sort({ timestamp: -1 })
      .limit(10);

    // Statistics
    const stats = {
      totalCases: await HealthData.countDocuments({ timestamp: { $gte: last7d } }),
      activeSensors: await WaterData.distinct('sensorId', { timestamp: { $gte: last24h } }).then(arr => arr.length),
      activeAlerts: activeAlerts.length,
      avgWaterQuality: await WaterData.aggregate([
        { $match: { timestamp: { $gte: last24h } } },
        { $group: { _id: null, avgPH: { $avg: '$pH' }, avgTurbidity: { $avg: '$turbidity' } } }
      ])
    };

    // Weather data (mock)
    const weatherData = {
      temperature: 28 + Math.random() * 10,
      humidity: 60 + Math.random() * 30,
      rainfall: Math.random() * 50,
      forecast: 'Partly cloudy with chance of rain'
    };

    res.json({
      success: true,
      data: {
        waterData: recentWaterData,
        healthCases: recentHealthCases,
        alerts: activeAlerts,
        stats,
        weather: weatherData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;