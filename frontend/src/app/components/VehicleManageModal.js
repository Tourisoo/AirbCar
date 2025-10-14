'use client'

import { useState, useRef, useEffect } from 'react'
import vehicleApiService from '../../services/vehicleApiService'

// Helper function to get full image URL
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null
  
  // If already a complete URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  
  // If it's a relative URL, prepend the API base URL
  const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
  return `${apiUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
}

export default function VehicleManageModal({ 
  showModal, 
  setShowModal, 
  vehicle,
  onUpdate,
  onDelete 
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [vehicleData, setVehicleData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [bookings, setBookings] = useState([])
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [bookingsFilter, setBookingsFilter] = useState('all')
  const [maintenanceHistory, setMaintenanceHistory] = useState([])
  const [editData, setEditData] = useState({
    ...vehicle,
    features: vehicle?.features || [],
    description: vehicle?.description || '',
    photos: vehicle?.photos || []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [photoUploadProgress, setPhotoUploadProgress] = useState(0)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [maintenanceForm, setMaintenanceForm] = useState({
    type: '',
    description: '',
    scheduledDate: '',
    garage: '',
    estimatedCost: '',
    priority: 'medium'
  })
  const fileInputRef = useRef(null)

  // Fetch vehicle data from backend
  const fetchVehicleData = async (vehicleId) => {
    if (!vehicleId) return

    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new Error('No access token found')
      }

      const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/listings/${vehicleId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      console.log('🔍 Raw backend data:', data)
      console.log('🔍 Pictures from backend:', data.pictures)
      
      // Transform backend data to match frontend format
      const transformedData = {
        id: data.id,
        brand: data.make || '',
        model: data.model || '',
        year: data.year || new Date().getFullYear(),
        dailyRate: data.price_per_day || 0,
        weeklyRate: data.weekly_rate || Math.round((data.price_per_day || 0) * 7 * 0.85),
        monthlyRate: data.monthly_rate || Math.round((data.price_per_day || 0) * 30 * 0.70),
        status: data.availability ? 'available' : 'unavailable',
        features: data.features || [],
        description: data.vehicle_description || '',
        photos: data.pictures || [],
        location: data.location || '',
        transmission: data.transmission || 'manual',
        fuelType: data.fuel_type || 'petrol',
        seatingCapacity: data.seating_capacity || 5,
        doors: data.doors || data.door_count || 4,
        mileage: data.mileage || data.odometer_reading || 0,
        condition: data.vehicle_condition || '',
        rating: data.rating || 0,
        partnerId: data.partner
      }
      
      console.log('🔍 Transformed data:', transformedData)
      console.log('🔍 Photos in transformed data:', transformedData.photos)

      setVehicleData(transformedData)
      setEditData({
        ...transformedData,
        features: transformedData.features || [],
        description: transformedData.description || '',
        photos: transformedData.photos || []
      })

      // Fetch related data (bookings, maintenance)
      await fetchBookingsData(vehicleId)
      await fetchMaintenanceData(vehicleId)

    } catch (error) {
      console.error('Error fetching vehicle data:', error)
      alert('Failed to load vehicle data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch bookings data
  const fetchBookingsData = async (vehicleId) => {
    setBookingsLoading(true)
    try {
      console.log('📋 Fetching bookings for vehicle:', vehicleId)
      const token = localStorage.getItem('access_token')
      const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
      
      if (!token) {
        console.warn('No authentication token available')
        setBookings(mockBookings)
        return
      }
      
      const response = await fetch(`${apiUrl}/bookings/?listing=${vehicleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('📋 Bookings API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📋 Raw bookings data:', data)
        
        // Transform booking data to frontend format
        const transformedBookings = (data.results || data || []).map(booking => {
          const startDate = new Date(booking.start_time)
          const endDate = new Date(booking.end_time)
          const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
          
          return {
            id: booking.id,
            customer: booking.user?.first_name && booking.user?.last_name 
              ? `${booking.user.first_name} ${booking.user.last_name}`
              : booking.user?.username || 'Unknown Customer',
            phone: booking.user?.phone_number || booking.user?.phone || 'N/A',
            email: booking.user?.email || 'N/A',
            dates: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
            startDate: booking.start_time,
            endDate: booking.end_time,
            duration: duration,
            amount: booking.total_price || booking.price || 0,
            status: booking.status || 'pending',
            rating: booking.rating || Math.floor(Math.random() * 2) + 4, // Random 4-5 rating as fallback
            bookingDate: booking.created_at,
            paymentStatus: booking.payment_status || 'pending',
            pickupLocation: booking.pickup_location || 'Default Location',
            dropoffLocation: booking.dropoff_location || booking.pickup_location || 'Default Location',
            specialRequests: booking.special_requests || '',
            customerNotes: booking.notes || ''
          }
        })
        
        console.log('📋 Transformed bookings:', transformedBookings)
        setBookings(transformedBookings)
      } else if (response.status === 404) {
        console.log('📋 No bookings found for this vehicle')
        setBookings([])
      } else {
        console.error('📋 Failed to fetch bookings:', response.status, response.statusText)
        // Use mock data as fallback for development/demo
        console.log('📋 Using mock bookings as fallback')
        setBookings(mockBookings)
      }
    } catch (error) {
      console.error('📋 Error fetching bookings:', error)
      // Use mock data as fallback
      console.log('📋 Using mock bookings due to error')
      setBookings(mockBookings)
    } finally {
      setBookingsLoading(false)
    }
  }

  // Fetch maintenance data
  const fetchMaintenanceData = async (vehicleId) => {
    try {
      const token = localStorage.getItem('access_token')
      const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/maintenance/?listing=${vehicleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Transform maintenance data to frontend format
        const transformedMaintenance = (data.results || data || []).map(maintenance => ({
          id: maintenance.id,
          type: maintenance.maintenance_type,
          date: new Date(maintenance.scheduled_date).toLocaleDateString(),
          cost: maintenance.actual_cost || maintenance.estimated_cost || 0,
          garage: maintenance.garage || 'Not specified',
          description: maintenance.description,
          nextService: maintenance.status === 'completed' && maintenance.completed_date
            ? 'Based on maintenance schedule'
            : maintenance.status === 'scheduled'
            ? new Date(maintenance.scheduled_date).toLocaleDateString()
            : '-'
        }))
        setMaintenanceHistory(transformedMaintenance)
      }
    } catch (error) {
      console.error('Error fetching maintenance data:', error)
      // Use mock data as fallback
      setMaintenanceHistory(mockMaintenanceHistory)
    }
  }

  // UseEffect to fetch data when modal opens or vehicle changes
  useEffect(() => {
    if (showModal && vehicle?.id) {
      fetchVehicleData(vehicle.id)
    }
  }, [showModal, vehicle?.id])

  // UseEffect to reinitialize editData when vehicle prop changes
  useEffect(() => {
    if (vehicle) {
      setEditData({
        ...vehicle,
        features: vehicle?.features || [],
        description: vehicle?.description || '',
        photos: vehicle?.photos || []
      })
    }
  }, [vehicle])

  // Filter bookings based on status
  const filterBookings = (bookings, filter) => {
    if (filter === 'all') return bookings
    return bookings.filter(booking => {
      switch (filter) {
        case 'active':
          return booking.status === 'active' || booking.status === 'confirmed'
        case 'completed':
          return booking.status === 'completed'
        case 'cancelled':
          return booking.status === 'cancelled'
        default:
          return true
      }
    })
  }

  const filteredBookings = filterBookings(bookings, bookingsFilter)

  // Enhanced booking mock data for demonstration
  const mockBookings = [
    {
      id: 1,
      customer: 'Ahmed Ben Ali',
      phone: '+212 6XX-XXXXXX',
      email: 'ahmed.benali@email.com',
      dates: 'Oct 15-17, 2025',
      startDate: '2025-10-15T10:00:00Z',
      endDate: '2025-10-17T18:00:00Z',
      duration: 3,
      amount: 2400,
      status: 'active',
      rating: 5,
      bookingDate: '2025-10-10T14:30:00Z',
      paymentStatus: 'paid',
      pickupLocation: 'Casablanca Airport',
      dropoffLocation: 'Casablanca Airport',
      specialRequests: 'Child seat required',
      customerNotes: 'Business trip, need GPS navigation'
    },
    {
      id: 2,
      customer: 'Fatima El Mansouri',
      phone: '+212 6XX-YYYYYY',
      email: 'fatima.elmansouri@email.com',
      dates: 'Oct 8-12, 2025',
      startDate: '2025-10-08T09:00:00Z',
      endDate: '2025-10-12T17:00:00Z',
      duration: 5,
      amount: 3600,
      status: 'completed',
      rating: 4,
      bookingDate: '2025-10-05T16:20:00Z',
      paymentStatus: 'paid',
      pickupLocation: 'Rabat City Center',
      dropoffLocation: 'Rabat City Center',
      specialRequests: 'Extra insurance coverage',
      customerNotes: 'Family vacation, very satisfied with service'
    },
    {
      id: 3,
      customer: 'Omar Bendriss',
      phone: '+212 6XX-ZZZZZZ',
      email: 'omar.bendriss@email.com',
      dates: 'Oct 1-3, 2025',
      startDate: '2025-10-01T14:00:00Z',
      endDate: '2025-10-03T12:00:00Z',
      duration: 2,
      amount: 1600,
      status: 'completed',
      rating: 5,
      bookingDate: '2025-09-28T11:15:00Z',
      paymentStatus: 'paid',
      pickupLocation: 'Marrakech Hotel',
      dropoffLocation: 'Marrakech Airport',
      specialRequests: 'Airport drop-off',
      customerNotes: 'Perfect for weekend getaway'
    },
    {
      id: 4,
      customer: 'Youssef Alami',
      phone: '+212 6XX-WWWWWW',
      email: 'youssef.alami@email.com',
      dates: 'Sep 25-27, 2025',
      startDate: '2025-09-25T16:00:00Z',
      endDate: '2025-09-27T10:00:00Z',
      duration: 2,
      amount: 1400,
      status: 'cancelled',
      rating: 0,
      bookingDate: '2025-09-20T13:45:00Z',
      paymentStatus: 'refunded',
      pickupLocation: 'Fez Medina',
      dropoffLocation: 'Fez Medina',
      specialRequests: 'Late pickup requested',
      customerNotes: 'Cancelled due to change of plans'
    },
    {
      id: 5,
      customer: 'Laila Benjelloun',
      phone: '+212 6XX-VVVVVV',
      email: 'laila.benjelloun@email.com',
      dates: 'Oct 20-24, 2025',
      startDate: '2025-10-20T11:00:00Z',
      endDate: '2025-10-24T15:00:00Z',
      duration: 4,
      amount: 3200,
      status: 'confirmed',
      rating: 0,
      bookingDate: '2025-10-12T09:30:00Z',
      paymentStatus: 'paid',
      pickupLocation: 'Agadir Beach Resort',
      dropoffLocation: 'Agadir Airport',
      specialRequests: 'Beach equipment storage',
      customerNotes: 'Looking forward to the trip'
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
        listing_id: currentVehicle.id,
        maintenance_type: maintenanceForm.type,
        description: maintenanceForm.description,
        scheduled_date: maintenanceForm.scheduledDate,
        garage: maintenanceForm.garage,
        estimated_cost: parseFloat(maintenanceForm.estimatedCost) || 0,
        priority: maintenanceForm.priority,
        status: 'scheduled'
      }

      // Send maintenance schedule to backend
      const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/maintenance/`, {
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
      
      // Refresh maintenance data
      await fetchMaintenanceData(currentVehicle.id)
      
      setShowMaintenanceModal(false)
      alert('Maintenance scheduled successfully!')
      
    } catch (error) {
      console.error('Error scheduling maintenance:', error)
      alert('Error scheduling maintenance. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    console.log('🔧 Input changed:', { name, value, type })
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
    
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
        }
      }
      
      setEditData(updatedData)
      console.log('🔧 Updated editData:', updatedData)
    }
  }

  const validateForm = () => {
    const errors = {}
    
    // Required field validations
    if (!editData.brand?.trim()) errors.brand = 'Brand is required'
    if (!editData.model?.trim()) errors.model = 'Model is required'
    if (!editData.year) errors.year = 'Year is required'
    if (!editData.dailyRate || editData.dailyRate <= 0) errors.dailyRate = 'Valid daily rate is required'
    if (!editData.fuelType) errors.fuelType = 'Fuel type is required'
    if (!editData.transmission) errors.transmission = 'Transmission is required'
    if (!editData.seatingCapacity) errors.seatingCapacity = 'Seating capacity is required'
    if (!editData.condition) errors.condition = 'Vehicle condition is required'
    
    // Range validations
    if (editData.year && (editData.year < 1990 || editData.year > new Date().getFullYear() + 1)) {
      errors.year = 'Please select a valid year'
    }
    if (editData.dailyRate && editData.dailyRate > 10000) {
      errors.dailyRate = 'Daily rate seems too high'
    }
    if (editData.mileage && editData.mileage > 1000000) {
      errors.mileage = 'Mileage seems unrealistic'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    // Validate form before saving
    if (!validateForm()) {
      alert('Please fix the validation errors before saving.')
      return
    }

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
        weekly_rate: parseFloat(editData.weeklyRate) || 0,
        monthly_rate: parseFloat(editData.monthlyRate) || 0,
        availability: editData.availability !== false,
        fuel_type: String(editData.fuelType).trim(),
        transmission: String(editData.transmission).trim(),
        seating_capacity: parseInt(editData.seatingCapacity) || 1,
        doors: parseInt(editData.doors) || 4,
        mileage: parseInt(editData.mileage) || 0,
        vehicle_condition: String(editData.condition).trim(),
        features: Array.isArray(editData.features) ? editData.features : [],
        vehicle_description: String(editData.description || '').trim()
      }

      console.log('🔧 Updating vehicle with data:', updateData)
      console.log('🔧 Vehicle ID:', currentVehicle.id)
      console.log('🔧 Edit data:', editData)
      console.log('🔧 Access token available:', !!accessToken)

      // Update vehicle in backend
      const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/listings/${currentVehicle.id}/`, {
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
        weeklyRate: parseFloat(updatedVehicle.weekly_rate || 0),
        monthlyRate: parseFloat(updatedVehicle.monthly_rate || 0),
        availability: updatedVehicle.availability,
        fuelType: updatedVehicle.fuel_type,
        transmission: updatedVehicle.transmission,
        seatingCapacity: updatedVehicle.seating_capacity,
        condition: updatedVehicle.vehicle_condition,
        features: updatedVehicle.features || [],
        description: updatedVehicle.vehicle_description || ''
      }

      // Update both vehicleData and editData with the response
      setVehicleData(transformedVehicle)
      setEditData({
        ...transformedVehicle,
        features: transformedVehicle.features || [],
        description: transformedVehicle.description || '',
        photos: transformedVehicle.photos || []
      })

      // Call parent component's onUpdate to refresh UI
      onUpdate(transformedVehicle)
      setIsEditing(false)
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
      
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
      const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/listings/${currentVehicle.id}/`, {
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

      console.log('✅ Vehicle deleted successfully:', currentVehicle.id)

      // Call parent component's onDelete to update UI
      onDelete(currentVehicle.id)
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

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit
      
      if (!isValidType) {
        alert(`"${file.name}" is not a valid image file.`)
        return false
      }
      if (!isValidSize) {
        alert(`"${file.name}" is too large. Maximum size is 5MB.`)
        return false
      }
      return true
    })
    
    if (validFiles.length > 0) {
      const currentPhotos = editData.photos || []
      if (currentPhotos.length + validFiles.length > 10) {
        alert('Maximum 10 photos allowed per vehicle.')
        return
      }
      
      setPhotoUploadProgress(10)
      
      try {
        const token = localStorage.getItem('access_token')
        const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
        const uploadedUrls = []
        
        // Upload each file individually
        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i]
          setPhotoUploadProgress(10 + (i / validFiles.length) * 80)
          
          const formData = new FormData()
          formData.append('pictures', file)
          
          const uploadResponse = await fetch(`${apiUrl}/listings/${currentVehicle.id}/`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData
          })
          
          if (uploadResponse.ok) {
            const result = await uploadResponse.json()
            // Get the latest uploaded pictures from the response
            if (result.pictures && result.pictures.length > 0) {
              const newPhotoUrl = result.pictures[result.pictures.length - 1]
              uploadedUrls.push(newPhotoUrl)
            }
          } else {
            console.error('Failed to upload photo:', file.name)
            alert(`Failed to upload ${file.name}`)
          }
        }
        
        setPhotoUploadProgress(100)
        
        // Update local state with uploaded photos
        if (uploadedUrls.length > 0) {
          const updatedPhotos = [...currentPhotos, ...uploadedUrls]
          setEditData({
            ...editData,
            photos: updatedPhotos
          })
        }
        
        // Reset progress after a short delay
        setTimeout(() => setPhotoUploadProgress(0), 1000)
        
      } catch (error) {
        console.error('Error uploading photos:', error)
        alert('Error uploading photos. Please try again.')
        setPhotoUploadProgress(0)
      }
    }
  }

  const removePhoto = (index) => {
    const newPhotos = editData.photos?.filter((_, i) => i !== index) || []
    setEditData({
      ...editData,
      photos: newPhotos
    })
  }

  const movePhotoUp = (index) => {
    if (index === 0) return
    const newPhotos = [...(editData.photos || [])]
    const temp = newPhotos[index]
    newPhotos[index] = newPhotos[index - 1]
    newPhotos[index - 1] = temp
    setEditData({
      ...editData,
      photos: newPhotos
    })
  }

  const movePhotoDown = (index) => {
    const photos = editData.photos || []
    if (index === photos.length - 1) return
    const newPhotos = [...photos]
    const temp = newPhotos[index]
    newPhotos[index] = newPhotos[index + 1]
    newPhotos[index + 1] = temp
    setEditData({
      ...editData,
      photos: newPhotos
    })
  }

  if (!showModal || !vehicle) return null

  // Use fetched vehicle data if available, otherwise fall back to prop data
  const currentVehicle = vehicleData || vehicle

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Vehicle Data</h3>
          <p className="text-gray-600">Please wait while we fetch the latest information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
      <div className="bg-white rounded-3xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 p-8 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                  {currentVehicle.brand} {currentVehicle.model}
                </h2>
                <p className="text-gray-600 mt-1 font-medium">Manage your vehicle listing and bookings</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-all duration-200 font-medium hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 font-medium shadow-lg hover:shadow-green-200"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : 'Save Changes'}
                  </button>
                </>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-all duration-200"
              >
                ×
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="mt-6">
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-2xl">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-white text-orange-600 shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white hover:bg-opacity-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Overview</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'bookings'
                    ? 'bg-white text-orange-600 shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white hover:bg-opacity-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Bookings</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'analytics'
                    ? 'bg-white text-orange-600 shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white hover:bg-opacity-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Analytics</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'settings'
                    ? 'bg-white text-orange-600 shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white hover:bg-opacity-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4" />
                  </svg>
                  <span>Settings</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="p-8">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-800 font-medium">Vehicle updated successfully!</p>
              </div>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Vehicle Status Card */}
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className={`w-6 h-6 rounded-full shadow-lg ${
                      currentVehicle.status === 'available' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                      currentVehicle.status === 'rented' ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                      'bg-gradient-to-r from-yellow-400 to-yellow-500'
                    } animate-pulse`}></div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Status: <span className="capitalize bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">{currentVehicle.status}</span>
                      </h3>
                      <p className="text-gray-600 mt-2 font-medium">
                        {currentVehicle.status === 'available' && 'Ready for bookings'}
                        {currentVehicle.status === 'rented' && 'Currently rented out'}
                        {currentVehicle.status === 'maintenance' && 'Under maintenance'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Debug Information for Images */}
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-gray-100 rounded-2xl p-6 border border-gray-300">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">🔍 Debug: Image URLs</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Backend Pictures:</span>
                      <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(currentVehicle?.photos, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <span className="font-medium">API Base URL:</span>
                      <code className="text-xs bg-white p-1 rounded ml-2">
                        {process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'}
                      </code>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => fetchVehicleData(currentVehicle?.id)}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        Refresh Data
                      </button>
                      <button
                        onClick={() => {
                          const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
                          console.log('🔍 Testing backend connection...')
                          fetch(`${apiUrl}/listings/`)
                            .then(res => res.json())
                            .then(data => console.log('🔍 Backend listings:', data))
                            .catch(err => console.error('🔍 Backend error:', err))
                        }}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                      >
                        Test Backend
                      </button>
                    </div>
                    {currentVehicle?.photos && currentVehicle.photos.length > 0 && (
                      <div>
                        <span className="font-medium">Processed URLs:</span>
                        <ul className="text-xs space-y-1 mt-1">
                          {currentVehicle.photos.map((photo, index) => (
                            <li key={index} className="break-all bg-white p-1 rounded flex items-center justify-between">
                              <span>{index + 1}: {getImageUrl(photo)}</span>
                              <button
                                onClick={() => {
                                  const img = new Image()
                                  img.onload = () => console.log(`✅ Image ${index + 1} loads successfully`)
                                  img.onerror = () => console.error(`❌ Image ${index + 1} failed to load`)
                                  img.src = getImageUrl(photo)
                                }}
                                className="ml-2 text-blue-600 hover:text-blue-800 text-xs px-2 py-1 bg-blue-100 rounded"
                              >
                                Test
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Vehicle Info Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Basic Information</h4>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-orange-600 hover:text-orange-800 font-semibold bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition-all duration-200"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                          <select
                            name="brand"
                            value={editData.brand || ''}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 ${
                              validationErrors.brand ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select Brand</option>
                            <option value="Toyota">Toyota</option>
                            <option value="Honda">Honda</option>
                            <option value="Ford">Ford</option>
                            <option value="BMW">BMW</option>
                            <option value="Mercedes-Benz">Mercedes-Benz</option>
                            <option value="Audi">Audi</option>
                            <option value="Volkswagen">Volkswagen</option>
                            <option value="Nissan">Nissan</option>
                            <option value="Hyundai">Hyundai</option>
                            <option value="Kia">Kia</option>
                            <option value="Mazda">Mazda</option>
                            <option value="Subaru">Subaru</option>
                            <option value="Chevrolet">Chevrolet</option>
                            <option value="Lexus">Lexus</option>
                            <option value="Tesla">Tesla</option>
                            <option value="Porsche">Porsche</option>
                            <option value="Jaguar">Jaguar</option>
                            <option value="Land Rover">Land Rover</option>
                            <option value="Volvo">Volvo</option>
                            <option value="Other">Other</option>
                          </select>
                          {validationErrors.brand && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.brand}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                          <select
                            name="model"
                            value={editData.model || ''}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 ${
                              validationErrors.model ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select Model</option>
                            {/* Toyota Models */}
                            <option value="Camry">Camry</option>
                            <option value="Corolla">Corolla</option>
                            <option value="RAV4">RAV4</option>
                            <option value="Highlander">Highlander</option>
                            <option value="Prius">Prius</option>
                            <option value="Sienna">Sienna</option>
                            <option value="Tacoma">Tacoma</option>
                            <option value="Tundra">Tundra</option>
                            {/* Honda Models */}
                            <option value="Civic">Civic</option>
                            <option value="Accord">Accord</option>
                            <option value="CR-V">CR-V</option>
                            <option value="Pilot">Pilot</option>
                            <option value="Odyssey">Odyssey</option>
                            <option value="Ridgeline">Ridgeline</option>
                            {/* Ford Models */}
                            <option value="F-150">F-150</option>
                            <option value="Mustang">Mustang</option>
                            <option value="Explorer">Explorer</option>
                            <option value="Escape">Escape</option>
                            <option value="Edge">Edge</option>
                            <option value="Fusion">Fusion</option>
                            {/* BMW Models */}
                            <option value="3 Series">3 Series</option>
                            <option value="5 Series">5 Series</option>
                            <option value="X3">X3</option>
                            <option value="X5">X5</option>
                            <option value="X1">X1</option>
                            <option value="7 Series">7 Series</option>
                            {/* Mercedes-Benz Models */}
                            <option value="C-Class">C-Class</option>
                            <option value="E-Class">E-Class</option>
                            <option value="S-Class">S-Class</option>
                            <option value="GLE">GLE</option>
                            <option value="GLC">GLC</option>
                            <option value="A-Class">A-Class</option>
                            {/* Audi Models */}
                            <option value="A4">A4</option>
                            <option value="A6">A6</option>
                            <option value="Q5">Q5</option>
                            <option value="Q7">Q7</option>
                            <option value="A3">A3</option>
                            <option value="Q3">Q3</option>
                            {/* Tesla Models */}
                            <option value="Model 3">Model 3</option>
                            <option value="Model Y">Model Y</option>
                            <option value="Model S">Model S</option>
                            <option value="Model X">Model X</option>
                            {/* Nissan Models */}
                            <option value="Altima">Altima</option>
                            <option value="Sentra">Sentra</option>
                            <option value="Rogue">Rogue</option>
                            <option value="Murano">Murano</option>
                            <option value="Pathfinder">Pathfinder</option>
                            {/* Hyundai Models */}
                            <option value="Elantra">Elantra</option>
                            <option value="Sonata">Sonata</option>
                            <option value="Tucson">Tucson</option>
                            <option value="Santa Fe">Santa Fe</option>
                            <option value="Palisade">Palisade</option>
                            {/* Chevrolet Models */}
                            <option value="Malibu">Malibu</option>
                            <option value="Equinox">Equinox</option>
                            <option value="Traverse">Traverse</option>
                            <option value="Silverado">Silverado</option>
                            <option value="Tahoe">Tahoe</option>
                            {/* Other Popular Models */}
                            <option value="Wrangler">Wrangler (Jeep)</option>
                            <option value="Grand Cherokee">Grand Cherokee (Jeep)</option>
                            <option value="Outback">Outback (Subaru)</option>
                            <option value="Forester">Forester (Subaru)</option>
                            <option value="CX-5">CX-5 (Mazda)</option>
                            <option value="Sorento">Sorento (Kia)</option>
                            <option value="Sportage">Sportage (Kia)</option>
                            <option value="Other">Other</option>
                          </select>
                          {validationErrors.model && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.model}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                          <select
                            name="year"
                            value={editData.year || ''}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 ${
                              validationErrors.year ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select Year</option>
                            {Array.from({ length: 25 }, (_, i) => 2024 - i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                          {validationErrors.year && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.year}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                          <select
                            name="location"
                            value={editData.location || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                          >
                            <option value="">Select Location</option>
                            {/* Moroccan Cities */}
                            <option value="Agadir">Agadir</option>
                            <option value="Casablanca">Casablanca</option>
                            <option value="Marrakech">Marrakech</option>
                            <option value="Rabat">Rabat</option>
                            <option value="Tetouan">Tetouan</option>
                            <option value="Tangier">Tangier</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Brand:</span>
                        <span className="font-medium text-gray-600">{vehicle.brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Model:</span>
                        <span className="font-medium text-gray-600">{vehicle.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Year:</span>
                        <span className="font-medium text-gray-600">{vehicle.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium text-gray-600">{vehicle.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-medium text-gray-600">{vehicle.rating}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pricing Information */}
                <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Pricing</h4>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate (DH) *</label>
                        <input
                          type="number"
                          name="dailyRate"
                          value={editData.dailyRate || ''}
                          onChange={handleInputChange}
                          min="1"
                          max="10000"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 ${
                            validationErrors.dailyRate ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {validationErrors.dailyRate && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.dailyRate}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Rate (DH)</label>
                        <input
                          type="number"
                          name="weeklyRate"
                          value={editData.weeklyRate || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 text-gray-900"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 text-gray-900"
                          readOnly
                        />
                        <p className="text-xs text-gray-700 mt-1">Auto-calculated with 30% discount</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Daily Rate:</span>
                        <span className="font-medium text-orange-600">DH{(isEditing ? editData.dailyRate : currentVehicle.dailyRate) || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weekly Rate:</span>
                        <span className="font-medium text-gray-600">DH{(isEditing ? editData.weeklyRate : currentVehicle.weeklyRate) || Math.round((currentVehicle.dailyRate || 0) * 7 * 0.85)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Rate:</span>
                        <span className="font-medium text-gray-600">DH{(isEditing ? editData.monthlyRate : currentVehicle.monthlyRate) || Math.round((currentVehicle.dailyRate || 0) * 30 * 0.70)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Features & Safety Section */}
              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Features & Safety</h4>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-orange-600 hover:text-orange-800 font-semibold bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition-all duration-200"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Features</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          'Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Ports', 'Backup Camera',
                          'Sunroof', 'Leather Seats', 'Heated Seats', 'Cruise Control', 'Keyless Entry',
                          'Push Start', 'Parking Sensors', 'Alloy Wheels', 'Power Windows', 'Central Locking',
                          'Anti-lock Brakes (ABS)', 'Airbags', 'Electronic Stability Control', 'Tire Pressure Monitor',
                          'Child Safety Locks', 'Emergency Brake Assist', 'Traction Control', 'Lane Departure Warning'
                        ].map((feature) => (
                          <label key={feature} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              name="features"
                              value={feature}
                              checked={(editData.features || []).includes(feature)}
                              onChange={handleInputChange}
                              className="text-orange-500 focus:ring-orange-500 rounded"
                            />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type *</label>
                        <select
                          name="fuelType"
                          value={editData.fuelType || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                          required
                        >
                          <option value="">Select Fuel Type</option>
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="Electric">Electric</option>
                          <option value="LPG">LPG</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transmission *</label>
                        <select
                          name="transmission"
                          value={editData.transmission || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                          required
                        >
                          <option value="">Select Transmission</option>
                          <option value="Manual">Manual</option>
                          <option value="Automatic">Automatic</option>
                          <option value="CVT">CVT (Continuously Variable)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity *</label>
                        <select
                          name="seatingCapacity"
                          value={editData.seatingCapacity || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                          required
                        >
                          <option value="">Select Capacity</option>
                          {[2, 4, 5, 7, 8, 9].map(capacity => (
                            <option key={capacity} value={capacity}>{capacity} seats</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Condition *</label>
                        <select
                          name="condition"
                          value={editData.condition || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                          required
                        >
                          <option value="">Select Condition</option>
                          <option value="Excellent">Excellent - Like new</option>
                          <option value="Very Good">Very Good - Minor wear</option>
                          <option value="Good">Good - Some wear</option>
                          <option value="Fair">Fair - Noticeable wear</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Doors</label>
                        <select
                          name="doors"
                          value={editData.doors || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                        >
                          <option value="">Select Doors</option>
                          <option value="2">2 doors</option>
                          <option value="3">3 doors</option>
                          <option value="4">4 doors</option>
                          <option value="5">5 doors</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km)</label>
                        <input
                          type="number"
                          name="mileage"
                          value={editData.mileage || ''}
                          onChange={handleInputChange}
                          min="0"
                          max="1000000"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 ${
                            validationErrors.mileage ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter mileage in kilometers"
                        />
                        {validationErrors.mileage && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.mileage}</p>
                        )}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Features</h5>
                      <div className="flex flex-wrap gap-3">
                        {(currentVehicle.features || []).map((feature, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 rounded-xl text-sm font-medium border border-orange-200 hover:from-orange-200 hover:to-orange-300 transition-all duration-200 shadow-sm"
                          >
                            {feature}
                          </span>
                        ))}
                        {(!currentVehicle.features || currentVehicle.features.length === 0) && (
                          <span className="text-gray-500 text-sm italic bg-gray-100 px-4 py-2 rounded-xl">
                            No features added yet here
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fuel Type:</span>
                        <span className="font-medium text-gray-600">{currentVehicle.fuelType || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transmission:</span>
                        <span className="font-medium text-gray-600">{currentVehicle.transmission || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seating Capacity:</span>
                        <span className="font-medium text-gray-600">{currentVehicle.seatingCapacity ? `${currentVehicle.seatingCapacity} seats` : 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Doors:</span>
                        <span className="font-medium text-gray-600">{currentVehicle.doors ? `${currentVehicle.doors} doors` : 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Year:</span>
                        <span className="font-medium text-gray-600">{currentVehicle.year || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Vehicle Description Section */}
              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Vehicle Description</h4>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-orange-600 hover:text-orange-800 font-semibold bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition-all duration-200"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Description
                    </label>
                    <textarea
                      name="description"
                      value={editData.description || ''}
                      onChange={handleInputChange}
                      placeholder="Describe your vehicle in detail. Include information about its condition, unique features, maintenance history, and anything else that would help potential renters..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      A detailed description helps attract more bookings. Mention special features, recent maintenance, and what makes your vehicle stand out.
                    </p>
                  </div>
                ) : (
                  <div>
                    {(isEditing ? editData.description : currentVehicle.description) ? (
                      <p className="text-gray-700 leading-relaxed">
                        {isEditing ? editData.description : currentVehicle.description}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">No description added yet here. Add a detailed description to attract more renters.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Vehicle Photos Section */}
              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Vehicle Photos</h4>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-orange-600 hover:text-orange-800 font-semibold bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition-all duration-200"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(editData.photos || []).map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={getImageUrl(photo)}
                            alt={`Vehicle ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              console.error('❌ Failed to load image:', photo)
                              console.error('❌ Processed URL:', getImageUrl(photo))
                              e.target.style.backgroundColor = '#f3f4f6'
                              e.target.style.display = 'flex'
                              e.target.style.alignItems = 'center'
                              e.target.style.justifyContent = 'center'
                              e.target.innerHTML = `<div style="text-align: center; color: #6b7280; font-size: 12px;">
                                <div>📷</div>
                                <div>Image not found</div>
                                <div style="font-size: 10px; margin-top: 4px;">${photo}</div>
                              </div>`
                            }}
                            onLoad={() => {
                              console.log('✅ Image loaded successfully:', photo)
                              console.log('✅ Processed URL:', getImageUrl(photo))
                            }}
                          />
                          
                          {/* Photo Controls */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex space-x-1">
                              {index > 0 && (
                                <button
                                  onClick={() => movePhotoUp(index)}
                                  className="w-8 h-8 bg-white text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                                  title="Move left"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>
                              )}
                              {index < (editData.photos || []).length - 1 && (
                                <button
                                  onClick={() => movePhotoDown(index)}
                                  className="w-8 h-8 bg-white text-gray-700 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                                  title="Move right"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              )}
                              <button
                                onClick={() => removePhoto(index)}
                                className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                title="Remove photo"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                              Main
                            </div>
                          )}
                          
                          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                      
                      {/* Add Photo Button */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors relative"
                      >
                        {photoUploadProgress > 0 && photoUploadProgress < 100 ? (
                          <div className="text-center">
                            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <span className="text-sm text-gray-600">{photoUploadProgress}%</span>
                          </div>
                        ) : (
                          <>
                            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="text-sm text-gray-600">Add Photo</span>
                            <span className="text-xs text-gray-500 mt-1">Max 10 photos</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h5 className="text-sm font-medium text-blue-900 mb-2">📸 Photo Tips</h5>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Upload high-quality photos (max 5MB each)</li>
                            <li>• Include exterior, interior, and engine bay shots</li>
                            <li>• First photo becomes the main listing image</li>
                            <li>• Well-lit photos attract more bookings</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {(currentVehicle?.photos && currentVehicle.photos.length > 0) ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {currentVehicle.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={getImageUrl(photo)}
                              alt={`Vehicle ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                console.error('❌ Failed to load image:', photo)
                                console.error('❌ Processed URL:', getImageUrl(photo))
                                e.target.style.backgroundColor = '#f3f4f6'
                                e.target.style.display = 'flex'
                                e.target.style.alignItems = 'center'
                                e.target.style.justifyContent = 'center'
                                e.target.innerHTML = `<div style="text-align: center; color: #6b7280; font-size: 12px;">
                                  <div>📷</div>
                                  <div>Image not found</div>
                                  <div style="font-size: 10px; margin-top: 4px;">${photo}</div>
                                </div>`
                              }}
                              onLoad={() => {
                                console.log('✅ Image loaded successfully:', photo)
                                console.log('✅ Processed URL:', getImageUrl(photo))
                              }}
                            />
                            {index === 0 && (
                              <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                                Main
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500">No photos uploaded yet. Add photos to attract more renters.</p>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          Add Photos
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Booking History</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {bookingsLoading ? 'Loading bookings...' : `${filteredBookings.length} bookings found`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setBookingsFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      bookingsFilter === 'all' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    All ({bookings.length})
                  </button>
                  <button 
                    onClick={() => setBookingsFilter('active')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      bookingsFilter === 'active' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Active ({filterBookings(bookings, 'active').length})
                  </button>
                  <button 
                    onClick={() => setBookingsFilter('completed')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      bookingsFilter === 'completed' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Completed ({filterBookings(bookings, 'completed').length})
                  </button>
                  <button 
                    onClick={() => setBookingsFilter('cancelled')}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      bookingsFilter === 'cancelled' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Cancelled ({filterBookings(bookings, 'cancelled').length})
                  </button>
                </div>
              </div>

              {bookingsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <span className="ml-3 text-gray-600">Loading booking history...</span>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 text-lg">No bookings found</p>
                  <p className="text-gray-400 text-sm">
                    {bookingsFilter === 'all' ? 'This vehicle hasn\'t been booked yet.' : `No ${bookingsFilter} bookings found.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                  <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {booking.customer.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{booking.customer}</h4>
                          <p className="text-sm text-gray-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {booking.phone}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {booking.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === 'active' || booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status === 'confirmed' ? 'Confirmed' : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          ID: #{booking.id}
                        </div>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Rental Period
                        </p>
                        <p className="text-sm text-gray-600">{booking.dates}</p>
                        <p className="text-xs text-gray-500">{booking.duration} day{booking.duration !== 1 ? 's' : ''}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          Total Amount
                        </p>
                        <p className="text-sm text-gray-900 font-semibold">DH{booking.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">
                          <span className={`px-1 py-0.5 rounded text-xs ${
                            booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                            booking.paymentStatus === 'refunded' ? 'bg-gray-100 text-gray-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {booking.paymentStatus}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Locations
                        </p>
                        <p className="text-sm text-gray-600">
                          Pickup: {booking.pickupLocation || 'TBD'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Drop: {booking.dropoffLocation || booking.pickupLocation || 'TBD'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Customer Rating
                        </p>
                        {booking.status === 'completed' && booking.rating > 0 ? (
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
                        ) : (
                          <p className="text-sm text-gray-500">
                            {booking.status === 'completed' ? 'Not rated yet' : 'Pending completion'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Additional Information */}
                    {(booking.specialRequests || booking.customerNotes) && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        {booking.specialRequests && (
                          <div className="mb-2">
                            <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Special Requests</p>
                            <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                          </div>
                        )}
                        {booking.customerNotes && (
                          <div>
                            <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Customer Notes</p>
                            <p className="text-sm text-gray-600">{booking.customerNotes}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 justify-end pt-4 border-t border-gray-200">
                      {booking.status === 'active' && (
                        <button className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors text-sm flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Manage Booking
                        </button>
                      )}
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Vehicle Analytics & Progress</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm">Last 30 Days</button>
                  <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Last 6 Months</button>
                  <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">This Year</button>
                </div>
              </div>

              {/* Progress Overview Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-blue-900">Booking Progress</h4>
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Monthly Goal</span>
                      <span className="font-medium text-blue-900">{Math.floor(filteredBookings.length * 1.3)}/20 bookings</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((filteredBookings.length * 1.3 / 20) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-blue-600">
                      {Math.floor((filteredBookings.length * 1.3 / 20) * 100)}% of monthly target reached
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-green-900">Revenue Progress</h4>
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Monthly Goal</span>
                      <span className="font-medium text-green-900">DH{(currentVehicle.dailyRate * 18).toLocaleString()}/DH{(currentVehicle.dailyRate * 25).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((18 / 25) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-green-600">
                      72% of monthly revenue target reached
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-purple-900">Rating Progress</h4>
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-700">Current Rating</span>
                      <span className="font-medium text-purple-900">4.6/5.0 ⭐</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: '92%' }}
                      ></div>
                    </div>
                    <p className="text-xs text-purple-600">
                      Excellent rating - Keep up the great service!
                    </p>
                  </div>
                </div>
              </div>

              {/* Revenue Chart with Progress */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Revenue Progress (Last 6 Months)</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Trend:</span>
                    <span className="text-sm font-medium text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      +12% growth
                    </span>
                  </div>
                </div>
                <div className="h-64 bg-gray-50 rounded-lg p-4">
                  <div className="h-full flex items-end justify-between space-x-2">
                    {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((month, index) => {
                      const heights = [40, 55, 48, 72, 68, 85] // Progress heights
                      const revenues = [2400, 3200, 2800, 4100, 3900, 4800] // Sample revenues
                      return (
                        <div key={month} className="flex-1 flex flex-col items-center">
                          <div className="w-full bg-gray-200 rounded-t-lg mb-2 relative group cursor-pointer">
                            <div 
                              className="bg-gradient-to-t from-orange-400 to-orange-500 rounded-t-lg transition-all duration-500 hover:from-orange-500 hover:to-orange-600"
                              style={{ height: `${heights[index]}%` }}
                            ></div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              DH{revenues[index].toLocaleString()}
                            </div>
                          </div>
                          <span className="text-xs text-gray-600 font-medium">{month}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-900">Best Month</div>
                    <div className="text-lg font-bold text-blue-600">October</div>
                    <div className="text-xs text-blue-500">DH4,800</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-green-900">Avg Monthly</div>
                    <div className="text-lg font-bold text-green-600">DH3,550</div>
                    <div className="text-xs text-green-500">6-month average</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-sm font-medium text-orange-900">Growth Rate</div>
                    <div className="text-lg font-bold text-orange-600">+12%</div>
                    <div className="text-xs text-orange-500">vs last period</div>
                  </div>
                </div>
              </div>

              {/* Detailed Metrics with Progress */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">78%</div>
                  <div className="text-sm text-gray-600 mb-2">Utilization Rate</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <div className="text-xs text-green-600">+5% from last month</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-green-600">DH{(currentVehicle.dailyRate * 23).toLocaleString()}</div>
                  <div className="text-sm text-gray-600 mb-2">Monthly Revenue</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                    <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="text-xs text-green-600">+12% from last month</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">4.6</div>
                  <div className="text-sm text-gray-600 mb-2">Customer Rating</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                    <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <div className="text-xs text-green-600">+0.2 from last month</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">18</div>
                  <div className="text-sm text-gray-600 mb-2">Rental Days/Month</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                    <div className="bg-orange-600 h-1.5 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <div className="text-xs text-green-600">+3 from last month</div>
                </div>
              </div>

              {/* Progress Insights */}
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights & Recommendations</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Excellent Performance</p>
                        <p className="text-sm text-gray-600">Your vehicle is performing above average with 78% utilization rate.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Revenue Growth</p>
                        <p className="text-sm text-gray-600">12% monthly growth shows strong market demand for your vehicle.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Optimization Tip</p>
                        <p className="text-sm text-gray-600">Consider adjusting pricing during peak seasons to maximize revenue.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Customer Satisfaction</p>
                        <p className="text-sm text-gray-600">4.6-star rating indicates excellent customer service quality.</p>
                      </div>
                    </div>
                  </div>
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
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Advanced Photo Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Auto-optimize images</p>
                      <p className="text-sm text-gray-600">Automatically compress and optimize uploaded photos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Watermark photos</p>
                      <p className="text-sm text-gray-600">Add AirbCar watermark to protect your photos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
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
        </div>

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
  );
}
