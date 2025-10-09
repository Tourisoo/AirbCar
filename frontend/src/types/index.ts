/**
 * User Types
 */
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  dateOfBirth?: string
  profileImage?: string
  role: 'customer' | 'partner' | 'admin'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthUser extends User {
  accessToken: string
  refreshToken: string
}

/**
 * Car Listing Types
 */
export interface CarListing {
  id: string
  make: string
  model: string
  year: number
  category: string
  pricePerDay: number
  location: string
  images: string[]
  description: string
  features: string[]
  transmission: 'manual' | 'automatic'
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid'
  seats: number
  doors: number
  partnerId: string
  partnerName: string
  isAvailable: boolean
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export interface SearchFilters {
  location?: string
  pickupDate?: string
  dropoffDate?: string
  category?: string
  priceMin?: number
  priceMax?: number
  transmission?: string
  fuelType?: string
  seats?: number
  features?: string[]
}

/**
 * Booking Types
 */
export interface Booking {
  id: string
  userId: string
  listingId: string
  listing: CarListing
  pickupDate: string
  dropoffDate: string
  pickupLocation: string
  dropoffLocation: string
  totalPrice: number
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface BookingRequest {
  listingId: string
  pickupDate: string
  dropoffDate: string
  pickupLocation: string
  dropoffLocation: string
  notes?: string
}

/**
 * Partner Types
 */
export interface Partner {
  id: string
  userId: string
  user: User
  businessName: string
  businessType: string
  licenseNumber: string
  address: string
  city: string
  phoneNumber: string
  website?: string
  description?: string
  isVerified: boolean
  rating: number
  totalBookings: number
  createdAt: string
  updatedAt: string
}

export interface PartnerStats {
  totalListings: number
  activeBookings: number
  totalRevenue: number
  monthlyRevenue: number
  averageRating: number
  totalReviews: number
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

/**
 * Form Types
 */
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber?: string
  acceptTerms: boolean
}

export interface ProfileForm {
  firstName: string
  lastName: string
  phoneNumber?: string
  dateOfBirth?: string
  address?: string
  city?: string
  country?: string
}

/**
 * Component Props Types
 */
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

/**
 * Navigation Types
 */
export interface NavItem {
  label: string
  href: string
  icon?: string
  children?: NavItem[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

/**
 * Utility Types
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}
