const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: { type: String, enum: ['outbreak', 'water_quality', 'weather'], required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  location: { type: String, required: true },
  message: { type: String, required: true },
  prediction: { type: Object },
  isActive: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);