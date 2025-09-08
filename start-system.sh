#!/bin/bash

echo "🚀 Starting Smart Community Health Monitoring System..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   brew services start mongodb/brew/mongodb-community"
    echo "   or"
    echo "   sudo systemctl start mongod"
    exit 1
fi

# Start backend
echo "📡 Starting backend server..."
cd backend
npm install > /dev/null 2>&1
npm run dev &
BACKEND_PID=$!

# Start ML pipeline
echo "🤖 Starting ML pipeline..."
cd ../ml-pipeline
pip install -r requirements.txt > /dev/null 2>&1
python app.py &
ML_PID=$!

# Start frontend
echo "🌐 Starting frontend..."
cd ../frontend
npm install > /dev/null 2>&1
npm start &
FRONTEND_PID=$!

echo "✅ System started successfully!"
echo ""
echo "🔗 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   ML Pipeline: http://localhost:8000"
echo ""
echo "📊 To generate mock data, run:"
echo "   cd backend && npm run mock-data"
echo ""
echo "🛑 To stop all services, press Ctrl+C"

# Wait for interrupt
trap "echo '🛑 Stopping services...'; kill $BACKEND_PID $ML_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait