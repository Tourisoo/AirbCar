#!/bin/bash

# Airbcar API Tests Runner
# This script helps run Newman tests for the Airbcar API

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚗 Airbcar API Tests Runner${NC}"
echo "=================================="

# Check if Newman is installed
if ! command -v newman &> /dev/null; then
    echo -e "${RED}❌ Newman is not installed${NC}"
    echo "Please install Newman globally: npm install -g newman"
    exit 1
fi

# Check if backend is running
echo -e "${YELLOW}🔍 Checking if backend is running...${NC}"
if curl -f http://localhost:8000/ >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running on http://localhost:8000${NC}"
else
    echo -e "${RED}❌ Backend is not running${NC}"
    echo "Please start the backend server first:"
    echo "  cd backend/airbcar_backend"
    echo "  python manage.py runserver"
    exit 1
fi

# Run the tests
echo -e "${YELLOW}🧪 Running API tests...${NC}"
echo ""

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Run Newman with the collection and environment
newman run "$PROJECT_ROOT/tests/airbcar-api-collection.json" \
    -e "$PROJECT_ROOT/tests/airbcar-test-environment.json" \
    --timeout-request 10000 \
    --color on

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ All tests completed successfully!${NC}"
else
    echo ""
    echo -e "${YELLOW}⚠️  Some tests may have failed. Check the output above.${NC}"
fi
