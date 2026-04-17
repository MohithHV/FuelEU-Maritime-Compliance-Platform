#!/bin/bash

# FuelEU Maritime Compliance Platform - Stop Script
# Stops all running servers

echo "🛑 Stopping FuelEU Maritime Platform..."

# Kill processes on port 3001 (Backend)
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "  Stopping backend (port 3001)..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null
    echo "  ✅ Backend stopped"
else
    echo "  ℹ️  Backend not running"
fi

# Kill processes on port 3000 (Frontend)
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "  Stopping frontend (port 3000)..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    echo "  ✅ Frontend stopped"
else
    echo "  ℹ️  Frontend not running"
fi

echo ""
echo "✅ All servers stopped!"
