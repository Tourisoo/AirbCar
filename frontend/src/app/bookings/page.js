'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { bookingsAPI } from '@/lib/api'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function BookingsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all') // all, upcoming, completed, cancelled
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showBookingDetails, setShowBookingDetails] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }
    
    if (user) {
      fetchBookings()
    }
  }, [user, authLoading, router])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await bookingsAPI.getBookings()
      setBookings(data)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Failed to load bookings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      setCancelLoading(true)
      await bookingAPI.cancelBooking(bookingId)
      // Update the booking status in the local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ))
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(prev => ({ ...prev, status: 'cancelled' }))
      }
    } catch (err) {
      console.error('Error cancelling booking:', err)
      setError('Failed to cancel booking. Please try again.')
    } finally {
      setCancelLoading(false)
    }
  }

  const getFilteredBookings = () => {
    const now = new Date()
    
    switch (filter) {
      case 'upcoming':
        return bookings.filter(booking => 
          new Date(booking.start_time) > now && booking.status !== 'cancelled'
        )
      case 'completed':
        return bookings.filter(booking => 
          new Date(booking.end_time) < now && booking.status === 'completed'
        )
      case 'cancelled':
        return bookings.filter(booking => booking.status === 'cancelled')
      default:
        return bookings
    }
  }

  // Count functions for tabs (independent of current filter)
  const getUpcomingCount = () => {
    const now = new Date()
    return bookings.filter(booking => 
      new Date(booking.start_time) > now && booking.status !== 'cancelled'
    ).length
  }

  const getCompletedCount = () => {
    return bookings.filter(booking => booking.status === 'completed').length
  }

  const getCancelledCount = () => {
    return bookings.filter(booking => booking.status === 'cancelled').length
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffInMs = end - start
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
    return diffInDays
  }

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking)
    setShowBookingDetails(true)
    document.body.style.overflow = 'hidden'
  }

  const closeBookingDetails = () => {
    setSelectedBooking(null)
    setShowBookingDetails(false)
    document.body.style.overflow = 'unset'
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
          <h1 className="text-3xl font-bold text-gray-900">Your Bookings</h1>
          <p className="text-gray-600 mt-2">Manage and track your car rental bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex space-x-0 overflow-x-auto">
            {[
              { key: 'all', label: 'All Bookings', count: bookings.length },
              { key: 'upcoming', label: 'Upcoming', count: getUpcomingCount() },
              { key: 'completed', label: 'Completed', count: getCompletedCount() },
              { key: 'cancelled', label: 'Cancelled', count: getCancelledCount() }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  filter === tab.key
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  filter === tab.key ? 'bg-orange-200' : 'bg-gray-200'
                }`}>
                  {filter === tab.key ? getFilteredBookings().length : tab.count}
                </span>
              </button>
            ))}
          </div>
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
            <p className="text-gray-500">Loading your bookings...</p>
          </div>
        )}

        {/* Bookings List */}
        {!loading && (
          <div className="space-y-4">
            {getFilteredBookings().length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-500 mb-4">
                  {filter === 'all' 
                    ? "You haven't made any bookings yet." 
                    : `No ${filter} bookings to show.`
                  }
                </p>
                <button
                  onClick={() => router.push('/search')}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Find a Car
                </button>
              </div>
            ) : (
              getFilteredBookings().map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.listing?.make} {booking.listing?.model} ({booking.listing?.year})
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <p className="font-medium text-gray-900">Pick-up</p>
                            <p>{formatDate(booking.start_time)}</p>
                            <p>{booking.listing?.location}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Drop-off</p>
                            <p>{formatDate(booking.end_time)}</p>
                            <p>{booking.listing?.location}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Duration</p>
                            <p>{calculateDuration(booking.start_time, booking.end_time)} day(s)</p>
                            <p className="font-semibold text-orange-600">${booking.price}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        {booking.listing?.picture_url ? (
                          <img
                            src={booking.listing.picture_url}
                            alt={`${booking.listing.make} ${booking.listing.model}`}
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
                      <div className="text-sm text-gray-500">
                        Booking ID: #{booking.id} • Booked on {new Date(booking.date).toLocaleDateString()}
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => openBookingDetails(booking)}
                          className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                        >
                          View Details
                        </button>
                        
                        {booking.status === 'confirmed' && new Date(booking.start_time) > new Date() && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancelLoading}
                            className="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50"
                          >
                            {cancelLoading ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showBookingDetails && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Booking Details</h3>
              <button
                onClick={closeBookingDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Car Details */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="font-medium text-gray-900 mb-4">Vehicle Information</h4>
                <div className="flex items-start space-x-4">
                  {selectedBooking.listing?.picture_url ? (
                    <img
                      src={selectedBooking.listing.picture_url}
                      alt={`${selectedBooking.listing.make} ${selectedBooking.listing.model}`}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <h5 className="text-lg font-semibold text-gray-900">
                      {selectedBooking.listing?.make} {selectedBooking.listing?.model} ({selectedBooking.listing?.year})
                    </h5>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Transmission:</span> {selectedBooking.listing?.transmission}</p>
                      <p><span className="font-medium">Fuel Type:</span> {selectedBooking.listing?.fuel_type}</p>
                      <p><span className="font-medium">Seats:</span> {selectedBooking.listing?.seating_capacity}</p>
                      <p><span className="font-medium">Location:</span> {selectedBooking.listing?.location}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Booking Details */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="font-medium text-gray-900 mb-4">Booking Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Booking ID</p>
                    <p className="text-gray-600">#{selectedBooking.id}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Pick-up Date & Time</p>
                    <p className="text-gray-600">{formatDate(selectedBooking.start_time)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Drop-off Date & Time</p>
                    <p className="text-gray-600">{formatDate(selectedBooking.end_time)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Duration</p>
                    <p className="text-gray-600">{calculateDuration(selectedBooking.start_time, selectedBooking.end_time)} day(s)</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Total Price</p>
                    <p className="text-lg font-semibold text-orange-600">${selectedBooking.price}</p>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeBookingDetails}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedBooking.status === 'confirmed' && new Date(selectedBooking.start_time) > new Date() && (
                  <button
                    onClick={() => {
                      handleCancelBooking(selectedBooking.id)
                      closeBookingDetails()
                    }}
                    disabled={cancelLoading}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {cancelLoading ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
