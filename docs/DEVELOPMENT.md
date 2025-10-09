# 🚀 Development Guide

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 13+
- Git

### 1. Clone and Setup
```bash
git clone https://github.com/your-org/airbcar.git
cd airbcar
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your values

# Database setup
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin

## 🏗️ Development Commands

### Frontend Commands
```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run type-check      # Check TypeScript types

# Database operations
npm run db:view         # View database users
npm run db:test         # Test database connection
```

### Backend Commands
```bash
# Development
python manage.py runserver              # Start development server
python manage.py shell                  # Django shell
python manage.py dbshell                # Database shell

# Database operations
python manage.py makemigrations         # Create migrations
python manage.py migrate               # Apply migrations
python manage.py showmigrations        # Show migration status

# Testing
python manage.py test                  # Run all tests
python manage.py test apps.users      # Run specific app tests

# Data management
python manage.py createsuperuser       # Create admin user
python manage.py loaddata fixtures/   # Load test data
python manage.py dumpdata apps.users  # Export data

# Production
python manage.py collectstatic         # Collect static files
python manage.py check --deploy        # Check production readiness
```

### Docker Commands
```bash
# Development
docker-compose up --build              # Build and start all services
docker-compose up -d                   # Start in background
docker-compose down                    # Stop all services
docker-compose logs -f                 # View logs

# Database
docker-compose exec db psql -U postgres airbcar_db  # Connect to database

# Backend
docker-compose exec web python manage.py migrate    # Run migrations
docker-compose exec web python manage.py shell      # Django shell
```

## 🧪 Testing

### Frontend Testing
```bash
# Unit tests
npm run test

# E2E tests (requires app to be running)
npm run cypress:open     # Interactive mode
npm run cypress:run      # Headless mode

# Performance testing
npm run lighthouse       # Lighthouse audit
```

### Backend Testing
```bash
# Unit tests
python manage.py test

# Specific tests
python manage.py test apps.users.tests.test_models
python manage.py test apps.bookings.tests.test_api

# Coverage report
coverage run --source='.' manage.py test
coverage report
coverage html  # Generate HTML report
```

### API Testing
```bash
# Postman/Newman tests
cd tests
newman run airbcar-api-collection.json -e airbcar-test-environment.json
```

## 🔧 Code Quality

### Frontend Standards
- **Prettier**: Code formatting
- **ESLint**: Code linting with Next.js rules
- **TypeScript**: Type checking
- **Husky**: Git hooks for quality checks

### Backend Standards
- **Black**: Code formatting
- **Flake8**: Code linting
- **isort**: Import sorting
- **mypy**: Type checking

### Pre-commit Setup
```bash
# Install pre-commit hooks
cd airbcar
pip install pre-commit
pre-commit install

# Run on all files
pre-commit run --all-files
```

## 📦 Database Management

### Migrations
```bash
# Create migration
python manage.py makemigrations apps_name

# Apply migrations
python manage.py migrate

# Rollback migration
python manage.py migrate apps_name 0001

# Show migration plan
python manage.py showmigrations --plan
```

### Fixtures & Test Data
```bash
# Load test data
python manage.py loaddata fixtures/test_users.json
python manage.py loaddata fixtures/test_cars.json

# Create fixtures from current data
python manage.py dumpdata apps.users --indent=2 > fixtures/users.json
```

## 🚀 Deployment

### Environment Setup
1. Create production environment files
2. Set up database (PostgreSQL)
3. Configure static file serving
4. Set up SSL certificates

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Backend Deployment (Railway/Heroku)
```bash
# Railway
railway login
railway link
railway up

# Heroku
heroku create airbcar-api
git push heroku main
heroku run python manage.py migrate
```

## 🔍 Debugging

### Frontend Debugging
- Use React Developer Tools
- Next.js debugging with VS Code
- Browser DevTools for performance

### Backend Debugging
- Django Debug Toolbar (development)
- Python debugger (pdb)
- Django logging configuration

### Common Issues
1. **CORS errors**: Check CORS settings in Django
2. **Database connection**: Verify DATABASE_URL
3. **Static files**: Run `collectstatic` in production
4. **Migration conflicts**: Reset migrations if needed

## 📊 Monitoring

### Development Monitoring
- Django Debug Toolbar
- React DevTools Profiler
- Network tab for API calls

### Production Monitoring
- Sentry for error tracking
- Application performance monitoring
- Database query monitoring

## 🤝 Contributing

### Branch Naming
- `feature/feature-name`
- `fix/bug-description`
- `refactor/component-name`
- `docs/documentation-update`

### Commit Messages
Follow conventional commits:
```
feat: add user authentication
fix: resolve booking validation issue
docs: update API documentation
style: format code with prettier
refactor: restructure component hierarchy
test: add unit tests for user service
chore: update dependencies
```

### Pull Request Process
1. Create feature branch from `develop`
2. Make changes with tests
3. Update documentation
4. Create pull request
5. Code review and approval
6. Merge to `develop`

## 📚 Resources

### Documentation
- [Django Documentation](https://docs.djangoproject.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Tools
- [VS Code](https://code.visualstudio.com/) - Recommended IDE
- [Postman](https://www.postman.com/) - API testing
- [Figma](https://www.figma.com/) - Design collaboration
- [GitHub Desktop](https://desktop.github.com/) - Git GUI

This guide should help you get started with professional development of the Airbcar platform! 🚗
