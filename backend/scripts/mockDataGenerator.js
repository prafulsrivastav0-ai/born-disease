const mongoose = require('mongoose');
const WaterData = require('../models/WaterData');
const HealthData = require('../models/HealthData');
require('dotenv').config();

const locations = ['Guwahati', 'Shillong', 'Imphal', 'Aizawl', 'Kohima', 'Itanagar', 'Agartala'];
const symptoms = ['diarrhea', 'vomiting', 'fever', 'abdominal_pain', 'dehydration', 'nausea'];
const diseases = ['cholera', 'typhoid', 'hepatitis_a', 'gastroenteritis', 'dysentery'];

async function generateMockData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/health-monitoring');
    console.log('Connected to MongoDB');

    // Generate water quality data
    const waterDataPromises = [];
    for (let i = 0; i < 100; i++) {
      const data = new WaterData({
        sensorId: `SENSOR_${Math.floor(Math.random() * 20) + 1}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        pH: 6.5 + Math.random() * 2, // 6.5-8.5
        turbidity: Math.random() * 10, // 0-10 NTU
        contaminationLevel: Math.random() * 100, // 0-100 ppm
        temperature: 20 + Math.random() * 15, // 20-35°C
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Last 7 days
      });
      waterDataPromises.push(data.save());
    }

    // Generate health case data
    const healthDataPromises = [];
    for (let i = 0; i < 50; i++) {
      const symptomCount = Math.floor(Math.random() * 3) + 1;
      const selectedSymptoms = [];
      for (let j = 0; j < symptomCount; j++) {
        const symptom = symptoms[Math.floor(Math.random() * symptoms.length)];
        if (!selectedSymptoms.includes(symptom)) {
          selectedSymptoms.push(symptom);
        }
      }

      const data = new HealthData({
        patientId: `PATIENT_${Math.floor(Math.random() * 1000) + 1}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        symptoms: selectedSymptoms,
        disease: diseases[Math.floor(Math.random() * diseases.length)],
        severity: ['mild', 'moderate', 'severe'][Math.floor(Math.random() * 3)],
        age: Math.floor(Math.random() * 80) + 1,
        gender: Math.random() > 0.5 ? 'male' : 'female',
        reportedBy: `WORKER_${Math.floor(Math.random() * 10) + 1}`,
        timestamp: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000) // Last 14 days
      });
      healthDataPromises.push(data.save());
    }

    await Promise.all([...waterDataPromises, ...healthDataPromises]);
    console.log('Mock data generated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error generating mock data:', error);
    process.exit(1);
  }
}

generateMockData();