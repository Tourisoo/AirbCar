'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Input, Alert } from '@/components/ui'
import { isValidEmail } from '@/lib/utils'

export default function LoginForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  
  const router = useRouter()
  const { login } = useAuth()

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGeneralError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const result = await login(formData.email, formData.password, { 
        redirect: !onSuccess, // Only redirect if no custom onSuccess handler 
        redirectTo: '/' 
      })
      
      if (result.success) {
        if (onSuccess) {
          onSuccess(result)
        }
        // If no onSuccess handler, AuthContext automatically handles redirection
      } else {
        setGeneralError(result.error || 'Login failed. Please try again.')
      }
    } catch (error) {
      setGeneralError(error.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {generalError && (
        <Alert variant="error">
          {generalError}
        </Alert>
      )}

      <Input
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="Enter your email"
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="Enter your password"
        required
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>

        <a
          href="/auth/forgot-password"
          className="text-sm text-orange-600 hover:text-orange-500"
        >
          Forgot your password?
        </a>
      </div>

      <Button
        type="submit"
        loading={loading}
        className="w-full"
        size="lg"
      >
        Sign In
      </Button>
    </form>
  )
}
