'use client'

import { Button } from '@/components/ui'
import Link from 'next/link'

export default function ErrorBoundary({ 
  error, 
  reset,
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  showHomeButton = true 
}) {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Error Content */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
        
        <p className="text-gray-600 mb-8">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {reset && (
            <Button 
              onClick={reset}
              className="w-full"
              size="lg"
            >
              Try Again
            </Button>
          )}
          
          {showHomeButton && (
            <Link href="/">
              <Button 
                variant="outline" 
                className="w-full"
                size="lg"
              >
                Go Home
              </Button>
            </Link>
          )}
        </div>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Show Error Details
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto">
              {error.stack || error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

export function NotFoundError() {
  return (
    <ErrorBoundary
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      showHomeButton={true}
    />
  )
}

export function UnauthorizedError() {
  return (
    <ErrorBoundary
      title="Access Denied"
      message="You don't have permission to access this page. Please log in or contact support."
      showHomeButton={true}
    />
  )
}

export function NetworkError({ onRetry }) {
  return (
    <ErrorBoundary
      title="Connection Error"
      message="Unable to connect to our servers. Please check your internet connection and try again."
      reset={onRetry}
      showHomeButton={true}
    />
  )
}
