#!/bin/bash

# Django Test Runner Script for Airbcar Backend
# This script helps run Django tests with proper environment setup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚗 Airbcar Backend Test Runner${NC}"
echo "=================================="

# Navigate to the correct directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/backend"
DJANGO_DIR="$BACKEND_DIR/airbcar_backend"

echo -e "${YELLOW}📁 Project structure check...${NC}"
if [ ! -d "$DJANGO_DIR" ]; then
    echo -e "${RED}❌ Django project directory not found: $DJANGO_DIR${NC}"
    exit 1
fi

if [ ! -f "$DJANGO_DIR/manage.py" ]; then
    echo -e "${RED}❌ manage.py not found in: $DJANGO_DIR${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Django project found${NC}"

# Check if virtual environment exists
if [ -d "$BACKEND_DIR/env" ]; then
    echo -e "${YELLOW}🐍 Activating virtual environment...${NC}"
    source "$BACKEND_DIR/env/bin/activate"
    echo -e "${GREEN}✅ Virtual environment activated${NC}"
else
    echo -e "${YELLOW}⚠️  No virtual environment found. Using system Python.${NC}"
fi

# Check if PostgreSQL is running (optional)
echo -e "${YELLOW}🗄️  Checking database connection...${NC}"
if command -v pg_isready &> /dev/null; then
    if pg_isready -h localhost -p 5432 &> /dev/null; then
        echo -e "${GREEN}✅ PostgreSQL is running${NC}"
    else
        echo -e "${YELLOW}⚠️  PostgreSQL may not be running. Tests will use SQLite if configured.${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  PostgreSQL client not found. Tests will use SQLite if configured.${NC}"
fi

# Set environment variables for testing
export DATABASE_NAME=${DATABASE_NAME:-"airbcar_test_db"}
export DATABASE_USER=${DATABASE_USER:-"airbcar_user"}
export DATABASE_PASSWORD=${DATABASE_PASSWORD:-"amineamine"}
export DATABASE_HOST=${DATABASE_HOST:-"localhost"}
export DATABASE_PORT=${DATABASE_PORT:-"5432"}
export DEBUG=True
export SECRET_KEY="django-test-secret-key-not-for-production"

echo -e "${YELLOW}🔧 Environment variables set for testing${NC}"

# Navigate to Django project directory
cd "$DJANGO_DIR"

# Run migrations first
echo -e "${YELLOW}📊 Running database migrations...${NC}"
python manage.py migrate --verbosity=1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migrations completed successfully${NC}"
else
    echo -e "${RED}❌ Migration failed${NC}"
    exit 1
fi

# Run the tests
echo -e "${YELLOW}🧪 Running Django tests...${NC}"
echo ""

# Run tests with verbose output
python manage.py test --verbosity=2

TEST_EXIT_CODE=$?

echo ""
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ All Django tests passed successfully!${NC}"
else
    echo -e "${RED}❌ Some tests failed. Exit code: $TEST_EXIT_CODE${NC}"
fi

exit $TEST_EXIT_CODE
