const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  location: { type: String, required: true },
  symptoms: [{ type: String }],
  disease: { type: String },
  severity: { type: String, enum: ['mild', 'moderate', 'severe'] },
  age: { type: Number },
  gender: { type: String },
  reportedBy: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HealthData', healthDataSchema);