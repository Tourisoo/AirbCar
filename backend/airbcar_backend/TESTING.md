# AirbCar Backend Testing Guide

This guide explains how to run tests in different environments for the AirbCar backend.

## Test Environments

### 1. Local Development (SQLite)
For local development and testing without Docker:

```bash
# Method 1: Using the test runner script
./run_tests.sh local

# Method 2: Direct command
python3 manage.py test --settings=airbcar_backend.settings_local
```

**Uses:**
- SQLite database (lightweight, no setup required)
- Local file storage
- Suitable for development and quick testing

### 2. CI/CD Environment (In-Memory SQLite)
For continuous integration environments like GitHub Actions:

```bash
# Method 1: Using the test runner script
./run_tests.sh ci

# Method 2: Direct command
python3 manage.py test --settings=airbcar_backend.settings_ci
```

**Uses:**
- In-memory SQLite database (fastest, no disk I/O)
- Disabled migrations for speed
- Optimized for CI/CD pipelines

### 3. Docker Environment (PostgreSQL)
For testing with the full production-like setup:

```bash
# Method 1: Using the test runner script
./run_tests.sh docker

# Method 2: Direct command with Docker Compose
cd ../../  # Go to project root
docker-compose up -d db
docker-compose run web python manage.py test
```

**Uses:**
- PostgreSQL database (production-like)
- Full Docker environment
- Closest to production setup

## Settings Files

- `settings.py` - Main settings (Docker/Production)
- `settings_local.py` - Local development settings (SQLite)
- `settings_ci.py` - CI/CD optimized settings (In-memory SQLite)

## GitHub Actions CI

The CI workflow automatically uses the `settings_ci.py` configuration for fast, reliable testing without external dependencies.

## Troubleshooting

### Database Connection Errors
If you see errors like "could not translate host name 'db'", you're trying to use Docker database settings outside of Docker. Use the appropriate settings file:

- **Outside Docker**: Use `--settings=airbcar_backend.settings_local`
- **In CI/CD**: Use `--settings=airbcar_backend.settings_ci`
- **In Docker**: Use default settings (no --settings flag needed)

### Missing Dependencies
Make sure you have all required packages installed:

```bash
pip install -r requirements.txt
```

### Permission Issues
Make sure the test script is executable:

```bash
chmod +x run_tests.sh
```
