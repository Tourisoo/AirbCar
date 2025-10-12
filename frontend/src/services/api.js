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
    return localStorage.getItem('access_token')
  }

  getHeaders() {
    const headers = { ...this.defaultHeaders }
    const token = this.getAuthToken()
    
    console.log('🔑 Getting auth token:', token ? 'Found token (length: ' + token.length + ')' : 'No token found')
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
      console.log('🔒 Added Authorization header')
    } else {
      console.log('❌ No Authorization header added')
    }
    
    console.log('📤 Final headers:', headers)
    return headers
  }

  async handleResponse(response) {
    console.log('📥 Response status:', response.status, response.url)
    
    if (!response.ok) {
      if (response.status === 401) {
        console.log('🚫 Unauthorized response - clearing tokens')
        // Handle unauthorized - redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/auth/signin'
        }
      }
      
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ API Error Response:', {
        status: response.status,
        url: response.url,
        errorData: errorData,
        headers: response.headers
      })
      throw new Error(errorData.message || errorData.detail || JSON.stringify(errorData) || `HTTP error! status: ${response.status}`)
    }
    
    console.log('✅ Successful response')
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

  async uploadPatch(endpoint, formData) {
    const headers = { ...this.getHeaders() }
    delete headers['Content-Type'] // Let browser set it for FormData

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
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
      localStorage.setItem('access_token', response.access)
      localStorage.setItem('refresh_token', response.refresh)
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
    return apiClient.get(`${API_ENDPOINTS.AUTH.PROFILE}me/`)
  },

  async updateProfile(userData) {
    return apiClient.patch(`${API_ENDPOINTS.AUTH.PROFILE}me/`, userData)
  },

  async uploadProfilePicture(file) {
    const formData = new FormData()
    formData.append('profile_picture', file)
    
    // Use uploadPatch for PATCH requests with file uploads
    return apiClient.uploadPatch(`${API_ENDPOINTS.AUTH.PROFILE}me/`, formData)
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) throw new Error('No refresh token')

    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
      refresh: refreshToken,
    })

    if (response.access) {
      localStorage.setItem('access_token', response.access)
    }

    return response
  },

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    window.location.href = '/auth/signin'
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
    // Favorites not implemented in backend yet - return empty array
    console.warn('Favorites feature not implemented in backend yet')
    return []
  },

  async addToFavorites(listingId) {
    // Favorites not implemented in backend yet - return success
    console.warn('Favorites feature not implemented in backend yet')
    return { success: true, message: 'Favorites feature coming soon' }
  },

  async removeFromFavorites(listingId) {
    // Favorites not implemented in backend yet - return success  
    console.warn('Favorites feature not implemented in backend yet')
    return { success: true, message: 'Favorites feature coming soon' }
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
    console.log('Creating booking with data:', bookingData);
    
    // Debug auth token
    const token = localStorage.getItem('access_token');
    console.log('Auth token available:', !!token, token ? 'Token length: ' + token.length : 'No token');
    
    // Ensure we're sending the listing ID, not the object
    const listingId = typeof bookingData.listing === 'object' 
      ? bookingData.listing.id 
      : bookingData.listing;
    
    const requestData = {
      listing: listingId,
      start_time: bookingData.start_time,
      end_time: bookingData.end_time,
      price: parseFloat(bookingData.price),
      status: 'pending',
      request_message: bookingData.request_message || '',
    };
    
    console.log('Sending booking data to backend:', requestData);
    console.log('API Headers will include:', apiClient.getHeaders());
    return apiClient.post(API_ENDPOINTS.BOOKINGS.CREATE, requestData)
  },

  async getBooking(id) {
    return apiClient.get(API_ENDPOINTS.BOOKINGS.DETAIL(id))
  },

  async cancelBooking(id) {
    console.log('Cancelling booking with ID:', id);
    return apiClient.post(API_ENDPOINTS.BOOKINGS.CANCEL(id))
  },

  async acceptBooking(id) {
    console.log('Accepting booking with ID:', id);
    return apiClient.post(API_ENDPOINTS.BOOKINGS.ACCEPT(id))
  },

  async rejectBooking(id, rejectionReason = '') {
    console.log('Rejecting booking with ID:', id);
    return apiClient.post(API_ENDPOINTS.BOOKINGS.REJECT(id), {
      rejection_reason: rejectionReason
    })
  },

  async getPendingRequests() {
    return apiClient.get(API_ENDPOINTS.BOOKINGS.PENDING_REQUESTS)
  },

  async getUpcomingBookings() {
    return apiClient.get(API_ENDPOINTS.BOOKINGS.UPCOMING)
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
