import { API_BASE_URL, API_ENDPOINTS } from '@/constants'

/**
 * Base API Client with common functionality
 */
class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  getAuthToken() {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('accessToken')
  }

  getHeaders() {
    const headers = { ...this.defaultHeaders }
    const token = this.getAuthToken()
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    
    return headers
  }

  async handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized - redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/auth/login'
        }
      }
      
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  async get(endpoint, params) {
    const url = new URL(`${this.baseURL}${endpoint}`)
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key].toString())
        }
      })
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    })

    return this.handleResponse(response)
  }

  async post(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse(response)
  }

  async put(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse(response)
  }

  async patch(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse(response)
  }

  async delete(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })

    return this.handleResponse(response)
  }

  async upload(endpoint, formData) {
    const headers = { ...this.getHeaders() }
    delete headers['Content-Type'] // Let browser set it for FormData

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    })

    return this.handleResponse(response)
  }
}

export const apiClient = new ApiClient()

/**
 * Authentication Service
 */
export const authService = {
  async login(email, password) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    })
    
    if (response.access && response.refresh) {
      localStorage.setItem('accessToken', response.access)
      localStorage.setItem('refreshToken', response.refresh)
    }
    
    return response
  },

  async register(userData) {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      password: userData.password,
      phone_number: userData.phoneNumber,
    })
  },

  async getCurrentUser() {
    return apiClient.get(API_ENDPOINTS.AUTH.PROFILE)
  },

  async updateProfile(userData) {
    return apiClient.patch(API_ENDPOINTS.AUTH.PROFILE, userData)
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) throw new Error('No refresh token')

    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
      refresh: refreshToken,
    })

    if (response.access) {
      localStorage.setItem('accessToken', response.access)
    }

    return response
  },

  logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/auth/login'
  },
}

/**
 * Listings Service
 */
export const listingsService = {
  async getListings(params) {
    return apiClient.get(API_ENDPOINTS.LISTINGS.LIST, params)
  },

  async getListing(id) {
    return apiClient.get(API_ENDPOINTS.LISTINGS.DETAIL(id))
  },

  async searchListings(searchParams) {
    return apiClient.get(API_ENDPOINTS.LISTINGS.SEARCH, searchParams)
  },

  async getFavorites() {
    return apiClient.get(API_ENDPOINTS.LISTINGS.FAVORITES)
  },

  async addToFavorites(listingId) {
    return apiClient.post(API_ENDPOINTS.LISTINGS.FAVORITES, {
      listing_id: listingId,
    })
  },

  async removeFromFavorites(listingId) {
    return apiClient.delete(`${API_ENDPOINTS.LISTINGS.FAVORITES}${listingId}/`)
  },
}

/**
 * Bookings Service
 */
export const bookingsService = {
  async getBookings() {
    return apiClient.get(API_ENDPOINTS.BOOKINGS.LIST)
  },

  async createBooking(bookingData) {
    return apiClient.post(API_ENDPOINTS.BOOKINGS.CREATE, {
      listing_id: bookingData.listingId,
      pickup_date: bookingData.pickupDate,
      dropoff_date: bookingData.dropoffDate,
      pickup_location: bookingData.pickupLocation,
      dropoff_location: bookingData.dropoffLocation,
      notes: bookingData.notes,
    })
  },

  async getBooking(id) {
    return apiClient.get(API_ENDPOINTS.BOOKINGS.DETAIL(id))
  },

  async cancelBooking(id) {
    return apiClient.post(API_ENDPOINTS.BOOKINGS.CANCEL(id))
  },
}

/**
 * Partners Service
 */
export const partnersService = {
  async registerPartner(partnerData) {
    return apiClient.post(API_ENDPOINTS.PARTNERS.REGISTER, {
      business_name: partnerData.businessName,
      business_type: partnerData.businessType,
      license_number: partnerData.licenseNumber,
      address: partnerData.address,
      city: partnerData.city,
      phone_number: partnerData.phoneNumber,
      website: partnerData.website,
      description: partnerData.description,
    })
  },

  async getDashboardData() {
    return apiClient.get(API_ENDPOINTS.PARTNERS.DASHBOARD)
  },
}

/**
 * Admin Service
 */
export const adminService = {
  async getUsers(params) {
    return apiClient.get(API_ENDPOINTS.ADMIN.USERS, params)
  },

  async getStats() {
    return apiClient.get(API_ENDPOINTS.ADMIN.STATS)
  },
}
