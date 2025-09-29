'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { userAPI, authAPI, bookingAPI, favoritesAPI } from '@/lib/api'
import Header from '../components/Header'
import Footer from '../components/Footer'

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading: authLoading, login, register } = useAuth()
  const [cars, setCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    transmission: [],
    fuelType: [],
    seats: [],
    style: [],
    brand: [],
    features: [],
    verified: false,
    location: '',
    pickupDate: '',
    returnDate: '',
    instantBooking: false
  })
  const [sortBy, setSortBy] = useState('relevance')
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [showAllFeatures, setShowAllFeatures] = useState(false)
  const [showAllBrands, setShowAllBrands] = useState(false)
  const [showAllStyles, setShowAllStyles] = useState(false)
  const [selectedCar, setSelectedCar] = useState(null)
  const [showCarModal, setShowCarModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showPickupProcess, setShowPickupProcess] = useState(false)
  const [showBookingFlow, setShowBookingFlow] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [bookingStep, setBookingStep] = useState('auth') // auth, personal, contact, license, payment
  const [authError, setAuthError] = useState('')
  const [validationError, setValidationError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [authSubmitLoading, setAuthSubmitLoading] = useState(false)
  const [profileCompleteness, setProfileCompleteness] = useState({
    personal: false,
    contact: false,
    license: false
  })
  const [userDataLoaded, setUserDataLoaded] = useState(false)
  const [favorites, setFavorites] = useState(new Set())
  const [favoritesLoading, setFavoritesLoading] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [comparisonCars, setComparisonCars] = useState([])
  const [showComparison, setShowComparison] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // grid, list, map
  const [bookingData, setBookingData] = useState({
    // Auth data
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isSignUp: false,
    
    // License data
    licenseCountry: '',
    licenseIssueDate: '',
    licenseNumber: '',
    
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
    
    // Payment
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })
  
  // Document upload state
  const [uploadedDocuments, setUploadedDocuments] = useState({
    idFrontDocument: null,
    idBackDocument: null
  })
  
  // Booking-specific state
  const [bookingDetails, setBookingDetails] = useState({
    pickupDate: '',
    dropoffDate: ''
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
      price_per_day: 420,
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
      price_per_day: 600,
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
      price_per_day: 550,
      location: 'Agadir',
      transmission: 'Manual',
      fuel: 'Diesel',
      seats: 5,
      style: 'Sedan',
      brand: 'Mercedes',
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
      price_per_day: 380,
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
      price_per_day: 850,
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
      price_per_day: 320,
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

  // Helper function to safely display price
  const formatPrice = (price_per_day) => {
    console.log('formatPrice input:', price_per_day, 'type:', typeof price_per_day)
    
    // Handle undefined, null, or empty values
    if (price_per_day === undefined || price_per_day === null || price_per_day === '') {
      console.log('Price is undefined/null/empty')
      return 'Price on request'
    }
    
    const numPrice = Number(price_per_day)
    console.log('numPrice after Number conversion:', numPrice, 'isNaN:', isNaN(numPrice))
    
    // Check if conversion resulted in a valid number
    if (isNaN(numPrice) || numPrice <= 0) {
      console.log('Price is not a valid positive number')
      return 'Price on request'
    }
    
    const result = `${numPrice} MAD`
    console.log('formatPrice result:', result)
    return result
  }

  const showPricePerDay = (price_per_day) => {
    const numPrice = Number(price_per_day)
    return (numPrice && numPrice > 0) ? 'per day' : ''
  }

  useEffect(() => {
    // Cleanup function to reset body overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Fetch cars from backend API
  const fetchCars = async () => {
    try {
      setLoading(true)
      // Use different API URLs for server-side vs client-side
      const isClientSide = typeof window !== 'undefined';
      const apiUrl = isClientSide 
        ? (process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://127.0.0.1:8000')
        : (process.env.DJANGO_API_URL || 'http://web:8000');
      
      console.log('Fetching from:', `${apiUrl}/listings/`);
      const response = await fetch(`${apiUrl}/listings/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API Response Status:', response.status);
      console.log('Number of listings received:', data?.length || 0);
      console.log('First listing sample:', data?.[0]);
      
      // Transform backend data to match frontend format
      const transformedCars = (data || []).map(vehicle => {
        const price = Number(vehicle.price_per_day || 0)
        
        console.log('Vehicle pictures from backend:', vehicle.pictures)
        console.log('Vehicle ID:', vehicle.id, 'Make:', vehicle.make, 'Model:', vehicle.model)
        
        return {
          id: vehicle.id,
          name: `${vehicle.make || 'Car'} ${vehicle.model || 'Model'}${vehicle.year ? ` ${vehicle.year}` : ''}`,
          brand: vehicle.make || 'Unknown',
          model: vehicle.model || 'Model',
          year: vehicle.year || new Date().getFullYear(),
          type: 'Car',
          style: 'Car',
          images: vehicle.pictures && vehicle.pictures.length > 0 ? vehicle.pictures : [
            '/carsymbol.jpg'
          ],
          price_per_day: price,
          weeklyPrice: price * 7 * 0.85,
          monthlyPrice: price * 30 * 0.70,
          location: vehicle.location || 'Morocco',
          transmission: vehicle.transmission || 'Manual',
          fuelType: vehicle.fuel_type || 'Petrol',
          seats: vehicle.seating_capacity || 5,
          doors: 4,
          verified: true,
          rating: vehicle.rating || 4.5,
          reviews: 50,
          instantBook: false,
          agency: {
            name: 'Premium Car Rental',
            verified: true,
            rating: 4.9,
            responseTime: '< 1 hour'
          },
          features: vehicle.features || [
            'Air Conditioning',
            'GPS Navigation',
            'Bluetooth',
            'USB Port'
          ],
          description: vehicle.vehicle_description || 'A reliable and comfortable vehicle perfect for your journey.',
          specifications: {
            engine: '1.5L',
            horsepower: '110 HP',
            consumption: '5.2L/100km',
            acceleration: '0-100 km/h in 10.5s',
            topSpeed: '180 km/h',
            co2Emission: '120 g/km'
          },
          availability: vehicle.availability || true,
          pickupProcess: [
            'Document verification at pickup location',
            'Vehicle inspection with rental agent',
            'Digital signature and key handover',
            'Quick orientation of vehicle features'
          ]
        }
      })

      console.log('Fetched cars from backend:', transformedCars.length)
      console.log('Sample transformed car:', transformedCars[0])
      console.log('Sample car price_per_day:', transformedCars[0]?.price_per_day)
      setCars(transformedCars)
      setFilteredCars(transformedCars)

    } catch (error) {
      console.error('Error fetching cars:', error)
      // Don't fall back to mock data - show empty state instead
      setCars([])
      setFilteredCars([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCars()
  }, []) // Empty dependency array is correct here

  // Capture search parameters from URL and update filters
  useEffect(() => {
    const location = searchParams.get('location')
    const pickupDate = searchParams.get('pickupDate')
    const dropoffDate = searchParams.get('dropoffDate')
    
    if (location || pickupDate || dropoffDate) {
      setFilters(prev => ({
        ...prev,
        location: location || '',
        pickupDate: pickupDate || '',
        returnDate: dropoffDate || ''
      }))
      
      // Update booking details for checkout process
      setBookingDetails(prev => ({
        ...prev,
        pickupDate: pickupDate || '',
        dropoffDate: dropoffDate || ''
      }))
    }
  }, [searchParams])

  // Check if user is authenticated and skip auth step
  useEffect(() => {
    const initializeUserProfile = async () => {
      if (user && !authLoading) {
        setIsLoggedIn(true)
        
        // Check profile completeness FIRST before setting step
        if (!userDataLoaded) {
          try {
            const profileStatus = await checkUserProfileCompleteness()
            setProfileCompleteness({
              personal: profileStatus.personal,
              contact: profileStatus.contact,
              license: profileStatus.license
            })
            
            // Handle case where user is already past auth but profile is complete
            if (showCarModal && profileStatus.personal && profileStatus.contact && profileStatus.license && bookingStep !== 'payment') {
              setBookingStep('payment')
            }
            
            // Pre-fill booking data with existing user data if available
            if (profileStatus.userData) {
              setBookingData(prev => ({
                ...prev,
                firstName: profileStatus.userData.first_name || '',
                lastName: profileStatus.userData.last_name || '',
                dateOfBirth: profileStatus.userData.date_of_birth || '',
                nationality: profileStatus.userData.nationality || '',
                phoneNumber: profileStatus.userData.phone_number || '',
                address: profileStatus.userData.address || '',
                city: profileStatus.userData.city || '',
                postalCode: profileStatus.userData.postal_code || '',
                country: profileStatus.userData.country_of_residence || '',
                licenseNumber: profileStatus.userData.license_number || '',
                licenseIssueDate: profileStatus.userData.issue_date || '',
                licenseCountry: profileStatus.userData.license_origin_country || ''
              }))
            }
            
            
            setUserDataLoaded(true)
          } catch (error) {
            console.error('Error checking profile completeness on login:', error)
          }
        }
      } else if (!user && !authLoading) {
        setIsLoggedIn(false)
        setBookingStep('auth')
        // Reset profile completeness and data when user logs out
        setProfileCompleteness({
          personal: false,
          contact: false,
          license: false
        })
        setUserDataLoaded(false)
      }
    }

    initializeUserProfile()
  }, [user, authLoading, userDataLoaded])

  // Load user's favorites
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        try {
          const userFavorites = await favoritesAPI.getFavorites()
          if (Array.isArray(userFavorites)) {
            setFavorites(new Set(userFavorites.map(fav => fav.car_id || fav.id)))
          } else {
            setFavorites(new Set())
          }
        } catch (error) {
          console.error('Error loading favorites:', error)
          setFavorites(new Set())
        }
      }
    }
    
    loadFavorites()
  }, [user])

  useEffect(() => {
    let filtered = cars.filter(car => {
      // Location filter
      const locationMatch = !filters.location || 
        car.location?.toLowerCase().includes(filters.location.toLowerCase()) ||
        car.name?.toLowerCase().includes(filters.location.toLowerCase()) ||
        car.brand?.toLowerCase().includes(filters.location.toLowerCase())
      
      return (
        locationMatch &&
        (car.price_per_day || 0) >= filters.priceRange[0] &&
        (car.price_per_day || 0) <= filters.priceRange[1] &&
        (filters.transmission.length === 0 || filters.transmission.includes(car.transmission)) &&
        (filters.fuelType.length === 0 || filters.fuelType.includes(car.fuelType || car.fuel)) &&
        (filters.seats.length === 0 || filters.seats.includes(car.seats.toString())) &&
        (filters.style.length === 0 || filters.style.includes(car.style)) &&
        (filters.brand.length === 0 || filters.brand.includes(car.brand)) &&
        (filters.features.length === 0 || filters.features.every(feature => car.availableFeatures && car.availableFeatures.includes(feature))) &&
        (!filters.verified || car.verified)
      )
    })

    // Calculate rental duration and total price for each car
    if (filters.pickupDate && filters.returnDate) {
      const startDate = new Date(filters.pickupDate)
      const endDate = new Date(filters.returnDate)
      const duration = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)))
      
      filtered = filtered.map(car => ({
        ...car,
        rentalDuration: duration,
        totalPrice: (car.price_per_day || 0) * duration
      }))
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        if (filtered.length > 0 && filtered[0].totalPrice) {
          filtered.sort((a, b) => (a.totalPrice || 0) - (b.totalPrice || 0))
        } else {
          filtered.sort((a, b) => (a.price_per_day || 0) - (b.price_per_day || 0))
        }
        break
      case 'price_high':
        if (filtered.length > 0 && filtered[0].totalPrice) {
          filtered.sort((a, b) => (b.totalPrice || 0) - (a.totalPrice || 0))
        } else {
          filtered.sort((a, b) => (b.price_per_day || 0) - (a.price_per_day || 0))
        }
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

  const handleBrandToggle = (brand) => {
    setFilters(prev => ({
      ...prev,
      brand: prev.brand.includes(brand)
        ? prev.brand.filter(b => b !== brand)
        : [...prev.brand, brand]
    }))
  }

  const handleStyleToggle = (style) => {
    setFilters(prev => ({
      ...prev,
      style: prev.style.includes(style)
        ? prev.style.filter(s => s !== style)
        : [...prev.style, style]
    }))
  }

  const handleTransmissionToggle = (transmission) => {
    setFilters(prev => ({
      ...prev,
      transmission: prev.transmission.includes(transmission)
        ? prev.transmission.filter(t => t !== transmission)
        : [...prev.transmission, transmission]
    }))
  }

  const handleFuelTypeToggle = (fuelType) => {
    setFilters(prev => ({
      ...prev,
      fuelType: prev.fuelType.includes(fuelType)
        ? prev.fuelType.filter(f => f !== fuelType)
        : [...prev.fuelType, fuelType]
    }))
  }

  const handleSeatsToggle = (seats) => {
    setFilters(prev => ({
      ...prev,
      seats: prev.seats.includes(seats)
        ? prev.seats.filter(s => s !== seats)
        : [...prev.seats, seats]
    }))
  }

  // Favorite functions
  const toggleFavorite = async (carId) => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login')
      return
    }

    setFavoritesLoading(true)
    try {
      if (favorites.has(carId)) {
        // Remove from favorites
        await favoritesAPI.removeFavoriteByCarId(carId)
        setFavorites(prev => {
          const newFavorites = new Set(prev)
          newFavorites.delete(carId)
          return newFavorites
        })
      } else {
        // Add to favorites
        await favoritesAPI.addFavorite(carId)
        setFavorites(prev => new Set([...prev, carId]))
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      // You could add a toast notification here
    } finally {
      setFavoritesLoading(false)
    }
  }

  const isFavorite = (carId) => {
    return favorites.has(carId)
  }

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 5000],
      transmission: [],
      fuelType: [],
      seats: [],
      style: [],
      brand: [],
      features: [],
      verified: false,
      location: '',
      pickupDate: '',
      returnDate: '',
      instantBooking: false
    })
    setBookingDetails({
      pickupDate: '',
      dropoffDate: ''
    })
    setShowAllFeatures(false)
    setShowAllBrands(false)
    setShowAllStyles(false)
    
    // Also clear URL parameters
    router.push('/search')
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
    setAuthError('')
    setAuthSubmitLoading(false)
    // Don't reset profileCompleteness here - it should persist while user is logged in
    setBookingData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      isSignUp: false,
      licenseCountry: '',
      licenseIssueDate: '',
      licenseNumber: '',
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
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    })
    document.body.style.overflow = 'unset'
  }

  const calculateDuration = (pickupDate, returnDate) => {
    if (!pickupDate || !returnDate) return 1
    
    const pickup = new Date(pickupDate)
    const returnD = new Date(returnDate)
    const diffInMs = Math.abs(returnD - pickup)
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
    
    return diffInDays || 1
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

  // Check if user profile is complete
  const checkUserProfileCompleteness = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token || !user?.id) {
        return {
          personal: false,
          contact: false,
          license: false
        }
      }

      const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/users/${user.id}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        console.error('Failed to fetch user profile')
        return {
          personal: false,
          contact: false,
          license: false
        }
      }

      const userData = await response.json()
      
      // Check if each section is complete
      const personalComplete = !!(
        userData.first_name && 
        userData.last_name && 
        userData.date_of_birth && 
        userData.nationality
      )
      
      const contactComplete = !!(
        userData.phone_number && 
        userData.address && 
        userData.city && 
        userData.country_of_residence
      )
      
      const licenseComplete = !!(
        userData.license_number && 
        userData.issue_date && 
        userData.license_origin_country
      )

      return {
        personal: personalComplete,
        contact: contactComplete,
        license: licenseComplete,
        userData: userData
      }
    } catch (error) {
      console.error('Error checking profile completeness:', error)
      return {
        personal: false,
        contact: false,
        license: false
      }
    }
  }

  const handleBookingRequest = async () => {
    if (!isLoggedIn) {
      setShowBookingFlow(true)
      setBookingStep('auth')
    } else {
      // User is logged in, use existing profile completeness (already loaded in useEffect)
      const currentProfileStatus = profileCompleteness
      
      // Determine which step to start from based on completeness
      let startStep = 'personal'
      if (currentProfileStatus.personal && currentProfileStatus.contact && currentProfileStatus.license) {
        // All verification steps complete, go directly to payment
        startStep = 'payment'
      } else if (currentProfileStatus.personal && currentProfileStatus.contact) {
        // Personal and contact complete, start from license
        startStep = 'license'
      } else if (currentProfileStatus.personal) {
        // Only personal complete, start from contact
        startStep = 'contact'
      }
      // If nothing is complete, start from personal (default)
      
      setShowBookingFlow(true)
      setBookingStep(startStep)
    }
    document.body.style.overflow = 'hidden'
  }

  const handleBookingDataChange = (field, value) => {
    // Clear validation errors when user starts typing
    if (validationError) {
      setValidationError('')
    }
    if (authError && (field === 'email' || field === 'password' || field === 'name' || field === 'confirmPassword')) {
      setAuthError('')
    }
    
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (documentType, file) => {
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      setValidationError('File size must be less than 5MB')
      return
    }
    
    setUploadedDocuments(prev => ({
      ...prev,
      [documentType]: file
    }))
    
    // Clear any previous validation errors
    if (validationError) {
      setValidationError('')
    }
  }

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setAuthSubmitLoading(true)
    setAuthError('')

    try {
      let result
      if (bookingData.isSignUp) {
        // Sign up flow
        if (bookingData.password !== bookingData.confirmPassword) {
          setAuthError("Passwords don't match")
          setAuthSubmitLoading(false)
          return
        }
        
        if (!bookingData.name.trim()) {
          setAuthError("Name is required")
          setAuthSubmitLoading(false)
          return
        }
        
        result = await register(
          bookingData.name.trim(),
          bookingData.email,
          bookingData.password
        )
      } else {
        // Sign in flow
        result = await login(bookingData.email, bookingData.password)
      }

      if (result.success) {
        setIsLoggedIn(true)
        setBookingStep('personal')
        setAuthError('')
      } else {
        setAuthError(result.error || 'Authentication failed')
      }
    } catch (error) {
      setAuthError('Something went wrong. Please try again.')
      console.error('Auth error:', error)
    } finally {
      setAuthSubmitLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    // TODO: Implement Google OAuth integration
    setAuthError('Google authentication not implemented yet')
  }

  // Validation function for each step
  const validateCurrentStep = (step) => {
    const currentDate = new Date()
    
    switch (step) {
      case 'auth':
        if (!isLoggedIn) {
          setAuthError('Please sign in or create an account to continue')
          return false
        }
        return true

      case 'personal':
        if (!bookingData.firstName.trim()) {
          setValidationError('Please enter your first name')
          return false
        }
        if (!bookingData.lastName.trim()) {
          setValidationError('Please enter your last name')
          return false
        }
        if (!bookingData.dateOfBirth) {
          setValidationError('Please select your date of birth')
          return false
        }
        if (!bookingData.nationality) {
          setValidationError('Please select your nationality')
          return false
        }
        // Check if user is at least 18 years old
        const birthDate = new Date(bookingData.dateOfBirth)
        const age = (currentDate - birthDate) / (365.25 * 24 * 60 * 60 * 1000)
        if (age < 18) {
          setValidationError('You must be at least 18 years old to rent a car')
          return false
        }
        return true

      case 'contact':
        if (!bookingData.phoneNumber.trim()) {
          setValidationError('Please enter your phone number')
          return false
        }
        if (!bookingData.address.trim()) {
          setValidationError('Please enter your address')
          return false
        }
        if (!bookingData.city.trim()) {
          setValidationError('Please enter your city')
          return false
        }
        if (!bookingData.country) {
          setValidationError('Please select your country')
          return false
        }
        // Basic phone number validation
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
        if (!phoneRegex.test(bookingData.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
          setValidationError('Please enter a valid phone number')
          return false
        }
        return true

      case 'license':
        if (!bookingData.licenseCountry) {
          setValidationError('Please select your license origin country')
          return false
        }
        if (!bookingData.licenseNumber.trim()) {
          setValidationError('Please enter your license number')
          return false
        }
        if (!bookingData.licenseIssueDate) {
          setValidationError('Please select your license issue date')
          return false
        }
        return true

      case 'payment':
        // For payment step, we might want to validate payment method selection
        // This would depend on your payment implementation
        return true

      default:
        return true
    }
  }

  const handleNextStep = async () => {
    // Clear previous validation errors and success messages
    setValidationError('')
    setAuthError('')
    setSuccessMessage('')

    // Validate current step before proceeding
    if (!validateCurrentStep(bookingStep)) {
      return
    }

    try {
      setAuthSubmitLoading(true)

      // Handle auth step differently - login/register
      if (bookingStep === 'auth') {
        await handleAuthSubmission()
        console.log('🔐 Auth completed - let useEffect handle step determination')
        setSuccessMessage('Authentication successful!')
        
        // Clear message after delay
        setTimeout(() => {
          setSuccessMessage('')
        }, 1000)
        return // Exit early to avoid automatic next step progression
      } 
      // For other steps, save data to backend
      else if (bookingStep === 'personal') {
        await savePersonalInfo()
        setProfileCompleteness(prev => ({ ...prev, personal: true }))
        setSuccessMessage('Personal information saved successfully!')
      } 
      else if (bookingStep === 'contact') {
        await saveContactInfo()
        setProfileCompleteness(prev => ({ ...prev, contact: true }))
        setSuccessMessage('Contact information saved successfully!')
      } 
      else if (bookingStep === 'license') {
        await saveLicenseInfo()
        setProfileCompleteness(prev => ({ ...prev, license: true }))
        setSuccessMessage('License information and documents saved successfully!')
      }
      else if (bookingStep === 'payment') {
        // Additional validation before processing payment
        if (!isLoggedIn) {
          throw new Error('Session expired. Please log in again to complete your booking.')
        }
        
        if (!localStorage.getItem('access_token')) {
          setIsLoggedIn(false)
          throw new Error('Authentication token missing. Please log in again.')
        }
        
        await processPaymentAndCreateBooking()
        setSuccessMessage('Payment processed successfully! Your booking has been confirmed.')
      }

      // Wait a bit to show success message, then move to next step (only for non-auth steps)
      if (bookingStep !== 'auth') {
        setTimeout(() => {
          const steps = ['auth', 'personal', 'contact', 'license', 'payment', 'confirmation']
          const currentIndex = steps.indexOf(bookingStep)
          if (currentIndex < steps.length - 1) {
            setBookingStep(steps[currentIndex + 1])
          }
          setSuccessMessage('')
        }, 1000)
      }

    } catch (error) {
      console.error(`Error in ${bookingStep} step:`, error)
      setValidationError(error.message || `Failed to save ${bookingStep} information. Please try again.`)
    } finally {
      setAuthSubmitLoading(false)
    }
  }

  const handleAuthSubmission = async () => {
    if (bookingData.isSignUp) {
      // Register new user
      const result = await register(
        bookingData.name.trim(),
        bookingData.email,
        bookingData.password
      )
      
      if (result.success) {
        setIsLoggedIn(true)
        console.log('🔐 New user registered - useEffect will determine step')
      } else {
        throw new Error(result.error || 'Registration failed')
      }
    } else {
      // Login existing user
      const result = await login(bookingData.email, bookingData.password)
      
      if (result.success) {
        setIsLoggedIn(true)
        
        // Check profile and set appropriate step immediately
        try {
          const profileStatus = await checkUserProfileCompleteness()
          setProfileCompleteness({
            personal: profileStatus.personal,
            contact: profileStatus.contact,
            license: profileStatus.license
          })
          
          setUserDataLoaded(true)
          
          // Jump to payment if profile is complete, otherwise start from personal
          if (profileStatus.personal && profileStatus.contact && profileStatus.license) {
            setBookingStep("payment")
          } else {
            setBookingStep("personal")
          }
        } catch (error) {
          console.error("Error checking profile after login:", error)
          setBookingStep("personal")
        }
      } else {
        throw new Error(result.error || 'Login failed')
      }
    }
  }

  const handlePrevStep = () => {
    // Clear errors when going back
    setValidationError('')
    setAuthError('')
    
    const steps = ['auth', 'personal', 'contact', 'license', 'payment', 'confirmation']
    const currentIndex = steps.indexOf(bookingStep)
    if (currentIndex > 0) {
      setBookingStep(steps[currentIndex - 1])
    }
  }

  // API functions to save user data
  const savePersonalInfo = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token || !user?.id) {
        throw new Error('User not authenticated')
      }

      const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
      
      const personalData = {
        first_name: bookingData.firstName,
        last_name: bookingData.lastName,
        date_of_birth: bookingData.dateOfBirth,
        nationality: bookingData.nationality
      }

      const response = await fetch(`${apiUrl}/users/${user.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(personalData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to save personal information')
      }

      return await response.json()
    } catch (error) {
      console.error('Error saving personal info:', error)
      throw error
    }
  }

  const saveContactInfo = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token || !user?.id) {
        throw new Error('User not authenticated')
      }

      const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
      
      const contactData = {
        phone_number: bookingData.phoneNumber,
        address: bookingData.address,
        city: bookingData.city,
        postal_code: bookingData.postalCode,
        country_of_residence: bookingData.country
      }

      const response = await fetch(`${apiUrl}/users/${user.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(contactData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to save contact information')
      }

      return await response.json()
    } catch (error) {
      console.error('Error saving contact info:', error)
      throw error
    }
  }

  const saveLicenseInfo = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token || !user?.id) {
        throw new Error('User not authenticated')
      }

      const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
      
      // Prepare form data for multipart upload (to handle file uploads)
      const formData = new FormData()
      
      // Add license data
      formData.append('license_number', bookingData.licenseNumber)
      formData.append('issue_date', bookingData.licenseIssueDate)
      formData.append('license_origin_country', bookingData.licenseCountry)
      
      // Add document files if they exist
      if (uploadedDocuments.idFrontDocument) {
        formData.append('id_front_document_url', uploadedDocuments.idFrontDocument)
      }
      if (uploadedDocuments.idBackDocument) {
        formData.append('id_back_document_url', uploadedDocuments.idBackDocument)
      }

      const response = await fetch(`${apiUrl}/users/${user.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to save license information')
      }

      return await response.json()
    } catch (error) {
      console.error('Error saving license info:', error)
      throw error
    }
  }

  const processPaymentAndCreateBooking = async () => {
    try {
      // Debug: Check authentication
      const token = localStorage.getItem('access_token')
      console.log('Access token available:', !!token)
      
      if (!token) {
        console.error('❌ No authentication token found - user should not be at payment step')
        throw new Error('Authentication required. Please log in again.')
      }

      // Double-check the user is actually logged in according to our state
      if (!isLoggedIn) {
        console.error('❌ User state shows not logged in - resetting booking flow')
        setShowBookingFlow(false)
        setBookingStep('auth')
        throw new Error('Session expired. Please log in again to continue booking.')
      }

      // Use booking details from state, with fallback to URL params
      let { pickupDate, dropoffDate } = bookingDetails
      
      // Fallback to URL params if state is empty
      if (!pickupDate || !dropoffDate) {
        pickupDate = searchParams.get('pickupDate')
        dropoffDate = searchParams.get('dropoffDate')
      }
      
      if (!pickupDate || !dropoffDate) {
        throw new Error('Pickup and dropoff dates are required. Please go back and select your dates.')
      }

      if (!selectedCar) {
        throw new Error('No car selected for booking')
      }

      // Calculate total price (basic calculation - you might want to add more logic)
      const startDate = new Date(pickupDate)
      const endDate = new Date(dropoffDate)
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
      
      // Use the correct price field and ensure it's a valid number
      const dailyPrice = Number(selectedCar.price_per_day || 0)
      const totalPrice = days * dailyPrice
      
      console.log('💰 Price calculation:', {
        days,
        dailyPrice,
        totalPrice,
        priceField: selectedCar.price_per_day,
        selectedCarKeys: Object.keys(selectedCar)
      })
      
      if (!totalPrice || totalPrice <= 0) {
        throw new Error('Invalid price calculation. Please check the car pricing information.')
      }

      // Create booking data with proper datetime formatting (using default times)
      const startDateTime = new Date(`${pickupDate}T09:00:00`).toISOString()
      const endDateTime = new Date(`${dropoffDate}T18:00:00`).toISOString()

      const bookingData = {
        listing: selectedCar.id,
        start_time: startDateTime,
        end_time: endDateTime,
        price: totalPrice,
        status: 'confirmed' // Set as confirmed after payment
      }

      console.log('✅ Creating booking with data:', bookingData)
      console.log('✅ Selected car object:', selectedCar)
      console.log('✅ Car ID type:', typeof selectedCar.id, 'Value:', selectedCar.id)
      console.log('✅ Price type:', typeof totalPrice, 'Value:', totalPrice)
      console.log('✅ Auth token exists:', !!localStorage.getItem('access_token'))
      console.log('✅ User logged in state:', isLoggedIn)
      
      // Final validation before sending
      if (!bookingData.listing || bookingData.listing <= 0) {
        throw new Error('Invalid listing ID for booking')
      }
      
      if (!bookingData.price || bookingData.price <= 0) {
        throw new Error('Invalid price for booking')
      }

      // Create the booking
      const booking = await bookingAPI.createBooking(bookingData)
      
      console.log('✅ Booking created successfully:', booking)
      
      // Store booking ID for reference
      localStorage.setItem('lastBookingId', booking.id)
      
      return booking
    } catch (error) {
      console.error('❌ Error processing payment and creating booking:', error)
      
      // If it's an authentication error, reset the flow
      if (error.message.includes('Authentication') || error.message.includes('Session expired')) {
        setIsLoggedIn(false)
        setShowBookingFlow(false)
        setBookingStep('auth')
      }
      
      throw error
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-700">Searching for the best deals...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Enhanced Search Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Location Search */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Where are you going?"
                      value={filters.location}
                      onChange={(e) => {
                        setFilters(prev => ({ ...prev, location: e.target.value }))
                        setShowSuggestions(e.target.value.length > 0)
                      }}
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {showSuggestions && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                        {['Casablanca', 'Rabat', 'Marrakech', 'Fez', 'Tangier', 'Agadir'].map(city => (
                          <button
                            key={city}
                            onClick={() => {
                              setFilters(prev => ({ ...prev, location: city }))
                              setShowSuggestions(false)
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pickup Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date</label>
                  <input
                    type="date"
                    value={filters.pickupDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, pickupDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Return Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
                  <input
                    type="date"
                    value={filters.returnDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, returnDate: e.target.value }))}
                    min={filters.pickupDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                  <button className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search Cars
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary and Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
              <p className="text-gray-700 mt-1">
                Showing {filteredCars.length} cars available{filters.location && ` in ${filters.location}`}
                {filters.pickupDate && filters.returnDate && (
                  <span className="block text-sm text-gray-600 mt-1">
                    📅 {new Date(filters.pickupDate).toLocaleDateString()} to {new Date(filters.returnDate).toLocaleDateString()}
                    {filteredCars.length > 0 && filteredCars[0].rentalDuration && (
                      <span> • {filteredCars[0].rentalDuration} day{filteredCars[0].rentalDuration > 1 ? 's' : ''}</span>
                    )}
                  </span>
                )}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="price_low">
                  {filters.pickupDate && filters.returnDate ? 'Total Price: Low to High' : 'Price: Low to High'}
                </option>
                <option value="price_high">
                  {filters.pickupDate && filters.returnDate ? 'Total Price: High to Low' : 'Price: High to Low'}
                </option>
                <option value="rating">Rating</option>
                <option value="newest">Newest First</option>
              </select>
              {/* Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Filters
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.location || filters.pickupDate || filters.returnDate || filters.priceRange || filters.category || filters.fuelType) && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Active Filters:</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {filters.location && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                    📍 {filters.location}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, location: '' }))}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.pickupDate && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    📅 From: {new Date(filters.pickupDate).toLocaleDateString()}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, pickupDate: '' }))}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.returnDate && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    📅 To: {new Date(filters.returnDate).toLocaleDateString()}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, returnDate: '' }))}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.priceRange && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    💰 ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, priceRange: null }))}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                    🚗 {filters.category}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.fuelType && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                    ⛽ {filters.fuelType}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, fuelType: '' }))}
                      className="ml-2 text-yellow-600 hover:text-yellow-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
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
                    max="5000"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                    className="w-full h-3 bg-gradient-to-r from-orange-100 to-orange-300 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #F97316 0%, #F97316 ${(filters.priceRange[1] / 5000) * 100}%, #E5E7EB ${(filters.priceRange[1] / 5000) * 100}%, #E5E7EB 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-700 font-medium bg-gray-50 px-2 py-1 rounded">0 MAD</span>
                    <span className="text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">{filters.priceRange[1]} MAD</span>
                  </div>
                </div>
              </div>

              {/* Transmission */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Transmission
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Manual', 'Automatic'].map(type => (
                    <button
                      key={type}
                      onClick={() => handleTransmissionToggle(type)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors flex-shrink-0 ${
                        filters.transmission.includes(type)
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Fuel Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(fuel => (
                    <button
                      key={fuel}
                      onClick={() => handleFuelTypeToggle(fuel)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors flex-shrink-0 ${
                        filters.fuelType.includes(fuel)
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500'
                      }`}
                    >
                      {fuel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const allStyles = [
                      'Commercial',
                      'City',
                      'Sedan',
                      'Family',
                      'Minibus',
                      '4x4',
                      'Convertible',
                      'Coupe',
                      'Antique',
                      'Campervan',
                      'SUV'
                    ]
                    const stylesToShow = showAllStyles ? allStyles : allStyles.slice(0, 3)
                    
                    return (
                      <>
                        {stylesToShow.map(style => (
                          <button
                            key={style}
                            onClick={() => handleStyleToggle(style)}
                            className={`px-3 py-2 text-sm rounded-lg border transition-colors flex-shrink-0 ${
                              filters.style.includes(style)
                                ? 'bg-orange-500 text-white border-orange-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                        {!showAllStyles && (
                          <button
                            onClick={() => setShowAllStyles(true)}
                            className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 text-orange-600 hover:bg-gray-100 transition-colors flex-shrink-0 flex items-center justify-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Show More
                          </button>
                        )}
                        {showAllStyles && (
                          <button
                            onClick={() => setShowAllStyles(false)}
                            className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0 flex items-center justify-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Show Less
                          </button>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>

              {/* Brand */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Brand
                </label>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const allBrands = [
                      'Toyota',
                      'BMW',
                      'Mercedes',
                      'Audi',
                      'Volkswagen',
                      'Ford',
                      'Honda',
                      'Nissan',
                      'Chevrolet',
                      'Hyundai',
                      'Kia',
                      'Mazda',
                      'Jeep',
                      'Alfa-Romeo',
                      'Chrysler',
                      'Dacia',
                      'Dodge',
                      'Fiat',
                      'Land-Rover',
                      'Lexus',
                      'Mini',
                      'Mitsubishi',
                      'Opel',
                      'Seat',
                      'Skoda',
                      'Smart',
                      'Suzuki',
                      'Tesla',
                      'Volvo'
                    ]
                    const brandsToShow = showAllBrands ? allBrands : allBrands.slice(0, 3)
                    
                    return (
                      <>
                        {brandsToShow.map(brand => (
                          <button
                            key={brand}
                            onClick={() => handleBrandToggle(brand)}
                            className={`px-3 py-2 text-sm rounded-lg border transition-colors flex-shrink-0 ${
                              filters.brand.includes(brand)
                                ? 'bg-orange-500 text-white border-orange-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500'
                            }`}
                          >
                            {brand}
                          </button>
                        ))}
                        {!showAllBrands && (
                          <button
                            onClick={() => setShowAllBrands(true)}
                            className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 text-orange-600 hover:bg-gray-100 transition-colors flex-shrink-0 flex items-center justify-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Show More
                          </button>
                        )}
                        {showAllBrands && (
                          <button
                            onClick={() => setShowAllBrands(false)}
                            className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0 flex items-center justify-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Show Less
                          </button>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Features
                </label>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const allFeatures = [
                      'Child seat',
                      'GPS',
                      'Air conditioning',
                      'Bike rack',
                      'Roof box',
                      'Cruise control',
                      'Snow tires',
                      'Snow chains',
                      'Apple CarPlay',
                      'Android Auto',
                      'Four-wheel drive'
                    ]
                    const featuresToShow = showAllFeatures ? allFeatures : allFeatures.slice(0, 3)
                    
                    return (
                      <>
                        {featuresToShow.map(feature => (
                          <button
                            key={feature}
                            onClick={() => handleFeatureToggle(feature)}
                            className={`px-3 py-2 text-sm rounded-lg border transition-colors flex-shrink-0 ${
                              filters.features.includes(feature)
                                ? 'bg-orange-500 text-white border-orange-500'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-orange-500'
                            }`}
                          >
                            {feature}
                          </button>
                        ))}
                        {!showAllFeatures && (
                          <button
                            onClick={() => setShowAllFeatures(true)}
                            className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 text-orange-600 hover:bg-gray-100 transition-colors flex-shrink-0 flex items-center justify-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Show More
                          </button>
                        )}
                        {showAllFeatures && (
                          <button
                            onClick={() => setShowAllFeatures(false)}
                            className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0 flex items-center justify-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Show Less
                          </button>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>

              {/* Seats */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Seats
                </label>
                <div className="flex flex-wrap gap-2">
                  {['2', '4', '5', '7', '8+'].map(seats => (
                    <button
                      key={seats}
                      onClick={() => handleSeatsToggle(seats)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors flex-shrink-0 ${
                        filters.seats.includes(seats)
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

              {/* Instant Booking */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.instantBooking}
                    onChange={(e) => handleFilterChange('instantBooking', e.target.checked)}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Instant booking available</span>
                </label>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            {filteredCars.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-600 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a8 8 0 01-8 8 8 8 0 01-8-8 8 8 0 018-8c.28 0 .556.014.827.042l2.651-9.529z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
                <p className="text-gray-700 mb-4">Try adjusting your filters to see more results</p>
                <button
                  onClick={clearFilters}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCars.map((car) => {
                  console.log('Rendering car:', car.name, 'with images:', car.images)
                  const imageUrl = car.images?.[0] || '/carsymbol.jpg'
                  console.log('Using image URL:', imageUrl)
                  
                  return (
                  <div key={car.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
                    {/* Car Image */}
                    <div className="relative">
                      <img
                        src={imageUrl}
                        alt={car.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          console.log('Image failed to load:', imageUrl)
                          e.target.src = '/carsymbol.jpg'
                        }}
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
                      <div className="absolute top-3 right-3 flex flex-col space-y-2">
                        {/* Favorite Button */}
                        <button 
                          onClick={() => toggleFavorite(car.id)}
                          disabled={favoritesLoading}
                          className={`bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors ${
                            isFavorite(car.id) ? 'text-red-500' : 'text-gray-700'
                          } ${favoritesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <svg 
                            className="w-5 h-5" 
                            fill={isFavorite(car.id) ? "currentColor" : "none"} 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
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
                          {car.totalPrice ? (
                            <>
                              <div className="text-2xl font-bold text-orange-500">
                                {car.totalPrice} MAD
                              </div>
                              <div className="text-sm text-gray-700 font-medium">
                                for {car.rentalDuration} day{car.rentalDuration > 1 ? 's' : ''}
                              </div>
                              <div className="text-xs text-gray-500">
                                ({formatPrice(car.price_per_day)} per day)
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-2xl font-bold text-orange-500">
                                {formatPrice(car.price_per_day)}
                              </div>
                              <div className="text-sm text-gray-700 font-medium">
                                {showPricePerDay(car.price_per_day)}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Car Features */}
                      <div className="flex items-center text-sm text-gray-700 mb-4 space-x-4">
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
                          <span className="ml-2 text-sm text-gray-700">
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
                        <button 
                          onClick={() => toggleFavorite(car.id)}
                          disabled={favoritesLoading}
                          className={`px-4 py-3 border rounded-lg transition-colors ${
                            isFavorite(car.id) 
                              ? 'border-red-500 text-red-500 bg-red-50' 
                              : 'border-gray-300 hover:border-orange-500 hover:text-orange-500'
                          } ${favoritesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <svg 
                            className="w-5 h-5" 
                            fill={isFavorite(car.id) ? "currentColor" : "none"} 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  )})}
              </div>
            )}

            {/* Pagination */}
            {filteredCars.length > 0 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button className="px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">1</button>
                  <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">2</button>
                  <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">3</button>
                  <span className="px-3 py-2 text-gray-700">...</span>
                  <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">10</button>
                  <button className="px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
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
        // <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
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
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Summary */}
            {(filters.location || filters.pickupDate) && (
              <div className="bg-blue-50 border-b border-blue-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    {filters.location && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-blue-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="text-blue-800">{filters.location}</span>
                      </div>
                    )}
                    {filters.pickupDate && (
                      <>
                        <span className="text-blue-400">•</span>
                        <span className="text-blue-800">
                          {new Date(filters.pickupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
                          {filters.returnDate ? new Date(filters.returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Return date'}
                        </span>
                        <span className="text-blue-400">•</span>
                        <span className="text-blue-800 font-medium">
                          {calculateDuration(filters.pickupDate, filters.returnDate)} {calculateDuration(filters.pickupDate, filters.returnDate) === 1 ? 'day' : 'days'}
                        </span>
                      </>
                    )}
                  </div>
                  <span className="text-blue-600 text-xs font-medium">Search details</span>
                </div>
              </div>
            )}

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
                      <p className="text-gray-700">Model Year: {selectedCar.modelYear}</p>
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
                      <svg className="w-6 h-6 mx-auto mb-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <div className="text-sm font-medium text-gray-900">{selectedCar.seats}</div>
                      <div className="text-xs text-gray-700">Seats</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <svg className="w-6 h-6 mx-auto mb-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div className="text-sm font-medium text-gray-900">{selectedCar.fuel}</div>
                      <div className="text-xs text-gray-700">Fuel</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <svg className="w-6 h-6 mx-auto mb-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      </svg>
                      <div className="text-sm font-medium text-gray-900">{selectedCar.transmission}</div>
                      <div className="text-xs text-gray-700">Transmission</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <svg className="w-6 h-6 mx-auto mb-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <div className="text-sm font-medium text-gray-900">{selectedCar.mileage}</div>
                      <div className="text-xs text-gray-700">Mileage</div>
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
                          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                            {(selectedCar.pickupProcess?.steps || []).map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Duration:</h5>
                          <p className="text-sm text-gray-700">{selectedCar.pickupProcess?.duration || 'Not specified'}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Requirements:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {(selectedCar.pickupProcess?.requirements || []).map((req, index) => (
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
                    <p className="text-gray-700 leading-relaxed">{selectedCar.description}</p>
                  </div>

                  {/* Owner Rules Card */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Owner Rules</h4>
                    <ul className="space-y-2">
                      {(selectedCar.ownerRules || []).map((rule, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-4 h-4 text-orange-500 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-sm">{rule}</span>
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
                        <p className="text-gray-700">{selectedCar.fuel}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Transmission</h5>
                        <p className="text-gray-700">{selectedCar.transmission}</p>
                      </div>
                    </div>
                  </div>

                  {/* Technical Features Card */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Technical Features</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(selectedCar.technicalFeatures || []).map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Options & Accessories Card */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Options & Accessories</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(selectedCar.optionsAccessories || []).map((option, index) => (
                        <div key={index} className="flex items-center">
                          <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-sm">{option}</span>
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
                        {selectedCar.price_per_day} MAD
                      </div>
                      <div className="text-gray-700">per day</div>
                    </div>

                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-900 mb-3">Duration</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">Pickup:</span>
                          <span className="font-medium text-gray-900">
                            {filters.pickupDate ? 
                              new Date(filters.pickupDate).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              }) : 
                              'Not selected'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">Return:</span>
                          <span className="font-medium text-gray-900">
                            {filters.returnDate ? 
                              new Date(filters.returnDate).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              }) : 
                              'Not selected'
                            }
                          </span>
                        </div>
                        <div className="border-t pt-2 flex justify-between items-center">
                          <span className="font-medium text-gray-900">Total Duration:</span>
                          <span className="font-bold text-gray-900">
                            {calculateDuration(filters.pickupDate, filters.returnDate)} {calculateDuration(filters.pickupDate, filters.returnDate) === 1 ? 'day' : 'days'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-900 mb-3">Total Price</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">
                            {selectedCar.price_per_day} MAD × {calculateDuration(filters.pickupDate, filters.returnDate)} {calculateDuration(filters.pickupDate, filters.returnDate) === 1 ? 'day' : 'days'}
                          </span>
                          <span className="text-gray-900">
                            {(selectedCar.price_per_day * calculateDuration(filters.pickupDate, filters.returnDate)).toLocaleString()} MAD
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Service fee</span>
                          <span className="text-gray-900">50 MAD</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span className="text-gray-900">Total</span>
                          <span className="text-gray-900">
                            {((selectedCar.price_per_day * calculateDuration(filters.pickupDate, filters.returnDate)) + 50).toLocaleString()} MAD
                          </span>
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
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {selectedCar.cancellationPolicy || 'Cancellation policy not specified'}
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-[40px] overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between rounded-t-[40px] z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {bookingStep === 'auth' && 'Sign In / Create Account'}
                  {bookingStep === 'personal' && (
                    <span className="flex items-center">
                      Personal Information
                      {profileCompleteness.personal && (
                        <svg className="w-5 h-5 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                  )}
                  {bookingStep === 'contact' && (
                    <span className="flex items-center">
                      Contact Information
                      {profileCompleteness.contact && (
                        <svg className="w-5 h-5 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                  )}
                  {bookingStep === 'license' && (
                    <span className="flex items-center">
                      Driver License Information
                      {profileCompleteness.license && (
                        <svg className="w-5 h-5 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                  )}
                  {bookingStep === 'payment' && 'Payment Information'}
                  {bookingStep === 'confirmation' && 'Booking Confirmation'}
                </h2>
                <div className="flex space-x-2 mt-2">
                  {['auth', 'personal', 'contact', 'license', 'payment', 'confirmation'].map((step, index) => {
                    let stepStatus = 'bg-gray-200' // default
                    
                    if (step === bookingStep) {
                      stepStatus = 'bg-orange-500' // current step
                    } else if (['auth', 'personal', 'contact', 'license', 'payment', 'confirmation'].indexOf(bookingStep) > index) {
                      stepStatus = 'bg-green-500' // completed step
                    } else if (step === 'personal' && profileCompleteness.personal) {
                      stepStatus = 'bg-green-500' // completed profile section
                    } else if (step === 'contact' && profileCompleteness.contact) {
                      stepStatus = 'bg-green-500' // completed profile section
                    } else if (step === 'license' && profileCompleteness.license) {
                      stepStatus = 'bg-green-500' // completed profile section
                    }
                    
                    return (
                      <div
                        key={step}
                        className={`h-2 w-8 rounded-full ${stepStatus}`}
                      />
                    )
                  })}
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <p className="text-gray-700">
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
                      <span className="px-2 bg-white text-gray-700">Or</span>
                    </div>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {authError && (
                      <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{authError}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {bookingData.isSignUp && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={bookingData.name}
                          onChange={(e) => handleBookingDataChange('name', e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder:text-gray-500"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => handleBookingDataChange('email', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder:text-gray-500"
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
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder:text-gray-500"
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
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder:text-gray-500"
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={authSubmitLoading}
                      className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {authSubmitLoading 
                        ? (bookingData.isSignUp ? 'Creating Account...' : 'Signing In...') 
                        : (bookingData.isSignUp ? 'Create Account' : 'Sign In')
                      }
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

              {/* Driver License Information Step */}
              {bookingStep === 'license' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Driver License Information</h3>
                    {profileCompleteness.license ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-center text-green-700">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">License information already completed</span>
                        </div>
                        <p className="text-green-600 text-xs mt-1">You can update your information below if needed</p>
                      </div>
                    ) : (
                      <p className="text-gray-700">We need your license details for verification</p>
                    )}
                  </div>

                  {validationError && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{validationError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {successMessage && (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-700">{successMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Origin Country</label>
                      <select
                        value={bookingData.licenseCountry}
                        onChange={(e) => handleBookingDataChange('licenseCountry', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
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
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder:text-gray-500"
                        placeholder="Enter license number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                      <input
                        type="date"
                        value={bookingData.licenseIssueDate}
                        onChange={(e) => handleBookingDataChange('licenseIssueDate', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                        required
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Document Upload</h4>
                      <p className="text-blue-700 text-sm mb-3">
                        Please upload clear photos of both sides of your driver license
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            id="frontDocument"
                            accept="image/*"
                            onChange={(e) => handleFileUpload('idFrontDocument', e.target.files[0])}
                            className="hidden"
                          />
                          <svg className="w-8 h-8 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <label 
                            htmlFor="frontDocument" 
                            className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium text-sm block"
                          >
                            {uploadedDocuments.idFrontDocument ? 'Change Front Side' : 'Upload Front Side'}
                          </label>
                          {uploadedDocuments.idFrontDocument && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ {uploadedDocuments.idFrontDocument.name}
                            </p>
                          )}
                        </div>
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            id="backDocument"
                            accept="image/*"
                            onChange={(e) => handleFileUpload('idBackDocument', e.target.files[0])}
                            className="hidden"
                          />
                          <svg className="w-8 h-8 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <label 
                            htmlFor="backDocument" 
                            className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium text-sm block"
                          >
                            {uploadedDocuments.idBackDocument ? 'Change Back Side' : 'Upload Back Side'}
                          </label>
                          {uploadedDocuments.idBackDocument && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ {uploadedDocuments.idBackDocument.name}
                            </p>
                          )}
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
                      disabled={authSubmitLoading}
                      className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {authSubmitLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </div>
                      ) : (
                        'Continue'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Personal Information Step */}
              {bookingStep === 'personal' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
                    {profileCompleteness.personal ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-center text-green-700">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">Personal information already completed</span>
                        </div>
                        <p className="text-green-600 text-xs mt-1">You can update your information below if needed</p>
                      </div>
                    ) : (
                      <p className="text-gray-700">Tell us more about yourself</p>
                    )}
                  </div>

                  {validationError && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{validationError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          value={bookingData.firstName}
                          onChange={(e) => handleBookingDataChange('firstName', e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder:text-gray-500"
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
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder:text-gray-500"
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
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                      <select
                        value={bookingData.nationality}
                        onChange={(e) => handleBookingDataChange('nationality', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
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
                    {profileCompleteness.contact ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-center text-green-700">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">Contact information already completed</span>
                        </div>
                        <p className="text-green-600 text-xs mt-1">You can update your information below if needed</p>
                      </div>
                    ) : (
                      <p className="text-gray-700">We need your contact details and address</p>
                    )}
                  </div>

                  {validationError && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{validationError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={bookingData.phoneNumber}
                        onChange={(e) => handleBookingDataChange('phoneNumber', e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder:text-gray-500"
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
                            className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
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
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder:text-gray-500"
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
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder:text-gray-500"
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
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder:text-gray-500"
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
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
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

              {/* Payment Information Step */}
              {bookingStep === 'payment' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Information</h3>
                    <p className="text-gray-700">Secure payment details</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Booking Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">{selectedCar?.name} {selectedCar?.modelYear}</span>
                        <span className="text-gray-900">{selectedCar?.price} MAD/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">1 day rental</span>
                        <span className="text-gray-900">{selectedCar?.price} MAD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Service fee</span>
                        <span className="text-gray-900">50 MAD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Security deposit (refundable)</span>
                        <span className="text-gray-900">1000 MAD</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">{selectedCar ? selectedCar.price_per_day + 1050 : 1050} MAD</span>
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
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder:text-gray-500"
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
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder:text-gray-500"
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
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder:text-gray-500"
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
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder:text-gray-500"
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
                    <p className="text-gray-700">Your car rental has been successfully booked</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 text-left">
                    <h4 className="font-semibold text-gray-900 mb-4">Booking Details</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Booking ID:</span>
                        <span className="font-medium">#ABC123456</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Car:</span>
                        <span className="font-medium">{selectedCar?.name} {selectedCar?.modelYear}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Pickup:</span>
                        <span className="font-medium">Wed, Aug 20</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Return:</span>
                        <span className="font-medium">Thu, Aug 21</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Location:</span>
                        <span className="font-medium">{selectedCar?.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Total Paid:</span>
                        <span className="font-medium">{selectedCar ? selectedCar.price_per_day + 1050 : 1050} MAD</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-gray-700">
                      You will receive a confirmation email with all the details and pickup instructions.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => router.push('/bookings')}
                        className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                      >
                        View My Bookings
                      </button>
                      <button
                        onClick={handleCloseModal}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Compare Cars</h2>
              <button
                onClick={() => setShowComparison(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comparisonCars.map((car) => (
                  <div key={car.id} className="border rounded-lg p-4">
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      <img
                        src={car.images?.[0] || '/carsymbol.jpg'}
                        alt={car.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{car.name}</h3>
                    <p className="text-gray-600 mb-4">{car.brand} {car.model}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium">{car.price_per_day} MAD/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transmission:</span>
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fuel:</span>
                        <span>{car.fuelType || car.fuel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seats:</span>
                        <span>{car.seats}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Year:</span>
                        <span>{car.modelYear || car.year}</span>
                      </div>
                      {car.availableFeatures && (
                        <div>
                          <span className="text-gray-600">Features:</span>
                          <div className="mt-1">
                            {car.availableFeatures.slice(0, 3).map((feature, index) => (
                              <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1">
                                {feature}
                              </span>
                            ))}
                            {car.availableFeatures.length > 3 && (
                              <span className="text-xs text-gray-500">+{car.availableFeatures.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(car)}
                        className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => setComparisonCars(prev => prev.filter(c => c.id !== car.id))}
                        className="bg-gray-200 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
            <p className="text-gray-700">Loading search results...</p>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
