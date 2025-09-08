const mongoose = require('mongoose');

const waterDataSchema = new mongoose.Schema({
  sensorId: { type: String, required: true },
  location: { type: String, required: true },
  pH: { type: Number, required: true },
  turbidity: { type: Number, required: true },
  contaminationLevel: { type: Number, required: true },
  temperature: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WaterData', waterDataSchema);