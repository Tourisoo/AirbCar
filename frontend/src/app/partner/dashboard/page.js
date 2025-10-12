'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import AddVehicleModal from '../../components/AddVehicleModal'
import VehicleManageModal from '../../components/VehicleManageModal'
import QuickEditModal from '../../components/QuickEditModal'

export default function PartnerDashboard() {
  const [activeSection, setActiveSection] = useState('general')
  const { user, loading, updateUser } = useAuth()
  const router = useRouter()
  // State variables
  const [activeTab, setActiveTab] = useState('today')
  const [vehicles, setVehicles] = useState([])
  const [vehiclesLoading, setVehiclesLoading] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showCalendar, setShowCalendar] = useState(false)
  const [partnerData, setPartnerData] = useState(null) // Added partner data state
  const [partnerLoading, setPartnerLoading] = useState(false) // Added partner loading state
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeBookings: 0,
    monthlyEarnings: 0,
    completedRentals: 0
  })
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [showQuickEditModal, setShowQuickEditModal] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [vehicleData, setVehicleData] = useState({
    brand: '',
    model: '',
    year: '',
    color: '',
    fuelType: '',
    transmission: '',
    engineSize: '',
    mileage: '',
    seatingCapacity: '',
    condition: '',
    location: '',
    address: '',
    dailyRate: '',
    weeklyRate: '',
    monthlyRate: '',
    securityDeposit: '',
    registrationNumber: '',
    features: [],
    photos: [],
    description: '',
    availability: 'available',
    bodyType: '',
    doors: '',
    airbags: '',
    insurance: '',
    maintenance: '',
    category: 'economy'
  })

  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  
  // Reservations state
  const [reservations, setReservations] = useState([])
  const [reservationsLoading, setReservationsLoading] = useState(false)
  const [activeReservationTab, setActiveReservationTab] = useState('checking-out')

  const [showAccountSettings, setShowAccountSettings] = useState(false)
  const [showPartnerEditModal, setShowPartnerEditModal] = useState(false)
  const [editingPartnerData, setEditingPartnerData] = useState({
    company_name: '',
    phone: '',
    location: '',
    tax_id: '',
    description: ''
  })
  const [accountFormLoading, setAccountFormLoading] = useState(false)
  const [testResult, setTestResult] = useState('')
  const [showTestModal, setShowTestModal] = useState(false)
  const [accountData, setAccountData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    idNumber: '',
    bankAccount: '**** **** **** 1234',
    businessName: '',
    taxId: '',
    profileImage: 'https://via.placeholder.com/150x150/e5e5e5/888888?text=Profile'
  })
  const [validationErrors, setValidationErrors] = useState({})
  
  // Real-time validation function
  const validateField = (fieldName, value) => {
    let error = ''
    
    switch (fieldName) {
      case 'firstName':
      case 'lastName':
        if (value && value.trim().length < 2) {
          error = 'Must be at least 2 characters long'
        }
        break
      case 'email':
        if (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            error = 'Please enter a valid email address'
          }
        }
        break
      case 'phone':
        if (value) {
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
          if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            error = 'Please enter a valid phone number'
          }
        }
        break
      case 'idNumber':
        if (value && value.trim().length < 5) {
          error = 'Must be at least 5 characters long'
        }
        break
      case 'businessName':
        if (value && value.trim().length < 2) {
          error = 'Must be at least 2 characters long'
        }
        break
      case 'taxId':
        if (value && value.trim().length < 3) {
          error = 'Must be at least 3 characters long'
        }
        break
      case 'address':
        if (value && value.trim().length < 10) {
          error = 'Must be at least 10 characters long'
        }
        break
      case 'dateOfBirth':
        if (value) {
          const birthDate = new Date(value)
          const today = new Date()
          const age = today.getFullYear() - birthDate.getFullYear()
          
          if (isNaN(birthDate.getTime())) {
            error = 'Please enter a valid date'
          } else if (age < 18) {
            error = 'You must be at least 18 years old'
          } else if (age > 100) {
            error = 'Please enter a valid date'
          }
        }
        break
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: error
    }))
    
    return error === ''
  }
  
  // Handle input changes with validation
  const handleAccountInputChange = (fieldName, value) => {
    setAccountData(prev => ({
      ...prev,
      [fieldName]: value
    }))
    
    // Validate the field in real-time
    validateField(fieldName, value)
  }

  // Car brands and their popular models
  const carBrands = {
    'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Avalon', 'Sienna'],
    'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit', 'HR-V', 'Odyssey'],
    'Ford': ['F-150', 'Escape', 'Explorer', 'Fusion', 'Edge', 'Expedition', 'Mustang'],
    'Chevrolet': ['Silverado', 'Equinox', 'Malibu', 'Traverse', 'Tahoe', 'Camaro', 'Impala'],
    'Nissan': ['Sentra', 'Altima', 'Rogue', 'Pathfinder', 'Maxima', 'Armada', 'Titan'],
    'BMW': ['3 Series', '5 Series', 'X3', 'X5', '7 Series', 'X1', 'X7'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class', 'A-Class', 'GLS'],
    'Audi': ['A4', 'A6', 'Q5', 'Q7', 'A3', 'Q3', 'A8'],
    'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Genesis', 'Veloster', 'Palisade'],
    'Kia': ['Optima', 'Sorento', 'Sportage', 'Soul', 'Forte', 'Stinger', 'Telluride'],
    'Volkswagen': ['Jetta', 'Passat', 'Tiguan', 'Atlas', 'Golf', 'Beetle', 'Arteon'],
    'Mazda': ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'MX-5 Miata', 'CX-3', 'CX-30'],
    'Subaru': ['Outback', 'Forester', 'Impreza', 'Legacy', 'Ascent', 'Crosstrek', 'WRX'],
    'Lexus': ['ES', 'RX', 'NX', 'GX', 'LS', 'UX', 'LX'],
    'Other': []
  }

  // Form validation
  const validateStep = (step) => {
    const errors = {}
    
    switch (step) {
      case 1:
        if (!vehicleData.brand) errors.brand = 'Brand is required'
        if (!vehicleData.model) errors.model = 'Model is required'
        if (!vehicleData.year) errors.year = 'Year is required'
        if (!vehicleData.color) errors.color = 'Color is required'
        break
      case 2:
        if (!vehicleData.fuelType) errors.fuelType = 'Fuel type is required'
        if (!vehicleData.transmission) errors.transmission = 'Transmission is required'
        if (!vehicleData.seatingCapacity) errors.seatingCapacity = 'Seating capacity is required'
        if (!vehicleData.bodyType) errors.bodyType = 'Body type is required'
        break
      case 3:
        if (vehicleData.features.length === 0) errors.features = 'Select at least one feature'
        break
      case 4:
        if (!vehicleData.dailyRate || vehicleData.dailyRate <= 0) errors.dailyRate = 'Daily rate is required and must be positive'
        if (!vehicleData.location) errors.location = 'Location is required'
        break
      case 5:
        if (!vehicleData.registrationNumber) errors.registrationNumber = 'Registration number is required'
        if (vehicleData.photos.length === 0) errors.photos = 'At least one photo is required'
        break
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }
  // Fetch partner data from backend API
  const fetchPartnerData = async (partnerId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/partners/${partnerId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
      })

      if (!response.ok) {
        console.error(`Partner API Error: ${response.status} ${response.statusText}`)
        const errorText = await response.text()
        console.error('Error response body:', errorText)
        
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const partnerData = await response.json()
      console.log('Partner API URL used:', `http://127.0.0.1:8000/partners/${partnerId}/`)
      console.log('Partner Response status:', response.status)
      console.log('Fetched partner data:', partnerData)
      
      return partnerData
    } catch (error) {
      console.error('Error fetching partner data:', error)
      return null
    }
  }

  // Fetch vehicles from backend API
  const fetchVehicles = async (partnerId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/listings/?partner=${partnerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
      })

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`)
        const errorText = await response.text()
        console.error('Error response body:', errorText)
        
        // Try to parse as JSON if possible
        try {
          const errorJson = JSON.parse(errorText)
          console.error('Error response JSON:', errorJson)
        } catch (e) {
          console.error('Error response is not JSON')
        }
        
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API URL used:', `http://127.0.0.1:8000/listings/?partner=${partnerId}`)
      console.log('Response status:', response.status)
      console.log('Fetched vehicles data:', data)
      console.log('Data type:', typeof data)
      console.log('Is array:', Array.isArray(data))
      console.log('Number of vehicles:', Array.isArray(data) ? data.length : 'N/A - not an array')
      
      // Log each vehicle's partner info
      if (Array.isArray(data) && data.length > 0) {
        console.log('Partner info from vehicles:')
        data.forEach((vehicle, index) => {
          console.log(`Vehicle ${index + 1}:`, {
            id: vehicle.id,
            make: vehicle.make,
            model: vehicle.model,
            partner: vehicle.partner,
            location: vehicle.location
          })
        })
      }

      // The API returns an array directly for partner-specific requests
      let vehiclesArray = data
      
      // Handle different response formats
      if (!Array.isArray(data)) {
        if (data.results && Array.isArray(data.results)) {
          // Paginated response
          vehiclesArray = data.results
          console.log('Found paginated results:', vehiclesArray.length, 'vehicles')
        } else if (data.listings && Array.isArray(data.listings)) {
          // Nested listings
          vehiclesArray = data.listings
          console.log('Found nested listings:', vehiclesArray.length, 'vehicles')
        } else {
          console.error('Unexpected response format:', data)
          return []
        }
      }
      
      console.log('Processing vehicles array:', vehiclesArray)
      console.log('Sample vehicle structure:', vehiclesArray[0])
      
      const transformedVehicles = vehiclesArray.map(vehicle => {
        console.log('Processing vehicle:', vehicle.id, 'with pictures:', vehicle.pictures)
        const processedImage = vehicle.pictures && vehicle.pictures.length > 0 ? getFullImageUrl(vehicle.pictures[0]) : '/pictures_car_example/image_front.png'
        console.log('Original image URL:', vehicle.pictures?.[0])
        console.log('Processed image URL:', processedImage)
        
        return {
          id: vehicle.id,
          partner_id: vehicle.partner, // Use 'partner' field from API
          owner_id: vehicle.partner, // Use 'partner' field as owner_id too
          brand: vehicle.make, // API uses 'make' field
          model: vehicle.model,
          year: vehicle.year,
          image: processedImage,
          pictures: vehicle.pictures ? vehicle.pictures.map(pic => getFullImageUrl(pic)) : [],
        dailyRate: parseFloat(vehicle.price_per_day || 0),
        location: vehicle.location,
        status: vehicle.availability ? 'available' : 'unavailable',
        availability: vehicle.availability,
        bookings: 0, // Not provided in API
        rating: vehicle.rating || 0,
        fuelType: vehicle.fuel_type,
        transmission: vehicle.transmission,
        seatingCapacity: vehicle.seating_capacity,
        condition: vehicle.vehicle_condition,
        features: vehicle.features || [],
        description: vehicle.vehicle_description || '',
        earnings: 0, // Not provided in API
        registrationNumber: '', // Not provided in API
        securityDeposit: parseFloat(vehicle.price_per_day || 0) * 2, // Calculate as 2x daily rate
        weeklyRate: parseFloat(vehicle.price_per_day || 0) * 7 * 0.85, // Calculate weekly rate
        monthlyRate: parseFloat(vehicle.price_per_day || 0) * 30 * 0.70, // Calculate monthly rate
        color: '', // Not provided in API
        engineSize: '', // Not provided in API
        mileage: '', // Not provided in API
          address: vehicle.location, // Use location as address
          created_at: vehicle.created_at
        }
      })

      console.log('Transformed vehicles for partner', partnerId, ':', transformedVehicles)
      console.log('Number of transformed vehicles:', transformedVehicles.length)
      
      return transformedVehicles
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      return []
    }
  }

  // Delete all vehicles for a partner
  const deletePartnerVehicles = async (partnerId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/listings/?partner=${partnerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
      })

      if (!response.ok) {
        console.error(`DELETE API Error: ${response.status} ${response.statusText}`)
        const errorText = await response.text()
        console.error('Delete error response body:', errorText)
        
        // Try to parse as JSON if possible
        try {
          const errorJson = JSON.parse(errorText)
          console.error('Delete error response JSON:', errorJson)
        } catch (e) {
          console.error('Delete error response is not JSON')
        }
        
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('DELETE API URL used:', `http://127.0.0.1:8000/listings/?partner=${partnerId}`)
      console.log('Delete response status:', response.status)
      console.log('Delete result:', result)
      
      return result
    } catch (error) {
      console.error('Error deleting partner vehicles:', error)
      throw error
    }
  }

  // Calendar helper functions
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const isToday = (date) => {
    const today = new Date()
    return date?.toDateString() === today.toDateString()
  }

  const isSameDay = (date1, date2) => {
    return date1?.toDateString() === date2?.toDateString()
  }

  const changeMonth = (increment) => {
    setSelectedDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + increment)
      return newDate
    })
  }

  // Helper function to get full image URL
  const getFullImageUrl = (imageUrl) => {
    console.log('getFullImageUrl called with:', imageUrl)
    
    if (!imageUrl) {
      console.log('No image URL provided, using fallback')
      return '/pictures_car_example/image_front.png'
    }
    
    // If it's already a full URL (starts with http), return as is
    if (imageUrl.startsWith('http')) {
      console.log('Full URL detected, returning as is:', imageUrl)
      return imageUrl
    }
    
    // If it's a relative path starting with /, add base URL
    if (imageUrl.startsWith('/')) {
      const fullUrl = `http://localhost:8000${imageUrl}`
      console.log('Relative path with /, constructed URL:', fullUrl)
      return fullUrl
    }
    
    // If it's a relative path without /, add base URL with /
    const fullUrl = `http://localhost:8000/${imageUrl}`
    console.log('Relative path without /, constructed URL:', fullUrl)
    return fullUrl
  };

  // Debug logging for state changes
  useEffect(() => {
    console.log('Dashboard state update:', {
      loading,
      user: user ? { id: user.id, email: user.email, is_partner: user.is_partner } : null,
      hasPartnerData: !!partnerData,
      vehicleCount: vehicles.length
    })
  }, [loading, user, partnerData, vehicles])

  useEffect(() => {
    // Don't run if auth is still loading
    if (loading) {
      console.log('Auth still loading, waiting...')
      return
    }
    
    // Redirect if no user after loading is complete
    if (!user) {
      console.log('No user found after auth loading complete, redirecting to login')
      router.push('/auth/signin')
      return
    }

    // Load data from backend API whenever user changes
    const loadAllData = async () => {
      try {
        setVehiclesLoading(true)
        setPartnerLoading(true)
        console.log('Loading data for authenticated user...')
        
        // Verify user is authenticated
        if (!user) {
          console.error('No authenticated user for loading data')
          setVehicles([])
          setPartnerData(null)
          setAccountData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            dateOfBirth: '',
            idNumber: '',
            bankAccount: '**** **** **** 1234',
            businessName: '',
            taxId: '',
            profileImage: 'https://via.placeholder.com/150x150/e5e5e5/888888?text=Profile'
          })
          return
        }
        
        // Get partner ID - try multiple approaches
        let partnerId = user.partner_id || user.id
        console.log('Initial partner ID from user:', partnerId)
        console.log('User object:', user)
        
        // If user doesn't have partner_id, try to find their partner record
        if (!user.partner_id && user.is_partner) {
          console.log('User is partner but no partner_id found, searching for partner record...')
          try {
            // First try to get all partners and find the one for this user
            const partnersResponse = await fetch('http://127.0.0.1:8000/partners/', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
              },
            })
            
            if (partnersResponse.ok) {
              const partnersData = await partnersResponse.json()
              console.log('All partners data:', partnersData)
              
              // Find partner record for current user
              const userPartner = partnersData.find(partner => partner.user?.id === user.id)
              if (userPartner) {
                partnerId = userPartner.id
                console.log('Found partner record with ID:', partnerId)
              }
            }
          } catch (error) {
            console.error('Error finding partner record:', error)
          }
        }
        
        // Fetch partner data from the specific endpoint
        const partnerInfo = await fetchPartnerData(partnerId)
        if (partnerInfo) {
          console.log('Loaded partner data:', partnerInfo)
          console.log('Partner user data:', partnerInfo.user)
          console.log('User phone_number:', partnerInfo.user?.phone_number)
          console.log('User address:', partnerInfo.user?.address)
          console.log('User date_of_birth:', partnerInfo.user?.date_of_birth)
          console.log('User id_number:', partnerInfo.user?.id_number)
          setPartnerData(partnerInfo)
          
          // Update account data with partner information
          setAccountData({
            firstName: partnerInfo.user?.first_name || '',
            lastName: partnerInfo.user?.last_name || '',
            email: partnerInfo.user?.email || '',
            phone: partnerInfo.user?.phone_number || partnerInfo.user?.phone || '',
            address: partnerInfo.user?.address || '',
            dateOfBirth: partnerInfo.user?.date_of_birth || '',
            idNumber: partnerInfo.user?.id_number || partnerInfo.user?.license_number || '',
            bankAccount: '**** **** **** 1234',
            businessName: partnerInfo.company_name || '',
            taxId: partnerInfo.tax_id || '',
            profileImage: partnerInfo.user?.profile_picture || 'https://via.placeholder.com/150x150/e5e5e5/888888?text=Profile'
          })
          
          // Update stats based on partner data
          const totalVehicles = partnerInfo.listings ? partnerInfo.listings.length : 0
          console.log('Total vehicles from partner data:', totalVehicles)
          
          // Calculate earnings from vehicles
          let totalEarnings = 0
          if (partnerInfo.listings) {
            totalEarnings = partnerInfo.listings.reduce((sum, vehicle) => {
              return sum + (parseFloat(vehicle.price_per_day) || 0) * 30 // Estimated monthly
            }, 0)
          }
          
          setStats(prev => ({
            ...prev,
            totalVehicles: totalVehicles,
            monthlyEarnings: Math.round(totalEarnings),
            activeBookings: Math.floor(totalVehicles * 2.5), // Estimated
            completedRentals: Math.floor(totalVehicles * 15) // Estimated
          }))
          
          // Transform partner listings to vehicles format for consistency
          if (partnerInfo.listings) {
            const transformedVehicles = partnerInfo.listings.map(listing => ({
              id: listing.id,
              partner_id: partnerId,
              owner_id: partnerId,
              brand: listing.make,
              model: listing.model,
              year: listing.year,
              image: listing.pictures && listing.pictures.length > 0 
                ? getFullImageUrl(listing.pictures[0]) 
                : '/pictures_car_example/image_front.png',
              pictures: listing.pictures ? listing.pictures.map(pic => getFullImageUrl(pic)) : [],
              dailyRate: parseFloat(listing.price_per_day || 0),
              location: listing.location || '',
              status: 'available',
              availability: true,
              bookings: Math.floor(Math.random() * 10), // Random for demo
              rating: 4.0 + Math.random(), // Random for demo
              fuelType: 'Petrol', // Default
              transmission: 'Manual', // Default
              seatingCapacity: 2, // Default
              condition: 'Good', // Default
              features: [],
              description: '',
              earnings: parseFloat(listing.price_per_day || 0) * 30,
              registrationNumber: '',
              securityDeposit: parseFloat(listing.price_per_day || 0) * 2,
              weeklyRate: parseFloat(listing.price_per_day || 0) * 7 * 0.85,
              monthlyRate: parseFloat(listing.price_per_day || 0) * 30 * 0.70,
              color: '',
              engineSize: '',
              mileage: '',
              address: listing.location || '',
              created_at: listing.created_at || new Date().toISOString()
            }))
            
            console.log('Transformed vehicles from partner data:', transformedVehicles)
            setVehicles(transformedVehicles)
          } else {
            setVehicles([])
          }
        } else {
          console.log('No partner data found, fetching vehicles separately...')
          // Fallback: fetch vehicles separately if partner data is not available
          const partnerVehicles = await fetchVehicles(partnerId)
          console.log('Loaded vehicles for partner ID', partnerId, ':', partnerVehicles)
          setVehicles(partnerVehicles)
        }
        
      } catch (error) {
        console.error('Error loading data:', error)
        setVehicles([])
        setPartnerData(null)
      } finally {
        setVehiclesLoading(false)
        setPartnerLoading(false)
      }
    }

    // Load data whenever user changes (including account switching)
    if (user) {
      loadAllData()
    } else {
      // Clear data when no user is authenticated
      setVehicles([])
      setPartnerData(null)
      setAccountData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        idNumber: '',
        bankAccount: '**** **** **** 1234',
        businessName: '',
        taxId: '',
        profileImage: 'https://via.placeholder.com/150x150/e5e5e5/888888?text=Profile'
      })
    }

    // Check URL parameters for initial tab
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get('tab')
    const actionParam = urlParams.get('action')
    
    if (tabParam && ['today', 'calendar', 'listings', 'bookings','rentalpolicies', 'earnings', 'menu'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
    
    if (actionParam === 'add-vehicle') {
      setShowAddVehicleModal(true)
      setCurrentStep(1)
    }

    // Listen for header menu events
    const handleSwitchTab = (event) => {
      setActiveTab(event.detail)
    }

    const handleOpenAddVehicle = () => {
      setShowAddVehicleModal(true)
      setCurrentStep(1)
    }

    window.addEventListener('switchTab', handleSwitchTab)
    window.addEventListener('openAddVehicle', handleOpenAddVehicle)

    return () => {
      window.removeEventListener('switchTab', handleSwitchTab)
      window.removeEventListener('openAddVehicle', handleOpenAddVehicle)
    }
  }, [user, user?.partner_id, user?.id, loading, router])

  // Load reservations when vehicles change or when bookings tab is accessed
  useEffect(() => {
    if (user && vehicles.length > 0 && (activeTab === 'bookings' || activeTab === 'today')) {
      loadReservations()
    }
  }, [user, vehicles, activeTab])

  // Function to refresh data from backend
  const refreshAllData = async () => {
    try {
      setVehiclesLoading(true)
      setPartnerLoading(true)
      console.log('Refreshing all data...')
      
      // Verify user is authenticated
      if (!user) {
        console.error('No authenticated user for refresh')
        setVehicles([])
        setPartnerData(null)
        return
      }
      
      // Use partner ID from authenticated user
      const partnerId = user.partner_id || user.id
      console.log('Refresh - Using partner ID from authenticated user:', partnerId)
      
      // Fetch partner data from the specific endpoint
      const partnerInfo = await fetchPartnerData(partnerId)
      if (partnerInfo) {
        console.log('Refreshed partner data:', partnerInfo)
        setPartnerData(partnerInfo)
        
        // Update account data
        setAccountData({
          firstName: partnerInfo.user?.first_name || '',
          lastName: partnerInfo.user?.last_name || '',
          email: partnerInfo.user?.email || '',
          phone: partnerInfo.user?.phone_number || partnerInfo.user?.phone || '',
          address: partnerInfo.user?.address || '',
          dateOfBirth: partnerInfo.user?.date_of_birth || '',
          idNumber: partnerInfo.user?.id_number || partnerInfo.user?.license_number || '',
          bankAccount: '**** **** **** 1234',
          businessName: partnerInfo.company_name || '',
          taxId: partnerInfo.tax_id || '',
          profileImage: partnerInfo.user?.profile_picture || 'https://via.placeholder.com/150x150/e5e5e5/888888?text=Profile'
        })
        
        // Update stats
        const totalVehicles = partnerInfo.listings ? partnerInfo.listings.length : 0
        let totalEarnings = 0
        if (partnerInfo.listings) {
          totalEarnings = partnerInfo.listings.reduce((sum, vehicle) => {
            return sum + (parseFloat(vehicle.price_per_day) || 0) * 30
          }, 0)
        }
        
        setStats(prev => ({
          ...prev,
          totalVehicles: totalVehicles,
          monthlyEarnings: Math.round(totalEarnings),
          activeBookings: Math.floor(totalVehicles * 2.5),
          completedRentals: Math.floor(totalVehicles * 15)
        }))
        
        // Transform partner listings to vehicles format
        if (partnerInfo.listings) {
          const transformedVehicles = partnerInfo.listings.map(listing => ({
            id: listing.id,
            partner_id: partnerId,
            owner_id: partnerId,
            brand: listing.make,
            model: listing.model,
            year: listing.year,
            image: listing.pictures && listing.pictures.length > 0 
              ? getFullImageUrl(listing.pictures[0]) 
              : '/pictures_car_example/image_front.png',
            pictures: listing.pictures ? listing.pictures.map(pic => getFullImageUrl(pic)) : [],
            dailyRate: parseFloat(listing.price_per_day || 0),
            location: listing.location || '',
            status: 'available',
            availability: true,
            bookings: Math.floor(Math.random() * 10),
            rating: 4.0 + Math.random(),
            fuelType: 'Petrol',
            transmission: 'Manual',
            seatingCapacity: 2,
            condition: 'Good',
            features: [],
            description: '',
            earnings: parseFloat(listing.price_per_day || 0) * 30,
            registrationNumber: '',
            securityDeposit: parseFloat(listing.price_per_day || 0) * 2,
            weeklyRate: parseFloat(listing.price_per_day || 0) * 7 * 0.85,
            monthlyRate: parseFloat(listing.price_per_day || 0) * 30 * 0.70,
            color: '',
            engineSize: '',
            mileage: '',
            address: listing.location || '',
            created_at: listing.created_at || new Date().toISOString()
          }))
          
          setVehicles(transformedVehicles)
        } else {
          setVehicles([])
        }
      } else {
        // Fallback to separate vehicles fetch
        const partnerVehicles = await fetchVehicles(partnerId)
        setVehicles(partnerVehicles)
      }
    } catch (error) {
      console.error('Error refreshing data:', error)
      setVehicles([])
      setPartnerData(null)
    } finally {
      setVehiclesLoading(false)
      setPartnerLoading(false)
    }
  }

  const handleAddVehicle = () => {
    setShowAddVehicleModal(true)
    setCurrentStep(1)
  }

  const handleQuickEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle)
    setShowQuickEditModal(true)
  }

  const handleManageVehicle = (vehicle) => {
    setSelectedVehicle(vehicle)
    setShowManageModal(true)
  }

  const handleUpdateVehicle = (updatedVehicle) => {
    setVehicles(prev => prev.map(v => 
      v.id === updatedVehicle.id ? { ...v, ...updatedVehicle } : v
    ))
  }

  const handleDeleteVehicle = (vehicleId) => {
    setVehicles(prev => prev.filter(v => v.id !== vehicleId))
  }

  // Toggle vehicle availability for search results
  const handleToggleAvailability = async (vehicle) => {
    try {
      const newAvailability = !vehicle.availability
      const token = localStorage.getItem('access_token')
      
      if (!token) {
        alert('Please log in to update vehicle availability')
        return
      }

      console.log('Toggling availability for vehicle:', vehicle.id, 'to:', newAvailability)

      // Show loading state by temporarily updating the UI
      setVehicles(prev => prev.map(v => 
        v.id === vehicle.id 
          ? { ...v, isUpdating: true } 
          : v
      ))

      // Update in backend - use the correct field name from the model
      const updateData = {
        availability: newAvailability
      }

      console.log('Sending update data:', updateData)

      const response = await fetch(`http://127.0.0.1:8000/listings/${vehicle.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Backend response error:', response.status, errorText)
        
        // Try to parse error response for better user feedback
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorJson = JSON.parse(errorText)
          if (errorJson.detail) {
            errorMessage = errorJson.detail
          } else if (errorJson.availability) {
            errorMessage = `Availability: ${errorJson.availability.join(', ')}`
          }
        } catch (parseError) {
          // Use default error message
        }
        
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log('Backend response:', result)

      // Update local state with the response from backend
      setVehicles(prev => prev.map(v => 
        v.id === vehicle.id 
          ? { 
              ...v, 
              availability: result.availability !== undefined ? result.availability : newAvailability,
              status: (result.availability !== undefined ? result.availability : newAvailability) ? 'available' : 'unavailable',
              isUpdating: false
            } 
          : v
      ))

      // Show success message with better UX
      const statusText = newAvailability ? 'available for booking' : 'unavailable for booking'
      const successMessage = `✅ ${vehicle.brand} ${vehicle.model} is now ${statusText}`
      
      // You could replace this alert with a toast notification for better UX
      alert(successMessage)
      
    } catch (error) {
      console.error('Error toggling availability:', error)
      
      // Revert the loading state
      setVehicles(prev => prev.map(v => 
        v.id === vehicle.id 
          ? { ...v, isUpdating: false } 
          : v
      ))
      
      // Show user-friendly error message
      const errorMessage = error.message.includes('HTTP error') 
        ? 'Failed to update vehicle availability. Please try again.'
        : error.message
      
      alert(`❌ ${errorMessage}`)
    }
  }

  // Load reservations from backend
  const loadReservations = async () => {
    try {
      setReservationsLoading(true)
      console.log('Loading reservations for authenticated user...')
      
      // Verify user is authenticated
      if (!user) {
        console.error('No authenticated user for loading reservations')
        setReservations([])
        return
      }

      // Get access token
      const accessToken = localStorage.getItem('access_token')
      if (!accessToken) {
        console.error('No access token available')
        setReservations([])
        return
      }

      // Fetch reservations from backend
      const response = await fetch(`http://127.0.0.1:8000/bookings/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error(`Reservations API Error: ${response.status} ${response.statusText}`)
        setReservations([])
        return
      }

      const reservationsData = await response.json()
      console.log('Loaded reservations:', reservationsData)
      
      // Transform and filter reservations based on partner's vehicles
      const partnerReservations = reservationsData.filter(reservation => {
        // Check if this reservation is for one of the partner's vehicles
        return vehicles.some(vehicle => vehicle.id === reservation.listing?.id)
      })

      setReservations(partnerReservations)
    } catch (error) {
      console.error('Error loading reservations:', error)
      setReservations([])
    } finally {
      setReservationsLoading(false)
    }
  }

  // Helper functions to categorize reservations
  const getReservationsByStatus = (status) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return reservations.filter(reservation => {
      const startDate = new Date(reservation.start_time)
      const endDate = new Date(reservation.end_time)
      
      switch (status) {
        case 'checking-out':
          // Ending today
          return endDate.toDateString() === today.toDateString() && reservation.status === 'active'
        case 'currently-hosting':
          // Currently active (between start and end date)
          return today >= startDate && today <= endDate && reservation.status === 'active'
        case 'arriving-soon':
          // Starting today or tomorrow
          return (startDate.toDateString() === today.toDateString() || 
                  startDate.toDateString() === tomorrow.toDateString()) && 
                 reservation.status === 'confirmed'
        case 'upcoming':
          // Future bookings (more than 1 day away)
          return startDate > tomorrow && reservation.status === 'confirmed'
        case 'pending-review':
          // Completed bookings pending review
          return endDate < today && reservation.status === 'completed'
        default:
          return false
      }
    })
  }

  const getReservationCount = (status) => {
    return getReservationsByStatus(status).length
  }

  const handleVehicleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    // Clear any existing error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }))
    }
    
    if (type === 'checkbox') {
      if (name === 'features') {
        const updatedFeatures = checked 
          ? [...vehicleData.features, value]
          : vehicleData.features.filter(feature => feature !== value)
        setVehicleData({
          ...vehicleData,
          features: updatedFeatures
        })
      }
    } else if (type === 'file') {
      if (name === 'photos') {
        const files = Array.from(e.target.files)
        const validFiles = files.filter(file => {
          const isValidType = file.type.startsWith('image/')
          const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit
          return isValidType && isValidSize
        })
        
        if (validFiles.length !== files.length) {
          alert('Some files were skipped. Please ensure all files are images under 5MB.')
        }
        
        setVehicleData({
          ...vehicleData,
          photos: [...vehicleData.photos, ...validFiles]
        })
      }
    } else {
      let updatedData = { ...vehicleData, [name]: value }
      
      // Auto-clear model when brand changes
      if (name === 'brand') {
        updatedData.model = ''
      }
      
      // Auto-calculate rates with better logic
      if (name === 'dailyRate' && value) {
        const daily = parseFloat(value)
        if (!isNaN(daily) && daily > 0) {
          updatedData.weeklyRate = Math.round(daily * 7 * 0.85) // 15% weekly discount
          updatedData.monthlyRate = Math.round(daily * 30 * 0.70) // 30% monthly discount
          updatedData.securityDeposit = Math.round(daily * 2) // 2 days worth as security
        }
      }
      
      // Auto-set category based on daily rate
      if (name === 'dailyRate' && value) {
        const daily = parseFloat(value)
        if (!isNaN(daily)) {
          if (daily <= 50) updatedData.category = 'economy'
          else if (daily <= 100) updatedData.category = 'mid-size'
          else if (daily <= 200) updatedData.category = 'luxury'
          else updatedData.category = 'premium'
        }
      }
      
      setVehicleData(updatedData)
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleVehicleSubmit = async (data) => {
    // The AddVehicleModal now handles the backend submission
    // This function will be called after successful submission
    if (data) {
      // Use the backend's returned data, especially for images
      const newVehicle = {
        id: data.id || Date.now(), // Use backend ID or generate temporary one
        partner_id: data.partner || user?.id,
        owner_id: data.partner || user?.id,
        brand: data.make || data.brand,
        model: data.model,
        year: data.year,
        // Use pictures from backend response, fallback to uploaded photos, then default
        image: (data.pictures && data.pictures.length > 0) 
          ? data.pictures[0] 
          : (data.photos && data.photos.length > 0) 
            ? (typeof data.photos[0] === 'string' ? data.photos[0] : URL.createObjectURL(data.photos[0]))
            : '/pictures_car_example/image_front.png',
        pictures: data.pictures || data.photos || [],
        dailyRate: parseFloat(data.price_per_day || data.dailyRate || 0),
        location: data.location,
        status: data.availability ? 'available' : 'active',
        availability: data.availability !== undefined ? data.availability : true,
        bookings: 0,
        rating: data.rating || 0,
        fuelType: data.fuel_type || data.fuelType,
        transmission: data.transmission,
        seatingCapacity: data.seating_capacity || data.seatingCapacity,
        condition: data.vehicle_condition || data.condition,
        features: data.features || [],
        description: data.vehicle_description || data.description || '',
        earnings: 0,
        registrationNumber: data.registrationNumber || '',
        securityDeposit: parseFloat(data.dailyRate || data.price_per_day || 0) * 2,
        weeklyRate: parseFloat(data.dailyRate || data.price_per_day || 0) * 7 * 0.85,
        monthlyRate: parseFloat(data.dailyRate || data.price_per_day || 0) * 30 * 0.70,
        color: data.color || '',
        engineSize: data.engineSize || '',
        mileage: data.mileage || '',
        address: data.location,
        created_at: data.created_at || new Date().toISOString()
      }
      
      console.log('Adding new vehicle to listings:', newVehicle)
      console.log('Vehicle image URL:', newVehicle.image)
      
      setVehicles(prev => [...prev, newVehicle])
      
      // Refresh data from backend to get the latest information with proper URLs
      setTimeout(async () => {
        try {
          console.log('Refreshing all data after adding new vehicle...')
          await refreshAllData()
        } catch (error) {
          console.error('Error refreshing data after add:', error)
        }
      }, 1000) // Small delay to ensure backend processing is complete
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalVehicles: prev.totalVehicles + 1
      }))
      
      // Reset form data
      setVehicleData({
        brand: '', model: '', year: '', color: '', fuelType: '', transmission: '',
        engineSize: '', mileage: '', seatingCapacity: '', condition: '', location: '',
        address: '', dailyRate: '', weeklyRate: '', monthlyRate: '', securityDeposit: '',
        registrationNumber: '', features: [], photos: [], description: '',
        availability: 'available', bodyType: '', doors: '', airbags: '',
        insurance: '', maintenance: '', category: 'economy'
      })
    }
  }

  // Test function to verify database connection and data submission
  const testDatabaseConnection = async () => {
    setTestResult('🔄 Starting database connection test...\n')
    
    try {
      // Test 1: Check authentication
      setTestResult(prev => prev + '✅ Test 1: Authentication check\n')
      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new Error('No authentication token found')
      }
      setTestResult(prev => prev + `   Token exists: ${token.substring(0, 20)}...\n`)

      // Test 2: Fetch current user data
      setTestResult(prev => prev + '\n🔄 Test 2: Fetching current user data\n')
      const userResponse = await fetch(`http://127.0.0.1:8000/users/${user.id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!userResponse.ok) {
        throw new Error(`Failed to fetch user: ${userResponse.status}`)
      }

      const userData = await userResponse.json()
      setTestResult(prev => prev + `✅ User data fetched successfully\n`)
      setTestResult(prev => prev + `   User ID: ${userData.id}\n`)
      setTestResult(prev => prev + `   Email: ${userData.email}\n`)
      setTestResult(prev => prev + `   Name: ${userData.first_name} ${userData.last_name}\n`)

      // Test 3: Test user data update with safe data
      setTestResult(prev => prev + '\n🔄 Test 3: Testing user data update\n')
      const testUpdateData = {
        first_name: userData.first_name || 'Test',
        last_name: userData.last_name || 'User'
      }

      const updateResponse = await fetch(`http://127.0.0.1:8000/users/${user.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testUpdateData)
      })

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text()
        throw new Error(`User update failed: ${updateResponse.status} - ${errorText}`)
      }

      const updatedUser = await updateResponse.json()
      setTestResult(prev => prev + `✅ User update successful\n`)
      setTestResult(prev => prev + `   Updated name: ${updatedUser.first_name} ${updatedUser.last_name}\n`)

      // Test 4: Test partner data if available
      if (partnerData) {
        setTestResult(prev => prev + '\n🔄 Test 4: Testing partner data update\n')
        const partnerTestData = {
          company_name: partnerData.company_name || 'Test Company'
        }

        const partnerUpdateResponse = await fetch(`http://127.0.0.1:8000/partners/${partnerData.id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(partnerTestData)
        })

        if (!partnerUpdateResponse.ok) {
          const errorText = await partnerUpdateResponse.text()
          throw new Error(`Partner update failed: ${partnerUpdateResponse.status} - ${errorText}`)
        }

        const updatedPartner = await partnerUpdateResponse.json()
        setTestResult(prev => prev + `✅ Partner update successful\n`)
        setTestResult(prev => prev + `   Company: ${updatedPartner.company_name}\n`)
      } else {
        setTestResult(prev => prev + '\n⚠️  Test 4: No partner data available to test\n')
      }

      // Test 5: Test other endpoints
      setTestResult(prev => prev + '\n🔄 Test 5: Testing other API endpoints\n')
      
      const partnersResponse = await fetch('http://127.0.0.1:8000/partners/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (partnersResponse.ok) {
        const partnersData = await partnersResponse.json()
        setTestResult(prev => prev + `✅ Partners endpoint accessible (${partnersData.length} partners)\n`)
      }

      const listingsResponse = await fetch('http://127.0.0.1:8000/listings/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (listingsResponse.ok) {
        const listingsData = await listingsResponse.json()
        setTestResult(prev => prev + `✅ Listings endpoint accessible (${listingsData.length} listings)\n`)
      }

      setTestResult(prev => prev + '\n🎉 All database tests completed successfully!\n')
      setTestResult(prev => prev + '✅ Database connection is working properly\n')
      setTestResult(prev => prev + '✅ Data can be read and updated\n')
      setTestResult(prev => prev + '✅ Authentication is working\n')

    } catch (error) {
      console.error('Database test error:', error)
      setTestResult(prev => prev + `\n❌ Test failed: ${error.message}\n`)
      setTestResult(prev => prev + '🔍 Check console for detailed error information\n')
    }
  }

  const handleAccountDataChange = (e) => {
    const { name, value } = e.target
    handleAccountInputChange(name, value)
  }

  const handleAccountSubmit = async (e) => {
    e.preventDefault()
    setAccountFormLoading(true)
    
    try {
      // Input validation
      const errors = []
      
      // Required field validation
      if (!accountData.firstName || accountData.firstName.trim().length < 2) {
        errors.push('First name must be at least 2 characters long')
      }
      
      if (!accountData.lastName || accountData.lastName.trim().length < 2) {
        errors.push('Last name must be at least 2 characters long')
      }
      
      // Email validation
      if (accountData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(accountData.email)) {
          errors.push('Please enter a valid email address')
        }
      } else {
        errors.push('Email is required')
      }
      
      // Phone validation
      if (accountData.phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
        if (!phoneRegex.test(accountData.phone.replace(/[\s\-\(\)]/g, ''))) {
          errors.push('Please enter a valid phone number')
        }
      }
      
      // ID Number validation
      if (accountData.idNumber && accountData.idNumber.trim().length < 5) {
        errors.push('ID Number must be at least 5 characters long')
      }
      
      // Date of Birth validation
      if (accountData.dateOfBirth) {
        const birthDate = new Date(accountData.dateOfBirth)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        
        if (isNaN(birthDate.getTime())) {
          errors.push('Please enter a valid date of birth')
        } else if (age < 18) {
          errors.push('You must be at least 18 years old')
        } else if (age > 100) {
          errors.push('Please enter a valid date of birth')
        }
      }
      
      // Business name validation (if provided)
      if (accountData.businessName && accountData.businessName.trim().length < 2) {
        errors.push('Business name must be at least 2 characters long')
      }
      
      // Tax ID validation (if provided)
      if (accountData.taxId && accountData.taxId.trim().length < 3) {
        errors.push('Tax ID must be at least 3 characters long')
      }
      
      // Address validation (if provided)
      if (accountData.address && accountData.address.trim().length < 10) {
        errors.push('Address must be at least 10 characters long')
      }
      
      // If there are validation errors, show them and stop
      if (errors.length > 0) {
        alert('Please fix the following errors:\n\n' + errors.join('\n'))
        setAccountFormLoading(false)
        return
      }
      
      // Prepare data for user update - only include non-empty fields
      const userData = {}
      
      if (accountData.firstName) userData.first_name = accountData.firstName.trim()
      if (accountData.lastName) userData.last_name = accountData.lastName.trim()
      if (accountData.email) userData.email = accountData.email.trim().toLowerCase()
      if (accountData.phone) userData.phone_number = accountData.phone.trim()
      if (accountData.address) userData.address = accountData.address.trim()
      if (accountData.idNumber) userData.id_number = accountData.idNumber.trim()
      
      // Handle date formatting properly
      if (accountData.dateOfBirth) {
        // Ensure date is in YYYY-MM-DD format
        const date = new Date(accountData.dateOfBirth)
        if (!isNaN(date.getTime())) {
          userData.date_of_birth = date.toISOString().split('T')[0]
        }
      }

      // Prepare data for partner update - only include non-empty fields
      const partnerUpdateData = {}
      if (accountData.businessName) partnerUpdateData.company_name = accountData.businessName.trim()
      if (accountData.taxId) partnerUpdateData.tax_id = accountData.taxId.trim()
      if (accountData.phone) partnerUpdateData.phone = accountData.phone.trim()

      console.log('Updating user data:', userData)
      console.log('Updating partner data:', partnerUpdateData)

      // Update user information using the correct endpoint
      const userResponse = await fetch(`http://127.0.0.1:8000/users/${user.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(userData)
      })

      if (!userResponse.ok) {
        const errorText = await userResponse.text()
        console.error('User update error:', errorText)
        
        // Try to parse error as JSON to get field-specific errors
        try {
          const errorJson = JSON.parse(errorText)
          const errorMessages = Object.entries(errorJson).map(([field, messages]) => {
            return `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
          }).join('\n')
          throw new Error(`Validation errors:\n${errorMessages}`)
        } catch (parseError) {
          throw new Error(`Failed to update user information: ${userResponse.status}`)
        }
      }

      const updatedUser = await userResponse.json()
      console.log('User updated successfully:', updatedUser)

      // Update partner information if partner data exists
      if (partnerData) {
        const partnerResponse = await fetch(`http://127.0.0.1:8000/partners/${partnerData.id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify(partnerUpdateData)
        })

        if (!partnerResponse.ok) {
          const errorText = await partnerResponse.text()
          console.error('Partner update error:', errorText)
          
          // Try to parse error as JSON to get field-specific errors
          try {
            const errorJson = JSON.parse(errorText)
            const errorMessages = Object.entries(errorJson).map(([field, messages]) => {
              return `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            }).join('\n')
            throw new Error(`Partner validation errors:\n${errorMessages}`)
          } catch (parseError) {
            throw new Error(`Failed to update partner information: ${partnerResponse.status}`)
          }
        }

        // Update local partner data
        const updatedPartner = await partnerResponse.json()
        console.log('Partner updated successfully:', updatedPartner)
        setPartnerData(updatedPartner)
      }

      // Refresh all data to ensure UI is up to date
      console.log('Account update successful, refreshing data...')
      await refreshAllData()
      
      // Try to update user context if available
      if (typeof updateUser === 'function') {
        try {
          const refreshedUserResponse = await fetch(`http://127.0.0.1:8000/users/${user.id}/`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
          })
          if (refreshedUserResponse.ok) {
            const refreshedUser = await refreshedUserResponse.json()
            updateUser(refreshedUser)
            console.log('User context updated with refreshed data')
          }
        } catch (refreshError) {
          console.log('Could not refresh user context, but data was updated successfully')
        }
      } else {
        console.log('updateUser function not available, but data was updated successfully')
      }
      
      // Close the account settings modal
      setShowAccountSettings(false)
      
      // Show success message
      alert('Account information updated successfully!')
      
      // Optionally refresh the page to ensure all components show updated data
      // window.location.reload()
      
    } catch (error) {
      console.error('Error updating account:', error)
      alert(`Failed to update account information: ${error.message}`)
    } finally {
      setAccountFormLoading(false)
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (event) => {
        setAccountData(prev => ({
          ...prev,
          profileImage: event.target.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setAccountData(prev => ({
      ...prev,
      profileImage: 'https://via.placeholder.com/150x150/e5e5e5/888888?text=Profile'
    }))
  }

  // Vehicle photo handling functions
  const handleVehiclePhotoChange = (e) => {
    const files = Array.from(e.target.files)
    processVehicleFiles(files)
  }

  const processVehicleFiles = (files) => {
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit
      return isValidType && isValidSize
    })
    
    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Please ensure all files are images under 5MB.')
    }
    
    setVehicleData(prev => ({
      ...prev,
      photos: [...prev.photos, ...validFiles]
    }))
    
    // Clear error if photos were added
    if (validFiles.length > 0 && formErrors.photos) {
      setFormErrors(prev => ({ ...prev, photos: undefined }))
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      processVehicleFiles(files)
    }
  }

  const handleRemoveVehiclePhoto = (index) => {
    setVehicleData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  // Utility function to get partner ID from a vehicle
  const getPartnerIdFromVehicle = (vehicle) => {
    return vehicle?.partner_id || vehicle?.owner_id || vehicle?.partner
  }

  if (loading || partnerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loading ? 'Loading user data...' : 'Loading partner information...'}
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }
  
    const sections = [
      { id: 'general', title: 'General Terms'},
      { id: 'booking', title: 'Booking & Cancellation'},
      { id: 'insurance', title: 'Insurance & Protection'},
      { id: 'vehicle', title: 'Vehicle Usage'},
      { id: 'payment', title: 'Payment & Fees'},
      { id: 'support', title: 'Support & Contact'}
    ]
  
    const policies = {
      general: {
        title: 'General Terms & Conditions',
        content: [
          {
            subtitle: 'Eligibility Requirements',
            items: [
              'Must be at least 21 years old to rent a vehicle',
              'Valid driver\'s license required (minimum 1 year)',
              'International driving permit required for foreign licenses',
              'Credit card in the primary driver\'s name required'
            ]
          },
          {
            subtitle: 'Rental Agreement',
            items: [
              'All rentals are subject to vehicle availability',
              'Rental period begins and ends on specified dates',
              'Late returns may incur additional charges',
              'All drivers must be listed on the rental agreement'
            ]
          }
        ]
      },
      booking: {
        title: 'Booking & Cancellation Policy',
        content: [
          {
            subtitle: 'Booking Process',
            items: [
              'Reservations can be made online or through our mobile app',
              'Confirmation email will be sent within 24 hours',
              'Full payment or deposit required at time of booking',
              'Vehicle pickup location must be confirmed'
            ]
          },
          {
            subtitle: 'Cancellation Policy',
            items: [
              'Free cancellation up to 48 hours before pickup',
              '50% refund for cancellations 24-48 hours before pickup',
              'No refund for cancellations less than 24 hours before pickup',
              'Emergency cancellations will be reviewed case by case'
            ]
          }
        ]
      },
      insurance: {
        title: 'Insurance & Protection Plans',
        content: [
          {
            subtitle: 'Basic Coverage',
            items: [
              'Third-party liability insurance included',
              'Collision damage waiver available',
              'Theft protection coverage available',
              'Personal accident insurance optional'
            ]
          },
          {
            subtitle: 'Damage Policy',
            items: [
              'Renter responsible for damage not covered by insurance',
              'Security deposit held until vehicle inspection',
              'Minor damages may be deducted from deposit',
              'Major damages require insurance claim process'
            ]
          }
        ]
      },
      vehicle: {
        title: 'Vehicle Usage Guidelines',
        content: [
          {
            subtitle: 'Permitted Use',
            items: [
              'Personal use only, no commercial activities',
              'Driving within specified geographic boundaries',
              'Maximum number of passengers as per vehicle capacity',
              'No smoking or pets allowed in vehicles'
            ]
          },
          {
            subtitle: 'Prohibited Activities',
            items: [
              'Off-road driving or racing',
              'Towing other vehicles or trailers',
              'Transporting hazardous materials',
              'Using vehicle under influence of alcohol or drugs'
            ]
          }
        ]
      },
      payment: {
        title: 'Payment Terms & Fees',
        content: [
          {
            subtitle: 'Payment Methods',
            items: [
              'Credit cards (Visa, MasterCard, American Express)',
              'Debit cards accepted with additional verification',
              'Cash payments not accepted',
              'Payment must be in the name of primary driver'
            ]
          },
          {
            subtitle: 'Additional Fees',
            items: [
              'Late return fee: €25 per hour',
              'Fuel service charge if returned empty',
              'Cleaning fee for excessive dirt or odors',
              'Traffic violation fees passed to renter'
            ]
          }
        ]
      },
      support: {
        title: 'Customer Support & Contact',
        content: [
          {
            subtitle: 'Emergency Support',
            items: [
              '24/7 roadside assistance available',
              'Emergency contact number provided with rental',
              'Breakdown and accident reporting procedures',
              'Replacement vehicle service when available'
            ]
          },
          {
            subtitle: 'Contact Information',
            items: [
              'Customer service: +212 5XX-XXXXXX',
              'Email support: support@airbcar.com',
              'Emergency line: +212 6XX-XXXXXX',
              'Online chat available 9 AM - 6 PM'
            ]
          }
        ]
      }
    }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Partner Dashboard</h1>
          <p className="text-gray-600">Manage your vehicles and track your earnings</p>
        </div>

        {/* Partner Information Card */}
        {partnerData && (
          <div className="bg-white rounded-lg shadow-sm border mb-8">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {partnerData.company_name ? partnerData.company_name.charAt(0).toUpperCase() : 'P'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {partnerData.company_name || 'Partner Business'}
                    </h2>
                    <p className="text-gray-600">
                      {partnerData.user?.first_name} {partnerData.user?.last_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Partner ID: #{partnerData.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowTestModal(true)}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Test DB</span>
                  </button>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Active Partner
                  </span>
                </div>
              </div>
              
              {/* Partner Details Grid */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Partner Information</h4>
                  <button
                    onClick={() => setShowAccountSettings(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Contact Information */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Email</span>
                      </div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium">{partnerData.user?.email || 'Not provided'}</p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Phone Number</span>
                      </div>
                      {!(partnerData.user?.phone_number || partnerData.user?.phone || partnerData.phone) && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Missing
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 font-medium">
                      {partnerData.user?.phone_number || partnerData.user?.phone || partnerData.phone || (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Tax ID</span>
                    </div>
                    <p className="text-gray-900 font-medium">{partnerData.tax_id || (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}</p>
                  </div>

                  {/* Personal Information */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">ID Number</span>
                      </div>
                      {!(partnerData.user?.id_number || partnerData.user?.license_number) && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Missing
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 font-medium">
                      {partnerData.user?.id_number || partnerData.user?.license_number || (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-pink-100 rounded-lg">
                          <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Date of Birth</span>
                      </div>
                      {!partnerData.user?.date_of_birth && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Missing
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 font-medium">
                      {partnerData.user?.date_of_birth 
                        ? new Date(partnerData.user.date_of_birth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : <span className="text-gray-400 italic">Not provided</span>
                      }
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Address</span>
                      </div>
                      {!(partnerData.user?.address || partnerData.location) && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Missing
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 font-medium">
                      {partnerData.user?.address || partnerData.location || (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </p>
                  </div>

                  {/* Status Information */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Verification Status</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        partnerData.verification_status === 'verified' 
                          ? 'bg-green-100 text-green-800' 
                          : partnerData.verification_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          partnerData.verification_status === 'verified' 
                            ? 'bg-green-400' 
                            : partnerData.verification_status === 'pending'
                            ? 'bg-yellow-400'
                            : 'bg-red-400'
                        }`}></div>
                        {partnerData.verification_status === 'verified' ? 'Verified' :
                         partnerData.verification_status === 'pending' ? 'Pending Review' : 'Unverified'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Partner Since</span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {partnerData.created_at 
                        ? new Date(partnerData.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'Not available'
                      }
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Terms Agreement</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        partnerData.agree_on_terms 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          partnerData.agree_on_terms ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        {partnerData.agree_on_terms ? 'Agreed' : 'Not Agreed'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Total Listings</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-gray-900">
                        {partnerData.listings ? partnerData.listings.length : 0}
                      </p>
                      <button
                        onClick={() => setActiveTab('listings')}
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                      >
                        View All →
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Missing Information Alert */}
                {(!(partnerData.user?.phone_number || partnerData.user?.phone || partnerData.phone) || 
                  !(partnerData.user?.id_number || partnerData.user?.license_number) || 
                  !partnerData.user?.date_of_birth || 
                  !(partnerData.user?.address || partnerData.location)) && (
                  <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Complete your profile
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            Some information is missing from your profile. Complete your profile to improve your verification status and build trust with customers.
                          </p>
                        </div>
                        <div className="mt-3">
                          <button
                            onClick={() => setShowAccountSettings(true)}
                            className="bg-yellow-100 px-3 py-2 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-200 transition-colors"
                          >
                            Complete Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Information Sections */}
              <div className="mt-6 space-y-4">
                {/* Verification Document Status */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-sm font-medium text-blue-900">Verification Document</h3>
                  </div>
                  <p className="text-sm text-blue-800">
                    {partnerData.verification_document 
                      ? `Document uploaded: ${partnerData.verification_document}` 
                      : 'No verification document uploaded yet'
                    }
                  </p>
                </div>

                {/* Business Description */}
                {partnerData.description && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Business Description</h3>
                    <p className="text-sm text-gray-700">{partnerData.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVehicles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Earnings</p>
                <p className="text-2xl font-bold text-gray-900">DH{stats.monthlyEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Rentals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedRentals}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Airbnb Style */}
        <div className="bg-white border-b border-gray-200 mb-8">
          <div className="max-w-7xl mx-auto">
            <nav className="flex space-x-8 px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setActiveTab('today')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'today'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'bookings'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'calendar'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'listings'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Listings
              </button>
              <div className="relative">
                <button
                  onClick={() => setActiveTab('menu')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                    activeTab === 'menu'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Menu
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'today' && (
          <div className="space-y-8">
            {/* Welcome Header */}
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Welcome back, {partnerData?.user?.first_name && partnerData?.user?.last_name 
                  ? `${partnerData.user.first_name} ${partnerData.user.last_name}` 
                  : user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user?.username || 'Partner'}
              </h1>
              {partnerData && (
                <p className="text-gray-600">
                  {partnerData.company_name} • {partnerData.verification_status === 'pending' ? 'Verification Pending' : 'Verified Partner'}
                </p>
              )}
            </div>

            {/* Verification Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-red-600 font-medium text-sm">Verify your identity</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Required to publish</p>
                    <p className="text-sm text-gray-900 font-medium">Cozy room in Tetouan</p>
                    <button className="text-sm font-medium text-gray-900 underline mt-2">Get started</button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-red-600 font-medium text-sm">Verify your identity</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Required to publish</p>
                    <p className="text-sm text-gray-900 font-medium">Cozy Room & Modern Amenities</p>
                    <button className="text-sm font-medium text-gray-900 underline mt-2">Get started</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Your reservations section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Your reservations</h2>
                <button className="text-sm font-medium text-gray-900 underline">
                  All reservations ({reservations.length})
                </button>
              </div>

              {/* Reservation Tabs */}
              <div className="border-b border-gray-200 mb-8">
                <nav className="flex space-x-8">
                  <button 
                    onClick={() => setActiveReservationTab('checking-out')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeReservationTab === 'checking-out'
                        ? 'border-black text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Checking out ({getReservationCount('checking-out')})
                  </button>
                  <button 
                    onClick={() => setActiveReservationTab('currently-hosting')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeReservationTab === 'currently-hosting'
                        ? 'border-black text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Currently hosting ({getReservationCount('currently-hosting')})
                  </button>
                  <button 
                    onClick={() => setActiveReservationTab('arriving-soon')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeReservationTab === 'arriving-soon'
                        ? 'border-black text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Arriving soon ({getReservationCount('arriving-soon')})
                  </button>
                  <button 
                    onClick={() => setActiveReservationTab('upcoming')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeReservationTab === 'upcoming'
                        ? 'border-black text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Upcoming ({getReservationCount('upcoming')})
                  </button>
                  <button 
                    onClick={() => setActiveReservationTab('pending-review')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeReservationTab === 'pending-review'
                        ? 'border-black text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Pending review ({getReservationCount('pending-review')})
                  </button>
                </nav>
              </div>

              {/* Reservations Content */}
              <div className="min-h-[400px]">
                {reservationsLoading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <span className="ml-3 text-gray-600">Loading reservations...</span>
                  </div>
                ) : getReservationsByStatus(activeReservationTab).length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6">
                      <svg className="w-full h-full text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-900 font-medium mb-2">
                      {activeReservationTab === 'checking-out' && "No guests checking out today or tomorrow"}
                      {activeReservationTab === 'currently-hosting' && "No active bookings at the moment"}
                      {activeReservationTab === 'arriving-soon' && "No guests arriving soon"}
                      {activeReservationTab === 'upcoming' && "No upcoming reservations"}
                      {activeReservationTab === 'pending-review' && "No completed bookings pending review"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activeReservationTab === 'checking-out' && "Guests will appear here when they're scheduled to check out."}
                      {activeReservationTab === 'currently-hosting' && "Active bookings will appear here."}
                      {activeReservationTab === 'arriving-soon' && "Guests arriving in the next 1-2 days will appear here."}
                      {activeReservationTab === 'upcoming' && "Future reservations will appear here."}
                      {activeReservationTab === 'pending-review' && "Completed bookings awaiting review will appear here."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getReservationsByStatus(activeReservationTab).map((reservation) => (
                      <div key={reservation.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {reservation.user?.first_name?.[0]}{reservation.user?.last_name?.[0] || reservation.user?.username?.[0] || 'G'}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {reservation.user?.first_name && reservation.user?.last_name 
                                  ? `${reservation.user.first_name} ${reservation.user.last_name}`
                                  : reservation.user?.username || 'Guest'}
                              </h3>
                              <p className="text-sm text-gray-600">{reservation.user?.email}</p>
                              <p className="text-sm text-gray-600">
                                {reservation.listing?.make} {reservation.listing?.model} ({reservation.listing?.year})
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {new Date(reservation.start_time).toLocaleDateString()} - {new Date(reservation.end_time).toLocaleDateString()}
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              DH{reservation.price}
                            </p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              reservation.status === 'active' ? 'bg-green-100 text-green-800' :
                              reservation.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              reservation.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {reservation.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                          <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">
                            View Details
                          </button>
                          <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-sm">
                            Contact Guest
                          </button>
                          {activeReservationTab === 'pending-review' && (
                            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm">
                              Leave Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Calendar</h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={() => changeMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 border-b">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {getDaysInMonth(selectedDate).map((date, index) => (
                  <div
                    key={index}
                    className={`h-16 p-2 border border-gray-100 ${
                      date ? 'cursor-pointer hover:bg-gray-50' : ''
                    } ${
                      date && isToday(date) ? 'bg-orange-100 border-orange-300' : ''
                    } ${
                      date && isSameDay(date, selectedDate) ? 'bg-blue-100 border-blue-300' : ''
                    }`}
                    onClick={() => date && setSelectedDate(date)}
                  >
                    {date && (
                      <div className="h-full flex flex-col">
                        <span className={`text-sm ${
                          isToday(date) ? 'font-bold text-orange-600' : 
                          isSameDay(date, selectedDate) ? 'font-bold text-blue-600' : 
                          'text-gray-900'
                        }`}>
                          {date.getDate()}
                        </span>
                        
                        {/* Sample bookings/events */}
                        {date.getDate() === 15 && (
                          <div className="mt-1">
                            <div className="w-full h-1 bg-green-400 rounded mb-1"></div>
                            <div className="text-xs text-green-600">Booking</div>
                          </div>
                        )}
                        {date.getDate() === 18 && (
                          <div className="mt-1">
                            <div className="w-full h-1 bg-blue-400 rounded mb-1"></div>
                            <div className="text-xs text-blue-600">Check-out</div>
                          </div>
                        )}
                        {date.getDate() === 22 && (
                          <div className="mt-1">
                            <div className="w-full h-1 bg-yellow-400 rounded mb-1"></div>
                            <div className="text-xs text-yellow-600">Maintenance</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Calendar Legend */}
              <div className="mt-6 flex justify-center space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">New Booking</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-400 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Check-out</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Maintenance</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Today</span>
                </div>
              </div>
            </div>

            {/* Selected Date Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Overview for {formatDate(selectedDate)}
              </h3>
              
              {/* Daily Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedDate.getDate() === 15 ? '1' : selectedDate.getDate() === 18 ? '1' : '0'}
                  </div>
                  <div className="text-xs text-gray-600">Checking out</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedDate.getDate() === 16 ? '2' : selectedDate.getDate() === 17 ? '1' : '0'}
                  </div>
                  <div className="text-xs text-gray-600">Currently hosting</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedDate.getDate() === 15 ? '1' : '0'}
                  </div>
                  <div className="text-xs text-gray-600">Arriving soon</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedDate.getDate() === 20 ? '1' : selectedDate.getDate() === 25 ? '1' : '0'}
                  </div>
                  <div className="text-xs text-gray-600">Upcoming</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {selectedDate.getDate() === 19 ? '1' : '0'}
                  </div>
                  <div className="text-xs text-gray-600">Pending review</div>
                </div>
              </div>

              {/* Today's Schedule */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Today's Schedule</h4>
                {selectedDate.getDate() === 15 ? (
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">New Booking: Royal Enfield Classic 350</p>
                        <p className="text-sm text-gray-600">Customer: John Doe - 3 days rental</p>
                        <p className="text-xs text-gray-500">Check-in scheduled</p>
                      </div>
                    </div>
                  </div>
                ) : selectedDate.getDate() === 18 ? (
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">Check-out: Royal Enfield Classic 350</p>
                        <p className="text-sm text-gray-600">Customer: John Doe</p>
                        <p className="text-xs text-gray-500">Vehicle return scheduled</p>
                      </div>
                    </div>
                  </div>
                ) : selectedDate.getDate() === 22 ? (
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">Maintenance: Yamaha FZ-S</p>
                        <p className="text-sm text-gray-600">Scheduled service and inspection</p>
                        <p className="text-xs text-gray-500">Service Center appointment</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No scheduled events for this date</p>
                  </div>
                )}
              </div>

              {/* Available Vehicles */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Available Vehicles</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {vehicles.filter(vehicle => 
                    selectedDate.getDate() === 15 ? vehicle.status === 'available' && vehicle.id !== 1 :
                    selectedDate.getDate() === 16 || selectedDate.getDate() === 17 ? vehicle.status === 'available' :
                    selectedDate.getDate() === 18 ? vehicle.status !== 'maintenance' :
                    vehicle.status === 'available'
                  ).map((vehicle) => (
                    <div key={vehicle.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {vehicle.brand} {vehicle.model}
                          </p>
                          <p className="text-xs text-gray-500">DH{vehicle.dailyRate}/day</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {vehicles.filter(vehicle => 
                    selectedDate.getDate() === 15 ? vehicle.status === 'available' && vehicle.id !== 1 :
                    selectedDate.getDate() === 16 || selectedDate.getDate() === 17 ? vehicle.status === 'available' :
                    selectedDate.getDate() === 18 ? vehicle.status !== 'maintenance' :
                    vehicle.status === 'available'
                  ).length === 0 && (
                    <div className="col-span-3 text-center py-4 text-gray-500">
                      <p>No vehicles available for this date</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Reservations */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Reservation Details</h4>
                <div className="space-y-4">
                  
                  {/* Checking out */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">Checking out</h5>
                      <span className="text-sm text-gray-500">
                        {selectedDate.getDate() === 15 || selectedDate.getDate() === 18 ? '(1)' : '(0)'}
                      </span>
                    </div>
                    {selectedDate.getDate() === 15 || selectedDate.getDate() === 18 ? (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm font-medium">Royal Enfield Classic 350</p>
                        <p className="text-sm text-gray-600">John Doe • 3-day rental ending</p>
                        <p className="text-xs text-gray-500">Expected return today</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No check-outs scheduled</p>
                    )}
                  </div>

                  {/* Currently hosting */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">Currently hosting</h5>
                      <span className="text-sm text-gray-500">
                        {selectedDate.getDate() === 16 || selectedDate.getDate() === 17 ? '(2)' : 
                         selectedDate.getDate() === 15 ? '(1)' : '(0)'}
                      </span>
                    </div>
                    {selectedDate.getDate() === 16 || selectedDate.getDate() === 17 ? (
                      <div className="space-y-2">
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm font-medium">Royal Enfield Classic 350</p>
                          <p className="text-sm text-gray-600">John Doe • Day 2 of 3</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm font-medium">Honda CB Shine</p>
                          <p className="text-sm text-gray-600">Sarah Smith • Day 1 of 2</p>
                        </div>
                      </div>
                    ) : selectedDate.getDate() === 15 ? (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm font-medium">Honda CB Shine</p>
                        <p className="text-sm text-gray-600">Previous customer • Ongoing rental</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No active rentals</p>
                    )}
                  </div>

                  {/* Arriving soon */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">Arriving soon</h5>
                      <span className="text-sm text-gray-500">
                        {selectedDate.getDate() === 15 ? '(1)' : '(0)'}
                      </span>
                    </div>
                    {selectedDate.getDate() === 15 ? (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm font-medium">Royal Enfield Classic 350</p>
                        <p className="text-sm text-gray-600">John Doe • Check-in today</p>
                        <p className="text-xs text-gray-500">Contact: +91 98765 43210</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No arrivals scheduled</p>
                    )}
                  </div>

                  {/* Upcoming bookings */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">Upcoming</h5>
                      <span className="text-sm text-gray-500">
                        {selectedDate.getDate() === 20 || selectedDate.getDate() === 25 ? '(1)' : '(0)'}
                      </span>
                    </div>
                    {selectedDate.getDate() === 20 ? (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm font-medium">Yamaha FZ-S</p>
                        <p className="text-sm text-gray-600">Mike Johnson • 2-day rental</p>
                        <p className="text-xs text-gray-500">Starts: Aug 20, 2025</p>
                      </div>
                    ) : selectedDate.getDate() === 25 ? (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm font-medium">Honda CB Shine</p>
                        <p className="text-sm text-gray-600">Alex Kumar • 1-day rental</p>
                        <p className="text-xs text-gray-500">Starts: Aug 25, 2025</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No upcoming bookings</p>
                    )}
                  </div>

                  {/* Pending review */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">Pending review</h5>
                      <span className="text-sm text-gray-500">
                        {selectedDate.getDate() === 19 ? '(1)' : '(0)'}
                      </span>
                    </div>
                    {selectedDate.getDate() === 19 ? (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm font-medium">Royal Enfield Classic 350</p>
                        <p className="text-sm text-gray-600">John Doe • Rental completed yesterday</p>
                        <p className="text-xs text-gray-500">Awaiting customer review</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No pending reviews</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                  Add Booking
                </button>
                <button className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                  Schedule Maintenance
                </button>
                <button className="bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                  View Availability
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Listings</h2>
              <div className="flex space-x-2">
                <button
                  onClick={refreshAllData}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center"
                  disabled={vehiclesLoading || partnerLoading}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {vehiclesLoading || partnerLoading ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  onClick={handleAddVehicle}
                  className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Vehicle
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehiclesLoading || partnerLoading ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                    <span className="text-gray-600">
                      {partnerLoading ? 'Loading partner data...' : 'Loading vehicles...'}
                    </span>
                    {user && (
                      <p className="text-xs text-gray-500 mt-1">
                        API: http://127.0.0.1:8000/partners/{user.partner_id || user.id}/
                      </p>
                    )}
                  </div>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1-1V9a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h4a1 1 0 001-1m-6 0a1 1 0 01-1-1v-1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
                  <p className="text-gray-600 mb-4">
                    {user ? (
                      <>
                        No vehicles found for your account (Partner ID: {user.partner_id || user.id}).
                        <br />
                        <span className="text-sm text-gray-500">
                          Data loaded from: http://127.0.0.1:8000/partners/{user.partner_id || user.id}/
                          <br />
                          You can add your own vehicles using the "Add Vehicle" button above.
                        </span>
                      </>
                    ) : (
                      'Please sign in to view your vehicles'
                    )}
                  </p>
                  <button
                    onClick={handleAddVehicle}
                    className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Add Your First Vehicle
                  </button>
                </div>
              ) : (
                vehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden relative">
                    <img
                      src={getFullImageUrl(vehicle.image)}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Vehicle image failed to load (listings tab):', e.target.src);
                        // Try fallback image first
                        if (!e.target.src.includes('image_front.png')) {
                          e.target.src = '/pictures_car_example/image_front.png';
                          return;
                        }
                        // If fallback also fails, show placeholder
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center absolute inset-0" style={{display: 'none'}}>
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-500">Image not available</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{vehicle.year} • {vehicle.location}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xl font-bold text-orange-500">DH{vehicle.dailyRate}/day</span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-600">{vehicle.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{vehicle.bookings} bookings</p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleToggleAvailability(vehicle)}
                        className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                          vehicle.availability 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {vehicle.availability ? 'Available' : 'Unavailable'}
                      </button>
                      <button 
                        onClick={() => handleManageVehicle(vehicle)}
                        className="flex-1 bg-orange-500 text-white py-2 px-3 rounded text-sm hover:bg-orange-600 transition-colors"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Menu</h2>
              <div className="space-y-4">
                <button 
                  onClick={() => setShowAccountSettings(true)}
                  className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center text-gray-500"
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Account Settings
                </button>
                <button 
                  onClick={() => setActiveTab('bookings')}
                  className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center text-gray-500"
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Reservations
                </button>
                <button
                  onClick={() => setActiveTab('rentalpolicies')}
                  className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center text-gray-500"
                >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="14" y="3" width="7" height="7" rx="1.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="14" y="14" width="7" height="7" rx="1.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3" y="14" width="7" height="7" rx="1.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                  Rental Policies
                </button>
                <button 
                  onClick={() => setActiveTab('earnings')}
                  className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center text-gray-500"
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Earnings
                </button>
                <hr className="my-2 border-gray-200" />
                <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center text-gray-500">
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment Methods
                </button>
                <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center text-gray-500">
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Help Center
                </button>
                <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-red-50 transition-colors font-medium text-red-600 flex items-center text-gray-500">
                  <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">New booking for Royal Enfield Classic 350</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Rental completed for Honda CB Shine</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Payment received DH2,400</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleAddVehicle}
                    className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Vehicle
                  </button>
                  <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    View Analytics
                  </button>
                  <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Manage Availability
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Vehicles</h2>
              <button
                onClick={handleAddVehicle}
                className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Vehicle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden relative">
                    <img
                      src={getFullImageUrl(vehicle.image)}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Vehicle image failed to load (vehicles tab):', e.target.src);
                        // Try fallback image first
                        if (!e.target.src.includes('image_front.png')) {
                          e.target.src = '/pictures_car_example/image_front.png';
                          return;
                        }
                        // If fallback also fails, show placeholder
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center absolute inset-0" style={{display: 'none'}}>
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-500">Image not available</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{vehicle.year} • {vehicle.location}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xl font-bold text-orange-500">DH{vehicle.dailyRate}/day</span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-600">{vehicle.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{vehicle.bookings} bookings</p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleToggleAvailability(vehicle)}
                        className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                          vehicle.availability 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {vehicle.availability ? 'Available' : 'Unavailable'}
                      </button>
                      <button 
                        onClick={() => handleManageVehicle(vehicle)}
                        className="flex-1 bg-orange-500 text-white py-2 px-3 rounded text-sm hover:bg-orange-600 transition-colors"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Pending Requests Section */}
            <PendingBookingRequests />
            
            {/* Bookings Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Booking Management</h2>
                <div className="flex space-x-4">
                  <div className="text-sm text-gray-600">
                    Total Bookings: <span className="font-semibold">{reservations.length}</span>
                  </div>
                  <button
                    onClick={() => fetchReservations()}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Booking Filter Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'checking-out', label: 'Checking Out Today'},
                    { id: 'currently-hosting', label: 'Currently Hosting'},
                    { id: 'checking-in', label: 'Checking In Today'},
                    { id: 'upcoming', label: 'Upcoming'},
                    { id: 'pending-review', label: 'Pending Review'},
                    { id: 'all', label: 'All Bookings'}
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveReservationTab(tab.id)}
                      className={`${
                        activeReservationTab === tab.id
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Bookings Content */}
            <div className="bg-white rounded-lg shadow-sm border">
              {reservationsLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading bookings...</p>
                </div>
              ) : reservations.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeReservationTab === 'checking-out' && "No vehicles checking out today"}
                    {activeReservationTab === 'checking-in' && "No vehicles checking in today"}
                    {activeReservationTab === 'currently-hosting' && "No active bookings at the moment"}
                    {activeReservationTab === 'upcoming' && "No upcoming bookings"}
                    {activeReservationTab === 'pending-review' && "No completed bookings pending review"}
                    {activeReservationTab === 'all' && "No bookings found"}
                  </h3>
                  <p className="text-gray-600">
                    {activeReservationTab === 'checking-out' && "Vehicle returns will appear here."}
                    {activeReservationTab === 'checking-in' && "Vehicle pickups will appear here."}
                    {activeReservationTab === 'currently-hosting' && "Active bookings will appear here."}
                    {activeReservationTab === 'upcoming' && "Future bookings will appear here."}
                    {activeReservationTab === 'pending-review' && "Completed bookings awaiting review will appear here."}
                    {activeReservationTab === 'all' && "All your bookings will appear here once customers start booking your vehicles."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vehicle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reservations.map((booking) => {
                        const startDate = new Date(booking.start_time)
                        const endDate = new Date(booking.end_time)
                        const vehicle = vehicles.find(v => v.id === booking.listing) || {}
                        
                        return (
                          <tr key={booking.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-orange-600">
                                      {booking.customer_name ? booking.customer_name.charAt(0).toUpperCase() : '?'}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {booking.customer_name || 'Customer'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {booking.customer_email || 'No email'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {vehicle.brand || booking.vehicle_brand} {vehicle.model || booking.vehicle_model}
                              </div>
                              <div className="text-sm text-gray-500">
                                {vehicle.year || booking.vehicle_year} • {vehicle.location || 'Location'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} days
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              DH{booking.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                booking.status === 'active' ? 'bg-green-100 text-green-800' :
                                booking.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-orange-600 hover:text-orange-900">
                                  View Details
                                </button>
                                {booking.status === 'confirmed' && (
                                  <button className="text-green-600 hover:text-green-900">
                                    Start Rental
                                  </button>
                                )}
                                {booking.status === 'active' && (
                                  <button className="text-blue-600 hover:text-blue-900">
                                    Complete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Booking Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                      <dd className="text-lg font-medium text-gray-900">{reservations.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Bookings</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {reservations.filter(r => r.status === 'active' || r.status === 'confirmed').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        DH{reservations.reduce((sum, booking) => sum + (parseFloat(booking.price) || 0), 0).toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Avg. Rating</dt>
                      <dd className="text-lg font-medium text-gray-900">4.8</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Earnings Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-3xl font-bold text-gray-900">DH45,000</p>
                  <p className="text-sm text-green-600">+12% from last month</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Last Month</p>
                  <p className="text-3xl font-bold text-gray-900">DH40,200</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-3xl font-bold text-gray-900">DH285,600</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rentalpolicies' && (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Rental Policies & Terms
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about renting with Airbcar. 
              Please read these policies carefully before making your reservation.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                    }`}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {policies[activeSection].title}
                </h2>
              </div>

              <div className="space-y-8">
                {policies[activeSection].content.map((section, index) => (
                  <div key={index} className="border-b border-gray-100 pb-8 last:border-b-0 last:pb-0">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      {section.subtitle}
                    </h3>
                    <ul className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Important Notice */}
              <div className="mt-12 p-6 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-orange-800 mb-2">Important Notice</h4>
                    <p className="text-orange-700 leading-relaxed">
                      These policies are subject to change without notice. By completing a reservation, 
                      you agree to abide by all current terms and conditions. For questions about our 
                      policies, please contact our customer support team.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl">🤝</div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Need clarification?</p>
                    <p className="text-sm text-gray-600">Our support team is here to help</p>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        )}
      </div>

      {/* Add Vehicle Modal */}
      <AddVehicleModal 
        showModal={showAddVehicleModal}
        setShowModal={setShowAddVehicleModal}
        vehicleData={vehicleData}
        setVehicleData={setVehicleData}
        onSubmit={handleVehicleSubmit}
      />

      {/* Vehicle Management Modal */}
      <VehicleManageModal 
        showModal={showManageModal}
        setShowModal={setShowManageModal}
        vehicle={selectedVehicle}
        onUpdate={handleUpdateVehicle}
        onDelete={handleDeleteVehicle}
      />

      {/* Quick Edit Modal */}
      <QuickEditModal 
        showModal={showQuickEditModal}
        setShowModal={setShowQuickEditModal}
        vehicle={selectedVehicle}
        onUpdate={handleUpdateVehicle}
        onDelete={handleDeleteVehicle}
      />

      
      {/* Account Settings Modal */}
      {showAccountSettings && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
                  <p className="text-gray-600">Manage your account information and preferences</p>
                </div>
                <button
                  onClick={() => setShowAccountSettings(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleAccountSubmit} className="space-y-8">
                {/* Profile Section */}
                <div className="border-b border-gray-200 pb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner Information</h3>
                  <div className="flex items-center mb-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mr-6 flex items-center justify-center overflow-hidden">
                      <img 
                        src={accountData.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center" style={{display: 'none'}}>
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <input
                        type="file"
                        id="photo-upload"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('photo-upload').click()}
                        className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors mr-3"
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={accountData.firstName}
                        onChange={handleAccountDataChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          validationErrors.firstName 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                        required
                      />
                      {validationErrors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={accountData.lastName}
                        onChange={handleAccountDataChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          validationErrors.lastName 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                        required
                      />
                      {validationErrors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={accountData.email}
                        onChange={handleAccountDataChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          validationErrors.email 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                        required
                      />
                      {validationErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={accountData.phone}
                        onChange={handleAccountDataChange}
                        placeholder="+1234567890"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          validationErrors.phone 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={accountData.address}
                        onChange={handleAccountDataChange}
                        placeholder="Full address including city and country"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          validationErrors.address 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.address && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={accountData.dateOfBirth}
                        onChange={handleAccountDataChange}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          validationErrors.dateOfBirth 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.dateOfBirth && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.dateOfBirth}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
                      <input
                        type="text"
                        name="idNumber"
                        value={accountData.idNumber}
                        onChange={handleAccountDataChange}
                        placeholder="Government issued ID number"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          validationErrors.idNumber 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.idNumber && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.idNumber}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div className="border-b border-gray-200 pb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                      <input
                        type="text"
                        name="businessName"
                        value={accountData.businessName}
                        onChange={handleAccountDataChange}
                        placeholder="Your company or business name"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          validationErrors.businessName 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.businessName && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.businessName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                      <input
                        type="text"
                        name="taxId"
                        value={accountData.taxId}
                        onChange={handleAccountDataChange}
                        placeholder="Business tax identification number"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          validationErrors.taxId 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.taxId && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.taxId}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="border-b border-gray-200 pb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account</label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={accountData.bankAccount}
                          disabled
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        />
                        <button
                          type="button"
                          className="ml-3 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            Bank account information is encrypted and secure. We use this for direct deposits of your earnings.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="border-b border-gray-200 pb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                        Enable
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Change Password</h4>
                        <p className="text-sm text-gray-600">Update your account password</p>
                      </div>
                      <button className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                        Change
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="pb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive booking confirmations and updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                        <p className="text-sm text-gray-600">Receive urgent notifications via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Marketing Communications</h4>
                        <p className="text-sm text-gray-600">Receive promotional offers and platform updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAccountSettings(false)}
                    className="bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={accountFormLoading}
                      className={`py-3 px-6 rounded-lg font-medium transition-colors ${
                        accountFormLoading 
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {accountFormLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        )}

      {/* Database Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Database Connection Test</h3>
                <button
                  onClick={() => setShowTestModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex space-x-3">
                  <button
                    onClick={testDatabaseConnection}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Run Database Test</span>
                  </button>
                  <button
                    onClick={() => setTestResult('')}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear Results
                  </button>
                </div>

                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
                  {testResult || 'Click "Run Database Test" to start testing...'}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">What this test checks:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Authentication token validity</li>
                    <li>• User data retrieval from database</li>
                    <li>• User data update capability</li>
                    <li>• Partner data update capability (if available)</li>
                    <li>• API endpoint accessibility</li>
                    <li>• Database read/write operations</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowTestModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

// Pending Booking Requests Component
function PendingBookingRequests() {
  const [pendingRequests, setPendingRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingBooking, setProcessingBooking] = useState(null)

  useEffect(() => {
    fetchPendingRequests()
  }, [])

  const fetchPendingRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/bookings/pending-requests/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPendingRequests(data)
      } else {
        console.error('Failed to fetch pending requests')
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptBooking = async (bookingId) => {
    try {
      setProcessingBooking(bookingId)
      const response = await fetch(`http://localhost:8000/bookings/${bookingId}/accept/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        alert('Booking accepted successfully!')
        fetchPendingRequests() // Refresh the list
      } else {
        const errorData = await response.json()
        alert('Failed to accept booking: ' + (errorData.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error accepting booking:', error)
      alert('Error accepting booking. Please try again.')
    } finally {
      setProcessingBooking(null)
    }
  }

  const handleRejectBooking = async (bookingId) => {
    const rejectionReason = prompt('Please provide a reason for rejection (optional):')
    if (rejectionReason === null) return // User cancelled

    try {
      setProcessingBooking(bookingId)
      const response = await fetch(`http://localhost:8000/bookings/${bookingId}/reject/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rejection_reason: rejectionReason
        })
      })

      if (response.ok) {
        alert('Booking rejected successfully!')
        fetchPendingRequests() // Refresh the list
      } else {
        const errorData = await response.json()
        alert('Failed to reject booking: ' + (errorData.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error rejecting booking:', error)
      alert('Error rejecting booking. Please try again.')
    } finally {
      setProcessingBooking(null)
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

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Pending Booking Requests</h2>
        <button
          onClick={fetchPendingRequests}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending requests...</p>
        </div>
      ) : pendingRequests.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
          <p className="text-gray-500">You don't have any pending booking requests at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {request.user?.first_name} {request.user?.last_name}
                      </h3>
                      <p className="text-sm text-gray-500">{request.user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Vehicle</p>
                      <p className="text-sm text-gray-600">
                        {request.listing?.make} {request.listing?.model} ({request.listing?.year})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Rental Period</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(request.start_time)} - {formatDate(request.end_time)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Total Price</p>
                      <p className="text-sm text-gray-600 font-semibold">
                        {request.price} MAD
                      </p>
                    </div>
                  </div>

                  {request.request_message && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-900">Message from Guest</p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                        {request.request_message}
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    Requested on {formatDate(request.requested_at)}
                  </p>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleAcceptBooking(request.id)}
                    disabled={processingBooking === request.id}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {processingBooking === request.id ? 'Processing...' : 'Accept'}
                  </button>
                  <button
                    onClick={() => handleRejectBooking(request.id)}
                    disabled={processingBooking === request.id}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {processingBooking === request.id ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}