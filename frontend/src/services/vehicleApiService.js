/**
 * Enhanced Vehicle API Service
 * Centralized service for all vehicle-related backend operations
 */

class VehicleApiService {
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
    this.timeout = 30000 // 30 seconds timeout
    this.retryAttempts = 3
    this.retryDelay = 1000 // 1 second
  }

  /**
   * Get authentication headers
   */
  getAuthHeaders() {
    const token = localStorage.getItem('access_token')
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  /**
   * Enhanced fetch with retry logic and better error handling
   */
  async fetchWithRetry(url, options = {}, attempt = 1) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      console.log(`🌐 API Request (attempt ${attempt}/${this.retryAttempts}):`, {
        method: options.method || 'GET',
        url,
        headers: options.headers,
        bodySize: options.body ? options.body.length : 0
      })

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        }
      })

      clearTimeout(timeoutId)

      // Log response details
      console.log(`📡 API Response:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })

      // Handle different HTTP status codes
      if (!response.ok) {
        const errorText = await response.text()
        let errorData = errorText

        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          // Not JSON, keep as text
        }

        const error = new Error(`HTTP ${response.status}: ${response.statusText}`)
        error.status = response.status
        error.data = errorData
        
        // Handle specific error cases
        switch (response.status) {
          case 401:
            error.message = 'Authentication failed. Please log in again.'
            // Clear invalid token
            localStorage.removeItem('access_token')
            break
          case 403:
            error.message = 'You do not have permission to perform this action.'
            break
          case 404:
            error.message = 'The requested resource was not found.'
            break
          case 422:
            error.message = 'Validation error. Please check your data.'
            break
          case 500:
            error.message = 'Server error. Please try again later.'
            break
          default:
            error.message = `Request failed with status ${response.status}`
        }

        throw error
      }

      const data = await response.json()
      console.log('✅ API Success:', data)
      return data

    } catch (error) {
      clearTimeout(timeoutId)

      // Handle timeout
      if (error.name === 'AbortError') {
        error.message = 'Request timed out. Please check your connection.'
      }

      // Retry logic for network errors
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        console.log(`🔄 Retrying API call in ${this.retryDelay}ms...`)
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt))
        return this.fetchWithRetry(url, options, attempt + 1)
      }

      console.error('❌ API Error:', error)
      throw error
    }
  }

  /**
   * Determine if request should be retried
   */
  shouldRetry(error) {
    return (
      error.name === 'AbortError' || // Timeout
      error.name === 'TypeError' || // Network error
      (error.status >= 500 && error.status < 600) // Server errors
    )
  }

  /**
   * Get vehicle details
   */
  async getVehicle(vehicleId) {
    const url = `${this.baseUrl}/listings/${vehicleId}/`
    const data = await this.fetchWithRetry(url)
    
    return this.transformVehicleData(data)
  }

  /**
   * Update vehicle
   */
  async updateVehicle(vehicleId, updateData) {
    const url = `${this.baseUrl}/listings/${vehicleId}/`
    const data = await this.fetchWithRetry(url, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    })
    
    return this.transformVehicleData(data)
  }

  /**
   * Delete vehicle
   */
  async deleteVehicle(vehicleId) {
    const url = `${this.baseUrl}/listings/${vehicleId}/`
    await this.fetchWithRetry(url, {
      method: 'DELETE'
    })
  }

  /**
   * Upload vehicle photos
   */
  async uploadVehiclePhotos(vehicleId, photos) {
    const formData = new FormData()
    photos.forEach((photo, index) => {
      formData.append(`photo_${index}`, photo)
    })

    const url = `${this.baseUrl}/listings/${vehicleId}/photos/`
    return await this.fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: formData
    })
  }

  /**
   * Get vehicle bookings
   */
  async getVehicleBookings(vehicleId) {
    const url = `${this.baseUrl}/listings/${vehicleId}/bookings/`
    return await this.fetchWithRetry(url)
  }

  /**
   * Get vehicle maintenance history
   */
  async getVehicleMaintenance(vehicleId) {
    const url = `${this.baseUrl}/listings/${vehicleId}/maintenance/`
    return await this.fetchWithRetry(url)
  }

  /**
   * Schedule vehicle maintenance
   */
  async scheduleMaintenance(vehicleId, maintenanceData) {
    const url = `${this.baseUrl}/listings/${vehicleId}/maintenance/`
    return await this.fetchWithRetry(url, {
      method: 'POST',
      body: JSON.stringify(maintenanceData)
    })
  }

  /**
   * Get vehicle analytics
   */
  async getVehicleAnalytics(vehicleId) {
    const url = `${this.baseUrl}/listings/${vehicleId}/analytics/`
    return await this.fetchWithRetry(url)
  }

  /**
   * Get vehicle revenue data
   */
  async getVehicleRevenue(vehicleId) {
    const url = `${this.baseUrl}/listings/${vehicleId}/revenue/`
    return await this.fetchWithRetry(url)
  }

  /**
   * Deactivate/Activate vehicle (hide/show from search)
   */
  async toggleVehicleAvailability(vehicleId, isAvailable) {
    const url = `${this.baseUrl}/listings/${vehicleId}/`
    return await this.fetchWithRetry(url, {
      method: 'PATCH',
      body: JSON.stringify({ availability: isAvailable })
    })
  }

  /**
   * Test backend connection
   */
  async testConnection() {
    try {
      const url = `${this.baseUrl}/listings/`
      const response = await this.fetchWithRetry(url)
      return {
        success: true,
        message: 'Backend connection successful',
        data: response
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error
      }
    }
  }

  /**
   * Transform backend data to frontend format
   */
  transformVehicleData(data) {
    return {
      id: data.id,
      brand: data.make || '',
      model: data.model || '',
      year: data.year || new Date().getFullYear(),
      dailyRate: data.price_per_day || 0,
      weeklyRate: data.weekly_rate || Math.round((data.price_per_day || 0) * 7 * 0.85),
      monthlyRate: data.monthly_rate || Math.round((data.price_per_day || 0) * 30 * 0.70),
      status: data.availability ? 'available' : 'unavailable',
      availability: data.availability,
      features: data.features || [],
      description: data.vehicle_description || '',
      photos: data.pictures || [],
      location: data.location || '',
      transmission: data.transmission || 'manual',
      fuelType: data.fuel_type || 'petrol',
      seatingCapacity: data.seating_capacity || 5,
      doors: data.doors || data.door_count || 4,
      condition: data.vehicle_condition || '',
      mileage: data.mileage || data.odometer_reading || 0,
      rating: data.rating || 0,
      partnerId: data.partner,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  }

  /**
   * Transform frontend data to backend format
   */
  transformToBackendFormat(vehicleData) {
    return {
      make: String(vehicleData.brand || '').trim(),
      model: String(vehicleData.model || '').trim(),
      year: parseInt(vehicleData.year) || new Date().getFullYear(),
      location: String(vehicleData.location || '').trim(),
      price_per_day: parseFloat(vehicleData.dailyRate) || 0,
      weekly_rate: parseFloat(vehicleData.weeklyRate) || 0,
      monthly_rate: parseFloat(vehicleData.monthlyRate) || 0,
      availability: vehicleData.availability !== false,
      fuel_type: String(vehicleData.fuelType || '').trim(),
      transmission: String(vehicleData.transmission || '').trim(),
      seating_capacity: parseInt(vehicleData.seatingCapacity) || 1,
      doors: parseInt(vehicleData.doors) || 4,
      mileage: parseInt(vehicleData.mileage) || 0,
      vehicle_condition: String(vehicleData.condition || '').trim(),
      features: Array.isArray(vehicleData.features) ? vehicleData.features : [],
      vehicle_description: String(vehicleData.description || '').trim()
    }
  }

  /**
   * Get image URL helper
   */
  getImageUrl(imagePath) {
    if (!imagePath) return null
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }
    
    // If it starts with /media/, prepend base URL
    if (imagePath.startsWith('/media/') || imagePath.startsWith('media/')) {
      const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath
      return `${this.baseUrl}/${cleanPath}`
    }
    
    // Default: assume it's a relative path in media
    return `${this.baseUrl}/media/${imagePath}`
  }
}

// Create singleton instance
const vehicleApiService = new VehicleApiService()

export default vehicleApiService
