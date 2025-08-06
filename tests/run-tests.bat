@echo off
setlocal enabledelayedexpansion

REM Airbcar API Tests Runner for Windows
REM This script helps run Newman tests for the Airbcar API

echo 🚗 Airbcar API Tests Runner
echo ==================================

REM Check if Newman is installed
newman --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Newman is not installed
    echo Please install Newman globally: npm install -g newman
    exit /b 1
)

REM Check if backend is running
echo 🔍 Checking if backend is running...
curl -f http://localhost:8000/ >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend is not running
    echo Please start the backend server first:
    echo   cd backend\airbcar_backend
    echo   python manage.py runserver
    exit /b 1
) else (
    echo ✅ Backend is running on http://localhost:8000
)

REM Run the tests
echo 🧪 Running API tests...
echo.

REM Get the project root directory
set "PROJECT_ROOT=%~dp0.."

REM Run Newman with the collection and environment
newman run "%PROJECT_ROOT%\tests\airbcar-api-collection.json" -e "%PROJECT_ROOT%\tests\airbcar-test-environment.json" --timeout-request 10000 --color on

if errorlevel 1 (
    echo.
    echo ⚠️  Some tests may have failed. Check the output above.
) else (
    echo.
    echo ✅ All tests completed successfully!
)

pause
