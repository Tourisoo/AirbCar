# AirbCar Full Stack Application

This project contains a full-stack car rental application with Django backend and Next.js frontend.

## Architecture

- **Backend**: Django/Python API (Port 8000)
- **Frontend**: Next.js React application (Port 3000)  
- **Database**: PostgreSQL (Port 5432)

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd Airbcar_backend
```

### 2. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` file with your actual values:
- Update `NEXTAUTH_SECRET` with a secure random string
- Configure OAuth credentials (Google, etc.) if needed
- Set up email server credentials if using email features

### 3. Build and Run

Build and start all services:
```bash
docker-compose up --build
```

Or run in background:
```bash
docker-compose up -d --build
```

### 4. Access Applications

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Database**: localhost:5432

## Development Workflow

### Starting Services
```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up frontend
docker-compose up backend

# Start in background
docker-compose up -d
```

### Stopping Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ This will delete database data)
docker-compose down -v
```

### Viewing Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs frontend
docker-compose logs backend
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f frontend
```

### Database Operations

#### Access PostgreSQL directly:
```bash
docker-compose exec db psql -U airbcar_user -d airbcar_db
```

#### Backend Django Commands:
```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Collect static files
docker-compose exec backend python manage.py collectstatic

# Access Django shell
docker-compose exec backend python manage.py shell
```

#### Frontend Operations:
```bash
# Install new packages
docker-compose exec frontend pnpm install <package-name>

# Run Prisma migrations (if using Prisma)
docker-compose exec frontend npx prisma migrate dev

# Access container shell
docker-compose exec frontend sh
```

## Service Health Checks

The docker-compose includes health checks for all services:

- **Database**: Checks if PostgreSQL is ready
- **Backend**: Checks if Django server responds
- **Frontend**: Checks if Next.js server responds

View health status:
```bash
docker-compose ps
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 8000, and 5432 are available
2. **Database connection issues**: Wait for database to be fully ready before starting backend
3. **Volume permissions**: On Windows, make sure Docker has access to your project directory

### Rebuild Services
```bash
# Rebuild all services
docker-compose build --no-cache

# Rebuild specific service
docker-compose build --no-cache frontend
```

### Reset Everything
```bash
# Stop and remove everything including volumes
docker-compose down -v --remove-orphans

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up --build
```

## Production Deployment

For production deployment:

1. Update environment variables for production
2. Set `NODE_ENV=production`
3. Use proper secrets for `NEXTAUTH_SECRET` and `DJANGO_SECRET_KEY`
4. Configure proper domain names
5. Set up SSL/TLS certificates
6. Use production database with proper backups

## Network Architecture

All services run on the `airbcar-network` Docker network:
- Services can communicate using container names
- Frontend calls backend at `http://backend:8000`
- Backend connects to database at `db:5432`
