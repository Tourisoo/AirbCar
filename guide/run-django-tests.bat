@echo off
setlocal enabledelayedexpansion

REM Django Test Runner Script for Airbcar Backend (Windows)
REM This script helps run Django tests with proper environment setup

echo 🚗 Airbcar Backend Test Runner
echo ==================================

REM Navigate to the correct directory
set "PROJECT_ROOT=%~dp0.."
set "BACKEND_DIR=%PROJECT_ROOT%\backend"
set "DJANGO_DIR=%BACKEND_DIR%\airbcar_backend"

echo 📁 Project structure check...
if not exist "%DJANGO_DIR%" (
    echo ❌ Django project directory not found: %DJANGO_DIR%
    exit /b 1
)

if not exist "%DJANGO_DIR%\manage.py" (
    echo ❌ manage.py not found in: %DJANGO_DIR%
    exit /b 1
)

echo ✅ Django project found

REM Check if virtual environment exists
if exist "%BACKEND_DIR%\env\Scripts\activate.bat" (
    echo 🐍 Activating virtual environment...
    call "%BACKEND_DIR%\env\Scripts\activate.bat"
    echo ✅ Virtual environment activated
) else (
    echo ⚠️  No virtual environment found. Using system Python.
)

REM Set environment variables for testing
set DATABASE_NAME=airbcar_test_db
set DATABASE_USER=airbcar_user
set DATABASE_PASSWORD=amineamine
set DATABASE_HOST=localhost
set DATABASE_PORT=5432
set DEBUG=True
set SECRET_KEY=django-test-secret-key-not-for-production

echo 🔧 Environment variables set for testing

REM Navigate to Django project directory
cd /d "%DJANGO_DIR%"

REM Run migrations first
echo 📊 Running database migrations...
python manage.py migrate --verbosity=1

if errorlevel 1 (
    echo ❌ Migration failed
    exit /b 1
) else (
    echo ✅ Migrations completed successfully
)

REM Run the tests
echo 🧪 Running Django tests...
echo.

REM Run tests with verbose output
python manage.py test --verbosity=2

if errorlevel 1 (
    echo.
    echo ❌ Some tests failed.
    pause
    exit /b 1
) else (
    echo.
    echo ✅ All Django tests passed successfully!
    pause
    exit /b 0
)
