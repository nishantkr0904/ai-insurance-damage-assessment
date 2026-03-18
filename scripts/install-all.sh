#!/bin/bash

# =============================================================================
# AI Insurance Damage Assessment - Install All Dependencies
# =============================================================================

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}Installing all dependencies...${NC}"
echo ""

echo -e "${GREEN}[1/6] Installing backend dependencies...${NC}"
cd "$PROJECT_ROOT/backend" && npm install

echo -e "${GREEN}[2/6] Installing frontend dependencies...${NC}"
cd "$PROJECT_ROOT/frontend/web-app" && npm install

echo -e "${GREEN}[3/6] Installing damage-detection mock dependencies...${NC}"
cd "$PROJECT_ROOT/ai-services/damage-detection" && npm install

echo -e "${GREEN}[4/6] Installing cost-estimation mock dependencies...${NC}"
cd "$PROJECT_ROOT/ai-services/cost-estimation" && npm install

echo -e "${GREEN}[5/6] Installing fraud-detection mock dependencies...${NC}"
cd "$PROJECT_ROOT/ai-services/fraud-detection" && npm install

echo -e "${GREEN}[6/6] Installing report-generation mock dependencies...${NC}"
cd "$PROJECT_ROOT/ai-services/report-generation" && npm install

echo ""
echo -e "${GREEN}All dependencies installed successfully!${NC}"
echo -e "Run ${BLUE}./scripts/start-all-dev.sh${NC} to start all services."
