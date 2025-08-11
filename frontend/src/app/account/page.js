'use client'

import { useState, useEffect, Suspense } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Header from '../components/Header'
import Footer from '../components/Footer'

const profileSchema = z.object({
  lastName: z.string().min(1, 'Last name is required'),
  firstName: z.string().min(1, 'First name is required'),
  birthDate: z.object({
    day: z.string().min(1, 'Day is required'),
    month: z.string().min(1, 'Month is required'),
    year: z.string().min(1, 'Year is required'),
  }),
  placeOfBirth: z.string().optional(),
  licenseNumber: z.string().optional(),
  firstIssueDate: z.object({
    day: z.string().optional(),
    month: z.string().optional(),
    year: z.string().optional(),
  }),
  countryOfIssue: z.string().optional(),
  email: z.string().email('Invalid email'),
  phoneCode: z.string().min(1, 'Country code is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  address: z.string().optional(),
  addressLine2: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  notifications: z.boolean(),
})

function AccountPageContent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeSection, setActiveSection] = useState('bookings')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  // Check URL parameters and set active section
  useEffect(() => {
    const section = searchParams.get('section')
    if (section && ['bookings', 'favorites', 'alerts', 'account'].includes(section)) {
      setActiveSection(section)
    }
  }, [searchParams])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      lastName: 'Ayache',
      firstName: 'Yassine',
      birthDate: { day: '', month: '', year: '' },
      placeOfBirth: '',
      licenseNumber: '',
      firstIssueDate: { day: '', month: '', year: '' },
      countryOfIssue: '',
      email: 'ayacheyassine2000@gmail.com',
      phoneCode: 'United States (+1)',
      phoneNumber: '',
      address: '',
      addressLine2: '',
      postalCode: '',
      city: '',
      country: 'United States',
      notifications: true,
    },
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin?redirect=/account')
    }
  }, [user, router])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // API call to update profile would go here
      console.log('Profile update:', data)
      setIsEditing(false)
      // Show success message
    } catch (error) {
      console.error('Profile update failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // API call to delete account would go here
      console.log('Account deletion requested')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const sidebarItems = [
    { id: 'bookings', label: 'Your bookings', icon: '📋' },
    { id: 'favorites', label: 'Your Favorite cars', icon: '❤️' },
    { id: 'alerts', label: 'Price Alerts', icon: '🔔' },
    { id: 'account', label: 'Account', icon: '👤' },
  ]

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'France', 'Germany', 
    'Morocco', 'Spain', 'Italy', 'Japan', 'Australia'
  ]

  const phoneCodes = [
    'United States (+1)', 'Canada (+1)', 'United Kingdom (+44)', 
    'France (+33)', 'Germany (+49)', 'Morocco (+212)', 'Spain (+34)'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Hi there!</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.label}
                    <span className="ml-auto">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="w-full mt-6 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeSection === 'account' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Account</h1>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
                  {/* Personal Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last name
                        </label>
                        <input
                          {...register('lastName')}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First name
                        </label>
                        <input
                          {...register('firstName')}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Birth date
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        <select
                          {...register('birthDate.day')}
                          disabled={!isEditing}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Day</option>
                          {days.map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                        <select
                          {...register('birthDate.month')}
                          disabled={!isEditing}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Month</option>
                          {months.map((month, index) => (
                            <option key={month} value={month}>{month}</option>
                          ))}
                        </select>
                        <select
                          {...register('birthDate.year')}
                          disabled={!isEditing}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Year</option>
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Place of birth
                      </label>
                      <input
                        {...register('placeOfBirth')}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Driving License */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Driving license</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          License number
                        </label>
                        <input
                          {...register('licenseNumber')}
                          disabled={!isEditing}
                          placeholder="e.g. 1234567890XX"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First issue date
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          <select
                            {...register('firstIssueDate.day')}
                            disabled={!isEditing}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">Day</option>
                            {days.map(day => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </select>
                          <select
                            {...register('firstIssueDate.month')}
                            disabled={!isEditing}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">Month</option>
                            {months.map((month, index) => (
                              <option key={month} value={month}>{month}</option>
                            ))}
                          </select>
                          <select
                            {...register('firstIssueDate.year')}
                            disabled={!isEditing}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">Year</option>
                            {years.map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country of issue
                        </label>
                        <select
                          {...register('countryOfIssue')}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Select country</option>
                          {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="flex items-center">
                          <input
                            {...register('email')}
                            disabled={!isEditing}
                            type="email"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                          {!isEditing && (
                            <button
                              type="button"
                              className="ml-3 text-sm text-orange-600 hover:text-orange-700"
                            >
                              Change your email
                            </button>
                          )}
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMS notifications will be sent to:
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <select
                            {...register('phoneCode')}
                            disabled={!isEditing}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            {phoneCodes.map(code => (
                              <option key={code} value={code}>{code}</option>
                            ))}
                          </select>
                          <input
                            {...register('phoneNumber')}
                            disabled={!isEditing}
                            type="tel"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                        {errors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                        )}
                      </div>

                      <div className="text-sm text-gray-600">
                        <div className="flex items-start">
                          <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p>
                            Your phone number will only be used by the operator you contact. By providing your phone
                            number, you are agreeing to receive marketing and promotional messages from the associated Message
                            and data rates may apply. You can opt out at any time. Please see our{' '}
                            <a href="#" className="text-orange-600 hover:text-orange-700">Privacy Statement</a> for more details.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          {...register('address')}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address line 2
                        </label>
                        <input
                          {...register('addressLine2')}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Postal code and city
                          </label>
                          <input
                            {...register('postalCode')}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            {...register('city')}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <select
                          {...register('country')}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Subscriptions */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscriptions</h3>
                    
                    <div className="flex items-center">
                      <input
                        {...register('notifications')}
                        disabled={!isEditing}
                        type="checkbox"
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded disabled:cursor-not-allowed"
                      />
                      <label className="ml-3 text-sm text-gray-700">
                        I'd like to get the latest travel deals, news and inspiration sent straight to my inbox.
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Updating...' : 'Update my profile'}
                      </button>
                    </div>
                  )}

                  {/* Delete Account Section */}
                  <div className="pt-8 border-t border-gray-200">
                    <div className="bg-red-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-red-900 mb-2">Account</h3>
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Delete account →
                      </button>
                      <p className="text-sm text-red-700 mt-2">
                        This action cannot be undone. All your data will be permanently deleted.
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Other sections placeholders */}
            {activeSection === 'bookings' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Bookings</h1>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600">Your car rental bookings will appear here.</p>
                </div>
              </div>
            )}

            {activeSection === 'favorites' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Favorite Cars</h1>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">❤️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                  <p className="text-gray-600">Cars you favorite will appear here.</p>
                </div>
              </div>
            )}

            {activeSection === 'alerts' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Price Alerts</h1>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔔</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No price alerts set</h3>
                  <p className="text-gray-600">Set up price alerts to get notified of deals.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

// Loading component for Suspense fallback
function AccountLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading account...</p>
      </div>
    </div>
  )
}

// Main export with Suspense boundary
export default function AccountPage() {
  return (
    <Suspense fallback={<AccountLoading />}>
      <AccountPageContent />
    </Suspense>
  )
}
