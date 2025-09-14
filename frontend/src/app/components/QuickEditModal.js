'use client'

import { useState } from 'react'

export default function QuickEditModal({ showModal, setShowModal, vehicle, onUpdate, onDelete }) {
  const [editData, setEditData] = useState(vehicle || {})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [errors, setErrors] = useState({})

  // Moroccan cities
  const moroccanCities = [
    'Casablanca', 'Rabat', 'Fès', 'Marrakech', 'Agadir', 'Tangier', 'Meknès', 'Oujda',
    'Kenitra', 'Tetouan', 'Safi', 'Mohammedia', 'Khouribga', 'El Jadida', 'Béni Mellal',
    'Nador', 'Taza', 'Settat', 'Larache', 'Ksar El Kebir', 'Sale', 'Berrechid', 'Khemisset',
    'Inezgane', 'Ouarzazate', 'Tiznit', 'Taroudant', 'Guelmim', 'Beni Mellal', 'Errachidia',
    'Essaouira', 'Chefchaouen', 'Al Hoceima', 'Ifrane', 'Azrou', 'Midelt', 'Zagora',
    'Tan-Tan', 'Laayoune', 'Dakhla'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
    
    let updatedData = { ...editData, [name]: value }
    
    // Auto-calculate rates when daily rate changes (removed weekly rate calculation)
    if (name === 'dailyRate' && value) {
      const daily = parseFloat(value)
      if (!isNaN(daily) && daily > 0) {
        updatedData.monthlyRate = Math.round(daily * 30 * 0.70)
        updatedData.securityDeposit = Math.round(daily * 2)
      }
    }
    
    setEditData(updatedData)
  }

  const validate = () => {
    const newErrors = {}
    
    if (!editData.brand?.trim()) newErrors.brand = 'Brand is required'
    if (!editData.model?.trim()) newErrors.model = 'Model is required'
    if (!editData.year) newErrors.year = 'Year is required'
    if (!editData.dailyRate || editData.dailyRate <= 0) newErrors.dailyRate = 'Valid daily rate is required'
    if (!editData.location?.trim()) newErrors.location = 'City/Location is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsSubmitting(true)
    try {
      // Check if we have an access token
      const accessToken = localStorage.getItem('access_token')
      if (!accessToken) {
        alert('You are not authenticated. Please log in again.')
        return
      }

      // Prepare update data in the format expected by the backend
      const updateData = {
        make: String(editData.brand).trim(),
        model: String(editData.model).trim(),
        year: parseInt(editData.year),
        location: String(editData.location).trim(),
        price_per_day: parseFloat(editData.dailyRate),
        availability: editData.status === 'available', // true only if status is 'available'
        // Keep existing values for fields not in quick edit
        fuel_type: vehicle.fuelType || vehicle.fuel_type || 'gasoline',
        transmission: vehicle.transmission || 'manual',
        seating_capacity: vehicle.seatingCapacity || vehicle.seating_capacity || 5,
        vehicle_condition: vehicle.condition || vehicle.vehicle_condition || 'good',
        features: vehicle.features || [],
        vehicle_description: String(editData.description || '').trim()
      }

      console.log('🔧 Updating vehicle with data:', updateData)
      console.log('🔧 Vehicle ID:', vehicle.id)

      // Update vehicle in backend using PATCH
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

      if (!response.ok) {
        console.error(`PATCH API Error: ${response.status} ${response.statusText}`)
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
        status: updatedVehicle.availability ? 'available' : (editData.status === 'rented' ? 'rented' : editData.status === 'maintenance' ? 'maintenance' : 'unavailable'),
        description: updatedVehicle.vehicle_description || ''
      }

      // Call parent component's onUpdate to refresh UI
      onUpdate(transformedVehicle)
      setShowModal(false)
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
      // Check if we have an access token
      const accessToken = localStorage.getItem('access_token')
      if (!accessToken) {
        alert('You are not authenticated. Please log in again.')
        return
      }

      console.log('🗑️ Deleting vehicle ID:', vehicle.id)

      // Delete vehicle from backend
      const response = await fetch(`http://127.0.0.1:8000/listings/${vehicle.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      })

      console.log('🗑️ Delete response status:', response.status)

      if (!response.ok) {
        console.error(`DELETE API Error: ${response.status} ${response.statusText}`)
        const errorText = await response.text()
        console.error('Delete error response body:', errorText)
        
        if (response.status === 401) {
          alert('Authentication failed. Please log in again.')
        } else if (response.status === 403) {
          alert('You do not have permission to delete this vehicle.')
        } else if (response.status === 404) {
          alert('Vehicle not found. It may have already been deleted.')
        } else {
          alert(`Error deleting vehicle (${response.status}). Please try again.`)
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log('✅ Vehicle deleted successfully:', vehicle.id)
      
      // Call parent component's onDelete to update UI
      if (onDelete) {
        onDelete(vehicle.id)
      }
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

  if (!showModal || !vehicle) return null

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quick Edit Vehicle</h2>
              <p className="text-gray-600">Update basic information for {vehicle.brand} {vehicle.model}</p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={editData.brand || ''}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.brand ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Toyota, Honda"
                />
                {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  name="model"
                  value={editData.model || ''}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.model ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Camry, Civic"
                />
                {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <select
                  name="year"
                  value={editData.year || ''}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.year ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 15 }, (_, i) => 2024 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={editData.status || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="rented">Rented</option>
                  <option value="maintenance">Under Maintenance</option>
                </select>
              </div>
            </div>

            {/* City/Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City/Location *
              </label>
              <select
                name="location"
                value={editData.location || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.location ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Select City</option>
                {moroccanCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Rate (DH) *
                  </label>
                  <input
                    type="number"
                    name="dailyRate"
                    value={editData.dailyRate || ''}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      errors.dailyRate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 800"
                    min="1"
                  />
                  {errors.dailyRate && <p className="mt-1 text-sm text-red-600">{errors.dailyRate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rate (DH)
                  </label>
                  <input
                    type="number"
                    name="monthlyRate"
                    value={editData.monthlyRate || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    placeholder="Auto-calculated"
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-700">30% discount applied automatically</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Deposit (DH)
                  </label>
                  <input
                    type="number"
                    name="securityDeposit"
                    value={editData.securityDeposit || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    placeholder="Auto-calculated"
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-500">2 days worth of daily rate</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={editData.description || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Brief description of your vehicle..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete Vehicle
            </button>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>

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
                  Are you sure you want to delete "{vehicle.brand} {vehicle.model}"? This action cannot be undone and will remove all associated bookings and data.
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