#!/bin/bash

# =============================================================================
# AI Insurance Damage Assessment - Development Startup Script
# =============================================================================
# This script starts all services needed for local development:
# - AI Mock Services (ports 8000-8003)
# - Backend API (port 5001)
# - Frontend (port 5173)
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  AI Insurance - Development Environment   ${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Check if .env exists
if [ ! -f "$PROJECT_ROOT/backend/.env" ]; then
    echo -e "${RED}ERROR: backend/.env file not found!${NC}"
    echo -e "Please copy backend/.env.example to backend/.env and add your credentials."
    exit 1
fi

# Check for REDACTED values in .env
if grep -q "REDACTED" "$PROJECT_ROOT/backend/.env"; then
    echo -e "${RED}ERROR: Your backend/.env contains REDACTED values!${NC}"
    echo -e "${YELLOW}Please update the following in backend/.env:${NC}"
    echo -e "  - MONGODB_URI: Your MongoDB connection string"
    echo -e "  - JWT_SECRET: A secure random string"
    echo -e "  - AWS_ACCESS_KEY_ID: Your AWS access key"
    echo -e "  - AWS_SECRET_ACCESS_KEY: Your AWS secret key"
    exit 1
fi

echo -e "${GREEN}[1/4] Starting AI Mock Services...${NC}"

# Start AI services in background
cd "$PROJECT_ROOT/ai-services/damage-detection" && npm start &
DAMAGE_PID=$!
cd "$PROJECT_ROOT/ai-services/cost-estimation" && npm start &
COST_PID=$!
cd "$PROJECT_ROOT/ai-services/fraud-detection" && npm start &
FRAUD_PID=$!
cd "$PROJECT_ROOT/ai-services/report-generation" && npm start &
REPORT_PID=$!

# Wait a moment for services to start
sleep 2

echo -e "${GREEN}[2/4] AI Mock Services Started:${NC}"
echo -e "  - Damage Detection:  http://localhost:8000"
echo -e "  - Cost Estimation:   http://localhost:8001"
echo -e "  - Fraud Detection:   http://localhost:8002"
echo -e "  - Report Generation: http://localhost:8003"
echo ""

echo -e "${GREEN}[3/4] Starting Backend API...${NC}"
cd "$PROJECT_ROOT/backend" && npm run dev &
BACKEND_PID=$!

sleep 3

echo -e "${GREEN}[4/4] Starting Frontend...${NC}"
cd "$PROJECT_ROOT/frontend/web-app" && npm run dev &
FRONTEND_PID=$!

sleep 2

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}  All services started successfully!       ${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo -e "Services running:"
echo -e "  ${GREEN}Backend API:${NC}         http://localhost:5001"
echo -e "  ${GREEN}Frontend:${NC}            http://localhost:5173"
echo -e "  ${GREEN}Damage Detection:${NC}    http://localhost:8000"
echo -e "  ${GREEN}Cost Estimation:${NC}     http://localhost:8001"
echo -e "  ${GREEN}Fraud Detection:${NC}     http://localhost:8002"
echo -e "  ${GREEN}Report Generation:${NC}   http://localhost:8003"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    kill $DAMAGE_PID $COST_PID $FRAUD_PID $REPORT_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}All services stopped.${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT SIGTERM

# Wait for all processes
wait
