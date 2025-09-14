'use client'

import { useState, useRef } from 'react'

export default function VehicleManageModal({ 
  showModal, 
  setShowModal, 
  vehicle,
  onUpdate,
  onDelete 
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(vehicle || {})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  const [maintenanceForm, setMaintenanceForm] = useState({
    type: '',
    description: '',
    scheduledDate: '',
    garage: '',
    estimatedCost: '',
    priority: 'medium'
  })
  const fileInputRef = useRef(null)

  // Booking and maintenance mock data
  const mockBookings = [
    {
      id: 1,
      customer: 'John Doe',
      phone: '+91 98765 43210',
      email: 'john@example.com',
      dates: 'Aug 15-17, 2025',
      amount: 2400,
      status: 'active',
      rating: 5
    },
    {
      id: 2,
      customer: 'Sarah Smith',
      phone: '+91 87654 32109',
      email: 'sarah@example.com',
      dates: 'Aug 10-12, 2025',
      amount: 1800,
      status: 'completed',
      rating: 4
    }
  ]

  const mockMaintenanceHistory = [
    {
      id: 1,
      date: '2025-08-01',
      type: 'Routine Service',
      description: 'Oil change, brake check, tire rotation',
      cost: 2500,
      garage: 'City Auto Service',
      nextService: '2025-11-01'
    },
    {
      id: 2,
      date: '2025-06-15',
      type: 'Repair',
      description: 'Brake pad replacement',
      cost: 3200,
      garage: 'Quick Fix Motors',
      nextService: '-'
    }
  ]

  const handleMaintenanceFormChange = (e) => {
    const { name, value } = e.target
    setMaintenanceForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleScheduleMaintenance = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Prepare maintenance data for backend
      const maintenanceData = {
        vehicle_id: vehicle.id,
        maintenance_type: maintenanceForm.type,
        description: maintenanceForm.description,
        scheduled_date: maintenanceForm.scheduledDate,
        garage: maintenanceForm.garage,
        estimated_cost: parseFloat(maintenanceForm.estimatedCost) || 0,
        priority: maintenanceForm.priority,
        status: 'scheduled'
      }

      // Send maintenance schedule to backend
      const response = await fetch(`http://127.0.0.1:8000/maintenance/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(maintenanceData)
      })

      if (!response.ok) {
        console.error(`Maintenance API Error: ${response.status} ${response.statusText}`)
        const errorText = await response.text()
        console.error('Maintenance error response body:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const newMaintenanceRecord = await response.json()
      console.log('✅ Maintenance scheduled successfully:', newMaintenanceRecord)
      
      // Reset form
      setMaintenanceForm({
        type: '',
        description: '',
        scheduledDate: '',
        garage: '',
        estimatedCost: '',
        priority: 'medium'
      })
      
      setShowMaintenanceModal(false)
      alert('Maintenance scheduled successfully!')
      
    } catch (error) {
      alert('Error scheduling maintenance. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      if (name === 'features') {
        const updatedFeatures = checked 
          ? [...(editData.features || []), value]
          : (editData.features || []).filter(feature => feature !== value)
        setEditData({
          ...editData,
          features: updatedFeatures
        })
      }
    } else {
      let updatedData = { ...editData, [name]: value }
      
      // Auto-calculate rates when daily rate changes
      if (name === 'dailyRate' && value) {
        const daily = parseFloat(value)
        if (!isNaN(daily) && daily > 0) {
          updatedData.weeklyRate = Math.round(daily * 7 * 0.85)
          updatedData.monthlyRate = Math.round(daily * 30 * 0.70)
          updatedData.securityDeposit = Math.round(daily * 2)
        }
      }
      
      setEditData(updatedData)
    }
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      // Check if we have an access token
      const accessToken = localStorage.getItem('access_token')
      if (!accessToken) {
        alert('You are not authenticated. Please log in again.')
        return
      }

      // Validate required fields before sending
      if (!editData.brand || !editData.model || !editData.year || !editData.dailyRate || 
          !editData.fuelType || !editData.transmission || !editData.seatingCapacity || !editData.condition) {
        alert('Please fill in all required fields (Brand, Model, Year, Daily Rate, Fuel Type, Transmission, Seating Capacity, Condition)')
        return
      }

      // Prepare update data in the format expected by the backend
      const updateData = {
        make: String(editData.brand).trim(),
        model: String(editData.model).trim(),
        year: parseInt(editData.year) || new Date().getFullYear(),
        location: String(editData.location || '').trim(),
        price_per_day: parseFloat(editData.dailyRate) || 0,
        availability: editData.availability !== false,
        fuel_type: String(editData.fuelType).trim(),
        transmission: String(editData.transmission).trim(),
        seating_capacity: parseInt(editData.seatingCapacity) || 1,
        vehicle_condition: String(editData.condition).trim(),
        features: Array.isArray(editData.features) ? editData.features : [],
        vehicle_description: String(editData.description || '').trim()
      }

      console.log('🔧 Updating vehicle with data:', updateData)
      console.log('🔧 Vehicle ID:', vehicle.id)
      console.log('🔧 Edit data:', editData)
      console.log('🔧 Access token available:', !!accessToken)

      // Update vehicle in backend
      const response = await fetch(`http://127.0.0.1:8000/listings/${vehicle.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(updateData)
      })

      console.log('🔧 Update response status:', response.status)
      console.log('🔧 Update response headers:', Object.fromEntries(response.headers))

      if (!response.ok) {
        console.error(`UPDATE API Error: ${response.status} ${response.statusText}`)
        const errorText = await response.text()
        console.error('Update error response body:', errorText)
        
        // Try to parse error response as JSON for more details
        let errorDetails = errorText
        try {
          const errorJson = JSON.parse(errorText)
          errorDetails = JSON.stringify(errorJson, null, 2)
        } catch (e) {
          // Not JSON, use as is
        }
        
        if (response.status === 401) {
          alert('Authentication failed. Please log in again.')
        } else if (response.status === 403) {
          alert('You do not have permission to update this vehicle.')
        } else if (response.status === 404) {
          alert('Vehicle not found. It may have been deleted.')
        } else {
          alert(`Error updating vehicle (${response.status}): ${errorDetails}`)
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedVehicle = await response.json()
      console.log('✅ Vehicle updated successfully:', updatedVehicle)
      
      // Transform the response back to frontend format
      const transformedVehicle = {
        ...editData,
        id: updatedVehicle.id,
        partner_id: updatedVehicle.partner,
        brand: updatedVehicle.make,
        model: updatedVehicle.model,
        year: updatedVehicle.year,
        location: updatedVehicle.location,
        dailyRate: parseFloat(updatedVehicle.price_per_day || 0),
        availability: updatedVehicle.availability,
        fuelType: updatedVehicle.fuel_type,
        transmission: updatedVehicle.transmission,
        seatingCapacity: updatedVehicle.seating_capacity,
        condition: updatedVehicle.vehicle_condition,
        features: updatedVehicle.features || [],
        description: updatedVehicle.vehicle_description || ''
      }

      // Call parent component's onUpdate to refresh UI
      onUpdate(transformedVehicle)
      setIsEditing(false)
      alert('Vehicle updated successfully!')
      
    } catch (error) {
      console.error('Error updating vehicle:', error)
      alert('Error updating vehicle. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsSubmitting(true)
    try {
      // Delete individual vehicle from backend
      const response = await fetch(`http://127.0.0.1:8000/listings/${vehicle.id}/`, {
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
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log('✅ Vehicle deleted successfully:', vehicle.id)
      
      // Call parent component's onDelete to update UI
      onDelete(vehicle.id)
      setShowDeleteConfirm(false)
      setShowModal(false)
      alert('Vehicle deleted successfully!')
      
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      alert('Error deleting vehicle. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit
      return isValidType && isValidSize
    })
    
    if (validFiles.length > 0) {
      const newPhotos = [...(editData.photos || []), ...validFiles]
      setEditData({
        ...editData,
        photos: newPhotos
      })
    }
  }

  const removePhoto = (index) => {
    const newPhotos = editData.photos?.filter((_, i) => i !== index) || []
    setEditData({
      ...editData,
      photos: newPhotos
    })
  }

  if (!showModal || !vehicle) return null

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {vehicle.brand} {vehicle.model}
              </h2>
              <p className="text-gray-600">Manage your vehicle listing and bookings</p>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="mt-4">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'bookings'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'maintenance'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Maintenance
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'settings'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Vehicle Status Card */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${
                      vehicle.status === 'available' ? 'bg-green-500' :
                      vehicle.status === 'rented' ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`}></div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Status: <span className="capitalize">{vehicle.status}</span>
                      </h3>
                      <p className="text-gray-600">
                        {vehicle.status === 'available' && 'Ready for bookings'}
                        {vehicle.status === 'rented' && 'Currently rented out'}
                        {vehicle.status === 'maintenance' && 'Under maintenance'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">DH{vehicle.dailyRate}/day</div>
                    <div className="text-sm text-gray-500">{vehicle.bookings} total bookings</div>
                  </div>
                </div>
              </div>

              {/* Vehicle Info Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Basic Information</h4>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-orange-600 hover:text-orange-800 font-medium"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                          <input
                            type="text"
                            name="brand"
                            value={editData.brand || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                          <input
                            type="text"
                            name="model"
                            value={editData.model || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                          <select
                            name="year"
                            value={editData.year || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          >
                            <option value="">Select Year</option>
                            {Array.from({ length: 15 }, (_, i) => 2024 - i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                          <input
                            type="text"
                            name="location"
                            value={editData.location || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Brand:</span>
                        <span className="font-medium">{vehicle.brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Model:</span>
                        <span className="font-medium">{vehicle.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Year:</span>
                        <span className="font-medium">{vehicle.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{vehicle.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-medium">{vehicle.rating}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pricing Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h4>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate (DH)</label>
                        <input
                          type="number"
                          name="dailyRate"
                          value={editData.dailyRate || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Rate (DH)</label>
                        <input
                          type="number"
                          name="weeklyRate"
                          value={editData.weeklyRate || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                          readOnly
                        />
                        <p className="text-xs text-gray-700 mt-1">Auto-calculated with 15% discount</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rate (DH)</label>
                        <input
                          type="number"
                          name="monthlyRate"
                          value={editData.monthlyRate || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50"
                          readOnly
                        />
                        <p className="text-xs text-gray-700 mt-1">Auto-calculated with 30% discount</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Daily Rate:</span>
                        <span className="font-medium text-orange-600">DH{vehicle.dailyRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weekly Rate:</span>
                        <span className="font-medium">DH{Math.round(vehicle.dailyRate * 7 * 0.85)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Rate:</span>
                        <span className="font-medium">DH{Math.round(vehicle.dailyRate * 30 * 0.70)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Security Deposit:</span>
                        <span className="font-medium">DH{Math.round(vehicle.dailyRate * 2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">85%</div>
                    <div className="text-sm text-gray-600">Booking Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">DH{(vehicle.dailyRate * 18).toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Monthly Avg</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{vehicle.rating}</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{vehicle.bookings}</div>
                    <div className="text-sm text-gray-600">Total Bookings</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center">
                    <svg className="w-6 h-6 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <div className="text-sm font-medium text-blue-600">Add Booking</div>
                  </button>
                  <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors text-center">
                    <svg className="w-6 h-6 text-yellow-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="text-sm font-medium text-yellow-600">Maintenance</div>
                  </button>
                  <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center">
                    <svg className="w-6 h-6 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm font-medium text-green-600">Mark Available</div>
                  </button>
                  <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center">
                    <svg className="w-6 h-6 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="text-sm font-medium text-purple-600">Update Photos</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Booking History</h3>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm">All</button>
                  <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Active</button>
                  <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Completed</button>
                  <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Cancelled</button>
                </div>
              </div>

              <div className="space-y-4">
                {mockBookings.map((booking) => (
                  <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {booking.customer.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{booking.customer}</h4>
                          <p className="text-sm text-gray-600">{booking.phone}</p>
                          <p className="text-sm text-gray-600">{booking.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Rental Period</p>
                        <p className="text-sm text-gray-600">{booking.dates}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Amount</p>
                        <p className="text-sm text-gray-900 font-semibold">DH{booking.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Customer Rating</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-4 h-4 ${i < booking.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">{booking.rating}.0</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                      <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">
                        View Details
                      </button>
                      <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-sm">
                        Contact Customer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Maintenance History</h3>
                <button 
                  onClick={() => setShowMaintenanceModal(true)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Schedule Maintenance
                </button>
              </div>

              <div className="space-y-4">
                {mockMaintenanceHistory.map((record) => (
                  <div key={record.id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{record.type}</h4>
                        <p className="text-sm text-gray-600">{record.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">DH{record.cost.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{record.garage}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                      <p className="text-sm text-gray-600">{record.description}</p>
                    </div>

                    {record.nextService !== '-' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm text-yellow-800">
                            Next service due: <span className="font-medium">{record.nextService}</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Vehicle Analytics</h3>

              {/* Revenue Chart Placeholder */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (Last 6 Months)</h4>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-gray-500">Chart data will be displayed here</p>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600">78%</div>
                  <div className="text-sm text-gray-600">Utilization Rate</div>
                  <div className="text-xs text-green-600 mt-1">+5% from last month</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                  <div className="text-2xl font-bold text-green-600">DH{(vehicle.dailyRate * 23).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Avg Monthly Revenue</div>
                  <div className="text-xs text-green-600 mt-1">+12% from last month</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                  <div className="text-2xl font-bold text-purple-600">4.8</div>
                  <div className="text-sm text-gray-600">Customer Rating</div>
                  <div className="text-xs text-green-600 mt-1">+0.2 from last month</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                  <div className="text-2xl font-bold text-orange-600">18</div>
                  <div className="text-sm text-gray-600">Avg Rental Days/Month</div>
                  <div className="text-xs text-green-600 mt-1">+3 from last month</div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Vehicle Settings</h3>

              {/* Availability Settings */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Availability</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Auto-accept bookings</p>
                      <p className="text-sm text-gray-600">Automatically approve new booking requests</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Instant booking</p>
                      <p className="text-sm text-gray-600">Allow customers to book without approval</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Photo Management */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Photo Management</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {(vehicle.photos || []).map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)}
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 transition-colors text-gray-600 hover:text-orange-600"
                  >
                    Add More Photos
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-900">Deactivate Listing</p>
                      <p className="text-sm text-red-700">Temporarily remove this vehicle from bookings</p>
                    </div>
                    <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                      Deactivate
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-900">Delete Vehicle</p>
                      <p className="text-sm text-red-700">Permanently remove this vehicle and all its data</p>
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Schedule Maintenance Modal */}
        {showMaintenanceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Schedule Maintenance</h3>
                    <p className="text-gray-600">Plan upcoming maintenance for your vehicle</p>
                  </div>
                  <button
                    onClick={() => setShowMaintenanceModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <form onSubmit={handleScheduleMaintenance} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maintenance Type *
                    </label>
                    <select
                      name="type"
                      value={maintenanceForm.type}
                      onChange={handleMaintenanceFormChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      <option value="">Select maintenance type</option>
                      <option value="Routine Service">Routine Service</option>
                      <option value="Oil Change">Oil Change</option>
                      <option value="Brake Service">Brake Service</option>
                      <option value="Tire Service">Tire Service</option>
                      <option value="Engine Repair">Engine Repair</option>
                      <option value="Transmission Service">Transmission Service</option>
                      <option value="Air Conditioning">Air Conditioning</option>
                      <option value="Battery Service">Battery Service</option>
                      <option value="Inspection">Inspection</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Date *
                    </label>
                    <input
                      type="date"
                      name="scheduledDate"
                      value={maintenanceForm.scheduledDate}
                      onChange={handleMaintenanceFormChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={maintenanceForm.description}
                    onChange={handleMaintenanceFormChange}
                    placeholder="Describe the maintenance work needed..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Center/Garage
                    </label>
                    <input
                      type="text"
                      name="garage"
                      value={maintenanceForm.garage}
                      onChange={handleMaintenanceFormChange}
                      placeholder="e.g., City Auto Service"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Cost (DH)
                    </label>
                    <input
                      type="number"
                      name="estimatedCost"
                      value={maintenanceForm.estimatedCost}
                      onChange={handleMaintenanceFormChange}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value="low"
                        checked={maintenanceForm.priority === 'low'}
                        onChange={handleMaintenanceFormChange}
                        className="mr-2 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">Low</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value="medium"
                        checked={maintenanceForm.priority === 'medium'}
                        onChange={handleMaintenanceFormChange}
                        className="mr-2 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">Medium</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value="high"
                        checked={maintenanceForm.priority === 'high'}
                        onChange={handleMaintenanceFormChange}
                        className="mr-2 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">High</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value="urgent"
                        checked={maintenanceForm.priority === 'urgent'}
                        onChange={handleMaintenanceFormChange}
                        className="mr-2 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">Urgent</span>
                    </label>
                  </div>
                </div>

                {/* Maintenance Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Maintenance Tips</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Schedule routine maintenance every 6 months</li>
                        <li>• Keep detailed records for warranty purposes</li>
                        <li>• Use authorized service centers when possible</li>
                        <li>• Plan maintenance during low booking periods</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowMaintenanceModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Scheduling...' : 'Schedule Maintenance'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Vehicle</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this vehicle? This action cannot be undone and will remove all associated bookings and data.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
