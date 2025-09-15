'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { bookingAPI, listingAPI } from '@/lib/api'
import Header from '../components/Header'
import Footer from '../components/Footer'

function BookingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingStep, setBookingStep] = useState(1)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    pickupDate: '',
    pickupTime: '10:00',
    returnDate: '',
    returnTime: '10:00',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    drivingLicense: '',
    message: ''
  })

  const carId = searchParams.get('carId')

  // Check authentication
  const checkAuth = () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/login?redirect=/booking?carId=' + carId)
      return false
    }
    return true
  }

  useEffect(() => {
    if (!checkAuth()) return

    if (carId) {
      setLoading(true)
      // Try to fetch real car data first, fallback to mock data
      listingAPI.getListing(carId)
        .then(carData => {
          setCar({
            id: carData.id,
            name: `${carData.make} ${carData.model} ${carData.year}`,
            image: carData.picture_url || '/api/placeholder/300/200',
            price: carData.price_per_day,
            location: carData.location,
            owner: 'Car Owner', // You might want to add owner info to the listing model
            rating: carData.rating || 4.8,
            reviewCount: 124 // You might want to add review count to the model
          })
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching car data:', error)
          // Fallback to mock data
          setCar({
            id: carId,
            name: 'Dacia Duster 2020',
            image: '/api/placeholder/300/200',
            price: 420,
            location: 'Agadir, Morocco',
            owner: 'Mirian I.',
            rating: 4.8,
            reviewCount: 124
          })
          setLoading(false)
        })
    }

    // Set default dates (today and tomorrow)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    setFormData(prev => ({
      ...prev,
      pickupDate: today.toISOString().split('T')[0],
      returnDate: tomorrow.toISOString().split('T')[0]
    }))
  }, [carId, router])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 1
    const pickup = new Date(formData.pickupDate)
    const returnDate = new Date(formData.returnDate)
    const diffTime = Math.abs(returnDate - pickup)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(1, diffDays)
  }

  const calculateTotal = () => {
    const days = calculateDays()
    const serviceFee = 25
    return (car?.price * days) + serviceFee
  }

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required')
      return false
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required')
      return false
    }
    if (!formData.drivingLicense.trim()) {
      setError('Driving license number is required')
      return false
    }
    if (!formData.pickupDate) {
      setError('Pickup date is required')
      return false
    }
    if (!formData.returnDate) {
      setError('Return date is required')
      return false
    }
    if (new Date(formData.returnDate) <= new Date(formData.pickupDate)) {
      setError('Return date must be after pickup date')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (bookingStep === 1) {
      if (!validateForm()) return
      setBookingStep(2)
    } else {
      // Final booking submission
      if (!checkAuth()) return

      try {
        setSubmitLoading(true)

        // Create booking data for the API
        const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}:00`)
        const returnDateTime = new Date(`${formData.returnDate}T${formData.returnTime}:00`)
        
        const bookingData = {
          listing: parseInt(carId),
          start_time: pickupDateTime.toISOString(),
          end_time: returnDateTime.toISOString(),
          price: calculateTotal(),
          status: 'pending'
        }

        const result = await bookingAPI.createBooking(bookingData)
        
        setSuccess('Booking request submitted successfully!')
        
        // Redirect to bookings page or success page after a delay
        setTimeout(() => {
          router.push('/bookings')
        }, 2000)

      } catch (error) {
        console.error('Booking submission error:', error)
        setError(error.message || 'Failed to submit booking request. Please try again.')
      } finally {
        setSubmitLoading(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h2>
            <p className="text-gray-600 mb-6">Unable to load booking information.</p>
            <button 
              onClick={() => router.push('/search')}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Back to Search
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <button onClick={() => router.push('/')} className="text-gray-700 hover:text-gray-800">
              Home
            </button>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <button onClick={() => router.push('/search')} className="text-gray-700 hover:text-gray-800">
              Cars in Morocco
            </button>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <button onClick={() => router.push(`/car/${carId}`)} className="text-gray-700 hover:text-gray-800">
              {car.name}
            </button>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900">Book Now</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${bookingStep >= 1 ? 'text-orange-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                bookingStep >= 1 ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-300'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Trip Details</span>
            </div>
            <div className={`h-0.5 w-16 ${bookingStep >= 2 ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${bookingStep >= 2 ? 'text-orange-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                bookingStep >= 2 ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-300'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                {bookingStep === 1 ? 'Trip Details' : 'Confirm Your Booking'}
              </h1>

              {error && (
                <div className="mb-6 rounded-md bg-red-50 p-4">
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

              {success && (
                <div className="mb-6 rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{success}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {bookingStep === 1 ? (
                  <div className="space-y-6">
                    {/* Dates and Times */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pickup & Return</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pickup Date
                          </label>
                          <input
                            type="date"
                            required
                            value={formData.pickupDate}
                            onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pickup Time
                          </label>
                          <input
                            type="time"
                            value={formData.pickupTime}
                            onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Return Date
                          </label>
                          <input
                            type="date"
                            required
                            value={formData.returnDate}
                            onChange={(e) => handleInputChange('returnDate', e.target.value)}
                            min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Return Time
                          </label>
                          <input
                            type="time"
                            value={formData.returnTime}
                            onChange={(e) => handleInputChange('returnTime', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Driving License Number *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.drivingLicense}
                            onChange={(e) => handleInputChange('drivingLicense', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message to Host (Optional)
                          </label>
                          <textarea
                            rows={4}
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            placeholder="Tell the host about your trip plans..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Confirmation Step */
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pickup:</span>
                          <span>{formData.pickupDate} at {formData.pickupTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Return:</span>
                          <span>{formData.returnDate} at {formData.returnTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span>{calculateDays()} day{calculateDays() > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Guest:</span>
                          <span>{formData.firstName} {formData.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span>{formData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span>{formData.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm">
                          <div className="font-medium text-blue-800">Next Steps</div>
                          <div className="text-blue-700 mt-1">
                            After submitting your request, the host will review and respond within 24 hours. 
                            You'll receive an email confirmation once approved.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  {bookingStep === 2 && (
                    <button
                      type="button"
                      onClick={() => setBookingStep(1)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="ml-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      bookingStep === 1 ? 'Continue' : 'Submit Request'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{car.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{car.rating} ({car.reviewCount})</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Host</span>
                    <span className="font-medium">{car.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{car.location}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">{calculateDays()} day{calculateDays() > 1 ? 's' : ''} rental</span>
                    <span className="font-medium">{car.price * calculateDays()} MAD</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Service fee</span>
                    <span className="font-medium">25 MAD</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold text-lg border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span>{calculateTotal()} MAD</span>
                  </div>
                </div>

                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-800">Free cancellation up to 48 hours before pickup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function Booking() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking form...</p>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <BookingContent />
    </Suspense>
  )
}

export function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  )
}
