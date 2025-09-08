const express = require('express');
const HealthData = require('../models/HealthData');
const router = express.Router();

// Submit health case data
router.post('/health-data', async (req, res) => {
  try {
    const healthData = new HealthData(req.body);
    await healthData.save();
    res.status(201).json({ success: true, data: healthData });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get health data
router.get('/health-data', async (req, res) => {
  try {
    const { location, limit = 100 } = req.query;
    const filter = location ? { location } : {};
    const data = await HealthData.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;