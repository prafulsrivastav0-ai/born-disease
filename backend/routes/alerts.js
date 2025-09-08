const express = require('express');
const Alert = require('../models/Alert');
const axios = require('axios');
const router = express.Router();

// Get alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find({ isActive: true })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create alert
router.post('/alerts', async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Trigger ML prediction
router.post('/predict', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:8000/predict', req.body);
    
    if (response.data.risk_level > 0.7) {
      const alert = new Alert({
        type: 'outbreak',
        severity: response.data.risk_level > 0.9 ? 'critical' : 'high',
        location: req.body.location || 'Unknown',
        message: `High outbreak risk detected: ${(response.data.risk_level * 100).toFixed(1)}%`,
        prediction: response.data
      });
      await alert.save();
    }
    
    res.json({ success: true, prediction: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;