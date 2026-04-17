#!/bin/bash

# FuelEU Maritime Compliance Platform - Startup Script
# This script handles first-time setup and starts both backend and frontend

set -e  # Exit on any error

echo "🚢 FuelEU Maritime Compliance Platform"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if first time setup is needed
check_first_time() {
    if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
        return 0  # True - first time
    else
        return 1  # False - already setup
    fi
}

# Function to setup backend
setup_backend() {
    echo -e "${BLUE}📦 Setting up Backend...${NC}"
    cd backend

    echo "  ⏳ Installing dependencies..."
    npm install

    echo "  ⏳ Generating Prisma client..."
    npm run prisma:generate

    echo "  ⏳ Running database migrations..."
    npm run prisma:migrate || true  # Continue even if migration fails (might already exist)

    echo "  ⏳ Seeding database with sample data..."
    npm run prisma:seed || true  # Continue even if seed fails (might already have data)

    cd ..
    echo -e "${GREEN}✅ Backend setup complete!${NC}"
    echo ""
}

# Function to setup frontend
setup_frontend() {
    echo -e "${BLUE}📦 Setting up Frontend...${NC}"
    cd frontend

    echo "  ⏳ Installing dependencies..."
    npm install

    cd ..
    echo -e "${GREEN}✅ Frontend setup complete!${NC}"
    echo ""
}

# Function to start backend
start_backend() {
    echo -e "${BLUE}🔧 Starting Backend Server...${NC}"
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    echo -e "${GREEN}✅ Backend started on http://localhost:3001${NC}"
    echo ""
}

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}🎨 Starting Frontend App...${NC}"
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    echo -e "${GREEN}✅ Frontend started on http://localhost:3000${NC}"
    echo ""
}

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Shutting down servers...${NC}"

    # Kill backend
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi

    # Kill frontend
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi

    # Kill any remaining node processes on our ports
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true

    echo -e "${GREEN}✅ Servers stopped. Goodbye!${NC}"
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT SIGTERM

# Main execution
echo -e "${BLUE}🔍 Checking setup status...${NC}"

if check_first_time; then
    echo -e "${YELLOW}⚠️  First time setup detected!${NC}"
    echo "This will take a few minutes..."
    echo ""

    # Run setup
    setup_backend
    setup_frontend

    echo -e "${GREEN}🎉 Setup complete! Now starting servers...${NC}"
    echo ""
else
    echo -e "${GREEN}✅ Already setup. Starting servers...${NC}"
    echo ""
fi

# Start servers
start_backend
sleep 3  # Give backend time to start

start_frontend
sleep 3  # Give frontend time to start

# Display info
echo ""
echo "========================================"
echo -e "${GREEN}🎉 Application is running!${NC}"
echo "========================================"
echo ""
echo -e "${BLUE}📍 Access the application:${NC}"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:3001"
echo "   Health:    http://localhost:3001/health"
echo ""
echo -e "${YELLOW}💡 Press Ctrl+C to stop both servers${NC}"
echo ""

# Keep script running and wait for user to press Ctrl+C
wait
