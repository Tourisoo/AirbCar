// API Constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/login/',
    REGISTER: '/api/register/',
    REFRESH: '/api/token/refresh/',
    LOGOUT: '/api/logout/',
    PROFILE: '/users/',
    VERIFY_TOKEN: '/api/verify-token/',
  },
  LISTINGS: {
    LIST: '/listings/',
    DETAIL: (id) => `/listings/${id}/`,
    SEARCH: '/listings/search/',
    FAVORITES: '/favorites/',
  },
  BOOKINGS: {
    LIST: '/bookings/',
    CREATE: '/bookings/',
    DETAIL: (id) => `/bookings/${id}/`,
    CANCEL: (id) => `/bookings/${id}/cancel/`,
    ACCEPT: (id) => `/bookings/${id}/accept/`,
    REJECT: (id) => `/bookings/${id}/reject/`,
    PENDING_REQUESTS: '/bookings/pending-requests/',
    UPCOMING: '/bookings/upcoming/',
  },
  PARTNERS: {
    LIST: '/partners/',
    REGISTER: '/partners/register/',
    DASHBOARD: '/partners/dashboard/',
  },
  ADMIN: {
    USERS: '/admin/users/',
    STATS: '/admin/stats/',
  }
}

// App Constants
export const APP_NAME = 'Airbcar'
export const APP_DESCRIPTION = 'Premium car rental platform in Morocco'

// UI Constants
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export const COLORS = {
  primary: {
    50: '#fff7ed',
    100: '#ffedd5',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
  },
  secondary: {
    50: '#f0f9ff',
    500: '#3b82f6',
    600: '#2563eb',
  }
}

// Car Categories
export const CAR_CATEGORIES = [
  { id: 'economy', name: 'Economy', icon: '🚗' },
  { id: 'compact', name: 'Compact', icon: '🚙' },
  { id: 'intermediate', name: 'Intermediate', icon: '🚘' },
  { id: 'standard', name: 'Standard', icon: '🚖' },
  { id: 'premium', name: 'Premium', icon: '🚗' },
  { id: 'luxury', name: 'Luxury', icon: '🏎️' },
]

// Moroccan Cities
export const MOROCCAN_CITIES = [
  'Agadir',
  'Casablanca', 
  'Marrakech',
  'Rabat',
  'Tangier',
  'Tetouan'
]

// Pagination
export const ITEMS_PER_PAGE = 12
export const MAX_PAGINATION_PAGES = 5

// Form Validation
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+212|0)[5-7]\d{8}$/,
  PASSWORD_MIN_LENGTH: 8,
}

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  PARTNER: 'partner',
  ADMIN: 'admin',
}

// File Upload
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_IMAGES_PER_LISTING: 10,
}
