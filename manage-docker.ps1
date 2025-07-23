# AirbCar Docker Management Script for Windows PowerShell

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

# Colors for output
function Write-Status { 
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue 
}

function Write-Success { 
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green 
}

function Write-Warning { 
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow 
}

function Write-Error { 
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red 
}

# Help function
function Show-Help {
    Write-Host "AirbCar Docker Management Script" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\manage-docker.ps1 [COMMAND]" -ForegroundColor White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor White
    Write-Host "  start          Start all services" -ForegroundColor Gray
    Write-Host "  stop           Stop all services" -ForegroundColor Gray
    Write-Host "  restart        Restart all services" -ForegroundColor Gray
    Write-Host "  build          Build all services" -ForegroundColor Gray
    Write-Host "  rebuild        Rebuild all services (no cache)" -ForegroundColor Gray
    Write-Host "  logs           Show logs for all services" -ForegroundColor Gray
    Write-Host "  logs-f         Follow logs for all services" -ForegroundColor Gray
    Write-Host "  status         Show status of all services" -ForegroundColor Gray
    Write-Host "  clean          Stop and remove all containers and volumes" -ForegroundColor Gray
    Write-Host "  reset          Complete reset (remove everything and rebuild)" -ForegroundColor Gray
    Write-Host "  db-shell       Access PostgreSQL shell" -ForegroundColor Gray
    Write-Host "  backend-shell  Access backend container shell" -ForegroundColor Gray
    Write-Host "  frontend-shell Access frontend container shell" -ForegroundColor Gray
    Write-Host "  setup          Initial setup (copy .env.example to .env)" -ForegroundColor Gray
    Write-Host "  help           Show this help message" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Service-specific commands:" -ForegroundColor White
    Write-Host "  start-db       Start only database" -ForegroundColor Gray
    Write-Host "  start-backend  Start only backend (and database)" -ForegroundColor Gray
    Write-Host "  start-frontend Start only frontend" -ForegroundColor Gray
}

# Check if docker-compose is available
function Test-DockerCompose {
    try {
        docker-compose version | Out-Null
        return $true
    }
    catch {
        Write-Error "docker-compose is not installed or not in PATH"
        return $false
    }
}

# Initial setup
function Invoke-Setup {
    Write-Status "Setting up AirbCar application..."
    
    if (-not (Test-Path ".env")) {
        Copy-Item ".env.example" ".env"
        Write-Success "Created .env file from .env.example"
        Write-Warning "Please edit .env file with your actual configuration values"
    }
    else {
        Write-Warning ".env file already exists"
    }
    
    Write-Success "Setup completed!"
}

# Start services
function Start-Services {
    Write-Status "Starting AirbCar application..."
    docker-compose up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Services started successfully!"
        Write-Status "Frontend: http://localhost:3000"
        Write-Status "Backend: http://localhost:8000"
    }
}

# Stop services
function Stop-Services {
    Write-Status "Stopping AirbCar application..."
    docker-compose down
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Services stopped successfully!"
    }
}

# Restart services
function Restart-Services {
    Write-Status "Restarting AirbCar application..."
    docker-compose restart
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Services restarted successfully!"
    }
}

# Build services
function Build-Services {
    Write-Status "Building AirbCar services..."
    docker-compose build
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Build completed successfully!"
    }
}

# Rebuild services
function Rebuild-Services {
    Write-Status "Rebuilding AirbCar services (no cache)..."
    docker-compose build --no-cache
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Rebuild completed successfully!"
    }
}

# Show logs
function Show-Logs {
    docker-compose logs
}

# Follow logs
function Show-LogsFollow {
    docker-compose logs -f
}

# Show status
function Show-Status {
    Write-Status "Service Status:"
    docker-compose ps
}

# Clean up
function Invoke-Clean {
    Write-Warning "This will stop and remove all containers and volumes!"
    $confirmation = Read-Host "Are you sure? (y/N)"
    if ($confirmation -match '^[Yy]$') {
        Write-Status "Cleaning up..."
        docker-compose down -v --remove-orphans
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Cleanup completed!"
        }
    }
    else {
        Write-Status "Cleanup cancelled"
    }
}

# Complete reset
function Invoke-Reset {
    Write-Warning "This will completely reset the application (remove everything and rebuild)!"
    $confirmation = Read-Host "Are you sure? (y/N)"
    if ($confirmation -match '^[Yy]$') {
        Write-Status "Resetting application..."
        docker-compose down -v --remove-orphans --rmi all
        docker-compose build --no-cache
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Reset completed!"
        }
    }
    else {
        Write-Status "Reset cancelled"
    }
}

# Database shell
function Open-DbShell {
    Write-Status "Accessing PostgreSQL shell..."
    docker-compose exec db psql -U airbcar_user -d airbcar_db
}

# Backend shell
function Open-BackendShell {
    Write-Status "Accessing backend container shell..."
    docker-compose exec backend bash
}

# Frontend shell
function Open-FrontendShell {
    Write-Status "Accessing frontend container shell..."
    docker-compose exec frontend sh
}

# Service-specific starts
function Start-Database {
    Write-Status "Starting database..."
    docker-compose up -d db
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Database started successfully!"
    }
}

function Start-Backend {
    Write-Status "Starting backend and database..."
    docker-compose up -d db backend
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Backend services started successfully!"
    }
}

function Start-Frontend {
    Write-Status "Starting frontend..."
    docker-compose up -d frontend
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Frontend started successfully!"
    }
}

# Main script logic
if (-not (Test-DockerCompose)) {
    exit 1
}

switch ($Command.ToLower()) {
    "start" { Start-Services }
    "stop" { Stop-Services }
    "restart" { Restart-Services }
    "build" { Build-Services }
    "rebuild" { Rebuild-Services }
    "logs" { Show-Logs }
    "logs-f" { Show-LogsFollow }
    "status" { Show-Status }
    "clean" { Invoke-Clean }
    "reset" { Invoke-Reset }
    "db-shell" { Open-DbShell }
    "backend-shell" { Open-BackendShell }
    "frontend-shell" { Open-FrontendShell }
    "setup" { Invoke-Setup }
    "start-db" { Start-Database }
    "start-backend" { Start-Backend }
    "start-frontend" { Start-Frontend }
    default { Show-Help }
}
