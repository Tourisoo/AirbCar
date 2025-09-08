'use client'

import { useState, useRef, useEffect } from 'react'
import { useClientOnly } from '@/hooks/useClientOnly'

export default function AddVehicleModal({ 
  showModal, 
  setShowModal, 
  vehicleData, 
  setVehicleData, 
  onSubmit 
}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [photos, setPhotos] = useState({
    front: null,
    side: null,
    back: null,
    interior: null
  })
  const [isMounted, setIsMounted] = useState(false)
  const isClient = useClientOnly()
  const fileInputRef = useRef(null)

  // Ensure component is mounted before rendering dynamic content
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Moroccan cities array
  const moroccanCities = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fes', 'Tangier', 'Agadir',
    'Meknes', 'Oujda', 'Kenitra', 'Tetouan', 'Safi', 'El Jadida',
    'Nador', 'Khouribga', 'Settat', 'Taza', 'Ouarzazate', 'Errachidia'
  ]

  // Image imports with fallbacks
  const front_img = '/pictures_car_example/image_front.png'
  const side_img = '/pictures_car_example/image_side.png'
  const back_img = '/pictures_car_example/image_back.png'
  const interior_img = '/pictures_car_example/image_interior.png'

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
        if (!vehicleData.fuelType) errors.fuelType = 'Fuel type is required'
        if (!vehicleData.transmission) errors.transmission = 'Transmission is required'
        break
      case 2:
        if (!vehicleData.seatingCapacity) errors.seatingCapacity = 'Seating capacity is required'
        if (!vehicleData.condition) errors.condition = 'Vehicle condition is required'
        break
      case 3:
        // Features step - no required validation, optional step
        break
      case 4:
        if (!vehicleData.dailyRate || vehicleData.dailyRate <= 0) errors.dailyRate = 'Daily rate is required and must be positive'
        if (!vehicleData.location) errors.location = 'Location is required'
        break
      case 5:
        // Check if at least the front photo is uploaded
        if (!photos.front || photos.front === 'loading') {
          errors.photos = 'At least the front photo is required'
        }
        break
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle file upload
  const handleFileUpload = (files) => {
    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit
      return isValidType && isValidSize
    })

    if (validFiles.length > 0) {
      const currentPhotos = vehicleData.photos || []
      const newPhotos = [...currentPhotos, ...validFiles].slice(0, 8) // Max 8 photos
      
      setVehicleData({
        ...vehicleData,
        photos: newPhotos
      })
      
      // Clear photo error if exists
      if (formErrors.photos) {
        setFormErrors(prev => ({ ...prev, photos: undefined }))
      }
    }
  }

  // Handle drag events
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
      handleFileUpload(e.dataTransfer.files)
    }
  }

  // Remove photo
  const removePhoto = (index) => {
    const newPhotos = vehicleData.photos.filter((_, i) => i !== index)
    setVehicleData({
      ...vehicleData,
      photos: newPhotos
    })
  }

  // Load example photos for demo purposes
  const loadExamplePhotos = async () => {
    const exampleImageUrls = [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1494976688153-ca3ce73b3abb?w=800&h=600&fit=crop&crop=center'
    ]

    try {
      const imageFiles = await Promise.all(
        exampleImageUrls.map(async (url, index) => {
          const response = await fetch(url)
          const blob = await response.blob()
          return new File([blob], `example-photo-${index + 1}.jpg`, { type: 'image/jpeg' })
        })
      )

      setVehicleData({
        ...vehicleData,
        photos: imageFiles
      })

      // Clear photo error if exists
      if (formErrors.photos) {
        setFormErrors(prev => ({ ...prev, photos: undefined }))
      }
    } catch (error) {
      console.error('Error loading example photos:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    // Clear any existing error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }))
    }
    
    if (type === 'checkbox') {
      if (name === 'features') {
        const currentFeatures = vehicleData.features || []
        const updatedFeatures = checked 
          ? [...currentFeatures, value]
          : currentFeatures.filter(feature => feature !== value)
        setVehicleData({
          ...vehicleData,
          features: updatedFeatures
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
      
      setVehicleData(updatedData)
    }
  }

  // Handle vehicle input change (consistent naming)
  const handleVehicleInputChange = handleInputChange

  // Handle file changes
  const handleFileChange = (e, photoType) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhotos(prev => ({
          ...prev,
          [photoType]: event.target.result
        }))
      }
      reader.readAsDataURL(file)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) {
      return
    }
    
    setIsSubmitting(true)
    try {
      await onSubmit(vehicleData)
      setCurrentStep(1)
      setFormErrors({})
      setShowModal(false)
    } catch (error) {
      console.error('Error submitting vehicle:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle vehicle submit (consistent naming)
  const handleVehicleSubmit = handleSubmit

  // Don't render until client-side mounted to prevent hydration mismatch
  if (!isClient || !showModal) return null

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 border-b border-gray-200 p-6 rounded-t-2xl" >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add Your Vehicle</h2>
              <p className="text-gray-600">Step {currentStep} of 5 - Let&apos;s get your vehicle listed!</p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>Basic Info</span>
              <span>Specifications</span>
              <span>Pricing</span>
              <span>Features</span>
              <span>Photos</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

            <form onSubmit={handleVehicleSubmit} className="p-4 sm:p-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center" style={{ backgroundColor: '#ff4c25' }}>
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Vehicle Basic Information</h3>
                    <p className="text-sm sm:text-base text-gray-600">Tell us about your vehicle's basic details</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                      <select
                        name="brand"
                        value={vehicleData?.brand || ''}
                        onChange={handleVehicleInputChange}
                        className={`w-full px-3 sm:px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${formErrors.brand ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        required
                      >
                        <option value="">Select Brand</option>
                        <option value="Royal Enfield">Royal Enfield</option>
                        <option value="Honda">Honda</option>
                        <option value="Yamaha">Yamaha</option>
                        <option value="Bajaj">Bajaj</option>
                        <option value="TVS">TVS</option>
                        <option value="KTM">KTM</option>
                        <option value="Suzuki">Suzuki</option>
                        <option value="Hero">Hero</option>
                        <option value="Other">Other</option>
                      </select>
                      {formErrors.brand && <p className="text-red-500 text-xs mt-1">{formErrors.brand}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                      <input
                        type="text"
                        name="model"
                        value={vehicleData?.model || ''}
                        onChange={handleVehicleInputChange}
                        placeholder="e.g., Classic 350, R15 V4"
                        className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                      <select
                        name="year"
                        value={vehicleData?.year || ''}
                        onChange={handleVehicleInputChange}
                        className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        required
                      >
                        <option value="">Select Year</option>
                        {Array.from({ length: 15 }, (_, i) => 2024 - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type *</label>
                      <select
                        name="fuelType"
                        value={vehicleData?.fuelType || ''}
                        onChange={handleVehicleInputChange}
                        className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        required
                      >
                        <option value="">Select Fuel Type</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Transmission *</label>
                      <select
                        name="transmission"
                        value={vehicleData?.transmission || ''}
                        onChange={handleVehicleInputChange}
                        className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        required
                      >
                        <option value="">Select Transmission</option>
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Specifications */}
              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgb(255, 76, 37)' }}>
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Vehicle Specifications</h3>
                    <p className="text-sm sm:text-base text-gray-600">Provide detailed specifications of your vehicle</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seating Capacity *</label>
                      <select
                        name="seatingCapacity"
                        value={vehicleData?.seatingCapacity || ''}
                        onChange={handleVehicleInputChange}
                        className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        required
                      >
                        <option value="">Select Capacity</option>
                        <option value="2">2 People</option>
                        <option value="4">4 People</option>
                        <option value="5">5 People</option>
                        <option value="7+">7+ People</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Condition *</label>
                      <select
                        name="condition"
                        value={vehicleData?.condition || ''}
                        onChange={handleVehicleInputChange}
                        className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        required
                      >
                        <option value="">Select Condition</option>
                        <option value="Excellent">Excellent (Like new)</option>
                        <option value="Good">Good (Well maintained)</option>
                        <option value="Fair">Fair (Some wear)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Features & Safety */}
              {currentStep === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Features & Safety</h3>
                    <p className="text-sm sm:text-base text-gray-600">Highlight what makes your vehicle special</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 sm:mb-4">Available Features (Select all that apply)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {[
                        'GPS Navigation', 'Bluetooth Connectivity', 'USB Charging Port',
                        'LED Headlights', 'Digital Speedometer', 'Anti-theft System',
                        'Helmet Storage', 'Mobile Holder', 'Side Bags',
                        'First Aid Kit', 'Tool Kit', 'Spare Helmet',
                        'Rain Cover', 'Phone Charger', 'Action Camera Mount'
                      ].map((feature) => (
                        <label key={feature} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            name="features"
                            value={feature}
                            checked={(vehicleData.features || []).includes(feature)}
                            onChange={handleVehicleInputChange}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Description</label>
                    <textarea
                      name="description"
                      value={vehicleData.description || ''}
                      onChange={handleVehicleInputChange}
                      rows="4"
                      placeholder="Describe your vehicle's unique features, recent upgrades, or any special aspects customers should know about..."
                      className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Step 4: Location & Pricing */}
              {currentStep === 4 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Location & Pricing</h3>
                    <p className="text-sm sm:text-base text-gray-600">Set competitive rates to maximize your bookings</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="sm:col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">City/Location *</label>
                      <select
                        name="location"
                        value={vehicleData?.location || ''}
                        onChange={handleVehicleInputChange}
                        className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                        required
                      >
                        <option value="">Select City</option>
                        {moroccanCities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Daily Rate (DH) *</label>
                      <input
                        type="number"
                        name="dailyRate"
                        value={vehicleData.dailyRate || ''}
                        onChange={handleVehicleInputChange}
                        placeholder="e.g., 500, 750, 1000"
                        className={`w-full px-3 sm:px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${formErrors.dailyRate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        required
                      />
                      {formErrors.dailyRate && <p className="text-red-500 text-xs mt-1">{formErrors.dailyRate}</p>}
                      <p className="text-xs text-gray-500 mt-1">Suggested: DH400-800 for 150cc, DH600-1200 for 350cc+</p>
                    </div>
                  </div>

                  {/* Earnings Calculator - Mobile Optimized */}
                  {vehicleData?.dailyRate && vehicleData.dailyRate > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 sm:p-6">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Potential Earnings Calculator
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                        <div className="bg-white p-3 sm:p-4 rounded-lg">
                          <div className="text-xs sm:text-sm text-gray-600">If rented 15 days/month</div>
                          <div className="text-lg sm:text-xl font-bold text-green-600">
                            DH{Math.round(vehicleData.dailyRate * 15 * 0.85).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Your earnings after 15% commission</div>
                        </div>

                        <div className="bg-white p-3 sm:p-4 rounded-lg">
                          <div className="text-xs sm:text-sm text-gray-600">If rented 20 days/month</div>
                          <div className="text-lg sm:text-xl font-bold text-green-600">
                            DH{Math.round(vehicleData.dailyRate * 20 * 0.85).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Your earnings after 15% commission</div>
                        </div>

                        <div className="bg-white p-3 sm:p-4 rounded-lg">
                          <div className="text-xs sm:text-sm text-gray-600">If rented 25 days/month</div>
                          <div className="text-lg sm:text-xl font-bold text-green-600">
                            DH{Math.round(vehicleData.dailyRate * 25 * 0.85).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Your earnings after 15% commission</div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 mt-3 text-center">
                        💡 Average partners rent their vehicles 18-22 days per month
                      </p>
                    </div>
                  )}
                </div>
              )}

{currentStep === 5 && (
  <div className="space-y-8">
    {/* Vehicle Detection Functions */}
    {isMounted && isClient && (() => {
      // Enhanced vehicle detection using multiple sophisticated approaches
      const detectVehicleInImage = async (imageFile) => {
        return new Promise((resolve) => {
          if (typeof window === 'undefined') {
            resolve({
              isVehicle: true,
              confidence: 75,
              details: { error: 'Server-side, allowing upload' }
            });
            return;
          }

          const img = new Image();
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          img.onload = () => {
            try {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              
              // Get image data for analysis
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const data = imageData.data;
              
              let vehicleScore = 0;
              let metallic = 0;
              let darkColors = 0;
              let brightColors = 0;
              let edgePixels = 0;
              
              // More sophisticated color and pattern analysis
              for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const brightness = (r + g + b) / 3;
                
                // Check for typical vehicle colors with broader criteria
                if (
                  // Metallic/gray tones (more flexible)
                  (Math.abs(r - g) < 40 && Math.abs(g - b) < 40 && Math.abs(r - b) < 40) ||
                  // Common car colors - reds
                  (r > 120 && g < 80 && b < 80) ||
                  // Common car colors - blues  
                  (r < 80 && g < 100 && b > 120) ||
                  // Common car colors - greens
                  (r < 100 && g > 120 && b < 100) ||
                  // Black/dark colors (very common for cars)
                  (r < 60 && g < 60 && b < 60) ||
                  // White/light colors
                  (r > 200 && g > 200 && b > 200)
                ) {
                  metallic++;
                }
                
                if (brightness < 80) darkColors++;
                if (brightness > 180) brightColors++;
                
                // Simple edge detection for geometric shapes
                if (i > 0 && i < data.length - 4) {
                  const prevBrightness = (data[i-4] + data[i-3] + data[i-2]) / 3;
                  if (Math.abs(brightness - prevBrightness) > 30) {
                    edgePixels++;
                  }
                }
              }
              
              const totalPixels = data.length / 4;
              const metallicRatio = metallic / totalPixels;
              const darkRatio = darkColors / totalPixels;
              const brightRatio = brightColors / totalPixels;
              const edgeRatio = edgePixels / totalPixels;
              
              // Much more lenient scoring system
              if (metallicRatio > 0.15) vehicleScore += 25; // Reduced threshold
              if (darkRatio > 0.1) vehicleScore += 20; // Dark surfaces common in cars
              if (brightRatio > 0.05) vehicleScore += 15; // Light reflections
              if (edgeRatio > 0.05) vehicleScore += 15; // Geometric shapes
              if (canvas.width > canvas.height) vehicleScore += 15; // Landscape format
              if (canvas.width > 200 && canvas.height > 150) vehicleScore += 10; // Reasonable size
              
              // Additional bonus for typical car image characteristics
              const aspectRatio = canvas.width / canvas.height;
              if (aspectRatio > 1.2 && aspectRatio < 2.5) vehicleScore += 10; // Typical car photo ratio
              
              resolve({
                isVehicle: vehicleScore > 30, // Much lower threshold
                confidence: Math.min(vehicleScore, 100),
                details: {
                  metallicRatio: metallicRatio.toFixed(3),
                  darkRatio: darkRatio.toFixed(3),
                  brightRatio: brightRatio.toFixed(3),
                  edgeRatio: edgeRatio.toFixed(3),
                  dimensions: `${canvas.width}x${canvas.height}`,
                  aspectRatio: aspectRatio.toFixed(2),
                  score: vehicleScore
                }
              });
            } catch (error) {
              resolve({
                isVehicle: true,
                confidence: 75,
                details: { error: 'Analysis failed, allowing upload' }
              });
            }
          };
          
          img.onerror = () => {
            resolve({
              isVehicle: true,
              confidence: 75,
              details: { error: 'Image load failed, allowing upload' }
            });
          };
          
          img.src = URL.createObjectURL(imageFile);
        });
      };
      
      // Enhanced vehicle detection with multiple validation layers
      if (typeof window !== 'undefined') {
        window.detectVehicle = async (imageFile) => {
          try {
            const basicResult = await detectVehicleInImage(imageFile);
            
            // File-based analysis
            const fileName = imageFile.name.toLowerCase();
            const hasCarKeywords = [
              'car', 'vehicle', 'auto', 'bmw', 'toyota', 'honda', 'ford', 
              'mercedes', 'audi', 'volkswagen', 'nissan', 'mazda', 'hyundai',
              'kia', 'lexus', 'infiniti', 'acura', 'volvo', 'subaru', 'jeep',
              'chevrolet', 'dodge', 'chrysler', 'buick', 'cadillac', 'lincoln',
              'porsche', 'ferrari', 'lamborghini', 'maserati', 'bentley',
              'sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'truck'
            ].some(keyword => fileName.includes(keyword));
            
            const fileSize = imageFile.size;
            const isGoodSize = fileSize > 50000 && fileSize < 15000000; // 50KB to 15MB
            
            let finalScore = basicResult.confidence;
            
            // Bonus points for positive indicators
            if (hasCarKeywords) finalScore += 25; // Strong indicator
            if (isGoodSize) finalScore += 10;
            if (imageFile.type.startsWith('image/jpeg') || imageFile.type.startsWith('image/jpg')) finalScore += 5; // Common photo format
            
            // Very lenient final check - most images should pass
            const isVehicle = finalScore > 25 || hasCarKeywords || basicResult.confidence > 40;
            
            return {
              isVehicle: isVehicle,
              confidence: Math.min(finalScore, 100),
              details: {
                ...basicResult.details,
                hasCarKeywords,
                fileSize: `${Math.round(fileSize / 1024)}KB`,
                fileType: imageFile.type,
                finalScore: finalScore,
                passedBasicTest: basicResult.confidence > 40,
                passedKeywordTest: hasCarKeywords,
                passedSizeTest: isGoodSize
              }
            };
          } catch (error) {
            console.error('Vehicle detection error:', error);
            // Very generous fallback - almost always allow upload
            return {
              isVehicle: true,
              confidence: 85,
              details: { error: 'Detection failed, allowing upload' }
            };
          }
        };
      }
      
      return null;
    })()}
    {/* Header */}
    <div className="text-center">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center shadow-lg">
        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">Pictures of the vehicle</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
        We only display cars with photos. You can start with one and add more later.
      </p>
      
      {/* Progress Indicator */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4 sm:mb-6">
        <div className="text-xs sm:text-sm font-medium text-gray-700">
          {Object.values(photos).filter(photo => photo && photo !== 'loading').length} of 4 photos uploaded
        </div>
        <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(Object.values(photos).filter(photo => photo && photo !== 'loading').length / 4) * 100}%` }}
          />
        </div>
      </div>
    </div>

    {/* Tips Section */}
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-blue-200">
      <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Photography Tips
      </h4>
      <div className="grid grid-cols-1 gap-2 sm:gap-3">
        {[
          'Use landscape format for best results',
          'Follow our angle guidelines shown in examples',
          'Keep the background clear and neutral',
          'Use only natural daylight for best quality'
        ].map((tip, index) => (
          <div key={index} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{tip}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Photo Upload Sections */}
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 space-y-8">
        {/* Main Picture */}
        <div className="border-b border-gray-100 pb-8">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Main Picture</h4>
            <p className="text-gray-600">This is the first photo drivers will see - make it count!</p>
          </div>

          <div className="space-y-3 ">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  3/4 Front
                  <span className="text-red-500 text-xs">*</span>
                </h5>
                <p className="text-sm text-gray-600 mt-1">A 3/4 front photo that stands out and showcases your vehicle's best angle.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 items-start">
              {/* Upload Area */}
              <div className="relative order-2 lg:order-1">
                <label 
                  className={`
                    relative block w-full h-55 sm:h-54 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
                    ${photos.front ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
                  `}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) {
                      const fakeEvent = { target: { files: [file] } };
                      handleFileChange(fakeEvent, "front");
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {photos.front === 'loading' ? (
                    <div className="flex flex-col items-center justify-center h-full p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                      <p className="text-sm font-medium text-blue-600">Analyzing image...</p>
                      <p className="text-xs text-gray-500">Checking if this is a vehicle</p>
                    </div>
                  ) : photos.front ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={photos.front} 
                        alt="Front uploaded" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPhotos(prev => ({...prev, front: null}));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-4">
                      <svg className="w-6 h-6 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-sm font-medium text-gray-600">+ 3/4 Front</p>
                      <p className="text-xs text-gray-500 mt-1">Click to upload or drag & drop</p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Show loading state
                        setPhotos(prev => ({...prev, front: 'loading'}));
                        
                        // Detect vehicle only if client-side
                        if (typeof window !== 'undefined' && window.detectVehicle) {
                          const detection = await window.detectVehicle(file);
                          
                          if (!detection.isVehicle) {
                            const message = `This image doesn't appear to be a vehicle photo (${detection.confidence}% confidence).\n\nAnalysis details:\n• Basic test: ${detection.details.passedBasicTest ? '✓ Passed' : '✗ Failed'}\n• Keywords: ${detection.details.passedKeywordTest ? '✓ Found' : '✗ None found'}\n• File size: ${detection.details.passedSizeTest ? '✓ Good' : '✗ Too small/large'}\n\nPlease upload a clear photo of your vehicle. If this is a vehicle photo, try renaming the file to include words like 'car' or the vehicle brand.`;
                            alert(message);
                            setPhotos(prev => ({...prev, front: null}));
                            return;
                          }
                        }
                        
                        handleFileChange(e, "front");
                      }
                    }}
                    aria-label="Upload front photo"
                  />
                </label>
              </div>

              {/* Example Image */}
              <div className="relative order-1 lg:order-2">
                <img 
                  src={front_img} 
                  alt="Example front view" 
                  className="w-full h-full sm:h-full object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-black bg-opacity-50 text-white text-xs px-1 sm:px-2 py-1 rounded">
                  Example
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Pictures */}
        <div>
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Additional Pictures</h4>
            <p className="text-gray-600">These photos help complete the story of your vehicle.</p>
          </div>
          
          <div className="space-y-8">
            {/* Side Photo */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-semibold text-gray-900">Side View</h5>
                  <p className="text-sm text-gray-600 mt-1">A side photo to give an idea of the size and profile of your car.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 items-start">
                <div className="relative order-2 lg:order-1">
                  <label 
                    className={`
                      relative block w-full h-55 sm:h-54 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
                      ${photos.side ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
                    `}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        setPhotos(prev => ({...prev, side: 'loading'}));
                        if (typeof window !== 'undefined' && window.detectVehicle) {
                          const detection = await window.detectVehicle(file);
                          if (!detection.isVehicle) {
                            alert(`This doesn't appear to be a vehicle photo (${detection.confidence}% confidence). Please upload a clear photo of your vehicle.`);
                            setPhotos(prev => ({...prev, side: null}));
                            return;
                          }
                        }
                        const fakeEvent = { target: { files: [file] } };
                        handleFileChange(fakeEvent, "side");
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {photos.side === 'loading' ? (
                      <div className="flex flex-col items-center justify-center h-full p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                        <p className="text-sm font-medium text-blue-600">Analyzing image...</p>
                        <p className="text-xs text-gray-500">Checking if this is a vehicle</p>
                      </div>
                    ) : photos.side ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={photos.side} 
                          alt="Side uploaded" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setPhotos(prev => ({...prev, side: null}));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-4">
                        <svg className="w-6 h-6 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-600">+ Side</p>
                        <p className="text-xs text-gray-500 mt-1">Click to upload or drag & drop</p>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setPhotos(prev => ({...prev, side: 'loading'}));
                          if (typeof window !== 'undefined' && window.detectVehicle) {
                            const detection = await window.detectVehicle(file);
                            if (!detection.isVehicle) {
                              alert(`This doesn't appear to be a vehicle photo (${detection.confidence}% confidence). Please upload a clear photo of your vehicle.`);
                              setPhotos(prev => ({...prev, side: null}));
                              return;
                            }
                          }
                          handleFileChange(e, "side");
                        }
                      }}
                      aria-label="Upload side photo"
                    />
                  </label>
                </div>

                <div className="relative order-1 lg:order-2">
                  <img 
                    src={side_img} 
                    alt="Example side view" 
                    className="w-full h-55 sm:h-54 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-black bg-opacity-50 text-white text-xs px-1 sm:px-2 py-1 rounded">
                    Example
                  </div>
                </div>
              </div>
            </div>

            {/* Back Photo */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-semibold text-gray-900">3/4 Back</h5>
                  <p className="text-sm text-gray-600 mt-1">A 3/4 back photo to complete the exterior overview.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 items-start">
                <div className="relative order-2 lg:order-1">
                  <label 
                    className={`
                      relative block w-full h-55 sm:h-54 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
                      ${photos.back ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
                    `}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        setPhotos(prev => ({...prev, back: 'loading'}));
                        if (typeof window !== 'undefined' && window.detectVehicle) {
                          const detection = await window.detectVehicle(file);
                          if (!detection.isVehicle) {
                            alert(`This doesn't appear to be a vehicle photo (${detection.confidence}% confidence). Please upload a clear photo of your vehicle.`);
                            setPhotos(prev => ({...prev, back: null}));
                            return;
                          }
                        }
                        const fakeEvent = { target: { files: [file] } };
                        handleFileChange(fakeEvent, "back");
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {photos.back === 'loading' ? (
                      <div className="flex flex-col items-center justify-center h-full p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                        <p className="text-sm font-medium text-blue-600">Analyzing image...</p>
                        <p className="text-xs text-gray-500">Checking if this is a vehicle</p>
                      </div>
                    ) : photos.back ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={photos.back} 
                          alt="Back uploaded" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setPhotos(prev => ({...prev, back: null}));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-4">
                        <svg className="w-6 h-6 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-600">+ 3/4 Back</p>
                        <p className="text-xs text-gray-500 mt-1">Click to upload or drag & drop</p>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setPhotos(prev => ({...prev, back: 'loading'}));
                          if (typeof window !== 'undefined' && window.detectVehicle) {
                            const detection = await window.detectVehicle(file);
                            if (!detection.isVehicle) {
                              alert(`This doesn't appear to be a vehicle photo (${detection.confidence}% confidence). Please upload a clear photo of your vehicle.`);
                              setPhotos(prev => ({...prev, back: null}));
                              return;
                            }
                          }
                          handleFileChange(e, "back");
                        }
                      }}
                      aria-label="Upload back photo"
                    />
                  </label>
                </div>

                <div className="relative order-1 lg:order-2">
                  <img 
                    src={back_img} 
                    alt="Example back view" 
                    className="w-full h-full sm:h-full object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-black bg-opacity-50 text-white text-xs px-1 sm:px-2 py-1 rounded">
                    Example
                  </div>
                </div>
              </div>
            </div>

            {/* Interior Photo */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-semibold text-gray-900">Interior</h5>
                  <p className="text-sm text-gray-600 mt-1">An interior photo to help drivers picture themselves behind the wheel.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 items-start">
                <div className="relative order-2 lg:order-1">
                  <label 
                    className={`
                      relative block w-full h-55 sm:h-54 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
                      ${photos.interior ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
                    `}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        setPhotos(prev => ({...prev, interior: 'loading'}));
                        // Interior photos have different detection criteria
                        if (typeof window !== 'undefined' && window.detectVehicle) {
                          const detection = await window.detectVehicle(file);
                          // For interior, we're more lenient as it's harder to detect
                          if (!detection.isVehicle && detection.confidence < 30) {
                            alert(`This doesn't appear to be a vehicle interior photo. Please upload a photo of your vehicle's interior.`);
                            setPhotos(prev => ({...prev, interior: null}));
                            return;
                          }
                        }
                        const fakeEvent = { target: { files: [file] } };
                        handleFileChange(fakeEvent, "interior");
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {photos.interior === 'loading' ? (
                      <div className="flex flex-col items-center justify-center h-full p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                        <p className="text-sm font-medium text-blue-600">Analyzing image...</p>
                        <p className="text-xs text-gray-500">Checking if this is a vehicle interior</p>
                      </div>
                    ) : photos.interior ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={photos.interior} 
                          alt="Interior uploaded" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setPhotos(prev => ({...prev, interior: null}));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-4">
                        <svg className="w-6 h-6 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-600">+ Interior</p>
                        <p className="text-xs text-gray-500 mt-1">Click to upload or drag & drop</p>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setPhotos(prev => ({...prev, interior: 'loading'}));
                          if (typeof window !== 'undefined' && window.detectVehicle) {
                            const detection = await window.detectVehicle(file);
                            // For interior, we're more lenient
                            if (!detection.isVehicle && detection.confidence < 30) {
                              alert(`This doesn't appear to be a vehicle interior photo. Please upload a photo of your vehicle's interior.`);
                              setPhotos(prev => ({...prev, interior: null}));
                              return;
                            }
                          }
                          handleFileChange(e, "interior");
                        }
                      }}
                      aria-label="Upload interior photo"
                    />
                  </label>
                </div>

                <div className="relative order-1 lg:order-2">
                  <img 
                    src={interior_img} 
                    alt="Example interior view" 
                    className="w-full h-full sm:h-full object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-black bg-opacity-50 text-white text-xs px-1 sm:px-2 py-1 rounded">
                    Example
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Error Display for Step 5 */}
    {formErrors.photos && (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm font-medium">{formErrors.photos}</p>
      </div>
    )}
    {formErrors.general && (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm font-medium">{formErrors.general}</p>
      </div>
    )}
  </div>
)}


              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 border-t border-gray-200 mt-6 sm:mt-8 gap-3 sm:gap-0">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`w-full sm:w-auto px-4 sm:px-6 py-3 rounded-lg font-medium text-sm sm:text-base ${currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  Previous
                </button>

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-all duration-200 text-sm sm:text-base"
                    style={{ backgroundColor: '#ff4c25' }}
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 text-sm sm:text-base ${isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'text-white hover:opacity-90'
                      } transition-all duration-200`}
                    style={{ backgroundColor: isSubmitting ? '#9ca3af' : '#ff4c25' }}
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      </svg>
                    ) : null}
                    {isSubmitting ? 'Submitting...' : 'Submit Vehicle'}
                  </button>
                )}
              </div>
            </form>
      </div>
    </div>
  )
}
