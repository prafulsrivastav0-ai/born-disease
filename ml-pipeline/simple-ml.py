from flask import Flask, request, jsonify
import random
from datetime import datetime

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    # Simple mock prediction
    risk_level = random.uniform(0.1, 0.9)
    
    factors = []
    if risk_level > 0.7:
        factors = ['High contamination levels', 'Multiple severe cases', 'Weather conditions']
    elif risk_level > 0.4:
        factors = ['Elevated pH levels', 'Recent cases in area']
    else:
        factors = ['Normal conditions']
    
    return jsonify({
        'success': True,
        'risk_level': risk_level,
        'risk_category': 'high' if risk_level > 0.7 else 'medium' if risk_level > 0.4 else 'low',
        'factors': factors,
        'prediction_date': datetime.now().isoformat()
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    print("🤖 ML Pipeline running on http://localhost:8000")
    app.run(host='0.0.0.0', port=8000, debug=True)