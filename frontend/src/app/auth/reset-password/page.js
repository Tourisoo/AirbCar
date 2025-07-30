'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  })

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token')
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    } else {
      setError('Invalid reset link')
    }
  }, [searchParams])

  const onSubmit = async (data) => {
    if (!token) {
      setError('Invalid reset token')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/auth/signin')
        }, 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Something went wrong')
      }
    } catch (error) {
      setError('Something went wrong')
    }

    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex">
        {/* Left side - Success message */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* Logo */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-orange-500">Airbcar</h1>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-green-600 mb-6">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Password reset successfully!
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Your password has been updated. Redirecting to sign in...
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Image/Background */}
        <div className="hidden lg:block relative w-0 flex-1">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h3 className="text-3xl font-bold mb-4">Success!</h3>
              <p className="text-lg opacity-90">Your password has been updated successfully</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !token) {
    return (
      <div className="min-h-screen flex">
        {/* Left side - Error message */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            {/* Logo */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-orange-500">Airbcar</h1>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Invalid reset link
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                This password reset link is invalid or has expired.
              </p>
              <Link
                href="/auth/forgot-password"
                className="inline-flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Request a new reset link
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Image/Background */}
        <div className="hidden lg:block relative w-0 flex-1">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h3 className="text-3xl font-bold mb-4">Link Expired</h3>
              <p className="text-lg opacity-90">Request a new password reset link</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-orange-500">Airbcar</h1>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Reset your password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your new password below.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    {...register('password')}
                    type="password"
                    autoComplete="new-password"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm text-gray-900 placeholder-gray-500"
                    placeholder="Enter your new password"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    autoComplete="new-password"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm text-gray-900 placeholder-gray-500"
                    placeholder="Confirm your new password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading || !token}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Updating password...' : 'Update password'}
              </button>

              <Link
                href="/auth/signin"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Image/Background */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h3 className="text-3xl font-bold mb-4">Set New Password</h3>
            <p className="text-lg opacity-90">Choose a strong password for your account security</p>
          </div>
        </div>
      </div>
    </div>
  )
}
