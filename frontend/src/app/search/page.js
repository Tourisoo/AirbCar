'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    transmission: '',
    fuelType: '',
    seats: '',
    verified: false
  })
  const [sortBy, setSortBy] = useState('relevance')
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCar, setSelectedCar] = useState(null)
  const [showCarModal, setShowCarModal] = useState(false)

  // Mock data - replace with actual API call
  const mockCars = [
    {
      id: 1,
      name: 'Dacia Duster 2020',
      image: '/api/placeholder/300/200',
      price: 420,
      location: 'Agadir',
      transmission: 'Manual',
      fuel: 'Diesel',
      seats: 5,
      verified: true,
      rating: 4.8,
      reviews: 124,
      features: ['Air Conditioning', 'GPS', 'Bluetooth']
    },
    {
      id: 2,
      name: 'Vauxhall Corsa',
      image: '/api/placeholder/300/200',
      price: 600,
      location: 'Agadir',
      transmission: 'Manual',
      fuel: 'Diesel',
      seats: 5,
      verified: true,
      rating: 4.6,
      reviews: 89,
      features: ['Air Conditioning', 'GPS', 'USB Port']
    },
    {
      id: 3,
      name: 'Mercedes E Class',
      image: '/api/placeholder/300/200',
      price: 550,
      location: 'Agadir',
      transmission: 'Manual',
      fuel: 'Diesel',
      seats: 5,
      verified: true,
      rating: 4.9,
      reviews: 156,
      features: ['Air Conditioning', 'GPS', 'Leather Seats', 'Premium Audio']
    },
    {
      id: 4,
      name: 'Toyota Aygo',
      image: '/api/placeholder/300/200',
      price: 380,
      location: 'Agadir',
      transmission: 'Manual',
      fuel: 'Petrol',
      seats: 4,
      verified: false,
      rating: 4.3,
      reviews: 67,
      features: ['Air Conditioning', 'Bluetooth']
    },
    {
      id: 5,
      name: 'BMW X3',
      image: '/api/placeholder/300/200',
      price: 850,
      location: 'Casablanca',
      transmission: 'Automatic',
      fuel: 'Diesel',
      seats: 5,
      verified: true,
      rating: 4.7,
      reviews: 203,
      features: ['Air Conditioning', 'GPS', 'Leather Seats', 'Sunroof']
    },
    {
      id: 6,
      name: 'Renault Clio',
      image: '/api/placeholder/300/200',
      price: 320,
      location: 'Marrakesh',
      transmission: 'Manual',
      fuel: 'Petrol',
      seats: 5,
      verified: true,
      rating: 4.4,
      reviews: 92,
      features: ['Air Conditioning', 'GPS']
    }
  ]

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setCars(mockCars)
      setFilteredCars(mockCars)
      setLoading(false)
    }, 1000)
  }, []) // Empty dependency array is correct here since mockCars is static

  useEffect(() => {
    let filtered = cars.filter(car => {
      return (
        car.price >= filters.priceRange[0] &&
        car.price <= filters.priceRange[1] &&
        (filters.transmission === '' || car.transmission === filters.transmission) &&
        (filters.fuelType === '' || car.fuel === filters.fuelType) &&
        (filters.seats === '' || car.seats.toString() === filters.seats) &&
        (!filters.verified || car.verified)
      )
    })

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      default:
        // Keep original order for relevance
        break
    }

    setFilteredCars(filtered)
  }, [cars, filters, sortBy])

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      transmission: '',
      fuelType: '',
      seats: '',
      verified: false
    })
  }

  const openCarModal = (car) => {
    setSelectedCar(car)
    setShowCarModal(true)
  }

  const closeCarModal = () => {
    setShowCarModal(false)
    setSelectedCar(null)
  }

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showCarModal) {
        closeCarModal()
      }
    }
    
    if (showCarModal) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [showCarModal])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for the best deals...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Search Summary */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
              <p className="text-gray-600 mt-1">
                Showing {filteredCars.length} cars available in Morocco
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Price Range (MAD/day)
                </label>
                <div className="px-3">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>0 MAD</span>
                    <span>{filters.priceRange[1]} MAD</span>
                  </div>
                </div>
              </div>

              {/* Transmission */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Transmission
                </label>
                <div className="space-y-2">
                  {['Manual', 'Automatic'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="transmission"
                        value={type}
                        checked={filters.transmission === type}
                        onChange={(e) => handleFilterChange('transmission', e.target.value)}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="transmission"
                      value=""
                      checked={filters.transmission === ''}
                      onChange={(e) => handleFilterChange('transmission', e.target.value)}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Any</span>
                  </label>
                </div>
              </div>

              {/* Fuel Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Fuel Type
                </label>
                <div className="space-y-2">
                  {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(fuel => (
                    <label key={fuel} className="flex items-center">
                      <input
                        type="radio"
                        name="fuelType"
                        value={fuel}
                        checked={filters.fuelType === fuel}
                        onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{fuel}</span>
                    </label>
                  ))}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="fuelType"
                      value=""
                      checked={filters.fuelType === ''}
                      onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Any</span>
                  </label>
                </div>
              </div>

              {/* Seats */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Seats
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['2', '4', '5', '7', '8+'].map(seats => (
                    <button
                      key={seats}
                      onClick={() => handleFilterChange('seats', filters.seats === seats ? '' : seats)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        filters.seats === seats
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500'
                      }`}
                    >
                      {seats}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Agency */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.verified}
                    onChange={(e) => handleFilterChange('verified', e.target.checked)}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Verified agencies only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            {filteredCars.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 01-8 8 8 8 0 01-8-8 8 8 0 018-8c.28 0 .556.014.827.042l2.651-9.529z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
                <button
                  onClick={clearFilters}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCars.map((car) => (
                  <div key={car.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
                    {/* Car Image */}
                    <div className="relative">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-48 object-cover"
                      />
                      {car.verified && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Verified Agency
                          </span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Car Details */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{car.name}</h3>
                          <p className="text-gray-600 text-sm flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {car.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-orange-500">{car.price} MAD</div>
                          <div className="text-sm text-gray-500">per day</div>
                        </div>
                      </div>

                      {/* Car Features */}
                      <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          {car.seats} seats
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          </svg>
                          {car.transmission}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          {car.fuel}
                        </span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(car.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {car.rating} ({car.reviews} reviews)
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => openCarModal(car)}
                          className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                        >
                          View Details
                        </button>
                        <button className="px-4 py-3 border border-gray-300 rounded-lg hover:border-orange-500 hover:text-orange-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredCars.length > 0 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">1</button>
                  <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">2</button>
                  <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">3</button>
                  <span className="px-3 py-2 text-gray-500">...</span>
                  <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">10</button>
                  <button className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Car Details Modal */}
      {showCarModal && selectedCar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeCarModal}
        >
          <div 
            className="bg-white rounded-xl max-w-7xl w-full max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
              <button
                onClick={closeCarModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                {/* Left Column - Car Details (3/4 width) */}
                <div className="lg:col-span-3 p-6">
                  
                  {/* Image Gallery */}
                  {/* Gallery Section - Horizontal Layout inspired by reference images */}
                  <div className="mb-8">
                    <div className="flex gap-4">
                      {/* Main large image */}
                      <div className="flex-1">
                        <img
                          src={selectedCar.image}
                          alt={selectedCar.name}
                          className="w-full h-96 object-cover rounded-lg"
                        />
                      </div>
                      {/* Side images grid */}
                      <div className="w-80 grid grid-cols-2 gap-3">
                        <img
                          src={selectedCar.image}
                          alt={`${selectedCar.name} view 2`}
                          className="w-full h-[185px] object-cover rounded-lg"
                        />
                        <img
                          src={selectedCar.image}
                          alt={`${selectedCar.name} view 3`}
                          className="w-full h-[185px] object-cover rounded-lg"
                        />
                        <img
                          src={selectedCar.image}
                          alt={`${selectedCar.name} view 4`}
                          className="w-full h-[185px] object-cover rounded-lg"
                        />
                        <img
                          src={selectedCar.image}
                          alt={`${selectedCar.name} view 5`}
                          className="w-full h-[185px] object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>                  {/* Car Details Header */}
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedCar.name}</h1>
                    <div className="flex items-center space-x-6 text-gray-600 mb-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        3.35 km • 2024 • {selectedCar.seats} seats
                      </span>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-900 mr-2">{selectedCar.rating}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${i < Math.floor(selectedCar.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <span className="text-orange-500 font-medium">{selectedCar.reviews} Reviews</span>
                    </div>
                  </div>

                  {/* Additional Cards Section - Orange theme matching global design */}
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
                    {/* Meet the owner card - Full width with orange theme */}
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Meet the owner to get the keys</h3>
                          <p className="text-sm text-gray-600">Arrange to pick up and return the car to the owner in person</p>
                        </div>
                        <div className="ml-auto">
                          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                            See how it works →
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Pickup & return location - Full width */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pickup & return location</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Near</p>
                          <p className="text-base font-medium text-gray-900 mb-3">
                            Calle Manuel Altolaguirre, Málaga, Maroc
                          </p>
                          <p className="text-sm text-gray-600">Contact the owner to arrange the exact pickup location</p>
                        </div>
                        <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">Map placeholder</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Owner Section - Enhanced to match reference */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Owner</h2>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white font-bold text-lg">SD</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Samuel D.</h3>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className="w-4 h-4 text-yellow-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="ml-2 text-sm text-gray-600 font-medium">5.0 (4)</span>
                            </div>
                          </div>
                        </div>
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                          Contact Owner
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Technical Features - Enhanced layout with better spacing */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Technical features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-2">Fuel type</div>
                        <div className="font-semibold text-gray-900 text-lg">{selectedCar.fuel}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-2">Transmission</div>
                        <div className="font-semibold text-gray-900 text-lg">{selectedCar.transmission}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-2">Mileage</div>
                        <div className="font-semibold text-gray-900 text-lg">15-50,000 km</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-2">Seats</div>
                        <div className="font-semibold text-gray-900 text-lg">{selectedCar.seats} seats</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-2">Year</div>
                        <div className="font-semibold text-gray-900 text-lg">2024</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-2">Engine</div>
                        <div className="font-semibold text-gray-900 text-lg">1.6L</div>
                      </div>
                    </div>
                  </div>

                  {/* Options & Accessories - Enhanced with better visual hierarchy */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Options & accessories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedCar.features.map((feature, index) => (
                        <div key={index} className="flex items-center py-2">
                          <svg className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                      
                      {/* Additional common features */}
                      <div className="flex items-center py-2">
                        <svg className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 font-medium">Power steering</span>
                      </div>
                      <div className="flex items-center py-2">
                        <svg className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 font-medium">Central locking</span>
                      </div>
                      <div className="flex items-center py-2">
                        <svg className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 font-medium">Electric windows</span>
                      </div>
                      <div className="flex items-center py-2">
                        <svg className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 font-medium">Anti-lock braking system (ABS)</span>
                      </div>
                    </div>
                  </div>

                  {/* Reviews Section - Enhanced with better layout */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
                      <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                        See the 4 reviews
                      </button>
                    </div>
                    
                    <div className="flex items-center mb-6">
                      <div className="text-4xl font-bold text-gray-900 mr-4">{selectedCar.rating}</div>
                      <div>
                        <div className="flex items-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${i < Math.floor(selectedCar.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">{selectedCar.reviews} reviews</div>
                      </div>
                    </div>
                    
                    {/* Sample Reviews */}
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-orange-600 font-semibold text-sm">OB</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Omar B.</div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className="w-4 h-4 text-yellow-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="ml-2 text-sm text-gray-600">• 3 day rental in July 2024</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2 font-medium">Car in good condition. Good value for money</p>
                        <p className="text-gray-600 text-sm">
                          Quick response from the very friendly owner, the car was really clean and delivered as asked. We 
                          thank Samuel for this opportunity. Really great service!
                        </p>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-orange-600 font-semibold text-sm">LF</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Lucas F.</div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className="w-4 h-4 text-yellow-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="ml-2 text-sm text-gray-600">• 5 day rental in May 2024</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2 font-medium">Excellent experience with great service</p>
                        <p className="text-gray-600 text-sm">
                          Todo excelente con Samuel. Excelente lo recomiendo, buena gente! Perfect rental experience 
                          with responsive communication and clean vehicle.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Insurance and Protection - Enhanced layout with proper sections */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Insurance and protection</h2>
                    
                    {/* Main insurance info card */}
                    <div className="bg-green-50 rounded-lg p-6 mb-6 border border-green-200">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">Insurance is always included when you rent on Getaround</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Insurance is provided by our partner Allianz. Additional insurance options are available at 
                            booking and until the start of rental.
                          </p>
                        </div>
                      </div>
                      
                      {/* Roadside assistance info */}
                      <div className="flex items-start mt-4 pt-4 border-t border-green-200">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">All cars are covered by roadside assistance</h4>
                          <p className="text-sm text-gray-600">
                            In the event of a breakdown or incident, our 24/7 roadside assistance takes care of you and 
                            your passengers and transports you to your destination or home.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">What the insurance covers</h4>
                        <ul className="space-y-3">
                          <li className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Accidents
                          </li>
                          <li className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Theft and attempted theft
                          </li>
                          <li className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Arson
                          </li>
                          <li className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Glass breakage
                          </li>
                          <li className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Liability insurance
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Insurance conditions</h4>
                        <div className="space-y-3 text-sm text-gray-700">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            21 years old
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 01-8 8 8 8 0 01-8-8 8 8 0 018-8c.28 0 .556.014.827.042l2.651-9.529z" />
                            </svg>
                            2 years of driving history
                          </div>
                          <div className="flex items-start">
                            <svg className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <div>
                              <div>Stay in the following countries:</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Andorra, Austria, Belgium, Czech Republic, Denmark, Finland...
                                <button className="text-orange-500 hover:text-orange-600 ml-1">Learn more</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional section for rental advantages */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Les avantages à chaque location</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-orange-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <div>
                            <div className="font-medium text-gray-900">Extend your rental easily</div>
                            <div className="text-sm text-gray-600">Adjust start and return times in just a few clicks.</div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-orange-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <div className="font-medium text-gray-900">30-minute margin for late returns</div>
                            <div className="text-sm text-gray-600">Avoid stress when the unexpected happens thanks to a little extra time.</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Learn more button */}
                    <div className="mt-6">
                      <button className="text-orange-500 hover:text-orange-600 text-sm font-medium border border-orange-300 hover:border-orange-500 px-4 py-2 rounded-lg transition-colors">
                        Learn more
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column - Booking Sidebar (1/4 width) - Orange theme design */}
                <div className="lg:col-span-1 bg-white p-6 border border-gray-200 rounded-lg">
                  <div className="sticky top-6">
                    {/* Price section */}
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-gray-900 mb-1">{selectedCar.price} MAD</div>
                      <div className="text-gray-600">For 1 day ⓘ</div>
                    </div>

                    {/* Booking button - Orange gradient to match theme */}
                    <button 
                      onClick={() => {
                        closeCarModal()
                        router.push(`/booking?carId=${selectedCar.id}`)
                      }}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold mb-4 shadow-lg"
                    >
                      Send booking request
                    </button>

                    {/* Free cancellation */}
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center text-sm text-green-600 mb-2">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Free cancellation
                      </div>
                      <p className="text-xs text-gray-500">Up to 1 hour after payment</p>
                    </div>

                    {/* Included in price section */}
                    <div className="border-t border-gray-200 pt-6">
                      <h5 className="font-semibold text-gray-900 mb-4">Included in the price</h5>
                      <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start">
                          <svg className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <div>
                            <div className="font-medium">200 km included</div>
                            <div className="text-xs text-orange-500 cursor-pointer hover:text-orange-600">Add extra kilometres</div>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <div className="font-medium">Comprehensive vehicle and passenger insurance provided by Allianz</div>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <div className="font-medium">24/7 roadside assistance</div>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <div className="font-medium">Free secondary drivers</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
