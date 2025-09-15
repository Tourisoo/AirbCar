'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '../components/Header'
import Footer from '../components/Footer'

function BookingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingStep, setBookingStep] = useState(1)
  const [formData, setFormData] = useState({
    pickupDate: 'Wed, Aug 20, 2024',
    pickupTime: '01:30 PM',
    returnDate: 'Thu, Aug 21, 2024',
    returnTime: '01:30 PM',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    drivingLicense: '',
    message: ''
  })

  const carId = searchParams.get('carId')

  // Mock car data - same as details page
  const mockCarData = {
    id: 1,
    name: 'Dacia Duster 2020',
    image: '/api/placeholder/300/200',
    price: 420,
    location: 'Agadir, Morocco',
    owner: 'Mirian I.',
    rating: 4.8,
    reviewCount: 124
  }

  useEffect(() => {
    if (carId) {
      setLoading(true)
      setTimeout(() => {
        setCar(mockCarData)
        setLoading(false)
      }, 1000)
    }
  }, [carId])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (bookingStep === 1) {
      setBookingStep(2)
    } else {
      // Handle final booking submission
      alert('Booking request submitted successfully!')
      router.push('/search')
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
                            type="text"
                            value={formData.pickupDate}
                            onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pickup Time
                          </label>
                          <input
                            type="text"
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
                            type="text"
                            value={formData.returnDate}
                            onChange={(e) => handleInputChange('returnDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Return Time
                          </label>
                          <input
                            type="text"
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
                    className="ml-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                  >
                    {bookingStep === 1 ? 'Continue' : 'Submit Request'}
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
                    <span className="text-gray-600">1 day rental</span>
                    <span className="font-medium">{car.price} MAD</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Service fee</span>
                    <span className="font-medium">25 MAD</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold text-lg border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span>{car.price + 25} MAD</span>
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
