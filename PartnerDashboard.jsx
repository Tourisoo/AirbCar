'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function PartnerDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('today')
  const [vehicles, setVehicles] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [stats, setStats] = useState({
    totalVehicles: 5,
    activeBookings: 12,
    monthlyEarnings: 45000,
    completedRentals: 89
  })
  
  // Modal states
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false)
  const [showAccountSettings, setShowAccountSettings] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  
  // Form data
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

  const [accountData, setAccountData] = useState({
    firstName: 'Adnan',
    lastName: 'Mayache',
    email: 'adnan.mayache@example.com',
    phone: '+212 6 12 34 56 78',
    address: 'Tetouan, Morocco',
    dateOfBirth: '1990-01-15',
    idNumber: 'BE123456',
    bankAccount: '**** **** **** 1234',
    businessName: 'Mayache Car Rentals',
    taxId: 'TAX123456789',
    profileImage: 'https://via.placeholder.com/150x150/e5e5e5/888888?text=Profile'
  })

  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const mockVehicles = [
    {
      id: 1,
      brand: 'Royal Enfield',
      model: 'Classic 350',
      year: 2023,
      image: 'https://via.placeholder.com/300x200/f0f0f0/888888?text=Royal+Enfield+Classic+350',
      dailyRate: 800,
      location: 'Mumbai',
      status: 'available',
      bookings: 15,
      rating: 4.8
    },
    {
      id: 2,
      brand: 'Honda',
      model: 'CB Shine',
      year: 2022,
      image: 'https://via.placeholder.com/300x200/f0f0f0/888888?text=Honda+CB+Shine',
      dailyRate: 600,
      location: 'Mumbai',
      status: 'rented',
      bookings: 23,
      rating: 4.6
    },
    {
      id: 3,
      brand: 'Yamaha',
      model: 'FZ-S',
      year: 2023,
      image: 'https://via.placeholder.com/300x200/f0f0f0/888888?text=Yamaha+FZ-S',
      dailyRate: 750,
      location: 'Mumbai',
      status: 'maintenance',
      bookings: 8,
      rating: 4.7
    }
  ]

  // Form validation
  const validateStep = (step) => {
    const errors = {}
    
    switch (step) {
      case 1:
        if (!vehicleData.brand) errors.brand = 'Brand is required'
        if (!vehicleData.model) errors.model = 'Model is required'
        if (!vehicleData.year) errors.year = 'Year is required'
        if (!vehicleData.color) errors.color = 'Color is required'
        if (!vehicleData.dailyRate || vehicleData.dailyRate <= 0) errors.dailyRate = 'Daily rate is required and must be positive'
        if (!vehicleData.location) errors.location = 'Location is required'
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
        if (!vehicleData.registrationNumber) errors.registrationNumber = 'Registration number is required'
        break
      case 5:
        if (vehicleData.photos.length === 0) errors.photos = 'At least one photo is required'
        break
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
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

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
      return
    }
    setVehicles(mockVehicles)

    // Check URL parameters for initial tab
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const tabParam = urlParams.get('tab')
      const actionParam = urlParams.get('action')
      
      if (tabParam && ['today', 'calendar', 'listings', 'bookings', 'earnings', 'menu'].includes(tabParam)) {
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
    }
  }, [user, loading, router])

  const handleAddVehicle = () => {
    setShowAddVehicleModal(true)
    setCurrentStep(1)
  }

  const handleQuickEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle)
    console.log('Quick edit vehicle:', vehicle)
  }

  const handleManageVehicle = (vehicle) => {
    setSelectedVehicle(vehicle)
    console.log('Manage vehicle:', vehicle)
  }

  const handleUpdateVehicle = (updatedVehicle) => {
    setVehicles(prev => prev.map(v => 
      v.id === updatedVehicle.id ? { ...v, ...updatedVehicle } : v
    ))
  }

  const handleDeleteVehicle = (vehicleId) => {
    setVehicles(prev => prev.filter(v => v.id !== vehicleId))
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

  const handleVehicleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Add vehicle to mock data with generated ID
      const newVehicle = {
        ...vehicleData,
        id: Date.now(),
        status: 'pending',
        bookings: 0,
        rating: 0,
        image: vehicleData.photos && vehicleData.photos[0] 
          ? URL.createObjectURL(vehicleData.photos[0]) 
          : 'https://via.placeholder.com/300x200/f0f0f0/888888?text=No+Image'
      }
      
      setVehicles(prev => [...prev, newVehicle])
      
      // Reset form
      setVehicleData({
        brand: '', model: '', year: '', color: '', fuelType: '', transmission: '',
        engineSize: '', mileage: '', seatingCapacity: '', condition: '', location: '',
        address: '', dailyRate: '', weeklyRate: '', monthlyRate: '', securityDeposit: '',
        registrationNumber: '', features: [], photos: [], description: '',
        availability: 'available', bodyType: '', doors: '', airbags: '',
        insurance: '', maintenance: '', category: 'economy'
      })
      setCurrentStep(1)
      setFormErrors({})
      setShowAddVehicleModal(false)
      
      // Show success message
      alert('Vehicle added successfully! It will be reviewed and activated within 24 hours.')
      
    } catch (error) {
      alert('Error adding vehicle. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAccountDataChange = (e) => {
    const { name, value } = e.target
    setAccountData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAccountSubmit = async (e) => {
    e.preventDefault()
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Account updated successfully!')
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

  const handleRemoveVehiclePhoto = (index) => {
    setVehicleData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
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
                <p className="text-2xl font-bold text-gray-900">₹{stats.monthlyEarnings.toLocaleString()}</p>
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

        {/* Navigation Tabs */}
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
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'today' && (
          <div className="space-y-8">
            {/* Welcome Header */}
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">Welcome back, Adnan</h1>
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
                  All reservations (0)
                </button>
              </div>

              {/* Reservation Tabs */}
              <div className="border-b border-gray-200 mb-8">
                <nav className="flex space-x-8">
                  <button className="py-2 px-1 border-b-2 border-black font-medium text-sm text-gray-900">
                    Checking out (0)
                  </button>
                  <button className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                    Currently hosting (0)
                  </button>
                  <button className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                    Arriving soon (0)
                  </button>
                  <button className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                    Upcoming (0)
                  </button>
                  <button className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700">
                    Pending review (0)
                  </button>
                </nav>
              </div>

              {/* Empty State */}
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6">
                  <svg className="w-full h-full text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-900 font-medium mb-2">You don't have any guests</p>
                <p className="text-gray-900 font-medium mb-2">checking out today</p>
                <p className="text-gray-900 font-medium">or tomorrow.</p>
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
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-48 object-cover"
                  />
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
                      <span className="text-xl font-bold text-orange-500">₹{vehicle.dailyRate}/day</span>
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
                        onClick={() => handleQuickEditVehicle(vehicle)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 transition-colors"
                      >
                        Quick Edit
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

        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Menu</h2>
              <div className="space-y-4">
                <button 
                  onClick={() => setShowAccountSettings(true)}
                  className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Account Settings
                </button>
                <button 
                  onClick={() => setActiveTab('bookings')}
                  className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Reservations
                </button>
                <button 
                  onClick={() => setActiveTab('earnings')}
                  className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Earnings
                </button>
                <button 
                  onClick={handleAddVehicle}
                  className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create New Listing
                </button>
                <hr className="my-2 border-gray-200" />
                <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center">
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment Methods
                </button>
                <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center">
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Help Center
                </button>
                <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-red-600 flex items-center">
                  <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Royal Enfield Classic 350</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Doe</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Aug 15-17, 2025</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹2,400</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                  <p className="text-3xl font-bold text-gray-900">₹45,000</p>
                  <p className="text-sm text-green-600">+12% from last month</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Last Month</p>
                  <p className="text-3xl font-bold text-gray-900">₹40,200</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-3xl font-bold text-gray-900">₹285,600</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicleModal && (
        <AddVehicleModal 
          isOpen={showAddVehicleModal}
          onClose={() => setShowAddVehicleModal(false)}
          vehicleData={vehicleData}
          setVehicleData={setVehicleData}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          carBrands={carBrands}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          onSubmit={handleVehicleSubmit}
          onInputChange={handleVehicleInputChange}
          validateStep={validateStep}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}

      {/* Account Settings Modal */}
      {showAccountSettings && (
        <AccountSettingsModal 
          isOpen={showAccountSettings}
          onClose={() => setShowAccountSettings(false)}
          accountData={accountData}
          onInputChange={handleAccountDataChange}
          onSubmit={handleAccountSubmit}
          onPhotoChange={handlePhotoChange}
          onRemovePhoto={handleRemovePhoto}
        />
      )}

      <Footer />
    </div>
  )
}

// Simplified Add Vehicle Modal Component
function AddVehicleModal({ 
  isOpen, 
  onClose, 
  vehicleData, 
  currentStep,
  carBrands,
  formErrors,
  isSubmitting,
  onSubmit,
  onInputChange,
  validateStep,
  nextStep,
  prevStep
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add New Vehicle</h2>
              <p className="text-gray-600">Step {currentStep} of 5</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Vehicle Basic Information</h3>
                <p className="text-gray-600">Tell us about your vehicle's basic details</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                  <select
                    name="brand"
                    value={vehicleData.brand}
                    onChange={onInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      formErrors.brand ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select Brand</option>
                    {Object.keys(carBrands).map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                  {formErrors.brand && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.brand}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                  {vehicleData.brand && carBrands[vehicleData.brand]?.length > 0 ? (
                    <select
                      name="model"
                      value={vehicleData.model}
                      onChange={onInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                        formErrors.model ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">Select Model</option>
                      {carBrands[vehicleData.brand].map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="model"
                      value={vehicleData.model}
                      onChange={onInputChange}
                      placeholder="e.g., Camry, Civic, Model S"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                        formErrors.model ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    />
                  )}
                  {formErrors.model && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.model}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                  <select
                    name="year"
                    value={vehicleData.year}
                    onChange={onInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      formErrors.year ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 15 }, (_, i) => 2024 - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {formErrors.year && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.year}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                  <input
                    type="text"
                    name="color"
                    value={vehicleData.color}
                    onChange={onInputChange}
                    placeholder="e.g., Black, Red, Blue"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      formErrors.color ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.color && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.color}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Daily Rate (₹) *</label>
                  <input
                    type="number"
                    name="dailyRate"
                    value={vehicleData.dailyRate}
                    onChange={onInputChange}
                    placeholder="e.g., 1500"
                    min="1"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      formErrors.dailyRate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.dailyRate && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.dailyRate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={vehicleData.location}
                    onChange={onInputChange}
                    placeholder="e.g., Mumbai, Delhi"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      formErrors.location ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.location && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Add other steps here when needed */}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Previous
              </button>
            )}
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-colors ml-auto disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Vehicle'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

// Simplified Account Settings Modal Component
function AccountSettingsModal({ 
  isOpen, 
  onClose, 
  accountData, 
  onInputChange, 
  onSubmit, 
  onPhotoChange, 
  onRemovePhoto 
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
              <p className="text-gray-600">Manage your account information and preferences</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={onSubmit} className="space-y-8">
            {/* Profile Section */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
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
                    onChange={onPhotoChange}
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
                    onClick={onRemovePhoto}
                    className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={accountData.firstName}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={accountData.lastName}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={accountData.email}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={accountData.phone}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={accountData.address}
                    onChange={onInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}