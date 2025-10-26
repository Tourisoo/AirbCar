# 🚗 AirbCar - Car Rental Platform

A modern full-stack car rental platform built with Django REST Framework and Next.js, featuring both local development and production-ready configurations.

## 📁 Project Structure

```
AirbCar/
├── backend/                 # Django REST API
│   ├── airbcar_backend/    # Main Django project
│   ├── requirements.txt    # Python dependencies
│   └── entrypoint.sh      # Database initialization script
├── frontend/               # Next.js React application
├── .env.local.example     # Local development environment template
├── .env.local.supabase    # Production environment template
├── docker-compose.yml     # Docker services configuration
├── Makefile              # Quick start commands
└── README.md
```

## 🚀 Quick Start for Visitors

Perfect for testing the platform locally with sample data - no external dependencies required!

### Prerequisites

- **Docker** & **Docker Compose** installed
- **Make** utility (usually pre-installed on Linux/macOS, [available for Windows](https://gnuwin32.sourceforge.net/packages/make.htm))

### Setup Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd AirbCar

# 2. Create local environment file
cp .env.local.example .env.local

# 3. Start the application with local database
make local
```

That's it! 🎉 The application will automatically:
- Set up a local PostgreSQL database
- Load sample data (cars, users, bookings)
- Start all services in the background

### Access Your Application

After running `make local`, access:

- **🌐 Frontend**: http://localhost:3000
- **🔧 Backend API**: http://localhost:8000  
- **👤 Admin Panel**: http://localhost:8000/admin

### Sample Login Credentials

The application comes pre-loaded with sample data:

#### Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Full admin panel access

#### Test Users
- **Regular User**: `testuser` / `testpassword`
- **Partner User**: `partneruser` / `partnerpassword`

### Sample Data Included

🚗 **17 Car Listings** across Moroccan cities:
- **Tetouan**: Dacia Logan, Renault Clio, Peugeot 208
- **Tangier**: Hyundai i20, Nissan Micra, Ford Fiesta  
- **Rabat**: BMW 3 Series, Mercedes C-Class
- **Casablanca**: VW Golf, Toyota Corolla, Skoda Octavia
- **Marrakech**: Kia Sportage, Mazda CX-5, Mitsubishi Outlander
- **Agadir**: Citroën C3 Aircross, Jeep Compass, Suzuki Vitara

👥 **Users & Partners**:
- 1 Rental company (Airbcar Rentals)
- Sample bookings and user interactions

## 🛠️ Available Commands

```bash
# Local development (recommended for visitors)
make local          # Start with local database + sample data

# Remote development (for team members with access)
make run           # Start with remote Supabase database

# Maintenance
make clean         # Stop and remove containers
make fclean        # Full cleanup (containers, images, volumes)
```

## 🎯 For Developers

### Environment Files

The project uses different environment configurations:

#### `.env.local.example` (Local Development - Copy this!)
```bash
# Automatic local PostgreSQL setup
DATABASE_HOST=db
DATABASE_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=local_dev_password

# Sample data loading
FIRST_RUN=1
LOAD_INITIAL_FIXTURE=1
```

#### `.env.local.supabase` (Production/Team)
```bash
# Remote Supabase database (requires team credentials)
DATABASE_HOST=aws-1-eu-north-1.pooler.supabase.com
DATABASE_PORT=5432
# ... (requires team access)
```

### ⚠️ Important Note

The repository doesn't include a `.env.local` file for security reasons. You must create one:

```bash
# For local development (visitors/testing)
cp .env.local.example .env.local

# For production/team development
cp .env.local.supabase .env.local
# (requires team database credentials)
```

### Manual Setup (Alternative)

If you prefer manual setup over `make local`:

```bash
# 1. Create environment file
cp .env.local.example .env.local

# 2. Start services
docker-compose up --build

# 3. View logs (optional)
docker-compose logs -f
```

### Development Workflow

```bash
# Setup environment
cp .env.local.example .env.local

# Start development
make local

# View running containers
docker ps

# View logs
docker-compose logs -f django-api
docker-compose logs -f next-app

# Stop everything
make clean
```

## 🔧 Technical Stack

### Backend (Django REST Framework)
- **Framework**: Django 4.2.21 with DRF
- **Database**: PostgreSQL 14
- **Authentication**: JWT tokens
- **API**: RESTful endpoints
- **Features**: User management, car listings, booking system

### Frontend (Next.js)
- **Framework**: Next.js 15+ with React 18
- **Styling**: Tailwind CSS
- **Features**: Responsive design, JWT authentication
- **API Integration**: Axios for backend communication

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL (local) or Supabase (production)
- **Environment**: Environment-based configuration

## 📊 API Endpoints

### Authentication
- `POST /api/register/` - User registration
- `POST /api/login/` - Login (JWT tokens)
- `POST /api/token/refresh/` - Refresh access token

### Core Features
- `GET /api/listings/` - Browse car listings
- `POST /api/bookings/` - Create booking
- `GET /api/users/profile/` - User profile management
- `GET /api/partners/` - Partner/company management

### Admin
- `/admin/` - Django admin interface
- Full CRUD operations for all models

## 🚢 Production Setup

For production deployment:

1. **Copy production environment**:
   ```bash
   cp .env.local.supabase .env.local
   # Edit with your production credentials
   ```

2. **Use remote database mode**:
   ```bash
   make run  # Uses .env.local with remote database
   ```

## 🧪 Testing the Platform

### As a Visitor
1. **Setup**: `cp .env.local.example .env.local && make local`
2. **Browse Cars**: Visit http://localhost:3000 to see available rentals
3. **Register**: Create a new account or use test credentials
4. **Book a Car**: Select dates and submit booking requests
5. **Admin Panel**: Login to http://localhost:8000/admin to manage data

### As a Developer
1. **Setup Environment**: Copy appropriate `.env.*` file to `.env.local`
2. **API Testing**: Use tools like Postman with http://localhost:8000/api/
3. **Database**: Access PostgreSQL directly or via Django admin
4. **Frontend**: Modify React components with hot reload
5. **Backend**: Django auto-reloads on code changes

## 🔍 Troubleshooting

### Common Issues

**Missing `.env.local` file**:
```bash
cp .env.local.example .env.local
make local
```

**Port already in use**:
```bash
# Stop conflicting services
make clean
# Or change ports in docker-compose.yml
```

**Database connection issues**:
```bash
# Reset everything
make fclean
cp .env.local.example .env.local
make local
```

**Permission issues** (Linux/macOS):
```bash
sudo chown -R $USER:$USER .
```

### Logs & Debugging

```bash
# View all logs
docker-compose logs

# Specific service logs
docker-compose logs django-api
docker-compose logs next-app
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f
```

## 🤝 Contributing

1. Fork the repository
2. Create environment: `cp .env.local.example .env.local`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes and test with `make local`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Issues**: Create an issue in this repository
- **Documentation**: Check this README and code comments
- **Quick Test**: `cp .env.local.example .env.local && make local`

---

**🎉 Ready to explore?**
```bash
cp .env.local.example .env.local
make local
```
**Start testing the platform!**