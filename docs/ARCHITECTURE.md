# Airbcar - Professional Car Rental Platform

## 🏗️ Architecture Overview

### Frontend Architecture (Next.js)

```
src/
├── app/                    # Next.js 14+ App Router
│   ├── (auth)/            # Auth pages (grouped routing)
│   ├── account/           # User account pages
│   ├── admin/             # Admin dashboard
│   ├── partner/           # Partner dashboard
│   ├── search/            # Car search and listings
│   ├── booking/           # Booking flow
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Homepage
├── components/            # Reusable components
│   ├── ui/               # Base UI components (Button, Input, etc.)
│   ├── layout/           # Layout components (Header, Footer)
│   ├── sections/         # Page sections (Hero, Features, etc.)
│   ├── forms/            # Form components
│   └── common/           # Common utilities (Loading, Error)
├── contexts/             # React Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── services/             # API services
├── types/                # TypeScript type definitions
├── constants/            # App constants
└── utils/                # Helper utilities
```

### Backend Architecture (Django)

```
airbcar_backend/
├── airbcar_backend/      # Main Django project
│   ├── settings/         # Environment-specific settings
│   ├── urls.py          # Main URL configuration
│   └── wsgi.py          # WSGI configuration
├── apps/                 # Django applications
│   ├── users/           # User management
│   ├── partners/        # Partner management
│   ├── listings/        # Car listings
│   └── bookings/        # Booking system
├── common/              # Shared utilities
│   ├── models.py        # Base models
│   ├── permissions.py   # Custom permissions
│   ├── serializers.py   # Base serializers
│   └── utils.py         # Utility functions
└── manage.py            # Django management script
```

## 🎨 Design System

### Color Palette
- Primary: Orange (#f97316, #ea580c, #c2410c)
- Secondary: Blue (#3b82f6, #2563eb)
- Neutral: Gray (#f8fafc to #111827)
- Status: Green, Yellow, Red for success, warning, error

### Typography
- Font Family: System fonts (San Francisco, Segoe UI, etc.)
- Font Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Font Sizes: Responsive scale from 12px to 72px

### Component Standards
- All components use TypeScript interfaces for props
- Consistent naming: PascalCase for components, camelCase for functions
- Proper error handling and loading states
- Accessibility-first design (ARIA labels, keyboard navigation)

## 🔧 Development Standards

### Code Quality
- ESLint + Prettier for code formatting
- TypeScript for type safety
- Jest for unit testing
- Cypress for E2E testing

### Git Workflow
```bash
main (production)
├── develop (development)
├── feature/user-authentication
├── feature/booking-system
└── hotfix/critical-bug-fix
```

### Commit Convention
```
feat: add user authentication system
fix: resolve booking validation issue
docs: update API documentation
style: format code with prettier
refactor: restructure component hierarchy
test: add unit tests for user service
chore: update dependencies
```

## 📦 Dependencies Management

### Frontend Dependencies
- **Core**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **State**: React Context, Zustand (for complex state)
- **HTTP**: Axios, React Query
- **Forms**: React Hook Form, Zod validation
- **Utils**: date-fns, lodash-es

### Backend Dependencies
- **Core**: Django 4.2, Django REST Framework
- **Auth**: Simple JWT, Django CORS Headers
- **Database**: PostgreSQL, psycopg2
- **Storage**: Supabase, Django Storages
- **Utils**: python-dotenv, Pillow

## 🚀 Deployment

### Development Environment
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend/airbcar_backend
pip install -r requirements.txt
python manage.py runserver
```

### Production Environment
- **Frontend**: Vercel (recommended) or Netlify
- **Backend**: Railway, Heroku, or DigitalOcean
- **Database**: Supabase PostgreSQL
- **CDN**: Cloudflare for static assets

### Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_key

# Backend (.env)
DEBUG=False
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## 📊 Monitoring & Analytics

### Error Monitoring
- **Frontend**: Sentry for React error tracking
- **Backend**: Sentry for Django error tracking

### Performance Monitoring
- **Frontend**: Vercel Analytics, Lighthouse CI
- **Backend**: Django Debug Toolbar (dev), New Relic (prod)

### Business Analytics
- **User Analytics**: Google Analytics 4
- **Product Analytics**: Mixpanel or Amplitude
- **A/B Testing**: Optimizely or Split

## 🔒 Security

### Authentication & Authorization
- JWT tokens for API authentication
- Role-based access control (Customer, Partner, Admin)
- Refresh token rotation for security

### Data Protection
- HTTPS in production
- CORS properly configured
- Input validation on all endpoints
- Rate limiting on API endpoints

### Compliance
- GDPR compliance for EU users
- Data encryption at rest and in transit
- Regular security audits

## 🧪 Testing Strategy

### Frontend Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run cypress:open

# Performance tests
npm run lighthouse
```

### Backend Testing
```bash
# Unit tests
python manage.py test

# API tests
python manage.py test apps.users.tests
python manage.py test apps.bookings.tests

# Load tests
locust -f tests/load_tests.py
```

## 📈 Performance Optimization

### Frontend Optimization
- Next.js Image optimization
- Code splitting and lazy loading
- Service Worker for caching
- Bundle size monitoring

### Backend Optimization
- Database query optimization
- Redis caching for frequent data
- CDN for static files
- Database indexing

## 🤝 Team Collaboration

### Code Review Process
1. Feature branch created from `develop`
2. Pull request opened with description
3. Automated tests must pass
4. Code review by team member
5. Merge to `develop` after approval

### Documentation Standards
- All functions/components documented
- API endpoints documented with OpenAPI
- README files for each major component
- Changelog maintained for releases

## 📋 Release Process

### Version Control
- Semantic versioning (MAJOR.MINOR.PATCH)
- Release notes for each version
- Tagged releases in Git

### Deployment Pipeline
1. Development → Staging environment
2. QA testing in staging
3. Production deployment
4. Post-deployment monitoring

This architecture ensures scalability, maintainability, and professional standards for the Airbcar platform.
