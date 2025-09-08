'use client'

import { useState, useRef } from 'react'

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
  const fileInputRef = useRef(null)

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
        if (!vehicleData.color) errors.color = 'Color is required'
        break
      case 2:
        if (!vehicleData.fuelType) errors.fuelType = 'Fuel type is required'
        if (!vehicleData.transmission) errors.transmission = 'Transmission is required'
        if (!vehicleData.seatingCapacity) errors.seatingCapacity = 'Seating capacity is required'
        break
      case 3:
        if (!vehicleData.dailyRate || vehicleData.dailyRate <= 0) errors.dailyRate = 'Daily rate is required and must be positive'
        if (!vehicleData.location) errors.location = 'Location is required'
        break
      case 4:
        if (!vehicleData.photos || vehicleData.photos.length === 0) errors.photos = 'At least 4 photo is required'
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
        const updatedFeatures = checked 
          ? [...vehicleData.features, value]
          : vehicleData.features.filter(feature => feature !== value)
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

  if (!showModal) return null

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add Your Vehicle</h2>
              <p className="text-gray-600">Step {currentStep} of 4 - Let&apos;s get your vehicle listed!</p>
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
              <span>Photos</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Vehicle Basic Information</h3>
                <p className="text-gray-600">Tell us about your vehicle&apos;s basic details</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                  <select
                    name="brand"
                    value={vehicleData.brand}
                    onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                  <select
                    name="color"
                    value={vehicleData.color}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      formErrors.color ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select Color</option>
                    <option value="White">White</option>
                    <option value="Black">Black</option>
                    <option value="Silver">Silver</option>
                    <option value="Gray">Gray</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Orange">Orange</option>
                    <option value="Brown">Brown</option>
                    <option value="Other">Other</option>
                  </select>
                  {formErrors.color && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.color}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Specifications */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Vehicle Specifications</h3>
                <p className="text-gray-600">Technical details and specifications</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type *</label>
                  <select
                    name="fuelType"
                    value={vehicleData.fuelType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      formErrors.fuelType ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="Gasoline">Gasoline</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                    <option value="Compressed Natural Gas">CNG</option>
                  </select>
                  {formErrors.fuelType && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.fuelType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transmission *</label>
                  <select
                    name="transmission"
                    value={vehicleData.transmission}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      formErrors.transmission ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select Transmission</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                  {formErrors.transmission && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.transmission}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seating Capacity *</label>
                  <select
                    name="seatingCapacity"
                    value={vehicleData.seatingCapacity}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      formErrors.seatingCapacity ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select Capacity</option>
                    <option value="2">2 Seats</option>
                    <option value="4">4 Seats</option>
                    <option value="5">5 Seats</option>
                    <option value="6">6 Seats</option>
                    <option value="7">7 Seats</option>
                    <option value="8">8+ Seats</option>
                  </select>
                  {formErrors.seatingCapacity && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.seatingCapacity}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <select
                    name="condition"
                    value={vehicleData.condition}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="">Select Condition</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Pricing & Location</h3>
                <p className="text-gray-600">Set your rates and location</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Daily Rate ($) *</label>
                  <input
                    type="number"
                    name="dailyRate"
                    value={vehicleData.dailyRate}
                    onChange={handleInputChange}
                    placeholder="e.g., 50"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Rate ($)</label>
                  <input
                    type="number"
                    name="weeklyRate"
                    value={vehicleData.weeklyRate}
                    onChange={handleInputChange}
                    placeholder="Auto-calculated"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-gray-50"
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-700">15% discount applied automatically</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rate ($)</label>
                  <input
                    type="number"
                    name="monthlyRate"
                    value={vehicleData.monthlyRate}
                    onChange={handleInputChange}
                    placeholder="Auto-calculated"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-gray-50"
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-700">30% discount applied automatically</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Security Deposit ($)</label>
                  <input
                    type="number"
                    name="securityDeposit"
                    value={vehicleData.securityDeposit}
                    onChange={handleInputChange}
                    placeholder="Auto-calculated"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-gray-50"
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-700">2 days worth of daily rate</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={vehicleData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., New York, NY"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      formErrors.location ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.location && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={vehicleData.description}
                    onChange={handleInputChange}
                    placeholder="Tell potential renters about your vehicle..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">📸 Add Vehicle Photos</h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Great photos are key to attracting customers. Upload high-quality images that showcase your vehicle&apos;s best features.
                </p>
              </div>

              {/* Main Upload Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-dashed border-gray-300 transition-all duration-300 hover:border-orange-400 hover:from-orange-50 hover:to-orange-100">
                {(!vehicleData.photos || vehicleData.photos.length === 0) ? (
                  /* Initial Upload Area */
                  <div
                    className={`relative transition-all duration-300 ${
                      dragActive 
                        ? 'transform scale-105' 
                        : ''
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    
                    <div className="text-center space-y-6">
                      <div className="relative">
                        <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                          dragActive 
                            ? 'bg-orange-500 text-white transform scale-110' 
                            : 'bg-white text-orange-500 border-4 border-orange-200'
                        }`}>
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        {dragActive && (
                          <div className="absolute -inset-4 border-2 border-orange-400 border-dashed rounded-full animate-ping"></div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-gray-900">
                          {dragActive ? '📂 Drop your photos here!' : '🚗 Upload Vehicle Photos'}
                        </h4>
                        <p className="text-gray-600 text-lg">
                          Drag and drop your photos here, or{' '}
                          <button
                            type="button"
                            className="font-semibold text-orange-600 hover:text-orange-700 underline decoration-2 underline-offset-2 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            click to browse
                          </button>
                        </p>
                        
                        <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Up to 8 photos
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            JPG, PNG, WEBP
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Max 5MB each
                          </div>
                        </div>
                        
                        {/* Demo Button */}
                        <div className="pt-4 border-t border-gray-200">
                          <button
                            type="button"
                            onClick={loadExamplePhotos}
                            className="mx-auto flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            🎯 Try with Example Photos
                          </button>
                          <p className="text-xs text-gray-500 text-center mt-1">Perfect for testing the form</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Photos Management Area */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                        <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          {vehicleData.photos.length}
                        </span>
                        Photos Uploaded ({vehicleData.photos.length}/8)
                      </h4>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center font-medium"
                        disabled={vehicleData.photos.length >= 8}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add More Photos
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                      />
                    </div>

                    {/* Photo Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {vehicleData.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 hover:border-orange-300 transition-all duration-300 hover:shadow-xl">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Vehicle photo ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          {/* Labels */}
                          {index === 0 && (
                            <div className="absolute -top-2 -left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                              ⭐ Main Photo
                            </div>
                          )}
                          <div className="absolute -bottom-2 -right-2 bg-white text-gray-600 text-xs px-2 py-1 rounded-full font-medium shadow-md border">
                            #{index + 1}
                          </div>
                        </div>
                      ))}

                      {/* Add More Button */}
                      {vehicleData.photos.length < 8 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 group"
                        >
                          <div className="text-center">
                            <div className="w-12 h-12 bg-gray-100 group-hover:bg-orange-100 rounded-full flex items-center justify-center mb-2 transition-colors">
                              <svg className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                            <p className="text-xs text-gray-500 group-hover:text-orange-600 font-medium transition-colors">Add Photo</p>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {formErrors.photos && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 text-center font-medium">{formErrors.photos}</p>
                  </div>
                )}
              </div>

              {/* Photo Guidelines */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4 w-full">
                    <h5 className="text-lg font-semibold text-blue-900 mb-3">📋 Photography Guidelines</h5>
                    
                    {/* Example Photos Section */}
                    <div className="mb-6">
                      <h6 className="font-medium text-blue-800 mb-3">🎯 Photo Examples - What Great Vehicle Photos Look Like:</h6>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="relative">
                          <img 
                            src="https://ik.imagekit.io/szcfr7vth/pictures_car_example/image_front.png"
                            alt="Front view example"
                            className="w-full h-20 object-cover rounded-lg border-2 border-green-200"
                          />
                          <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            ✅ Front View
                          </div>
                        </div>
                        <div className="relative">
                          <img 
                            src="https://ik.imagekit.io/szcfr7vth/pictures_car_example/image_side.png"
                            alt="Side view example"
                            className="w-full h-20 object-cover rounded-lg border-2 border-green-200"
                          />
                          <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            ✅ Side View
                          </div>
                        </div>
                        <div className="relative">
                          <img 
                            src="https://ik.imagekit.io/szcfr7vth/pictures_car_example/image_interior.png"
                            alt="Interior example"
                            className="w-full h-20 object-cover rounded-lg border-2 border-green-200"
                          />
                          <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            ✅ Interior View
                          </div>
                        </div>
                        <div className="relative">
                          <img 
                            src="https://ik.imagekit.io/szcfr7vth/pictures_car_example/image_back.png"
                            alt="Dashboard example"
                            className="w-full h-20 object-cover rounded-lg border-2 border-green-200"
                          />
                          <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            ✅ back
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-blue-700 text-center italic">
                        👆 These are examples of high-quality vehicle photos that attract more bookings
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h6 className="font-medium text-blue-800 mb-2">✅ Do&apos;s:</h6>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• 📸 Use natural daylight for best results</li>
                          <li>• 🧽 Clean your vehicle thoroughly first</li>
                          <li>• 📐 Take photos from multiple angles</li>
                          <li>• 🎯 Focus on unique features</li>
                          <li>• 📱 Use high-resolution camera/phone</li>
                          <li>• 🏞️ Choose clean, uncluttered backgrounds</li>
                        </ul>
                      </div>
                      <div>
                        <h6 className="font-medium text-blue-800 mb-2">❌ Don&apos;ts:</h6>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• 🌙 Avoid dark or blurry photos</li>
                          <li>• 🚫 Don&apos;t include personal items</li>
                          <li>• 📵 Avoid over-filtering or editing</li>
                          <li>• 🤳 Don&apos;t include people in photos</li>
                          <li>• ⚠️ Avoid damaged areas close-ups</li>
                          <li>• 🌧️ Don&apos;t shoot in bad weather</li>
                        </ul>
                      </div>
                    </div>

                    {/* Photo Angle Guide */}
                    <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                      <h6 className="font-medium text-blue-800 mb-2">📐 Recommended Photo Angles:</h6>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-medium">1. Front 45°</div>
                          <div>Main showcase</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-medium">2. Side Profile</div>
                          <div>Full body</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-medium">3. Rear View</div>
                          <div>Back design</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-medium">4. Interior</div>
                          <div>Dashboard & seats</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Order Info */}
              {vehicleData.photos && vehicleData.photos.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Perfect! Your first photo will be the main display image. 
                        <span className="block text-green-600 mt-1">You can always reorder photos later in your dashboard.</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>
            
            <div>
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Adding Vehicle...' : 'Add Vehicle'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
