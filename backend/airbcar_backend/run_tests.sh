#!/bin/bash

# Test runner script for AirbCar backend
# Usage: ./run_tests.sh [environment]
# Environments: local, ci, docker

ENVIRONMENT=${1:-local}

case $ENVIRONMENT in
    "local")
        echo "Running tests with local SQLite database..."
        python3 manage.py test --settings=airbcar_backend.settings_local
        ;;
    "ci")
        echo "Running tests with CI configuration (in-memory database)..."
        python3 manage.py test --settings=airbcar_backend.settings_ci
        ;;
    "docker")
        echo "Running tests with Docker configuration..."
        python3 manage.py test
        ;;
    *)
        echo "Usage: $0 {local|ci|docker}"
        echo "  local  - Run tests with local SQLite database"
        echo "  ci     - Run tests with CI configuration (in-memory)"
        echo "  docker - Run tests with default Docker PostgreSQL config"
        exit 1
        ;;
esac
