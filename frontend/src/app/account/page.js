'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { favoritesAPI, userAPI } from '@/lib/api'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export default function AccountPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const [showAccountSettings, setShowAccountSettings] = useState(false)
  const [currentSection, setCurrentSection] = useState('account')
  const [accountData, setAccountData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phoneNumber: user?.phone_number || '',
    dateOfBirth: user?.date_of_birth || '',
    placeOfBirth: user?.place_of_birth || '',
    profileImage: user?.profile_picture || '/default-avatar.png',
    // Contact Information
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    postalCode: user?.postal_code || '',
    // Driver's License Information
    licenseNumber: user?.license_number || '',
    licenseCountry: user?.license_country || '',
    licenseIssueDate: user?.license_issue_date || '',
    licenseExpiryDate: user?.license_expiry_date || ''
  })
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [favorites, setFavorites] = useState([])
  const [favoritesLoading, setFavoritesLoading] = useState(false)
  const [hasLocalDraft, setHasLocalDraft] = useState(false)
  const [emailVerified, setEmailVerified] = useState(!!(user?.is_verified || user?.email_verified))

  const refreshVerificationStatus = async () => {
    try {
      const data = await userAPI.getCurrentUser()
      setEmailVerified(!!(data?.email_verified || data?.is_verified))
    } catch (_) {}
  }

  // Load draft from localStorage (keeps form values even if backend is down/reload happens)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('accountForm')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setAccountData(prev => ({ ...prev, ...parsed }))
        setHasLocalDraft(true)
      } catch (_) {}
    }
  }, [])

  // Auto-save form to localStorage on change
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('accountForm', JSON.stringify(accountData))
    } catch (_) {}
  }, [accountData])

  // Handle URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
      const sectionParam = urlParams.get('section')
    const actionParam = urlParams.get('action')
    
      if (sectionParam && ['favorites', 'price-alerts'].includes(sectionParam)) {
        setShowAccountSettings(true)
        setCurrentSection(sectionParam)
      }
      
      if (actionParam === 'account') {
        setShowAccountSettings(true)
        setCurrentSection('account')
      }
    }
  }, [])

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
        return
      }
  }, [user, loading, router])

  // Load user's favorites - DISABLED (Backend not implemented)
  const loadFavorites = async () => {
    if (!user) return
    
    setFavoritesLoading(true)
    try {
      // Favorites feature disabled - return empty array
      setFavorites([])
      console.warn('Favorites feature is disabled - backend not implemented')
    } catch (error) {
      console.error('Error loading favorites:', error)
      setFavorites([])
    } finally {
      setFavoritesLoading(false)
    }
  }

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      // Basic Information
      accountData.firstName,
      accountData.lastName,
      accountData.dateOfBirth,
      // Contact Information
      accountData.phoneNumber,
      accountData.address,
      accountData.city,
      accountData.country,
      // Driver's License
      accountData.licenseNumber,
      accountData.licenseCountry,
      accountData.licenseIssueDate
    ]
    
    const completedFields = fields.filter(field => field && field.trim() !== '').length
    return Math.round((completedFields / fields.length) * 100)
  }

  // Remove from favorites - DISABLED (Backend not implemented)
  const removeFavorite = async (carId) => {
    console.warn('Favorites feature is disabled - backend not implemented')
    // No-op - favorites feature disabled
  }

  // Load favorites when user is available
  useEffect(() => {
    if (user) {
      loadFavorites()
    }
  }, [user])

  // Load favorites when favorites section is opened
  useEffect(() => {
    if (currentSection === 'favorites' && user) {
      loadFavorites()
    }
  }, [currentSection, user])

  // Load user data from backend when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const userData = await authService.getCurrentUser()
          setAccountData(prev => ({
            ...prev,
            firstName: userData.first_name || prev.firstName,
            lastName: userData.last_name || prev.lastName,
            email: userData.email || prev.email,
            phoneNumber: userData.phone_number || prev.phoneNumber,
            dateOfBirth: userData.date_of_birth || prev.dateOfBirth,
            placeOfBirth: userData.nationality || prev.placeOfBirth,
            address: userData.address || prev.address,
            city: userData.city || prev.city,
            country: userData.country_of_residence || prev.country,
            postalCode: userData.postal_code || prev.postalCode,
            licenseNumber: userData.license_number || prev.licenseNumber,
            licenseCountry: userData.license_origin_country || prev.licenseCountry,
            licenseIssueDate: userData.issue_date || prev.licenseIssueDate,
            licenseExpiryDate: prev.licenseExpiryDate,
            profileImage: userData.profile_picture || prev.profileImage
          }))
          setEmailVerified(!!(userData?.email_verified || userData?.is_verified))
        } catch (error) {
          console.error('Error loading user data:', error)
          // Continue with existing data if backend fails
        }
      }
    }

    loadUserData()
  }, [user])

  // Handle account data changes
  const handleAccountDataChange = (e) => {
    const { name, value } = e.target
    setAccountData(prev => ({
        ...prev,
      [name]: value
    }))
  }

  // Handle photo change
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Optimistic preview
    try {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setAccountData(prev => ({
          ...prev,
          profileImage: ev.target.result
        }))
      }
      reader.readAsDataURL(file)
    } catch (_) {}

    // Upload to backend
    try {
      const updated = await userAPI.uploadProfilePicture(file)
      const newUrl = updated.profile_picture || updated.profileImage || updated.profile || null
      if (newUrl) {
        setAccountData(prev => ({ ...prev, profileImage: newUrl }))
      }
      setSaveMessage('Profile photo updated')
      setTimeout(() => setSaveMessage(''), 2500)
    } catch (err) {
      console.error('Error uploading profile photo:', err)
      setSaveMessage('Error uploading photo. Please try again.')
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  // Handle remove photo
  const handleRemovePhoto = () => {
    setAccountData(prev => ({
      ...prev,
      profileImage: '/default-avatar.png'
    }))
    // No need to manually write; auto-save effect persists this change
  }

  // Handle account form submission
  const handleAccountSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaveMessage('')

    try {
      // Build a single payload and update in one request
      const payload = {
        first_name: accountData.firstName,
        last_name: accountData.lastName,
        date_of_birth: accountData.dateOfBirth,
        nationality: accountData.placeOfBirth,
        phone_number: accountData.phoneNumber,
        address: accountData.address,
        city: accountData.city,
        postal_code: accountData.postalCode,
        country_of_residence: accountData.country,
        license_origin_country: accountData.licenseCountry,
        license_number: accountData.licenseNumber,
        issue_date: accountData.licenseIssueDate,
      }

      const updated = await userAPI.updateProfile(payload)

      // If backend is blocked, updateProfile returns merged local object
      const userData = updated || (await userAPI.getCurrentUser())
      setAccountData(prev => ({
        ...prev,
        firstName: userData.first_name || userData.firstName || prev.firstName,
        lastName: userData.last_name || userData.lastName || prev.lastName,
        email: userData.email || prev.email,
        phoneNumber: userData.phone_number || userData.phoneNumber || prev.phoneNumber,
        dateOfBirth: userData.date_of_birth || userData.dateOfBirth || prev.dateOfBirth,
        placeOfBirth: userData.nationality || userData.place_of_birth || prev.placeOfBirth,
        address: userData.address || prev.address,
        city: userData.city || prev.city,
        country: userData.country_of_residence || userData.country || prev.country,
        postalCode: userData.postal_code || userData.postalCode || prev.postalCode,
        licenseNumber: userData.license_number || userData.licenseNumber || prev.licenseNumber,
        licenseCountry: userData.license_origin_country || userData.licenseCountry || prev.licenseCountry,
        licenseIssueDate: userData.issue_date || userData.licenseIssueDate || prev.licenseIssueDate,
        licenseExpiryDate: userData.license_expiry_date || userData.licenseExpiryDate || prev.licenseExpiryDate,
        profileImage: userData.profile_picture || userData.profileImage || prev.profileImage,
      }))

      setSaveMessage('Account information saved successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Error saving account information:', error)
      setSaveMessage(error?.message || 'Error saving account information. Please try again.')
      setTimeout(() => setSaveMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Use edited values preferentially for immediate UI feedback after Save
  const displayFirstName = accountData.firstName || user.first_name || ''
  const displayLastName = accountData.lastName || user.last_name || ''
  const displayEmail = accountData.email || user.email || ''
  const displayProfileImage = accountData.profileImage && accountData.profileImage !== '/default-avatar.png'
    ? accountData.profileImage
    : (user.profile_picture || '')

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
      
      {/* Enhanced Profile Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-6">
            {/* Profile Avatar */}
            <div className="relative">
              {displayProfileImage ? (
                <img
                  src={displayProfileImage}
                  alt={displayFirstName || 'User'}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-3xl font-bold text-orange-600">
                    {(displayFirstName || displayEmail)?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 text-white">
              <h1 className="text-3xl font-bold">
                {displayFirstName ? `${displayFirstName} ${displayLastName}`.trim() : 'Welcome!'}
              </h1>
              <p className="text-orange-100 text-lg">{displayEmail}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-400 text-white">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified User
                  </span>
                <span className="text-orange-100">Member since {new Date().getFullYear()}</span>
                </div>
              </div>
              
            {/* Quick Actions */}
            <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAccountSettings(true)}
                className="bg-white text-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center space-x-2"
                  >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                <span>Edit Profile</span>
                  </button>
                      <button
                onClick={() => router.push('/search')}
                className="bg-orange-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-300 transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                <span>Find Cars</span>
                          </button>
                        </div>
                      </div>
                    </div>
              </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
              <button
                  type="button"
                  onClick={() => router.push('/bookings')}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
              </div>
            <div>
                      <p className="font-medium text-gray-900">My Bookings</p>
                      <p className="text-sm text-gray-500">View and manage your bookings</p>
            </div>
                      </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowAccountSettings(true)}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    <div>
                      <p className="font-medium text-gray-900">Favorite Cars</p>
                      <p className="text-sm text-gray-500">Your saved car listings</p>
                    </div>
                  </div>
                </button>

                  <button 
                  type="button"
                  onClick={() => setShowAccountSettings(true)}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 6v12a1.5 1.5 0 01-1.5 1.5h-15z" />
                      </svg>
                            </div>
                            <div>
                      <p className="font-medium text-gray-900">Price Alerts</p>
                      <p className="text-sm text-gray-500">Get notified of price drops</p>
                            </div>
                          </div>
                          </button>
                
                  <button
                  type="button"
                  onClick={() => setShowAccountSettings(true)}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
                  >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
              <div>
                      <p className="font-medium text-gray-900">Account Settings</p>
                      <p className="text-sm text-gray-500">Manage your profile</p>
                    </div>
                      </div>
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">View All</button>
                  </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Welcome to Airbcar!</p>
                    <p className="text-sm text-gray-500">You joined our platform today</p>
                </div>
                  <span className="text-xs text-gray-400">Just now</span>
                      </div>
                
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h4>
                  <p className="text-gray-500 mb-4">Start exploring cars to see your activity here</p>
                <button 
                    onClick={() => router.push('/search')}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Browse Cars
                </button>
              </div>
            </div>
          </div>

            {/* Profile Completion */}
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
                <span className="text-sm text-gray-500">{calculateProfileCompletion()}% Complete</span>
                    </div>
              
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      calculateProfileCompletion() >= 80 ? 'bg-green-500' : 
                      calculateProfileCompletion() >= 50 ? 'bg-orange-500' : 'bg-red-500'
                    }`} 
                    style={{width: `${calculateProfileCompletion()}%`}}
                  ></div>
                </div>
              </div>

                <div className="space-y-3">
                {/* Basic Information */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      (accountData.firstName && accountData.lastName && accountData.dateOfBirth) ? 'bg-green-500' : 
                      (accountData.firstName || accountData.lastName || accountData.dateOfBirth) ? 'bg-orange-500' : 'bg-gray-300'
                    }`}>
                      {(accountData.firstName && accountData.lastName && accountData.dateOfBirth) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-700">Basic Information</span>
                  </div>
                  <span className={`text-xs font-medium ${
                    (accountData.firstName && accountData.lastName && accountData.dateOfBirth) ? 'text-green-600' : 
                    (accountData.firstName || accountData.lastName || accountData.dateOfBirth) ? 'text-orange-600' : 'text-gray-500'
                  }`}>
                    {(accountData.firstName && accountData.lastName && accountData.dateOfBirth) ? 'Complete' : 
                     (accountData.firstName || accountData.lastName || accountData.dateOfBirth) ? 'Incomplete' : 'Not Started'}
                  </span>
                </div>
                
                {/* Email Verification */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      emailVerified ? 'bg-green-500' : 'bg-orange-500'
                    }`}>
                      {emailVerified && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-700">Email Verification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium ${emailVerified ? 'text-green-600' : 'text-orange-600'}`}>
                      {emailVerified ? 'Verified' : 'Verified'}
                    </span>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      accountData.phoneNumber ? 'bg-green-500' : 'bg-orange-500'
                    }`}>
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    <span className="text-sm text-gray-700">Phone Number</span>
                    </div>
                  <span className={`text-xs font-medium ${
                    accountData.phoneNumber ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {accountData.phoneNumber ? 'Complete' : 'Incomplete'}
                      </span>
                    </div>
                
                {/* Contact Information */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      accountData.address && accountData.city && accountData.country ? 'bg-green-500' : 
                      accountData.address || accountData.city || accountData.country ? 'bg-orange-500' : 'bg-gray-300'
                    }`}>
                      {accountData.address && accountData.city && accountData.country && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      </div>
                    <span className="text-sm text-gray-700">Contact Information</span>
                    </div>
                  <span className={`text-xs font-medium ${
                    accountData.address && accountData.city && accountData.country ? 'text-green-600' : 
                    accountData.address || accountData.city || accountData.country ? 'text-orange-600' : 'text-gray-500'
                  }`}>
                    {accountData.address && accountData.city && accountData.country ? 'Complete' : 
                     accountData.address || accountData.city || accountData.country ? 'Incomplete' : 'Not Started'}
                  </span>
                    </div>
                
                {/* Driver's License */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      accountData.licenseNumber && accountData.licenseCountry && accountData.licenseIssueDate ? 'bg-green-500' : 
                      accountData.licenseNumber || accountData.licenseCountry || accountData.licenseIssueDate ? 'bg-orange-500' : 'bg-gray-300'
                    }`}>
                      {accountData.licenseNumber && accountData.licenseCountry && accountData.licenseIssueDate && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                  </div>
                    <span className="text-sm text-gray-700">Driver's License</span>
                </div>
                  <span className={`text-xs font-medium ${
                    accountData.licenseNumber && accountData.licenseCountry && accountData.licenseIssueDate ? 'text-green-600' : 
                    accountData.licenseNumber || accountData.licenseCountry || accountData.licenseIssueDate ? 'text-orange-600' : 'text-gray-500'
                  }`}>
                    {accountData.licenseNumber && accountData.licenseCountry && accountData.licenseIssueDate ? 'Complete' : 
                     accountData.licenseNumber || accountData.licenseCountry || accountData.licenseIssueDate ? 'Incomplete' : 'Not Started'}
                        </span>
              </div>
            </div>
              
              <div className="mt-6">
                      <button 
                  onClick={() => setShowAccountSettings(true)}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Complete Profile
                      </button>
                </div>
                </div>
          </main>
                </div>
      </div>
      
      {/* Account Settings Modal */}
      {showAccountSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Section Navigation */}
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setCurrentSection('account')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    currentSection === 'account'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Account
                </button>
                      <button
                        type="button"
                  onClick={() => setCurrentSection('favorites')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    currentSection === 'favorites'
                      ? 'bg-white text-red-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Favorites
                      </button>
                      <button
                        type="button"
                  onClick={() => setCurrentSection('price-alerts')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    currentSection === 'price-alerts'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Price Alerts
                      </button>
                    </div>

              {/* Account Section */}
              {currentSection === 'account' && (
                <form onSubmit={handleAccountSubmit} className="space-y-8">
                  {saveMessage && (
                    <div className="bg-green-50 text-green-800 border border-green-200 rounded-lg px-4 py-3 text-sm">
                      {saveMessage}
                  </div>
                  )}

                  {/* Profile Photo */}
                  <section>
                    <h2 className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-2 rounded">Profile Photo</h2>
                    <div className="mt-4 flex items-center gap-4">
                      <img src={accountData.profileImage} alt="Profile" className="w-16 h-16 rounded-full object-cover border" />
                      <div className="flex gap-2">
                        <label className="inline-flex items-center px-3 py-2 border rounded-lg cursor-pointer bg-white hover:bg-gray-50">
                          <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                          Change photo
                      </label>
                        <button type="button" onClick={handleRemovePhoto} className="px-3 py-2 border rounded-lg hover:bg-gray-50">Remove</button>
                      </div>
                    </div>
                  </section>

                  {/* Personal Information */}
                  <section>
                    <h2 className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-2 rounded">Personal Information</h2>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-700">First name</label>
                      <input
                        type="text"
                        name="firstName"
                          value={accountData.firstName || ''}
                        onChange={handleAccountDataChange}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-700">Last name</label>
                      <input
                        type="text"
                        name="lastName"
                          value={accountData.lastName || ''}
                        onChange={handleAccountDataChange}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-700">Birth date</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                          value={accountData.dateOfBirth || ''}
                        onChange={handleAccountDataChange}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-700">Phone number</label>
                      <input
                        type="tel"
                          name="phoneNumber"
                          value={accountData.phoneNumber || ''}
                        onChange={handleAccountDataChange}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                  </div>
                  </section>

                  {/* Contact Information */}
                  <section>
                    <h2 className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-2 rounded">Contact Information</h2>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-700">Address</label>
                      <input
                        type="text"
                        name="address"
                          value={accountData.address || ''}
                        onChange={handleAccountDataChange}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
                          placeholder="Street address"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-700">City</label>
                      <input
                          type="text"
                          name="city"
                          value={accountData.city || ''}
                        onChange={handleAccountDataChange}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
                          placeholder="City"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-700">Country</label>
                      <input
                        type="text"
                          name="country"
                          value={accountData.country || ''}
                        onChange={handleAccountDataChange}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
                          placeholder="Country"
                        />
                    </div>
                      <div>
                        <label className="text-sm text-gray-700">Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={accountData.postalCode || ''}
                          onChange={handleAccountDataChange}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
                          placeholder="Postal code"
                        />
                  </div>
                </div>
                  </section>

                  {/* Driver's License Information */}
                  <section>
                    <h2 className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-2 rounded">Driver's License</h2>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-700">License Number</label>
                      <input
                        type="text"
                          name="licenseNumber"
                          value={accountData.licenseNumber || ''}
                        onChange={handleAccountDataChange}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
                          placeholder="Driver's license number"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-700">Issuing Country</label>
                      <input
                        type="text"
                          name="licenseCountry"
                          value={accountData.licenseCountry || ''}
                        onChange={handleAccountDataChange}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
                          placeholder="Country where license was issued"
                        />
                    </div>
                      <div>
                        <label className="text-sm text-gray-700">Issue Date</label>
                        <input
                          type="date"
                          name="licenseIssueDate"
                          value={accountData.licenseIssueDate || ''}
                          onChange={handleAccountDataChange}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
                        />
                  </div>
                    <div>
                        <label className="text-sm text-gray-700">Expiry Date</label>
                        <input
                          type="date"
                          name="licenseExpiryDate"
                          value={accountData.licenseExpiryDate || ''}
                          onChange={handleAccountDataChange}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Save button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                      </button>
                    </div>
                </form>
              )}

              {/* Favorites Section */}
              {currentSection === 'favorites' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                      <h3 className="text-lg font-semibold text-gray-900">Your Favorite Cars</h3>
                      <p className="text-gray-600">Cars you've saved for later</p>
                      </div>
                  <button
                      onClick={() => router.push('/search')}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                  >
                      Browse More Cars
                  </button>
                      </div>
                  
                  {favoritesLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading your favorites...</p>
                    </div>
                  ) : favorites.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
                      <p className="text-gray-500 mb-4">
                        Start exploring cars and add them to your favorites to see them here.
                      </p>
                    <button
                        onClick={() => router.push('/search')}
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        Browse Cars
                      </button>
                        </div>
                      ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favorites.map((favorite) => {
                        const car = favorite.car || favorite
                        return (
                          <div key={car.id || favorite.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-4">
                              <img
                                src={car.image || car.images?.[0] || '/carsymbol.jpg'}
                                alt={car.name || car.title}
                                className="w-20 h-20 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src = '/carsymbol.jpg'
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-semibold text-gray-900 truncate">
                                  {car.name || car.title || 'Car'}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  {car.brand} {car.model} • {car.year}
                                </p>
                    <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-orange-500">
                                    ${car.price_per_day || car.price}/day
                                  </span>
                  <button
                                    onClick={() => removeFavorite(car.id || favorite.id)}
                                    disabled={favoritesLoading}
                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                  >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" clipRule="evenodd" />
                                    </svg>
                    </button>
                  </div>
                </div>
            </div>
          </div>
                        )
                      })}
          </div>
                  )}
        </div>
        )}

              {/* Price Alerts Section */}
              {currentSection === 'price-alerts' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                      <h3 className="text-lg font-semibold text-gray-900">Price Alerts</h3>
                      <p className="text-gray-600">Get notified when car prices drop</p>
                      </div>
                <button
                      onClick={() => {
                        // TODO: Add create alert functionality
                        alert('Create alert functionality coming soon!')
                      }}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
                    >
                      Create Alert
                </button>
              </div>

                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 6v12a1.5 1.5 0 01-1.5 1.5h-15z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No price alerts yet</h3>
                    <p className="text-gray-500 mb-4">
                      Create your first price alert to get notified when car prices drop.
                    </p>
                  <button
                      onClick={() => {
                        // TODO: Add create alert functionality
                        alert('Create alert functionality coming soon!')
                      }}
                      className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Create Alert
                  </button>
                </div>
                </div>
              )}
                </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                  <button
                onClick={() => setShowAccountSettings(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
