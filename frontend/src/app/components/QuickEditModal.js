'use client'

import { useState } from 'react'

export default function QuickEditModal({ showModal, setShowModal, vehicle, onUpdate }) {
  const [editData, setEditData] = useState(vehicle || {})
  const [isSubmitting, setIsSubmitting] = useState(false)
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      onUpdate(editData)
      setShowModal(false)
      alert('Vehicle updated successfully!')
    } catch (error) {
      alert('Error updating vehicle. Please try again.')
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
              onClick={() => setShowModal(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  // Open full manage modal
                  setShowModal(false)
                  // This would trigger opening the full VehicleManageModal
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Advanced Edit
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
      </div>
    </div>
  )
}