'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { favoritesAPI, listingsAPI } from '@/lib/api'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function FavoritesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removeLoading, setRemoveLoading] = useState(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
      return
    }
    
    if (user) {
      fetchFavorites()
    }
  }, [user, authLoading, router])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await favoritesAPI.getFavorites()
      setFavorites(data)
    } catch (err) {
      console.error('Error fetching favorites:', err)
      setError('Failed to load favorites. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your favorites...</p>
          </div>
        )}

        {/* Favorites List */}
        {!loading && (
          <div className="space-y-6">
            {favorites.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                <p className="text-gray-500 mb-4">
                  Start exploring cars and add them to your favorites to see them here.
                </p>
                <button
                  onClick={() => router.push('/search')}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Browse Cars
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((favorite) => (
                  <div key={favorite.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    {/* Car Image */}
                    <div className="relative">
                      {favorite.listing?.picture_url ? (
                        <img
                          src={favorite.listing.picture_url}
                          alt={`${favorite.listing.make} ${favorite.listing.model}`}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Favorite Button */}
                      <button
                        onClick={() => handleRemoveFavorite(favorite.listing_id)}
                        disabled={removeLoading === favorite.listing_id}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                        title="Remove from favorites"
                      >
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* Car Details */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {favorite.listing?.make} {favorite.listing?.model}
                          </h3>
                          <p className="text-sm text-gray-600">{favorite.listing?.year}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-orange-600">
                            {formatPrice(favorite.listing?.price_per_day)}/day
                          </p>
                        </div>
                      </div>

                      {/* Car Features */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <span>{getTransmissionIcon(favorite.listing?.transmission)}</span>
                          <span>{favorite.listing?.transmission}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>{getFuelIcon(favorite.listing?.fuel_type)}</span>
                          <span>{favorite.listing?.fuel_type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>👥</span>
                          <span>{favorite.listing?.seating_capacity} seats</span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{favorite.listing?.location}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleBookNow(favorite.listing_id)}
                          className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                        >
                          Book Now
                        </button>
                        <button
                          onClick={() => router.push(`/car/${favorite.listing_id}`)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
