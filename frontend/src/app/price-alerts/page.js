'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { priceAlertsAPI, listingsAPI } from '@/lib/api'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function PriceAlertsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [createLoading, setCreateLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Form state for creating new alert
  const [newAlert, setNewAlert] = useState({
    listing_id: '',
    target_price: '',
    notification_method: 'email', // email, sms, both
    is_active: true
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
      return
    }
    
    if (user) {
      fetchAlerts()
    }
  }, [user, authLoading, router])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await priceAlertsAPI.getPriceAlerts()
      setAlerts(data)
    } catch (err) {
      console.error('Error fetching alerts:', err)
      setError('Failed to load price alerts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAlert = async (alertId) => {
    if (!confirm('Are you sure you want to delete this price alert?')) {
      return
    }

    try {
      setDeleteLoading(alertId)
      await priceAlertsAPI.deletePriceAlert(alertId)
      setAlerts(prev => prev.filter(alert => alert.id !== alertId))
    } catch (err) {
      console.error('Error deleting alert:', err)
      setError('Failed to delete alert. Please try again.')
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleToggleAlert = async (alertId, isActive) => {
    try {
      await priceAlertsAPI.updatePriceAlert(alertId, { is_active: !isActive })
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, is_active: !isActive }
          : alert
      ))
    } catch (err) {
      console.error('Error updating alert:', err)
      setError('Failed to update alert. Please try again.')
    }
  }

  const handleSearchCars = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      setSearchLoading(true)
      const data = await listingsAPI.getListings({ search: query })
      setSearchResults(data.slice(0, 5)) // Limit to 5 results
    } catch (err) {
      console.error('Error searching cars:', err)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  const handleCreateAlert = async (e) => {
    e.preventDefault()
    
    if (!newAlert.listing_id || !newAlert.target_price) {
      setError('Please fill in all required fields.')
      return
    }

    try {
      setCreateLoading(true)
      setError('')
      await priceAlertsAPI.createPriceAlert(newAlert)
      setShowCreateModal(false)
      setNewAlert({
        listing_id: '',
        target_price: '',
        notification_method: 'email',
        is_active: true
      })
      setSearchQuery('')
      setSearchResults([])
      fetchAlerts()
    } catch (err) {
      console.error('Error creating alert:', err)
      setError('Failed to create alert. Please try again.')
    } finally {
      setCreateLoading(false)
    }
  }

  const selectCar = (listing) => {
    setNewAlert(prev => ({ ...prev, listing_id: listing.id }))
    setSearchQuery(`${listing.make} ${listing.model} (${listing.year})`)
    setSearchResults([])
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Price Alerts</h1>
            <p className="text-gray-600 mt-2">Get notified when car prices drop</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Create Alert
          </button>
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
            <p className="text-gray-500">Loading your price alerts...</p>
          </div>
        )}

        {/* Alerts List */}
        {!loading && (
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 6v12a1.5 1.5 0 01-1.5 1.5h-15z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No price alerts yet</h3>
                <p className="text-gray-500 mb-4">
                  Create your first price alert to get notified when car prices drop.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Create Alert
                </button>
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {alert.listing?.make} {alert.listing?.model} ({alert.listing?.year})
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.is_active)}`}>
                            {alert.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <p className="font-medium text-gray-900">Current Price</p>
                            <p className="text-lg font-semibold text-orange-600">
                              {formatPrice(alert.listing?.price_per_day)}/day
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Target Price</p>
                            <p className="text-lg font-semibold text-green-600">
                              {formatPrice(alert.target_price)}/day
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Savings</p>
                            <p className="text-lg font-semibold text-blue-600">
                              {formatPrice(alert.listing?.price_per_day - alert.target_price)}/day
                            </p>
                          </div>
                        </div>

                        <div className="text-sm text-gray-500">
                          <p>Created on {formatDate(alert.created_at)} • Notifications via {alert.notification_method}</p>
                          <p>Location: {alert.listing?.location}</p>
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        {alert.listing?.picture_url ? (
                          <img
                            src={alert.listing.picture_url}
                            alt={`${alert.listing.make} ${alert.listing.model}`}
                            className="w-24 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => router.push(`/car/${alert.listing_id}`)}
                          className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                        >
                          View Car
                        </button>
                        <button
                          onClick={() => handleToggleAlert(alert.id, alert.is_active)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          {alert.is_active ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        disabled={deleteLoading === alert.id}
                        className="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50"
                      >
                        {deleteLoading === alert.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create Alert Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Create Price Alert</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateAlert} className="space-y-6">
              {/* Car Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search for a car
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      handleSearchCars(e.target.value)
                    }}
                    placeholder="Enter car make, model, or year..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  />
                  {searchLoading && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                    </div>
                  )}
                </div>
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((listing) => (
                      <button
                        key={listing.id}
                        type="button"
                        onClick={() => selectCar(listing)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          {listing.picture_url ? (
                            <img
                              src={listing.picture_url}
                              alt={`${listing.make} ${listing.model}`}
                              className="w-12 h-8 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {listing.make} {listing.model} ({listing.year})
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatPrice(listing.price_per_day)}/day • {listing.location}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Target Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Price (per day)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={newAlert.target_price}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, target_price: e.target.value }))}
                    placeholder="Enter target price"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              {/* Notification Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Method
                </label>
                <select
                  value={newAlert.notification_method}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, notification_method: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="both">Both Email & SMS</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading || !newAlert.listing_id || !newAlert.target_price}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {createLoading ? 'Creating...' : 'Create Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
