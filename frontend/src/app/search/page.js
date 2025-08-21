'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '../components/Header'
import Footer from '../components/Footer'

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    transmission: '',
    fuelType: '',
    seats: '',
    style: '',
    brand: '',
    features: [],
    verified: false
  })
  const [sortBy, setSortBy] = useState('relevance')
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCar, setSelectedCar] = useState(null)
  const [showCarModal, setShowCarModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showPickupProcess, setShowPickupProcess] = useState(false)
  const [showBookingFlow, setShowBookingFlow] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [bookingStep, setBookingStep] = useState('auth') // auth, license, personal, contact, verification, payment
  const [bookingData, setBookingData] = useState({
    // Auth data
    email: '',
    password: '',
    confirmPassword: '',
    isSignUp: false,
    
    // License data
    licenseCountry: '',
    licenseIssueDate: '',
    licenseNumber: '',
    licenseExpiryDate: '',
    
    // Personal data
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    
    // Contact data
    phoneNumber: '',
    smsCode: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    
    // Verification
    idType: 'passport', // passport, id_card, driver_license
    idNumber: '',
    idExpiryDate: '',
    
    // Payment
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })

  // Mock data - replace with actual API call
  const mockCars = [
    {
      id: 1,
      name: 'Dacia Duster',
      modelYear: 2020,
      image: '/carsymbol.jpg',
      images: [
        '/carsymbol.jpg',
        '/carsymbol.jpg',
        '/carsymbol.jpg',
        '/carsymbol.jpg'
      ],
      price: 420,
      location: 'Agadir',
      transmission: 'Manual',
      fuel: 'Diesel',
      seats: 5,
      style: 'SUV',
      brand: 'Dacia',
      mileage: '45,000 km',
      verified: true,
      rating: 4.8,
      reviews: 124,
      features: ['Air Conditioning', 'GPS', 'Bluetooth'],
      availableFeatures: ['GPS', 'AC', '4WD', 'Child Seat', 'Roof Box'],
      description: 'Perfect for exploring Morocco! This reliable Dacia Duster offers great comfort and performance for both city drives and mountain adventures. Well-maintained with all necessary equipment.',
      ownerRules: [
        'No smoking in the vehicle',
        'Return with same fuel level',
        'Maximum 2 additional drivers',
        'No pets allowed',
        'Clean the car before return'
      ],
      technicalFeatures: [
        'ABS Brakes',
        'Power Steering',
        'Electric Windows',
        'Central Locking',
        'Airbags'
      ],
      optionsAccessories: [
        'Air Conditioning',
        'GPS Navigation',
        'Bluetooth Connectivity',
        'USB Charging Ports',
        'Roof Rails'
      ],
      pickupProcess: {
        steps: [
          'Meet at the designated pickup location',
          'Vehicle inspection together',
          'Review rental agreement',
          'Provide driving license and ID',
          'Quick tutorial of car features'
        ],
        duration: '15-20 minutes',
        requirements: ['Valid driving license', 'Credit card', 'ID/Passport']
      },
      cancellationPolicy: 'Free cancellation up to 24 hours before pickup. 50% refund for cancellations within 24 hours.'
    },
    {
      id: 2,
      name: 'Vauxhall Corsa',
      modelYear: 2019,
      image: '/carsymbol.jpg',
      images: [
        '/carsymbol.jpg',
        '/carsymbol.jpg',
        '/carsymbol.jpg'
      ],
      price: 600,
      location: 'Agadir',
      transmission: 'Manual',
      fuel: 'Diesel',
      seats: 5,
      style: 'City',
      brand: 'Vauxhall',
      mileage: '38,000 km',
      verified: true,
      rating: 4.6,
      reviews: 89,
      features: ['Air Conditioning', 'GPS', 'USB Port'],
      availableFeatures: ['GPS', 'AC', 'Child Seat'],
      description: 'Compact and efficient city car perfect for urban exploration and short trips around Morocco.',
      ownerRules: [
        'No smoking in the vehicle',
        'Return with same fuel level',
        'Maximum 1 additional driver',
        'Clean the car before return'
      ],
      technicalFeatures: [
        'ABS Brakes',
        'Power Steering',
        'Electric Windows',
        'Central Locking'
      ],
      optionsAccessories: [
        'Air Conditioning',
        'GPS Navigation',
        'USB Charging Ports',
        'Bluetooth'
      ],
      pickupProcess: {
        steps: [
          'Meet at the designated pickup location',
          'Vehicle inspection together',
          'Review rental agreement',
          'Provide driving license and ID'
        ],
        duration: '10-15 minutes',
        requirements: ['Valid driving license', 'Credit card', 'ID/Passport']
      },
      cancellationPolicy: 'Free cancellation up to 24 hours before pickup. 50% refund for cancellations within 24 hours.'
    },
    {
      id: 3,
      name: 'Mercedes E Class',
      modelYear: 2021,
      image: '/carsymbol.jpg',
      images: [
        '/carsymbol.jpg',
        '/carsymbol.jpg',
        '/carsymbol.jpg',
        '/carsymbol.jpg',
        '/carsymbol.jpg'
      ],
      price: 550,
      location: 'Agadir',
      transmission: 'Manual',
      fuel: 'Diesel',
      seats: 5,
      style: 'Sedan',
      brand: 'Mercedes-Benz',
      mileage: '25,000 km',
      verified: true,
      rating: 4.9,
      reviews: 156,
      features: ['Air Conditioning', 'GPS', 'Leather Seats', 'Premium Audio'],
      availableFeatures: ['GPS', 'AC', 'Cruise Control', 'CarPlay/Android Auto', 'Child Seat'],
      description: 'Luxury executive sedan perfect for business trips and comfortable long-distance travel. Premium comfort with all modern amenities.',
      ownerRules: [
        'No smoking in the vehicle',
        'Return with same fuel level',
        'Maximum 2 additional drivers',
        'Professional use only',
        'Clean the car before return'
      ],
      technicalFeatures: [
        'ABS Brakes',
        'Power Steering',
        'Electric Windows',
        'Central Locking',
        'Multiple Airbags',
        'Stability Control'
      ],
      optionsAccessories: [
        'Premium Leather Seats',
        'GPS Navigation',
        'Premium Audio System',
        'Climate Control',
        'Bluetooth Connectivity',
        'USB Charging Ports'
      ],
      pickupProcess: {
        steps: [
          'Meet at the designated pickup location',
          'Vehicle inspection together',
          'Review rental agreement',
          'Provide driving license and ID',
          'Premium features tutorial'
        ],
        duration: '20-25 minutes',
        requirements: ['Valid driving license', 'Credit card', 'ID/Passport']
      },
      cancellationPolicy: 'Free cancellation up to 48 hours before pickup. 25% refund for cancellations within 48 hours.'
    },
    {
      id: 4,
      name: 'Toyota Aygo',
      modelYear: 2018,
      image: '/carsymbol.jpg',
      images: [
        '/carsymbol.jpg',
        '/carsymbol.jpg',
        '/carsymbol.jpg'
      ],
      price: 380,
      location: 'Agadir',
      transmission: 'Manual',
      fuel: 'Petrol',
      seats: 4,
      style: 'City',
      brand: 'Toyota',
      mileage: '52,000 km',
      verified: false,
      rating: 4.3,
      reviews: 67,
      features: ['Air Conditioning', 'Bluetooth'],
      availableFeatures: ['AC', 'Child Seat'],
      description: 'Compact and economical city car, perfect for urban exploration and short trips. Great fuel efficiency and easy parking.',
      ownerRules: [
        'No smoking in the vehicle',
        'Return with same fuel level',
        'Maximum 1 additional driver',
        'City driving only'
      ],
      technicalFeatures: [
        'ABS Brakes',
        'Power Steering',
        'Electric Windows',
        'Central Locking'
      ],
      optionsAccessories: [
        'Air Conditioning',
        'Bluetooth Connectivity',
        'USB Port',
        'Radio/CD Player'
      ],
      pickupProcess: {
        steps: [
          'Meet at the designated pickup location',
          'Vehicle inspection together',
          'Review rental agreement',
          'Provide driving license and ID'
        ],
        duration: '10-15 minutes',
        requirements: ['Valid driving license', 'Credit card', 'ID/Passport']
      },
      cancellationPolicy: 'Free cancellation up to 24 hours before pickup. No refund for cancellations within 24 hours.'
    },
    {
      id: 5,
      name: 'BMW X3',
      modelYear: 2022,
      image: '/carsymbol.jpg',
      images: [
        '/carsymbol.jpg',
        '/carsymbol.jpg',
        '/carsymbol.jpg',
        '/carsymbol.jpg',
        '/carsymbol.jpg',
        '/carsymbol.jpg'
      ],
      price: 850,
      location: 'Casablanca',
      transmission: 'Automatic',
      fuel: 'Diesel',
      seats: 5,
      style: 'SUV',
      brand: 'BMW',
      mileage: '15,000 km',
      verified: true,
      rating: 4.7,
      reviews: 203,
      features: ['Air Conditioning', 'GPS', 'Leather Seats', 'Sunroof'],
      availableFeatures: ['GPS', 'AC', '4WD', 'Cruise Control', 'CarPlay/Android Auto', 'Child Seat', 'Bike Rack', 'Roof Box', 'Snow Equipment'],
      description: 'Premium luxury SUV with all modern features. Perfect for family trips, mountain adventures, and luxury travel across Morocco.',
      ownerRules: [
        'No smoking in the vehicle',
        'Return with same fuel level',
        'Maximum 2 additional drivers',
        'No off-road driving',
        'Professional cleaning required'
      ],
      technicalFeatures: [
        'ABS Brakes',
        'Power Steering',
        'Electric Windows',
        'Central Locking',
        'Multiple Airbags',
        'Stability Control',
        'Traction Control',
        'Hill Start Assist'
      ],
      optionsAccessories: [
        'Premium Leather Seats',
        'GPS Navigation',
        'Premium Audio System',
        'Panoramic Sunroof',
        'Climate Control',
        'Bluetooth Connectivity',
        'USB Charging Ports',
        'Parking Sensors'
      ],
      pickupProcess: {
        steps: [
          'Meet at the designated pickup location',
          'Comprehensive vehicle inspection',
          'Review rental agreement',
          'Provide driving license and ID',
          'Premium features and safety tutorial',
          'Insurance verification'
        ],
        duration: '25-30 minutes',
        requirements: ['Valid driving license', 'Credit card', 'ID/Passport', 'Insurance proof']
      },
      cancellationPolicy: 'Free cancellation up to 72 hours before pickup. 50% refund for cancellations within 72 hours.'
    },
    {
      id: 6,
      name: 'Renault Clio',
      modelYear: 2019,
      image: '/carsymbol.jpg',
      images: [
        '/carsymbol.jpg',
        '/carsymbol.jpg',
        '/carsymbol.jpg'
      ],
      price: 320,
      location: 'Marrakesh',
      transmission: 'Manual',
      fuel: 'Petrol',
      seats: 5,
      style: 'Family',
      brand: 'Renault',
      mileage: '41,000 km',
      verified: true,
      rating: 4.4,
      reviews: 92,
      features: ['Air Conditioning', 'GPS'],
      availableFeatures: ['GPS', 'AC', 'Child Seat', 'Bike Rack'],
      description: 'Reliable and economical compact car, ideal for city exploration and day trips. Great fuel economy and comfortable for small groups.',
      ownerRules: [
        'No smoking in the vehicle',
        'Return with same fuel level',
        'Maximum 2 additional drivers',
        'Clean the car before return'
      ],
      technicalFeatures: [
        'ABS Brakes',
        'Power Steering',
        'Electric Windows',
        'Central Locking',
        'Airbags'
      ],
      optionsAccessories: [
        'Air Conditioning',
        'GPS Navigation',
        'Bluetooth Connectivity',
        'USB Charging Ports',
        'Radio/CD Player'
      ],
      pickupProcess: {
        steps: [
          'Meet at the designated pickup location',
          'Vehicle inspection together',
          'Review rental agreement',
          'Provide driving license and ID',
          'Basic features tutorial'
        ],
        duration: '15-20 minutes',
        requirements: ['Valid driving license', 'Credit card', 'ID/Passport']
      },
      cancellationPolicy: 'Free cancellation up to 24 hours before pickup. 50% refund for cancellations within 24 hours.'
    }
  ]

  useEffect(() => {
    // Cleanup function to reset body overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

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
        (filters.style === '' || car.style === filters.style) &&
        (filters.brand === '' || car.brand === filters.brand) &&
        (filters.features.length === 0 || filters.features.every(feature => car.availableFeatures && car.availableFeatures.includes(feature))) &&
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

  const handleFeatureToggle = (feature) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      transmission: '',
      fuelType: '',
      seats: '',
      style: '',
      brand: '',
      features: [],
      verified: false
    })
  }

  const handleViewDetails = (car) => {
    setSelectedCar(car)
    setCurrentImageIndex(0)
    setShowCarModal(true)
    document.body.style.overflow = 'hidden'
  }

  const handleCloseModal = () => {
    setShowCarModal(false)
    setSelectedCar(null)
    setCurrentImageIndex(0)
    setShowPickupProcess(false)
    setShowBookingFlow(false)
    setBookingStep('auth')
    setBookingData({
      email: '',
      password: '',
      confirmPassword: '',
      isSignUp: false,
      licenseCountry: '',
      licenseIssueDate: '',
      licenseNumber: '',
      licenseExpiryDate: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
      phoneNumber: '',
      smsCode: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      idType: 'passport',
      idNumber: '',
      idExpiryDate: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    })
    document.body.style.overflow = 'unset'
  }

  const nextImage = () => {
    if (selectedCar && selectedCar.images) {
      setCurrentImageIndex((prev) => 
        prev === selectedCar.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (selectedCar && selectedCar.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedCar.images.length - 1 : prev - 1
      )
    }
  }

  const handleBookingRequest = () => {
    if (!isLoggedIn) {
      setShowBookingFlow(true)
      setBookingStep('auth')
    } else {
      // User is logged in, start from license step
      setShowBookingFlow(true)
      setBookingStep('license')
    }
    document.body.style.overflow = 'hidden'
  }

  const handleBookingDataChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    // Simulate authentication
    setTimeout(() => {
      setIsLoggedIn(true)
      setBookingStep('license')
    }, 1000)
  }

  const handleGoogleAuth = () => {
    // Simulate Google authentication
    setTimeout(() => {
      setIsLoggedIn(true)
      setBookingStep('license')
    }, 1000)
  }

  const handleNextStep = () => {
    const steps = ['auth', 'license', 'personal', 'contact', 'verification', 'payment', 'confirmation']
    const currentIndex = steps.indexOf(bookingStep)
    if (currentIndex < steps.length - 1) {
      setBookingStep(steps[currentIndex + 1])
    }
  }

  const handlePrevStep = () => {
    const steps = ['auth', 'license', 'personal', 'contact', 'verification', 'payment', 'confirmation']
    const currentIndex = steps.indexOf(bookingStep)
    if (currentIndex > 0) {
      setBookingStep(steps[currentIndex - 1])
    }
  }

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

              {/* Style */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Style
                </label>
                <select
                  value={filters.style}
                  onChange={(e) => handleFilterChange('style', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                >
                  <option value="">All Styles</option>
                  <option value="Commercial">Commercial</option>
                  <option value="City">City</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Family">Family</option>
                  <option value="Minibus">Minibus</option>
                  <option value="4x4">4x4</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Antique">Antique</option>
                  <option value="Campervan">Campervan</option>
                  <option value="SUV">SUV</option>
                </select>
              </div>

              {/* Brand */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                >
                  <option value="">All Brands</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Jeep">Jeep</option>
                  <option value="Alfa-Romeo">Alfa-Romeo</option>
                  <option value="Audi">Audi</option>
                  <option value="BMW">BMW</option>
                  <option value="Chrysler">Chrysler</option>
                  <option value="Dacia">Dacia</option>
                  <option value="Dodge">Dodge</option>
                  <option value="Fiat">Fiat</option>
                  <option value="Ford">Ford</option>
                  <option value="Honda">Honda</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Kia">Kia</option>
                  <option value="Land-Rover">Land-Rover</option>
                  <option value="Lexus">Lexus</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Mini">Mini</option>
                  <option value="Mitsubishi">Mitsubishi</option>
                  <option value="Opel">Opel</option>
                  <option value="Seat">Seat</option>
                  <option value="Skoda">Skoda</option>
                  <option value="Smart">Smart</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Tesla">Tesla</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Volvo">Volvo</option>
                </select>
              </div>

              {/* Features */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Features
                </label>
                <div className="space-y-2">
                  {[
                    'Child Seat',
                    'GPS',
                    'AC',
                    'Bike Rack',
                    'Roof Box',
                    'Cruise Control',
                    'Snow Equipment',
                    'CarPlay/Android Auto',
                    '4WD'
                  ].map(feature => (
                    <label key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.features.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
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
                          onClick={() => handleViewDetails(car)}
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
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
          <div className="bg-white overflow-hidden max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between rounded-t-[40px] z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedCar.name} {selectedCar.modelYear}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row">
              {/* Left Side - Car Details */}
              <div className="lg:w-2/3 p-6">
                {/* Image Gallery */}
                <div className="mb-8">
                  <div className="relative">
                    <img
                      src={selectedCar.images[currentImageIndex]}
                      alt={selectedCar.name}
                      className="w-full h-64 lg:h-80 object-cover rounded-xl"
                    />
                    {selectedCar.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                        >
                          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                        >
                          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Image Thumbnails */}
                  {selectedCar.images.length > 1 && (
                    <div className="flex space-x-2 mt-4 overflow-x-auto">
                      {selectedCar.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            index === currentImageIndex ? 'border-orange-500' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${selectedCar.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Car Basic Info */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedCar.name}</h3>
                      <p className="text-gray-600">Model Year: {selectedCar.modelYear}</p>
                    </div>
                    {selectedCar.verified && (
                      <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <svg className="w-6 h-6 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <div className="text-sm font-medium text-gray-900">{selectedCar.seats}</div>
                      <div className="text-xs text-gray-500">Seats</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <svg className="w-6 h-6 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div className="text-sm font-medium text-gray-900">{selectedCar.fuel}</div>
                      <div className="text-xs text-gray-500">Fuel</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <svg className="w-6 h-6 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      </svg>
                      <div className="text-sm font-medium text-gray-900">{selectedCar.transmission}</div>
                      <div className="text-xs text-gray-500">Transmission</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <svg className="w-6 h-6 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <div className="text-sm font-medium text-gray-900">{selectedCar.mileage}</div>
                      <div className="text-xs text-gray-500">Mileage</div>
                    </div>
                  </div>
                </div>

                {/* Additional Cards */}
                <div className="space-y-6">
                  {/* Pickup Process Card */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Pickup Process</h4>
                      <button
                        onClick={() => setShowPickupProcess(!showPickupProcess)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                      >
                        {showPickupProcess ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                    {showPickupProcess && (
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Process Steps:</h5>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                            {selectedCar.pickupProcess.steps.map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Duration:</h5>
                          <p className="text-sm text-gray-600">{selectedCar.pickupProcess.duration}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Requirements:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                            {selectedCar.pickupProcess.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description Card */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedCar.description}</p>
                  </div>

                  {/* Owner Rules Card */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Owner Rules</h4>
                    <ul className="space-y-2">
                      {selectedCar.ownerRules.map((rule, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-4 h-4 text-orange-500 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-600 text-sm">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Fuel & Transmission Info Card */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Fuel & Transmission Info</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Fuel Type</h5>
                        <p className="text-gray-600">{selectedCar.fuel}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Transmission</h5>
                        <p className="text-gray-600">{selectedCar.transmission}</p>
                      </div>
                    </div>
                  </div>

                  {/* Technical Features Card */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Technical Features</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedCar.technicalFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Options & Accessories Card */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Options & Accessories</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedCar.optionsAccessories.map((option, index) => (
                        <div key={index} className="flex items-center">
                          <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-600 text-sm">{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Booking Sidebar */}
              <div className="lg:w-1/3 bg-gray-50 p-6">
                <div className="sticky top-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-orange-500 mb-2">
                        {selectedCar.price} MAD
                      </div>
                      <div className="text-gray-500">per day</div>
                    </div>

                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-900 mb-3">Duration</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Pickup:</span>
                          <span className="font-medium">Wed, Aug 20 - 01:30 PM</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Return:</span>
                          <span className="font-medium">Thu, Aug 21 - 01:30 PM</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between items-center">
                          <span className="font-medium text-gray-900">Total Duration:</span>
                          <span className="font-bold">1 day</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-900 mb-3">Total Price</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">{selectedCar.price} MAD × 1 day</span>
                          <span>{selectedCar.price} MAD</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service fee</span>
                          <span>50 MAD</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Total</span>
                          <span>{selectedCar.price + 50} MAD</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleBookingRequest}
                      className="w-full bg-orange-500 text-white py-4 rounded-xl hover:bg-orange-600 transition-colors font-semibold mb-4"
                    >
                      Request Booking
                    </button>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h6 className="font-semibold text-gray-900 mb-2">Cancellation Policy</h6>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {selectedCar.cancellationPolicy}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Flow Modal */}
      {showBookingFlow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between rounded-t-[40px] z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {bookingStep === 'auth' && 'Sign In / Create Account'}
                  {bookingStep === 'license' && 'Driver License Information'}
                  {bookingStep === 'personal' && 'Personal Information'}
                  {bookingStep === 'contact' && 'Contact Information'}
                  {bookingStep === 'verification' && 'Identity Verification'}
                  {bookingStep === 'payment' && 'Payment Information'}
                  {bookingStep === 'confirmation' && 'Booking Confirmation'}
                </h2>
                <div className="flex space-x-2 mt-2">
                  {['auth', 'license', 'personal', 'contact', 'verification', 'payment', 'confirmation'].map((step, index) => (
                    <div
                      key={step}
                      className={`h-2 w-8 rounded-full ${
                        step === bookingStep ? 'bg-orange-500' : 
                        ['auth', 'license', 'personal', 'contact', 'verification', 'payment', 'confirmation'].indexOf(bookingStep) > index ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Authentication Step */}
              {bookingStep === 'auth' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {bookingData.isSignUp ? 'Create Your Account' : 'Welcome Back'}
                    </h3>
                    <p className="text-gray-600">
                      {bookingData.isSignUp ? 'Join AirbCar to book your first car' : 'Sign in to continue with your booking'}
                    </p>
                  </div>

                  <button
                    onClick={handleGoogleAuth}
                    className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="font-medium text-gray-700">Continue with Google</span>
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => handleBookingDataChange('email', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <input
                        type="password"
                        value={bookingData.password}
                        onChange={(e) => handleBookingDataChange('password', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter your password"
                        required
                      />
                    </div>

                    {bookingData.isSignUp && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input
                          type="password"
                          value={bookingData.confirmPassword}
                          onChange={(e) => handleBookingDataChange('confirmPassword', e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      {bookingData.isSignUp ? 'Create Account' : 'Sign In'}
                    </button>
                  </form>

                  <div className="text-center">
                    <button
                      onClick={() => handleBookingDataChange('isSignUp', !bookingData.isSignUp)}
                      className="text-orange-500 hover:text-orange-600 font-medium"
                    >
                      {bookingData.isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                    </button>
                  </div>
                </div>
              )}

              {/* License Information Step */}
              {bookingStep === 'license' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Driver License Information</h3>
                    <p className="text-gray-600">We need your license details for verification</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Origin Country</label>
                      <select
                        value={bookingData.licenseCountry}
                        onChange={(e) => handleBookingDataChange('licenseCountry', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      >
                        <option value="">Select country</option>
                        <option value="morocco">Morocco</option>
                        <option value="france">France</option>
                        <option value="spain">Spain</option>
                        <option value="germany">Germany</option>
                        <option value="uk">United Kingdom</option>
                        <option value="usa">United States</option>
                        <option value="canada">Canada</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                      <input
                        type="text"
                        value={bookingData.licenseNumber}
                        onChange={(e) => handleBookingDataChange('licenseNumber', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter license number"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                        <input
                          type="date"
                          value={bookingData.licenseIssueDate}
                          onChange={(e) => handleBookingDataChange('licenseIssueDate', e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="date"
                          value={bookingData.licenseExpiryDate}
                          onChange={(e) => handleBookingDataChange('licenseExpiryDate', e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handlePrevStep}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Personal Information Step */}
              {bookingStep === 'personal' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
                    <p className="text-gray-600">Tell us more about yourself</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          value={bookingData.firstName}
                          onChange={(e) => handleBookingDataChange('firstName', e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={bookingData.lastName}
                          onChange={(e) => handleBookingDataChange('lastName', e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        value={bookingData.dateOfBirth}
                        onChange={(e) => handleBookingDataChange('dateOfBirth', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                      <select
                        value={bookingData.nationality}
                        onChange={(e) => handleBookingDataChange('nationality', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      >
                        <option value="">Select nationality</option>
                        <option value="moroccan">Moroccan</option>
                        <option value="french">French</option>
                        <option value="spanish">Spanish</option>
                        <option value="german">German</option>
                        <option value="british">British</option>
                        <option value="american">American</option>
                        <option value="canadian">Canadian</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handlePrevStep}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Contact Information Step */}
              {bookingStep === 'contact' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
                    <p className="text-gray-600">We need your contact details and address</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={bookingData.phoneNumber}
                        onChange={(e) => handleBookingDataChange('phoneNumber', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="+212 6XX XXX XXX"
                        required
                      />
                    </div>

                    {bookingData.phoneNumber && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">SMS Verification Code</label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={bookingData.smsCode}
                            onChange={(e) => handleBookingDataChange('smsCode', e.target.value)}
                            className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="Enter 6-digit code"
                            maxLength="6"
                          />
                          <button
                            type="button"
                            className="bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                          >
                            Send Code
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                      <input
                        type="text"
                        value={bookingData.address}
                        onChange={(e) => handleBookingDataChange('address', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Street address"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={bookingData.city}
                          onChange={(e) => handleBookingDataChange('city', e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="City"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                        <input
                          type="text"
                          value={bookingData.postalCode}
                          onChange={(e) => handleBookingDataChange('postalCode', e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Postal code"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <select
                        value={bookingData.country}
                        onChange={(e) => handleBookingDataChange('country', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      >
                        <option value="">Select country</option>
                        <option value="morocco">Morocco</option>
                        <option value="france">France</option>
                        <option value="spain">Spain</option>
                        <option value="germany">Germany</option>
                        <option value="uk">United Kingdom</option>
                        <option value="usa">United States</option>
                        <option value="canada">Canada</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handlePrevStep}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Identity Verification Step */}
              {bookingStep === 'verification' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Identity Verification</h3>
                    <p className="text-gray-600">Please provide your identification details</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ID Document Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'passport', label: 'Passport' },
                          { value: 'id_card', label: 'ID Card' },
                          { value: 'driver_license', label: 'Driver License' }
                        ].map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => handleBookingDataChange('idType', type.value)}
                            className={`p-3 text-sm rounded-lg border transition-colors ${
                              bookingData.idType === type.value
                                ? 'bg-orange-500 text-white border-orange-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500'
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
                      <input
                        type="text"
                        value={bookingData.idNumber}
                        onChange={(e) => handleBookingDataChange('idNumber', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter ID number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ID Expiry Date</label>
                      <input
                        type="date"
                        value={bookingData.idExpiryDate}
                        onChange={(e) => handleBookingDataChange('idExpiryDate', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Document Upload</h4>
                      <p className="text-blue-700 text-sm mb-3">
                        Please upload clear photos of both sides of your {bookingData.idType.replace('_', ' ')}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                          <svg className="w-8 h-8 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                            Upload Front Side
                          </button>
                        </div>
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                          <svg className="w-8 h-8 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                            Upload Back Side
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handlePrevStep}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Information Step */}
              {bookingStep === 'payment' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Information</h3>
                    <p className="text-gray-600">Secure payment details</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{selectedCar?.name} {selectedCar?.modelYear}</span>
                        <span>{selectedCar?.price} MAD/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span>1 day rental</span>
                        <span>{selectedCar?.price} MAD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service fee</span>
                        <span>50 MAD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Security deposit (refundable)</span>
                        <span>1000 MAD</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{selectedCar ? selectedCar.price + 1050 : 1050} MAD</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        value={bookingData.cardholderName}
                        onChange={(e) => handleBookingDataChange('cardholderName', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Name on card"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        value={bookingData.cardNumber}
                        onChange={(e) => handleBookingDataChange('cardNumber', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          value={bookingData.expiryDate}
                          onChange={(e) => handleBookingDataChange('expiryDate', e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="MM/YY"
                          maxLength="5"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          value={bookingData.cvv}
                          onChange={(e) => handleBookingDataChange('cvv', e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="123"
                          maxLength="4"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handlePrevStep}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      Complete Booking
                    </button>
                  </div>
                </div>
              )}

              {/* Confirmation Step */}
              {bookingStep === 'confirmation' && (
                <div className="space-y-6 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                    <p className="text-gray-600">Your car rental has been successfully booked</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 text-left">
                    <h4 className="font-semibold text-gray-900 mb-4">Booking Details</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booking ID:</span>
                        <span className="font-medium">#ABC123456</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Car:</span>
                        <span className="font-medium">{selectedCar?.name} {selectedCar?.modelYear}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pickup:</span>
                        <span className="font-medium">Wed, Aug 20 - 01:30 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Return:</span>
                        <span className="font-medium">Thu, Aug 21 - 01:30 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{selectedCar?.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Paid:</span>
                        <span className="font-medium">{selectedCar ? selectedCar.price + 1050 : 1050} MAD</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      You will receive a confirmation email with all the details and pickup instructions.
                    </p>
                    <button
                      onClick={handleCloseModal}
                      className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading search results...</p>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
