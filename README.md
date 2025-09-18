# 🚗 Airbcar - Car Rental Platform

A full-stack car rental platform built with Django REST Framework and Next.js.

## 📁 Project Structure

```
airbcar_ff/
├── backend/          # Django REST API
├── frontend/         # Next.js React application
├── tests/           # API tests (Postman/Newman)
├── .github/         # GitHub Actions workflows
└── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL
- Docker (optional)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up database and run migrations:
   ```bash
   cd airbcar_backend
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

The frontend will be available at `http://localhost:3000`

### Docker Setup (Alternative)

Run the entire stack with Docker Compose:

```bash
docker-compose up --build
```

## 🧪 Testing

### API Tests

We use Newman (Postman CLI) for API testing. The tests are located in the `tests/` directory.

#### Prerequisites
```bash
npm install -g newman
```

#### Running Tests

**Option 1: Use the provided scripts**
```bash
# On Linux/macOS
./tests/run-tests.sh

# On Windows
tests\run-tests.bat
```

**Option 2: Run Newman directly**
```bash
newman run tests/airbcar-api-collection.json -e tests/airbcar-test-environment.json
```

#### Test Coverage
- ✅ User registration
- ✅ User authentication (login/logout)
- ✅ JWT token refresh
- ✅ User management endpoints
- ✅ Health checks

## 📋 API Documentation

The backend API includes the following endpoints:

### Authentication
- `POST /api/register/` - User registration
- `POST /api/login/` - Login (get JWT tokens)
- `POST /api/token/refresh/` - Refresh access token

### Users
- `GET /api/users/` - List all users
- `GET /users/` - List users (alternative endpoint)
- `GET /api/users/<id>/` - Get user by ID
- `PUT /api/users/<id>/` - Update user
- `DELETE /api/users/<id>/` - Delete user

### Base URL
- Development: `http://localhost:8000`

## 🔧 Development

### Environment Variables

Create a `.env` file in the backend directory:

```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgres://user:password@localhost:5432/airbcar_db
```

### Database Configuration

The default configuration uses PostgreSQL. Update `backend/airbcar_backend/settings.py` for different database settings.

### Running Migrations

```bash
cd backend/airbcar_backend
python manage.py makemigrations
python manage.py migrate
```

## 🚢 Deployment

The project includes GitHub Actions workflows for automatic deployment:

- **Backend Tests**: Django unit tests
- **API Tests**: Newman/Postman collection tests
- **Build**: Docker image building
- **Deploy**: Automated deployment pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact the development team

## 🏗️ Architecture

### Backend (Django REST Framework)
- RESTful API design
- JWT authentication
- PostgreSQL database
- Django ORM
- API documentation with DRF

### Frontend (Next.js)
- React 18+ with Next.js 14+
- Tailwind CSS for styling
- JWT token management
- Responsive design
- Server-side rendering

### Testing
- Backend: Django unit tests
- API: Newman/Postman collections
- Frontend: Jest + React Testing Library (planned)

## 🔄 CI/CD

The project uses GitHub Actions for:
- Automated testing on pull requests
- API endpoint testing
- Docker image building
- Deployment to staging/production environments




*************