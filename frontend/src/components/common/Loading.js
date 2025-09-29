'use client'

import { LoadingSpinner } from '@/components/ui'

export default function LoadingPage({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mx-auto mb-4" />
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  )
}

export function LoadingCard({ className = '', children }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {children || (
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      )}
    </div>
  )
}

export function LoadingButton({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32'
  }

  return (
    <div className={`animate-pulse bg-gray-200 rounded ${sizes[size]} ${className}`} />
  )
}
