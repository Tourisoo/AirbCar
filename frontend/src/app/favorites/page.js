'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
// Favorites API imports removed - feature disabled
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function FavoritesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
      return
    }
  }, [user, authLoading, router])

  // Favorites feature is disabled - show message instead

  const handleRemoveFavorite = async (listingId) => {
    if (!confirm('Are you sure you want to remove this car from your favorites?')) {
      return
    }

    try {
      setRemoveLoading(listingId)
      await favoritesAPI.removeFavorite(listingId)
      setFavorites(prev => prev.filter(fav => fav.listing_id !== listingId))
    } catch (err) {
      console.error('Error removing favorite:', err)
      setError('Failed to remove favorite. Please try again.')
    } finally {
      setRemoveLoading(null)
    }
  }

  const handleBookNow = (listingId) => {
    router.push(`/car/${listingId}`)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const getTransmissionIcon = (transmission) => {
    return transmission === 'Automatic' ? '🔄' : '⚙️'
  }

  const getFuelIcon = (fuelType) => {
    switch (fuelType?.toLowerCase()) {
      case 'gasoline':
      case 'petrol':
        return '⛽'
      case 'diesel':
        return '🛢️'
      case 'electric':
        return '🔌'
      case 'hybrid':
        return '🔋'
      default:
        return '⛽'
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Favorite Cars</h1>
          <p className="text-gray-600 mt-2">Manage your saved car listings</p>
        </div>

        {/* Feature Disabled Message */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <svg className="h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Favorites Feature Coming Soon</h3>
          <p className="text-yellow-700 mb-4">
            The favorites feature is currently under development. You can still browse and book cars from our search page.
          </p>
          <button 
            onClick={() => router.push('/search')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Browse Cars
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
