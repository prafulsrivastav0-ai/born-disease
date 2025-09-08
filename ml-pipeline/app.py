from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import joblib
import os
from datetime import datetime, timedelta
import pymongo
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# MongoDB connection
client = pymongo.MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/health-monitoring'))
db = client['health-monitoring']

class OutbreakPredictor:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        
    def prepare_features(self, water_data, health_data, weather_data=None):
        features = []
        
        # Water quality features
        if water_data:
            avg_ph = np.mean([d['pH'] for d in water_data])
            avg_turbidity = np.mean([d['turbidity'] for d in water_data])
            avg_contamination = np.mean([d['contaminationLevel'] for d in water_data])
            features.extend([avg_ph, avg_turbidity, avg_contamination])
        else:
            features.extend([7.0, 5.0, 50.0])  # Default values
            
        # Health case features
        if health_data:
            case_count = len(health_data)
            severe_cases = len([d for d in health_data if d.get('severity') == 'severe'])
            features.extend([case_count, severe_cases])
        else:
            features.extend([0, 0])
            
        # Weather features (mock)
        if weather_data:
            features.extend([weather_data.get('temperature', 25), weather_data.get('humidity', 70)])
        else:
            features.extend([25, 70])
            
        return np.array(features).reshape(1, -1)
    
    def train_model(self):
        # Generate synthetic training data for demonstration
        np.random.seed(42)
        n_samples = 1000
        
        # Features: pH, turbidity, contamination, case_count, severe_cases, temperature, humidity
        X = np.random.rand(n_samples, 7)
        X[:, 0] = X[:, 0] * 3 + 6  # pH 6-9
        X[:, 1] = X[:, 1] * 15     # turbidity 0-15
        X[:, 2] = X[:, 2] * 100    # contamination 0-100
        X[:, 3] = X[:, 3] * 20     # case count 0-20
        X[:, 4] = X[:, 4] * 5      # severe cases 0-5
        X[:, 5] = X[:, 5] * 20 + 15  # temperature 15-35
        X[:, 6] = X[:, 6] * 40 + 40  # humidity 40-80
        
        # Create labels based on risk factors
        y = np.zeros(n_samples)
        for i in range(n_samples):
            risk_score = 0
            if X[i, 0] < 6.5 or X[i, 0] > 8.5:  # pH out of safe range
                risk_score += 0.3
            if X[i, 1] > 10:  # high turbidity
                risk_score += 0.2
            if X[i, 2] > 70:  # high contamination
                risk_score += 0.3
            if X[i, 3] > 10:  # many cases
                risk_score += 0.2
            if X[i, 4] > 2:  # many severe cases
                risk_score += 0.3
            if X[i, 5] > 30 and X[i, 6] > 70:  # hot and humid
                risk_score += 0.1
                
            y[i] = 1 if risk_score > 0.5 else 0
        
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained = True
        
    def predict_outbreak_risk(self, features):
        if not self.is_trained:
            self.train_model()
            
        features_scaled = self.scaler.transform(features)
        risk_prob = self.model.predict_proba(features_scaled)[0][1]
        
        return {
            'risk_level': float(risk_prob),
            'risk_category': 'high' if risk_prob > 0.7 else 'medium' if risk_prob > 0.4 else 'low',
            'factors': self._analyze_risk_factors(features[0])
        }
    
    def _analyze_risk_factors(self, features):
        factors = []
        if features[0] < 6.5 or features[0] > 8.5:
            factors.append('pH levels outside safe range')
        if features[1] > 10:
            factors.append('High water turbidity')
        if features[2] > 70:
            factors.append('High contamination levels')
        if features[3] > 10:
            factors.append('Increased disease cases')
        if features[4] > 2:
            factors.append('Multiple severe cases')
        return factors

predictor = OutbreakPredictor()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        location = data.get('location', 'Unknown')
        
        # Fetch recent data from MongoDB
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)
        
        water_data = list(db.waterdatas.find({
            'location': location,
            'timestamp': {'$gte': start_date, '$lte': end_date}
        }))
        
        health_data = list(db.healthdatas.find({
            'location': location,
            'timestamp': {'$gte': start_date, '$lte': end_date}
        }))
        
        # Prepare features
        features = predictor.prepare_features(water_data, health_data)
        
        # Make prediction
        prediction = predictor.predict_outbreak_risk(features)
        
        return jsonify({
            'success': True,
            'location': location,
            'prediction_date': datetime.now().isoformat(),
            **prediction
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'model_trained': predictor.is_trained})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)