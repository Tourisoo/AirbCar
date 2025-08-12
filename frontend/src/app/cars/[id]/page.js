'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function CarDetails() {
  const params = useParams()
  const router = useRouter()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedExtras, setSelectedExtras] = useState([])
  const [selectedInsurance, setSelectedInsurance] = useState('basic')

  // Mock car data - replace with actual API call
  const mockCar = {
    id: 1,
    name: 'Dacia Duster 2020',
    brand: 'Dacia',
    model: 'Duster',
    year: 2020,
    images: [
      '/api/placeholder/600/400',
      '/api/placeholder/600/400',
      '/api/placeholder/600/400',
      '/api/placeholder/600/400'
    ],
    price: 420,
    location: 'Agadir',
    transmission: 'Manual',
    fuel: 'Diesel',
    seats: 5,
    doors: 4,
    verified: true,
    rating: 4.8,
    reviews: 124,
    agency: {
      name: 'Premium Car Rental',
      verified: true,
      rating: 4.9
    },
    features: [
      'Air Conditioning',
      'GPS Navigation',
      'Bluetooth',
      'USB Port',
      'Power Steering',
      'Electric Windows',
      'Central Locking',
      'ABS Brakes'
    ],
    description: 'The Dacia Duster is a reliable and spacious SUV perfect for exploring Morocco. With its robust build and excellent fuel efficiency, it\'s ideal for both city driving and off-road adventures.',
    specs: {
      engine: '1.5L Diesel',
      horsepower: '110 HP',
      consumption: '5.2L/100km',
      tank: '50L',
      luggage: '445L'
    },
    extras: [
      {
        id: 1,
        name: 'GPS Navigation',
        price: 25,
        included: true,
        description: 'Built-in GPS with Morocco maps'
      },
      {
        id: 2,
        name: 'Child Seat',
        price: 30,
        included: false,
        description: 'Safety child seat (3-12 years)'
      },
      {
        id: 3,
        name: 'Additional Driver',
        price: 40,
        included: false,
        description: 'Allow additional driver (license required)'
      },
      {
        id: 4,
        name: 'Wi-Fi Hotspot',
        price: 35,
        included: false,
        description: 'Mobile internet in the car'
      }
    ],
    insurance: [
      {
        type: 'basic',
        name: 'Basic Insurance',
        price: 50,
        coverage: ['Third party liability', 'Basic theft protection']
      },
      {
        type: 'comprehensive',
        name: 'Comprehensive Insurance',
        price: 120,
        coverage: ['Full damage coverage', 'Theft protection', 'Glass & tires', 'Roadside assistance']
      }
    ]
  }

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setCar(mockCar)
      setLoading(false)
    }, 1000)
  }, [params.id])

  const handleExtraToggle = (extraId) => {
    setSelectedExtras(prev => 
      prev.includes(extraId) 
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    )
  }

  const calculateTotal = () => {
    if (!car) return 0
    
    const basePrice = car.price
    const extrasPrice = car.extras
      .filter(extra => selectedExtras.includes(extra.id))
      .reduce((sum, extra) => sum + extra.price, 0)
    const insurancePrice = car.insurance.find(ins => ins.type === selectedInsurance)?.price || 0
    
    return basePrice + extrasPrice + insurancePrice
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Car not found</h1>
          <button
            onClick={() => router.back()}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button onClick={() => router.push('/')} className="hover:text-orange-500">Home</button>
          <span>›</span>
          <button onClick={() => router.push('/search')} className="hover:text-orange-500">Search Results</button>
          <span>›</span>
          <span className="text-gray-900">{car.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={car.images[selectedImage]}
                  alt={car.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {car.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${car.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Car Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.name}</h1>
                  <p className="text-gray-600 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {car.location}
                  </p>
                </div>
                {car.verified && (
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified Agency
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(car.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-600">
                    {car.rating} ({car.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About this car</h3>
                <p className="text-gray-600 leading-relaxed">{car.description}</p>
              </div>

              {/* Specifications */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">👥</div>
                    <div className="text-sm text-gray-600">Seats</div>
                    <div className="font-semibold">{car.seats}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">🚪</div>
                    <div className="text-sm text-gray-600">Doors</div>
                    <div className="font-semibold">{car.doors}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">⚙️</div>
                    <div className="text-sm text-gray-600">Transmission</div>
                    <div className="font-semibold">{car.transmission}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">⛽</div>
                    <div className="text-sm text-gray-600">Fuel</div>
                    <div className="font-semibold">{car.fuel}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">🏃</div>
                    <div className="text-sm text-gray-600">Engine</div>
                    <div className="font-semibold">{car.specs.engine}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">🧳</div>
                    <div className="text-sm text-gray-600">Luggage</div>
                    <div className="font-semibold">{car.specs.luggage}</div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-orange-500 mb-1">
                  {calculateTotal()} MAD
                </div>
                <div className="text-sm text-gray-600">per day</div>
              </div>

              {/* Insurance Options */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Insurance</h4>
                <div className="space-y-3">
                  {car.insurance.map((option) => (
                    <label key={option.type} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="insurance"
                        value={option.type}
                        checked={selectedInsurance === option.type}
                        onChange={(e) => setSelectedInsurance(e.target.value)}
                        className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{option.name}</span>
                          <span className="font-bold text-orange-500">+{option.price} MAD</span>
                        </div>
                        <ul className="mt-1 text-sm text-gray-600">
                          {option.coverage.map((item, index) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Extras */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Optional Extras</h4>
                <div className="space-y-3">
                  {car.extras.map((extra) => (
                    <label key={extra.id} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={extra.included || selectedExtras.includes(extra.id)}
                        disabled={extra.included}
                        onChange={() => handleExtraToggle(extra.id)}
                        className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{extra.name}</span>
                          <span className={`font-bold ${extra.included ? 'text-green-500' : 'text-orange-500'}`}>
                            {extra.included ? 'Included' : `+${extra.price} MAD`}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{extra.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Book Now Button */}
              <button 
                onClick={() => router.push(`/booking?carId=${car.id}`)}
                className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-medium text-lg"
              >
                Book Now
              </button>

              {/* Agency Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Rental Agency</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{car.agency.name}</div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {car.agency.rating}
                    </div>
                  </div>
                  {car.agency.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Verified
                    </span>
                  )}
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
