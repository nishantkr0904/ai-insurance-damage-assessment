#!/bin/bash

# Startup script for AutoClaim AI - ensures backend is ready before frontend starts

set -e

echo "🚀 Starting AutoClaim AI..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if backend is already running
if curl -s http://localhost:5001/api/v1/health > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} Backend is already running on port 5001"
else
  echo -e "${YELLOW}⚠${NC} Backend is not running. Please start it first:"
  echo "  cd backend && npm run dev"
  echo ""
  echo "Or run this script with --start-backend flag"
  exit 1
fi

# Check if demo users exist
echo "Checking demo users..."
DEMO_LOGIN=$(curl -s -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@autoclaim.ai","password":"user123"}' | grep -o '"success":true' || echo "")

if [ -z "$DEMO_LOGIN" ]; then
  echo -e "${YELLOW}⚠${NC} Demo users not found. Creating them now..."
  cd backend
  npm run seed:demo
  cd ..
else
  echo -e "${GREEN}✓${NC} Demo users are available"
fi

echo ""
echo -e "${GREEN}✓${NC} All systems ready!"
echo ""
echo "You can now access the application:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:5001/api/v1"
echo ""
echo "Demo Accounts:"
echo "  👤 User:  user@autoclaim.ai / user123"
echo "  🛡️  Admin: admin@autoclaim.ai / admin123"
echo ""
