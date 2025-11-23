#!/bin/bash

# Healthcare Appointment Scheduling App Startup Script

echo "🏥 Starting Healthcare Appointment Scheduling App..."

# Set up Node.js v16
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 16

echo "✅ Using Node.js $(node --version)"

# Start Backend
echo "🚀 Starting Backend on port 5001..."
cd backend
npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 10

# Start Frontend
echo "🚀 Starting Frontend on port 3000..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "✅ Both services are starting..."
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for user to stop
wait

