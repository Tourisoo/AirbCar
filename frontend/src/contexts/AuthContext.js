'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
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
          is_partner: payload.is_partner || false,
          is_verified: payload.is_verified || false
        })
      } catch (error) {
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

  const login = async (email, password) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/token/`, {
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
          await checkAuth()
        }
        
        return { success: true }
      } else {
        const errorData = await response.json()
        return { 
          success: false, 
          error: errorData.detail || 'Invalid email or password' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Something went wrong' 
      }
    }
  }

  const register = async (username, email, password) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      })

      if (response.ok) {
        // After successful registration, automatically log the user in
        const loginResult = await login(email, password)
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
    } catch (error) {
      return { 
        success: false, 
        error: 'Something went wrong' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
    router.push('/')
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
