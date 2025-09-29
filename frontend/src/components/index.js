// Layout Components
export { default as Header } from './layout/Header'
export { default as Footer } from './layout/Footer'

// Form Components
export { default as LoginForm } from './forms/LoginForm'
export { default as RegisterForm } from './forms/RegisterForm'

// Common Components
export { default as LoadingPage, LoadingCard, LoadingButton } from './common/Loading'
export { 
  default as ErrorBoundary, 
  NotFoundError, 
  UnauthorizedError, 
  NetworkError 
} from './common/ErrorBoundary'

// UI Components - re-export from ui/index.js
export * from './ui'

// Section Components (to be moved from app/components)
// These will be organized as we move the existing components
export { default as Hero } from './sections/Hero'
export { default as Features } from './sections/Features'
export { default as CarTypes } from './sections/CarTypes'
export { default as PopularDestinations } from './sections/PopularDestinations'
export { default as HowItWorks } from './sections/HowItWorks'
export { default as TrustSignals } from './sections/TrustSignals'
export { default as RentalProviders } from './sections/RentalProviders'
export { default as CarRentalFacts } from './sections/CarRentalFacts'
export { default as InfoSection } from './sections/InfoSection'
