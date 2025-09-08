import React, { useState } from 'react';
import {
  Container, Grid, Paper, Typography, TextField, Button, Box,
  FormControl, InputLabel, Select, MenuItem, Chip, Alert, Tabs, Tab,
  useMediaQuery, useTheme
} from '@mui/material';
import { apiService } from '../services/api';
import SensorStatus from '../components/SensorStatus';

const DataEntry = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [waterData, setWaterData] = useState({
    sensorId: '',
    location: '',
    pH: '',
    turbidity: '',
    contaminationLevel: '',
    temperature: ''
  });
  const [healthData, setHealthData] = useState({
    patientId: '',
    location: '',
    symptoms: [],
    disease: '',
    severity: '',
    age: '',
    gender: '',
    reportedBy: ''
  });
  const [message, setMessage] = useState('');

  const locations = ['Guwahati', 'Shillong', 'Imphal', 'Aizawl', 'Kohima', 'Itanagar', 'Agartala'];
  const symptoms = ['diarrhea', 'vomiting', 'fever', 'abdominal_pain', 'dehydration', 'nausea'];
  const diseases = ['cholera', 'typhoid', 'hepatitis_a', 'gastroenteritis', 'dysentery'];

  const handleWaterSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.submitWaterData(waterData);
      setMessage('Water data submitted successfully');
      setWaterData({
        sensorId: '',
        location: '',
        pH: '',
        turbidity: '',
        contaminationLevel: '',
        temperature: ''
      });
    } catch (error) {
      setMessage('Error submitting water data');
    }
  };

  const handleHealthSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.submitHealthData(healthData);
      setMessage('Health data submitted successfully');
      setHealthData({
        patientId: '',
        location: '',
        symptoms: [],
        disease: '',
        severity: '',
        age: '',
        gender: '',
        reportedBy: ''
      });
    } catch (error) {
      setMessage('Error submitting health data');
    }
  };

  const handleSymptomToggle = (symptom) => {
    setHealthData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        mt: { xs: 2, sm: 3, md: 4 }, 
        mb: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1, sm: 2, md: 3 }
      }}
    >
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
          textAlign: { xs: 'center', sm: 'left' },
          mb: { xs: 2, sm: 3 }
        }}
      >
        Data Entry
      </Typography>

      {/* Sensor Status */}
      <SensorStatus />

      {message && (
        <Alert severity={message.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Paper sx={{ 
        p: { xs: 2, sm: 3 },
        borderRadius: { xs: 2, sm: 3 },
        boxShadow: { xs: 2, sm: 3 }
      }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)} 
          sx={{ 
            mb: { xs: 2, sm: 3 },
            '& .MuiTab-root': {
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              minWidth: { xs: 120, sm: 160 }
            }
          }}
          variant={isMobile ? 'fullWidth' : 'standard'}
        >
          <Tab label="Water Quality Data" />
          <Tab label="Health Case Data" />
        </Tabs>

        {activeTab === 0 && (
          <Box component="form" onSubmit={handleWaterSubmit}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sensor ID"
                  value={waterData.sensorId}
                  onChange={(e) => setWaterData({...waterData, sensorId: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={waterData.location}
                    onChange={(e) => setWaterData({...waterData, location: e.target.value})}
                  >
                    {locations.map(loc => (
                      <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="pH Level"
                  type="number"
                  inputProps={{ step: 0.1, min: 0, max: 14 }}
                  value={waterData.pH}
                  onChange={(e) => setWaterData({...waterData, pH: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Turbidity (NTU)"
                  type="number"
                  inputProps={{ step: 0.1, min: 0 }}
                  value={waterData.turbidity}
                  onChange={(e) => setWaterData({...waterData, turbidity: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contamination Level (ppm)"
                  type="number"
                  inputProps={{ step: 0.1, min: 0 }}
                  value={waterData.contaminationLevel}
                  onChange={(e) => setWaterData({...waterData, contaminationLevel: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Temperature (°C)"
                  type="number"
                  inputProps={{ step: 0.1 }}
                  value={waterData.temperature}
                  onChange={(e) => setWaterData({...waterData, temperature: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size={isMobile ? 'medium' : 'large'}
                  fullWidth={isMobile}
                  sx={{ mt: { xs: 1, sm: 0 } }}
                >
                  Submit Water Data
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 1 && (
          <Box component="form" onSubmit={handleHealthSubmit}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Patient ID"
                  value={healthData.patientId}
                  onChange={(e) => setHealthData({...healthData, patientId: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={healthData.location}
                    onChange={(e) => setHealthData({...healthData, location: e.target.value})}
                  >
                    {locations.map(loc => (
                      <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Symptoms
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: { xs: 0.5, sm: 1 },
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                  {symptoms.map(symptom => (
                    <Chip
                      key={symptom}
                      label={symptom.replace('_', ' ')}
                      onClick={() => handleSymptomToggle(symptom)}
                      color={healthData.symptoms.includes(symptom) ? 'primary' : 'default'}
                      variant={healthData.symptoms.includes(symptom) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Disease</InputLabel>
                  <Select
                    value={healthData.disease}
                    onChange={(e) => setHealthData({...healthData, disease: e.target.value})}
                  >
                    {diseases.map(disease => (
                      <MenuItem key={disease} value={disease}>
                        {disease.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    value={healthData.severity}
                    onChange={(e) => setHealthData({...healthData, severity: e.target.value})}
                  >
                    <MenuItem value="mild">Mild</MenuItem>
                    <MenuItem value="moderate">Moderate</MenuItem>
                    <MenuItem value="severe">Severe</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={healthData.age}
                  onChange={(e) => setHealthData({...healthData, age: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={healthData.gender}
                    onChange={(e) => setHealthData({...healthData, gender: e.target.value})}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Reported By"
                  value={healthData.reportedBy}
                  onChange={(e) => setHealthData({...healthData, reportedBy: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  size={isMobile ? 'medium' : 'large'}
                  fullWidth={isMobile}
                  sx={{ mt: { xs: 1, sm: 0 } }}
                >
                  Submit Health Data
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default DataEntry;