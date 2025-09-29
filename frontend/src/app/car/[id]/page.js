'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

function CarDetailsContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showFullGallery, setShowFullGallery] = useState(false)
  const [searchDetails, setSearchDetails] = useState({
    location: '',
    pickupDate: '',
    returnDate: '',
    duration: 1
  })
  const [selectedDates, setSelectedDates] = useState({
    pickup: 'Wed, Aug 20',
    return: 'Thu, Aug 21'
  })

  // Mock car data - replace with actual API call
  const mockCarData = {
    id: 1,
    name: 'Dacia Duster 2020',
    images: [
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600',
      '/api/placeholder/800/600'
    ],
    price: 420,
    location: 'Agadir, Morocco',
    fullAddress: 'Near Avenue Mohammed V, 80000 Agadir, Morocco',
    transmission: 'Manual',
    fuel: 'Diesel',
    seats: 5,
    year: 2020,
    verified: true,
    rating: 4.8,
    reviewCount: 124,
    totalTrips: 89,
    responseTime: 'Usually responds within 2 hours',
    features: [
      'Air Conditioning',
      'GPS Navigation',
      'Bluetooth',
      'USB Ports',
      'Aux Input',
      'Child Seat Anchors'
    ],
    restrictions: [
      'No smoking',
      'No pets',
      'Must return with same fuel level',
      'Late return fee: 50 MAD/hour'
    ],
    owner: {
      name: 'Mirian I.',
      avatar: 'M',
      memberSince: 'June 2019',
      rating: 5.0,
      reviewCount: 47,
      responseRate: '100%',
      languages: ['Arabic', 'French', 'English']
    },
    availability: {
      advanceNotice: '2 hours',
      maxTripLength: '30 days',
      minTripLength: '2 hours'
    },
    insurance: {
      included: true,
      coverage: 'Comprehensive insurance by Allianz',
      deductible: '1,500 MAD'
    },
    mileage: {
      included: 200,
      overage: '2 MAD/km'
    },
    reviews: [
      {
        id: 1,
        user: 'Zakaria B.',
        rating: 5,
        date: 'Aug 04, 2024',
        comment: 'A very warm welcome with a sunny smile. The car was clean and well-maintained. Highly recommend!'
      },
      {
        id: 2,
        user: 'Sarah M.',
        rating: 5,
        date: 'Jul 28, 2024',
        comment: 'Perfect car for our family trip. Mirian was very responsive and helpful throughout the rental.'
      },
      {
        id: 3,
        user: 'Ahmed K.',
        rating: 4,
        date: 'Jul 15, 2024',
        comment: 'Good car, clean and comfortable. Pickup was smooth and on time.'
      }
    ]
  }

  // Capture search parameters from URL
  useEffect(() => {
    const location = searchParams.get('location') || ''
    const pickupDate = searchParams.get('pickupDate') || ''
    const returnDate = searchParams.get('returnDate') || ''
    
    let duration = 1
    let formattedPickup = 'Wed, Aug 20'
    let formattedReturn = 'Thu, Aug 21'
    
    // Calculate duration and format dates if provided
    if (pickupDate && returnDate) {
      const pickup = new Date(pickupDate)
      const returnD = new Date(returnDate)
      const diffTime = Math.abs(returnD - pickup)
      duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1
      
      formattedPickup = pickup.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
      formattedReturn = returnD.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
    }
    
    setSearchDetails({
      location,
      pickupDate,
      returnDate,
      duration
    })
    
    setSelectedDates({
      pickup: formattedPickup,
      return: formattedReturn
    })
  }, [searchParams])

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setCar(mockCarData)
      setLoading(false)
    }, 1000)
  }, [params.id])

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === car.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? car.images.length - 1 : prev - 1
    )
  }

  const handleBooking = () => {
    // Build URL with all search parameters for booking page
    const params = new URLSearchParams()
    params.set('carId', car.id)
    
    // Pass through search parameters
    if (searchDetails.location) params.set('location', searchDetails.location)
    if (searchDetails.pickupDate) params.set('pickupDate', searchDetails.pickupDate)
    if (searchDetails.returnDate) params.set('returnDate', searchDetails.returnDate)
    params.set('duration', searchDetails.duration.toString())
    params.set('totalPrice', ((car.price * searchDetails.duration) + 25).toString())
    
    router.push(`/booking?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading car details...</p>
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
            <p className="text-gray-600 mb-6">The car you're looking for doesn't exist or has been removed.</p>
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
            <button onClick={() => router.push('/')} className="text-gray-500 hover:text-gray-700">
              Home
            </button>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <button onClick={() => router.push('/search')} className="text-gray-500 hover:text-gray-700">
              Cars in Morocco
            </button>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900">{car.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Search Summary */}
            {searchDetails.location && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-blue-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="text-blue-800">{searchDetails.location}</span>
                    </div>
                    {searchDetails.pickupDate && (
                      <>
                        <span className="text-blue-400">•</span>
                        <span className="text-blue-800">{selectedDates.pickup} - {selectedDates.return}</span>
                        <span className="text-blue-400">•</span>
                        <span className="text-blue-800">{searchDetails.duration} {searchDetails.duration === 1 ? 'day' : 'days'}</span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      const params = new URLSearchParams()
                      if (searchDetails.location) params.set('location', searchDetails.location)
                      if (searchDetails.pickupDate) params.set('pickupDate', searchDetails.pickupDate)
                      if (searchDetails.returnDate) params.set('returnDate', searchDetails.returnDate)
                      router.push(`/search?${params.toString()}`)
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Modify search
                  </button>
                </div>
              </div>
            )}

            {/* Car Title & Quick Info */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">{car.rating}</span>
                  <span className="ml-1">({car.reviewCount} reviews)</span>
                </div>
                <span>•</span>
                <span>{car.totalTrips} trips</span>
                <span>•</span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {car.location}
                </span>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative">
                <div className="aspect-w-16 aspect-h-10 rounded-xl overflow-hidden">
                  <img
                    src={car.images[currentImageIndex]}
                    alt={`${car.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-96 object-cover"
                  />
                </div>
                
                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {car.images.length}
                </div>

                {/* View All Photos Button */}
                <button
                  onClick={() => setShowFullGallery(true)}
                  className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors"
                >
                  View all photos
                </button>
              </div>

              {/* Thumbnail Strip */}
              <div className="mt-4 grid grid-cols-6 gap-2">
                {car.images.slice(0, 6).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden ${
                      currentImageIndex === index ? 'ring-2 ring-orange-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${car.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Car Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Specifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Car details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Make & Model</span>
                    <span className="font-medium">{car.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year</span>
                    <span className="font-medium">{car.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats</span>
                    <span className="font-medium">{car.seats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transmission</span>
                    <span className="font-medium">{car.transmission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuel type</span>
                    <span className="font-medium">{car.fuel}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                <div className="grid grid-cols-1 gap-2">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-white rounded-xl border p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hosted by {car.owner.name}</h3>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {car.owner.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium">{car.owner.rating}</span>
                      <span className="text-gray-500 ml-1">({car.owner.reviewCount} reviews)</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{car.owner.responseRate} response rate</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    Member since {car.owner.memberSince}
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    {car.responseTime}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {car.owner.languages.map((lang, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup Location */}
            <div className="bg-white rounded-xl border p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pickup & return location</h3>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">{car.fullAddress}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Exact location will be provided after booking confirmation
                  </p>
                </div>
              </div>
            </div>

            {/* Restrictions */}
            <div className="bg-white rounded-xl border p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Car rules & restrictions</h3>
              <div className="space-y-2">
                {car.restrictions.map((restriction, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-sm text-gray-700">{restriction}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Reviews ({car.reviewCount})
                </h3>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium text-gray-900">{car.rating}</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {car.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {review.user.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{review.user}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-3 text-center text-orange-600 font-medium border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
                Show all {car.reviewCount} reviews
              </button>
            </div>
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl border shadow-lg p-6">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900">{car.price} MAD</div>
                  <div className="text-gray-600">per day</div>
                </div>

                {/* Date Picker */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Pickup</label>
                      <div className="text-sm font-medium">{selectedDates.pickup}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Return</label>
                      <div className="text-sm font-medium">{selectedDates.return}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const params = new URLSearchParams()
                      if (searchDetails.location) params.set('location', searchDetails.location)
                      if (searchDetails.pickupDate) params.set('pickupDate', searchDetails.pickupDate)
                      if (searchDetails.returnDate) params.set('returnDate', searchDetails.returnDate)
                      router.push(`/search?${params.toString()}`)
                    }}
                    className="w-full mt-3 py-2 text-sm text-orange-600 font-medium border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    Change dates
                  </button>
                </div>

                {/* Trip Summary */}
                <div className="border-t border-b border-gray-200 py-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">{searchDetails.duration} {searchDetails.duration === 1 ? 'day' : 'days'} rental</span>
                    <span className="font-medium">{(car.price * searchDetails.duration).toLocaleString()} MAD</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Service fee</span>
                    <span className="font-medium">25 MAD</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total</span>
                    <span>{((car.price * searchDetails.duration) + 25).toLocaleString()} MAD</span>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={handleBooking}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-lg transition-colors mb-4"
                >
                  Book now
                </button>

                {/* Insurance Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <div className="font-medium text-green-800">Protected by insurance</div>
                      <div className="text-sm text-green-700">{car.insurance.coverage}</div>
                      <div className="text-xs text-green-600 mt-1">Deductible: {car.insurance.deductible}</div>
                    </div>
                  </div>
                </div>

                {/* What's Included */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">What's included</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{car.mileage.included} km included</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Comprehensive insurance</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>24/7 roadside assistance</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Free cancellation (48h)</span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Extra km: {car.mileage.overage}</div>
                    <div>Advance notice: {car.availability.advanceNotice}</div>
                    <div>Min trip: {car.availability.minTripLength}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Gallery Modal */}
      {showFullGallery && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setShowFullGallery(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            <img
              src={car.images[currentImageIndex]}
              alt={`${car.name} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {car.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default function CarDetails() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading car details...</p>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <CarDetailsContent />
    </Suspense>
  )
}
