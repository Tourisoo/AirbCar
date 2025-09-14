#!/bin/bash

# AirbCar - Backend Integration Test Setup
# This script helps set up and test the AddVehicleModal backend integration

echo "🚗 AirbCar - Backend Integration Setup"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Setting up backend integration test environment..."

# Start backend services
echo "🔧 Starting backend services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if Django backend is running
echo "🧪 Testing Django backend connection..."
if curl -s http://localhost:8000/ > /dev/null; then
    echo "✅ Django backend is running on http://localhost:8000"
else
    echo "❌ Django backend is not responding. Check docker-compose logs web"
    exit 1
fi

# Test database connection
echo "🗄️ Testing database connection..."
if curl -s http://localhost:8000/api/users/list/ > /dev/null; then
    echo "✅ Database connection successful"
else
    echo "⚠️ Database connection may have issues"
fi

# Start frontend (in background)
echo "🖥️ Starting frontend development server..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend development server
echo "🚀 Starting Next.js development server..."
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 15

# Check if frontend is running
if curl -s http://localhost:3000/ > /dev/null; then
    echo "✅ Frontend is running on http://localhost:3000"
else
    echo "❌ Frontend is not responding"
    kill $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📝 Test the integration:"
echo "1. Open http://localhost:3000/test-add-vehicle"
echo "2. Sign up a new user or sign in"
echo "3. Register as a partner at http://localhost:3000/partner"
echo "4. Test adding a vehicle"
echo "5. Check the partner dashboard at http://localhost:3000/partner/dashboard"
echo ""
echo "🔧 Admin Panel: http://localhost:8000/admin"
echo "🧪 API Test: http://localhost:3000/api/test-django"
echo ""
echo "⚠️ To stop the services:"
echo "Frontend: kill $FRONTEND_PID"
echo "Backend: docker-compose down"
echo ""
echo "📊 View logs:"
echo "Backend: docker-compose logs web"
echo "Database: docker-compose logs db"
