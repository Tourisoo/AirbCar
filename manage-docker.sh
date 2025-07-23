#!/bin/bash

# AirbCar Docker Management Script

set -e

COMPOSE_FILE="docker-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Help function
show_help() {
    echo "AirbCar Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start          Start all services"
    echo "  stop           Stop all services"
    echo "  restart        Restart all services"
    echo "  build          Build all services"
    echo "  rebuild        Rebuild all services (no cache)"
    echo "  logs           Show logs for all services"
    echo "  logs-f         Follow logs for all services"
    echo "  status         Show status of all services"
    echo "  clean          Stop and remove all containers and volumes"
    echo "  reset          Complete reset (remove everything and rebuild)"
    echo "  db-shell       Access PostgreSQL shell"
    echo "  backend-shell  Access backend container shell"
    echo "  frontend-shell Access frontend container shell"
    echo "  setup          Initial setup (copy .env.example to .env)"
    echo "  help           Show this help message"
    echo ""
    echo "Service-specific commands:"
    echo "  start-db       Start only database"
    echo "  start-backend  Start only backend (and database)"
    echo "  start-frontend Start only frontend"
}

# Check if docker-compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "docker-compose is not installed or not in PATH"
        exit 1
    fi
}

# Initial setup
setup() {
    print_status "Setting up AirbCar application..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        print_success "Created .env file from .env.example"
        print_warning "Please edit .env file with your actual configuration values"
    else
        print_warning ".env file already exists"
    fi
    
    print_success "Setup completed!"
}

# Start services
start() {
    print_status "Starting AirbCar application..."
    docker-compose up -d
    print_success "Services started successfully!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend: http://localhost:8000"
}

# Stop services
stop() {
    print_status "Stopping AirbCar application..."
    docker-compose down
    print_success "Services stopped successfully!"
}

# Restart services
restart() {
    print_status "Restarting AirbCar application..."
    docker-compose restart
    print_success "Services restarted successfully!"
}

# Build services
build() {
    print_status "Building AirbCar services..."
    docker-compose build
    print_success "Build completed successfully!"
}

# Rebuild services
rebuild() {
    print_status "Rebuilding AirbCar services (no cache)..."
    docker-compose build --no-cache
    print_success "Rebuild completed successfully!"
}

# Show logs
logs() {
    docker-compose logs
}

# Follow logs
logs_follow() {
    docker-compose logs -f
}

# Show status
status() {
    print_status "Service Status:"
    docker-compose ps
}

# Clean up
clean() {
    print_warning "This will stop and remove all containers and volumes!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up..."
        docker-compose down -v --remove-orphans
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled"
    fi
}

# Complete reset
reset() {
    print_warning "This will completely reset the application (remove everything and rebuild)!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Resetting application..."
        docker-compose down -v --remove-orphans --rmi all
        docker-compose build --no-cache
        print_success "Reset completed!"
    else
        print_status "Reset cancelled"
    fi
}

# Database shell
db_shell() {
    print_status "Accessing PostgreSQL shell..."
    docker-compose exec db psql -U airbcar_user -d airbcar_db
}

# Backend shell
backend_shell() {
    print_status "Accessing backend container shell..."
    docker-compose exec backend bash
}

# Frontend shell
frontend_shell() {
    print_status "Accessing frontend container shell..."
    docker-compose exec frontend sh
}

# Service-specific starts
start_db() {
    print_status "Starting database..."
    docker-compose up -d db
    print_success "Database started successfully!"
}

start_backend() {
    print_status "Starting backend and database..."
    docker-compose up -d db backend
    print_success "Backend services started successfully!"
}

start_frontend() {
    print_status "Starting frontend..."
    docker-compose up -d frontend
    print_success "Frontend started successfully!"
}

# Main script logic
main() {
    check_docker_compose
    
    case "${1:-help}" in
        "start")
            start
            ;;
        "stop")
            stop
            ;;
        "restart")
            restart
            ;;
        "build")
            build
            ;;
        "rebuild")
            rebuild
            ;;
        "logs")
            logs
            ;;
        "logs-f")
            logs_follow
            ;;
        "status")
            status
            ;;
        "clean")
            clean
            ;;
        "reset")
            reset
            ;;
        "db-shell")
            db_shell
            ;;
        "backend-shell")
            backend_shell
            ;;
        "frontend-shell")
            frontend_shell
            ;;
        "setup")
            setup
            ;;
        "start-db")
            start_db
            ;;
        "start-backend")
            start_backend
            ;;
        "start-frontend")
            start_frontend
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"
