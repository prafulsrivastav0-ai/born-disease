const express = require('express');
const WaterData = require('../models/WaterData');
const router = express.Router();

// Submit water quality data
router.post('/water-data', async (req, res) => {
  try {
    const waterData = new WaterData(req.body);
    await waterData.save();
    res.status(201).json({ success: true, data: waterData });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get water data
router.get('/water-data', async (req, res) => {
  try {
    const { location, limit = 100 } = req.query;
    const filter = location ? { location } : {};
    const data = await WaterData.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;