'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Header() {
  const { user, loading, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isRegionalSettingsOpen, setIsRegionalSettingsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [regionalSettings, setRegionalSettings] = useState({
    language: 'English',
    country: 'Belgium',
    currency: 'EUR - €'
  })

  // Language and Currency options
  const languageOptions = [
    { code: 'en', name: 'English'},
    { code: 'ar', name: 'العربية'},
    { code: 'fr', name: 'Français'}
  ]

  const currencyOptions = [
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'MAD', symbol: 'DH', name: 'Dirham' },
    { code: 'USD', symbol: '$', name: 'Dollar' }
  ]

  const handleLanguageChange = (language) => {
    setRegionalSettings(prev => ({ ...prev, language: language.name }))
    localStorage.setItem('selectedLanguage', language.name)
    console.log('Language changed to:', language)
  }

  const handleCurrencyChange = (currency) => {
    const currencyString = `${currency.code} - ${currency.symbol}`
    setRegionalSettings(prev => ({ ...prev, currency: currencyString }))
    localStorage.setItem('selectedCurrency', currencyString)
    console.log('Currency changed to:', currency)
  }
  
  const [isPartnerUser, setIsPartnerUser] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isPartnerDashboard = pathname === '/partner/dashboard'
  
  // Check if user is a partner based on user properties or if they've been to partner dashboard
  const isPartner = user && (
    user.is_partner === true || 
    user.role === 'partner' || 
    user.userType === 'partner' ||
    isPartnerUser // Persistent partner status
  )

  // Persist partner status when user visits partner dashboard
  useEffect(() => {
    if (isPartnerDashboard && user) {
      setIsPartnerUser(true)
      localStorage.setItem('isPartnerUser', 'true')
    }
  }, [isPartnerDashboard, user])

  // Check localStorage on component mount
  useEffect(() => {
    const storedPartnerStatus = localStorage.getItem('isPartnerUser')
    if (storedPartnerStatus === 'true') {
      setIsPartnerUser(true)
    }

    // Load regional settings from localStorage
    const storedLanguage = localStorage.getItem('selectedLanguage')
    const storedCurrency = localStorage.getItem('selectedCurrency')
    
    if (storedLanguage) {
      setRegionalSettings(prev => ({ ...prev, language: storedLanguage }))
    }
    if (storedCurrency) {
      setRegionalSettings(prev => ({ ...prev, currency: storedCurrency }))
    }
  }, [])

  // Check if user is admin based on email or role
  useEffect(() => {
    if (user) {
      setIsAdmin(
        user.email === 'admin@airbcar.com' ||
        user.role === 'admin' ||
        user.is_admin === true ||
        user.userType === 'admin'
      )
    } else {
      setIsAdmin(false)
    }
  }, [user])

  const handleSignOut = () => {
    logout()
    setIsDropdownOpen(false)
    localStorage.removeItem('isPartnerUser')
  }

  const handleBecomePartnerClick = () => {
    router.push('/partner')
  }

  const handleMyBookingsClick = () => {
    router.push('/bookings')
  }

  const handleAdminClick = () => {
    router.push('/admin')
  }

  const handlePartnerDashboardClick = () => {
    router.push('/partner/dashboard')
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Airbcar
              </span>
            </Link>
          </div>
          
          {/* Navigation - Center */}
          <nav className="hidden md:flex space-x-6">
            <button 
              onClick={handleBecomePartnerClick}
              className="px-3 py-2 text-gray-700 hover:text-orange-600 font-medium text-sm transition-colors duration-200 rounded-md"
            >
              Become a Partner
            </button>
            <a onClick={() => router.push('/mission')} className="px-3 py-2 text-gray-700 hover:text-orange-600 font-medium text-sm transition-colors duration-200 rounded-md">
              Our mission
            </a>
            {user && (
              <button 
                onClick={handleMyBookingsClick}
                className="px-3 py-2 text-gray-700 hover:text-orange-600 font-medium text-sm transition-colors duration-200 rounded-md"
              >
                My Bookings
              </button>
            )}
            {isAdmin && (
              <button 
                onClick={handleAdminClick}
                className="px-3 py-2 text-red-600 hover:text-red-700 font-medium text-sm transition-colors duration-200 hover:bg-red-50 rounded-md flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Admin</span>
              </button>
            )}
            {isPartner && (
              <button 
                onClick={handlePartnerDashboardClick}
                className="px-3 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 hover:bg-blue-50 rounded-md flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Partner</span>
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
          
          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Heart icon for favorites */}
            {user && (
              <button 
                onClick={() => router.push('/favorites')}
                className="relative w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-300 rounded-full flex items-center justify-center hover:from-orange-200 hover:to-orange-300 hover:border-orange-400 transition-all duration-200 group shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 text-orange-600 group-hover:text-orange-700 transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            )}
            
            {/* Authentication */}
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="hidden md:block w-20 h-4 bg-gray-200 animate-pulse rounded-md"></div>
              </div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200 shadow-sm hover:shadow-md"
                >
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={user.first_name || 'User'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-orange-300 hover:border-orange-400 transition-all duration-200 shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-2 border-orange-300 hover:border-orange-400 transition-all duration-200 shadow-md hover:shadow-lg">
                      <span className="text-white text-sm font-semibold">
                        {user.first_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="hidden md:flex items-center space-x-2">
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-32">
                        {user.email}
                      </p>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'User'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <button 
                        onClick={() => router.push('/account')}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors duration-150">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="font-medium">Profile</span>
                      </button>
                      <button 
                        onClick={() => router.push('/your-bookings')}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors duration-150">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <span className="font-medium">My Bookings</span>
                      </button>
                      <button 
                        onClick={() => router.push('/favorites')}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors duration-150">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <span className="font-medium">Favorites</span>
                      </button>
                        <button 
                        onClick={() => router.push('/price-alerts')}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors duration-150">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 6v12a1.5 1.5 0 01-1.5 1.5h-15z" />
                          </svg>
                        </div>
                        <span className="font-medium">Price Alerts</span>
                      </button>
                      {isPartner && (
                        <button 
                          onClick={handlePartnerDashboardClick}
                          className="flex items-center w-full px-4 py-3 text-sm text-blue-700 hover:bg-blue-50 transition-colors duration-150 group"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-150">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <span className="font-medium">Partner Dashboard</span>
                        </button>
                      )}
                      {isAdmin && (
                        <button 
                          onClick={handleAdminClick}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-700 hover:bg-red-50 transition-colors duration-150 group"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors duration-150">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <span className="font-medium">Admin Dashboard</span>
                        </button>
                      )}
                    </div>
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 group"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors duration-150">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <span className="font-medium">Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-xl">
          <div className="max-w-sm mx-auto px-4 py-4">
            {/* User Profile Section for Mobile */}
            {user && (
              <div className="flex items-center space-x-3 p-4 mb-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={user.first_name || 'User'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-300"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-2 border-orange-300">
                    <span className="text-white font-semibold">
                      {user.first_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'User'}
                  </p>
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <div className="space-y-2 mb-6">
              <button 
                onClick={() => {
                  handleBecomePartnerClick()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:text-orange-600 font-medium text-base transition-all duration-200 hover:bg-orange-50 rounded-xl group"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span>Become a Partner</span>
              </button>

              {user && (
                <>
                  <button 
                    onClick={() => {
                      router.push('/your-bookings')
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:text-orange-600 font-medium text-base transition-all duration-200 hover:bg-orange-50 rounded-xl group"
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span>My Bookings</span>
                  </button>

                  <button 
                    onClick={() => {
                      router.push('/favorites')
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:text-orange-600 font-medium text-base transition-all duration-200 hover:bg-orange-50 rounded-xl group"
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <span>Favorites</span>
                  </button>

                  <button 
                    onClick={() => {
                      router.push('/price-alerts')
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:text-orange-600 font-medium text-base transition-all duration-200 hover:bg-orange-50 rounded-xl group"
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 6v12a1.5 1.5 0 01-1.5 1.5h-15z" />
                      </svg>
                    </div>
                    <span>Price Alerts</span>
                  </button>
                </>
              )}

              {/* Special Role Buttons */}
              {isAdmin && (
                <button 
                  onClick={() => {
                    handleAdminClick()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center w-full px-4 py-3 text-red-600 hover:text-red-700 font-medium text-base transition-all duration-200 hover:bg-red-50 rounded-xl group"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors duration-200">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span>Admin Dashboard</span>
                </button>
              )}

              {isPartner && (
                <button 
                  onClick={() => {
                    handlePartnerDashboardClick()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center w-full px-4 py-3 text-blue-600 hover:text-blue-700 font-medium text-base transition-all duration-200 hover:bg-blue-50 rounded-xl group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-200">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span>Partner Dashboard</span>
                </button>
              )}
            </div>

            {/* Authentication Section */}
            {!user && (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <Link
                  href="/auth/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 text-gray-700 hover:text-gray-900 font-medium text-base transition-all duration-200 hover:bg-gray-50 rounded-xl border border-gray-200"
                >
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Sign up
                </Link>
              </div>
            )}

            {/* Sign Out for Mobile */}
            {user && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center w-full px-4 py-3 text-red-600 hover:text-red-700 font-medium text-base transition-all duration-200 hover:bg-red-50 rounded-xl group"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors duration-200">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop for dropdowns */}
      {(isDropdownOpen || isRegionalSettingsOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsDropdownOpen(false)
            setIsRegionalSettingsOpen(false)
            setIsMobileMenuOpen(false)
          }}
        ></div>
      )}
    </header>
  );
}
