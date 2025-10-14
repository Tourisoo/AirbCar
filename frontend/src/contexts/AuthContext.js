'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check if user is logged in on app start
  useEffect(() => {
    if (isClient) {
      checkAuth()
    }
  }, [isClient])

  const checkAuth = async () => {
    try {
      // Check if we're on the client side
      if (typeof window === 'undefined') {
        setLoading(false)
        return
      }

      const token = localStorage.getItem('access_token')
      if (!token) {
        setLoading(false)
        return
      }

      // For now, just check if token exists and try to decode it
      // In a production environment, you'd verify with the backend
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Date.now() / 1000
        
        if (payload.exp < currentTime) {
          // Token expired
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          setLoading(false)
          return
        }
        
        // Set user data from token payload
        setUser({
          id: payload.user_id,
          username: payload.username,
          email: payload.email || '',
          first_name: payload.first_name || '',
          last_name: payload.last_name || '',
          is_partner: payload.is_partner || false,
          is_verified: payload.is_verified || false,
          is_staff: payload.is_staff || false,
          is_superuser: payload.is_superuser || false,
          role: payload.role || 'user'
        })
      } catch {
        // Invalid token format
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password, options = {}) => {
    const { redirect = true, redirectTo = '/' } = options
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Store tokens
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)
        
        // Set user data (from Django's custom serializer)
        if (data.user) {
          setUser(data.user)
        } else {
          // If no user data in response, fetch it
          if (isClient) {
            await checkAuth()
          }
        }

        // Handle role-based redirection if enabled
        if (redirect && isClient && window?.location) {
          const token = data.access
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]))
              const userRole = payload.role || 'user'
              const isPartner = payload.is_partner || false
              const isStaff = payload.is_staff || false
              const isSuperuser = payload.is_superuser || false
              
              // Debug: Log the token payload
              console.log('🔍 Full Token payload:', payload)
              console.log('🔍 Role detection:', { userRole, isPartner, isStaff, isSuperuser })
              
              // FORCE admin redirection for ANY staff or superuser
              let redirectPath = '/'
              
              // Check if user is admin (HIGHEST priority - force redirect)
              if (isStaff === true || isSuperuser === true) {
                redirectPath = '/admin/dashboard'
                console.log('🚀 ADMIN DETECTED - Forcing redirect to:', redirectPath)
              }
              // Check if user is partner (second priority)
              else if (isPartner === true || userRole === 'partner') {
                redirectPath = '/partner/dashboard'
                console.log('🏢 PARTNER DETECTED - Redirecting to:', redirectPath)
              }
              // Regular user (default)
              else {
                redirectPath = redirectTo === '/' ? '/' : redirectTo
                console.log('👤 USER DETECTED - Redirecting to:', redirectPath)
              }
              
              console.log(`User role: ${userRole}, isStaff: ${isStaff}, isSuperuser: ${isSuperuser}, isPartner: ${isPartner}`)
              console.log(`Redirecting to: ${redirectPath}`)
              
              // Use window.location for navigation to ensure it works everywhere
              window.location.href = redirectPath
            } catch (tokenError) {
              console.error('Error parsing token:', tokenError)
              if (redirectTo !== '/') {
                window.location.href = redirectTo
              }
            }
          }
        }
        
        return { success: true, user: data.user }
      } else {
        const errorData = await response.json()
        return { 
          success: false, 
          error: errorData.detail || 'Invalid email or password' 
        }
      }
    } catch {
      return { 
        success: false, 
        error: 'Something went wrong' 
      }
    }
  }

  const register = async (firstName, lastName, email, password) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          first_name: firstName,
          last_name: lastName,
          email, 
          password 
        }),
      })

      if (response.ok) {
        // After successful registration, automatically log the user in without redirect
        const loginResult = await login(email, password, { redirect: false })
        return loginResult
      } else {
        const errorData = await response.json()
        
        // Handle Django validation errors
        let errorMessage = 'Something went wrong'
        if (errorData.username) {
          errorMessage = `Username: ${errorData.username[0]}`
        } else if (errorData.email) {
          errorMessage = `Email: ${errorData.email[0]}`
        } else if (errorData.password) {
          errorMessage = `Password: ${errorData.password[0]}`
        }
        
        return { 
          success: false, 
          error: errorMessage 
        }
      }
    } catch {
      return { 
        success: false, 
        error: 'Something went wrong' 
      }
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      // Remove all possible auth keys
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      // Clear cached user data used by fallbacks
      localStorage.removeItem('userProfile')
      localStorage.removeItem('favorites')
      localStorage.removeItem('bookings')
      localStorage.removeItem('accountForm')
      localStorage.removeItem('isPartnerUser')
    }
    setUser(null)
    // Use replace to prevent going back to an authed page
    router.replace('/')
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
