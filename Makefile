# Makefile for AirBCar v3 Project
# Django Backend + Next.js Frontend with Docker support

.PHONY: help install dev build start stop clean logs test lint migrate collectstatic superuser shell

# Default target
help:
	@echo "AirBCar v3 Project Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make install     - Install all dependencies (frontend & backend)"
	@echo "  make dev         - Start development servers with Docker"
	@echo "  make dev-local   - Start development servers locally (no Docker)"
	@echo "  make stop        - Stop all Docker containers"
	@echo ""
	@echo "Production:"
	@echo "  make build       - Build Docker images"
	@echo "  make start       - Start production containers"
	@echo "  make restart     - Restart all containers"
	@echo ""
	@echo "Database:"
	@echo "  make migrate     - Run Django migrations"
	@echo "  make superuser   - Create Django superuser"
	@echo "  make shell       - Open Django shell"
	@echo "  make dbshell     - Open database shell"
	@echo ""
	@echo "Testing & Quality:"
	@echo "  make test        - Run all tests"
	@echo "  make test-backend - Run Django tests"
	@echo "  make test-frontend - Run frontend tests"
	@echo "  make lint        - Run linting"
	@echo ""
	@echo "Utilities:"
	@echo "  make logs        - Show container logs"
	@echo "  make clean       - Clean up containers and images"
	@echo "  make status      - Show container status"

# Installation
install: install-frontend install-backend
	@echo "✅ All dependencies installed"

install-frontend:
	@echo "📦 Installing frontend dependencies..."
	cd frontend && pnpm install

install-backend:
	@echo "📦 Installing backend dependencies..."
	cd backend && pip install -r requirements.txt

# Development
dev:
	@echo "🚀 Starting development environment with Docker..."
	docker-compose up --build

dev-local: dev-backend dev-frontend

dev-backend:
	@echo "🚀 Starting Django development server..."
	cd backend/airbcar_backend && python manage.py runserver 0.0.0.0:8000 &

dev-frontend:
	@echo "🚀 Starting Next.js development server..."
	cd frontend && pnpm run dev &

# Production
build:
	@echo "🏗️ Building Docker images..."
	docker-compose build

start:
	@echo "▶️ Starting production containers..."
	docker-compose up -d

stop:
	@echo "⏹️ Stopping all containers..."
	docker-compose down

restart: stop start
	@echo "🔄 Containers restarted"

# Database operations
migrate:
	@echo "🗄️ Running Django migrations..."
	docker-compose exec web python manage.py migrate

migrate-local:
	@echo "🗄️ Running Django migrations locally..."
	cd backend/airbcar_backend && python manage.py migrate

makemigrations:
	@echo "📝 Creating Django migrations..."
	docker-compose exec web python manage.py makemigrations

makemigrations-local:
	@echo "📝 Creating Django migrations locally..."
	cd backend/airbcar_backend && python manage.py makemigrations

superuser:
	@echo "👤 Creating Django superuser..."
	docker-compose exec web python manage.py createsuperuser

superuser-local:
	@echo "👤 Creating Django superuser locally..."
	cd backend/airbcar_backend && python manage.py createsuperuser

shell:
	@echo "🐚 Opening Django shell..."
	docker-compose exec web python manage.py shell

shell-local:
	@echo "🐚 Opening Django shell locally..."
	cd backend/airbcar_backend && python manage.py shell

dbshell:
	@echo "🗄️ Opening database shell..."
	docker-compose exec web python manage.py dbshell

# Testing
test: test-backend test-frontend
	@echo "✅ All tests completed"

test-backend:
	@echo "🧪 Running Django tests..."
	docker-compose exec web python manage.py test

test-backend-local:
	@echo "🧪 Running Django tests locally..."
	cd backend/airbcar_backend && python manage.py test

test-frontend:
	@echo "🧪 Running frontend tests..."
	cd frontend && pnpm test

test-integration:
	@echo "🔗 Running integration tests..."
	./test-integration.sh

# Linting and code quality
lint: lint-backend lint-frontend
	@echo "✨ Linting completed"

lint-backend:
	@echo "🔍 Linting Django code..."
	cd backend && python -m flake8 . || true

lint-frontend:
	@echo "🔍 Linting Next.js code..."
	cd frontend && pnpm run lint

# Utilities
logs:
	@echo "📋 Showing container logs..."
	docker-compose logs -f

logs-web:
	@echo "📋 Showing web container logs..."
	docker-compose logs -f web

logs-app:
	@echo "📋 Showing app container logs..."
	docker-compose logs -f app

status:
	@echo "📊 Container status:"
	docker-compose ps

clean:
	@echo "🧹 Cleaning up containers and images..."
	docker-compose down -v
	docker system prune -f
	docker volume prune -f

clean-all: clean
	@echo "🧹 Removing all Docker images..."
	docker rmi $$(docker images -q) || true

# Database utilities
db-backup:
	@echo "💾 Creating database backup..."
	docker-compose exec web python manage.py dumpdata > backup_$$(date +%Y%m%d_%H%M%S).json

db-restore:
	@echo "📥 Restoring database from backup..."
	@read -p "Enter backup file name: " backup_file; \
	docker-compose exec web python manage.py loaddata $$backup_file

# Frontend specific commands
frontend-build:
	@echo "🏗️ Building Next.js application..."
	cd frontend && pnpm run build

frontend-start:
	@echo "▶️ Starting Next.js production server..."
	cd frontend && pnpm start

# Backend specific commands
collectstatic:
	@echo "📁 Collecting static files..."
	docker-compose exec web python manage.py collectstatic --noinput

collectstatic-local:
	@echo "📁 Collecting static files locally..."
	cd backend/airbcar_backend && python manage.py collectstatic --noinput

# Setup commands
setup: install migrate superuser
	@echo "🎉 Project setup completed!"

setup-local: install migrate-local superuser-local
	@echo "🎉 Local project setup completed!"

# Quick commands
up: dev
down: stop
ps: status