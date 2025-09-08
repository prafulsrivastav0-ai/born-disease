# Setup Guide - Smart Community Health Monitoring System

## Prerequisites

### 1. Install Required Software
```bash
# Node.js (v16 or higher)
# Download from: https://nodejs.org/

# Python (v3.8 or higher)
# Download from: https://python.org/

# MongoDB
# macOS:
brew tap mongodb/brew
brew install mongodb-community

# Ubuntu/Debian:
sudo apt-get install mongodb

# Windows:
# Download from: https://www.mongodb.com/try/download/community
```

### 2. Start MongoDB
```bash
# macOS:
brew services start mongodb/brew/mongodb-community

# Linux:
sudo systemctl start mongod

# Windows:
# Start MongoDB service from Services panel
```

## Quick Start (Automated)

```bash
# Clone/navigate to project directory
cd "borne dieses"

# Run the automated startup script
./start-system.sh
```

This will:
- Install all dependencies
- Start backend (port 5000)
- Start ML pipeline (port 8000)
- Start frontend (port 3000)
- Open browser to http://localhost:3000

## Manual Setup

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 2. ML Pipeline Setup
```bash
cd ml-pipeline
pip install -r requirements.txt
python app.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Generate Mock Data
```bash
cd backend
npm run mock-data
```

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Node.js Backend│    │  Python ML API  │
│   (Port 3000)   │◄──►│   (Port 5000)   │◄──►│   (Port 8000)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │    MongoDB      │
                       │   (Port 27017)  │
                       └─────────────────┘
```

## API Endpoints

### Water Data
- `POST /api/water-data` - Submit sensor data
- `GET /api/water-data?location=X&limit=Y` - Get water data

### Health Data
- `POST /api/health-data` - Submit health case
- `GET /api/health-data?location=X&limit=Y` - Get health cases

### Alerts & Predictions
- `GET /api/alerts` - Get active alerts
- `POST /api/predict` - Trigger ML prediction
- `GET /api/dashboard` - Get dashboard data

## Features Implemented

✅ **Water Quality Monitoring**
- IoT sensor data collection (pH, turbidity, contamination)
- Real-time data visualization
- Historical trend analysis

✅ **Health Case Tracking**
- Symptom and disease reporting
- Patient demographics
- Case severity classification

✅ **AI/ML Outbreak Prediction**
- Random Forest classifier
- Risk level assessment
- Factor analysis

✅ **Alert System**
- Automated alert generation
- Severity-based notifications
- Real-time dashboard updates

✅ **Weather Integration**
- Mock weather data (ready for API integration)
- Risk factor correlation

✅ **Dashboard**
- Real-time statistics
- Interactive charts
- Mobile-responsive design

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB manually
mongod --dbpath /usr/local/var/mongodb
```

### Port Conflicts
- Frontend: Change port in package.json scripts
- Backend: Set PORT in .env file
- ML Pipeline: Modify port in app.py

### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Python dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

## Production Deployment

### Environment Variables
Create production .env files with:
- Real MongoDB connection strings
- Weather API keys
- SMS/Email service credentials
- Security tokens

### Docker Deployment (Optional)
```dockerfile
# Example Dockerfile for backend
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Next Steps for Production

1. **Security**: Add authentication, input validation, rate limiting
2. **Monitoring**: Implement logging, health checks, metrics
3. **Scalability**: Add load balancing, database clustering
4. **Integration**: Connect real IoT sensors, weather APIs, SMS services
5. **Testing**: Add unit tests, integration tests, E2E tests