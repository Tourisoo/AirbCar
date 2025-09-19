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
    // You can add logic here to change the app language
    console.log('Language changed to:', language)
  }

  const handleCurrencyChange = (currency) => {
    const currencyString = `${currency.code} - ${currency.symbol}`
    setRegionalSettings(prev => ({ ...prev, currency: currencyString }))
    localStorage.setItem('selectedCurrency', currencyString)
    // You can add logic here to change the app currency
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
      // Store in localStorage for persistence across sessions
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
    localStorage.removeItem('isPartnerUser') // Clear partner status on logout
  }

  const handleBecomePartnerClick = () => {
    router.push('/partner')
  }

  const handleMyBookingsClick = () => {
    router.push('/account?section=bookings')
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
            {/* Mobile Regional Settings Button */}
            <button
              onClick={() => setIsRegionalSettingsOpen(!isRegionalSettingsOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
            </button>

            {/* Hamburger Menu Button */}
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

            {/* Mobile Regional Settings Dropdown */}
            {isRegionalSettingsOpen && (
              <div className="absolute top-16 right-4 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-3 z-50 animate-fadeIn">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 flex items-center">
                    Regional Settings
                  </p>
                </div>
                <div className="px-4 py-3 space-y-4">
                  {/* Mobile Language Selection */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Language</p>
                    <div className="grid grid-cols-1 gap-2">
                      {languageOptions.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => {
                            handleLanguageChange(language)
                            setIsRegionalSettingsOpen(false)
                          }}
                          className={`flex items-center w-full px-3 py-3 rounded-lg text-sm transition-all duration-200 ${
                            regionalSettings.language === language.name
                              ? 'bg-orange-50 text-orange-700 border border-orange-200'
                              : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                          }`}
                        >
                          <span className="text-xl mr-3">{language.flag}</span>
                          <span className="font-medium text-base">{language.name}</span>
                          {regionalSettings.language === language.name && (
                            <svg className="w-5 h-5 ml-auto text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Mobile Currency Selection */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Currency</p>
                    <div className="grid grid-cols-1 gap-2">
                      {currencyOptions.map((currency) => (
                        <button
                          key={currency.code}
                          onClick={() => {
                            handleCurrencyChange(currency)
                            setIsRegionalSettingsOpen(false)
                          }}
                          className={`flex items-center w-full px-3 py-3 rounded-lg text-sm transition-all duration-200 ${
                            regionalSettings.currency === `${currency.code} - ${currency.symbol}`
                              ? 'bg-orange-50 text-orange-700 border border-orange-200'
                              : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                          }`}
                        >
                          <span className="font-bold text-xl mr-3 text-gray-600">{currency.symbol}</span>
                          <div className="flex flex-col items-start">
                            <span className="font-medium text-base">{currency.name}</span>
                            <span className="text-xs text-gray-500">({currency.code})</span>
                          </div>
                          {regionalSettings.currency === `${currency.code} - ${currency.symbol}` && (
                            <svg className="w-5 h-5 ml-auto text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Regional Settings */}
            <div className="relative">
              <button
                onClick={() => setIsRegionalSettingsOpen(!isRegionalSettingsOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-200 hover:border-gray-300"
              >
                <span className="text-base">
                  {regionalSettings.language === 'English'
                   ? 'EN'
                   : regionalSettings.language === 'العربية'
                   ? 'AR'
                   : regionalSettings.language === 'Français'
                   ? 'FR'
                   : 'EN'}
                </span>
                <span className="hidden sm:block font-medium">{regionalSettings.currency}</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isRegionalSettingsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isRegionalSettingsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-1 z-50 animate-fadeIn backdrop-blur-sm">
                  <div className="px-4 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Regional Settings</p>
                          <p className="text-xs text-gray-500">Choose your preferences</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsRegionalSettingsOpen(false)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-4 space-y-6">
                    {/* Language Selection */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Language</p>
                      </div>
                      <div className="space-y-1">
                        {languageOptions.map((language) => (
                          <button
                            key={language.code}
                            onClick={() => {
                              handleLanguageChange(language)
                              setIsRegionalSettingsOpen(false)
                            }}
                            className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                              regionalSettings.language === language.name
                                ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border border-orange-200 shadow-sm'
                                : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm'
                            }`}
                          >
                            <span className="text-lg mr-3 transition-transform duration-200 group-hover:scale-110">{language.flag}</span>
                            <span className="font-medium flex-1 text-left">{language.name}</span>
                            {regionalSettings.language === language.name && (
                              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center ml-2">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Currency Selection */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Currency</p>
                      </div>
                      <div className="space-y-1">
                        {currencyOptions.map((currency) => (
                          <button
                            key={currency.code}
                            onClick={() => {
                              handleCurrencyChange(currency)
                              setIsRegionalSettingsOpen(false)
                            }}
                            className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                              regionalSettings.currency === `${currency.code} - ${currency.symbol}`
                                ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border border-orange-200 shadow-sm'
                                : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-center flex-1">
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors duration-200">
                                <span className="font-bold text-sm text-gray-600">{currency.symbol}</span>
                              </div>
                              <div className="flex flex-col items-start">
                                <span className="font-medium text-sm">{currency.name}</span>
                                <span className="text-xs text-gray-500">{currency.code}</span>
                              </div>
                            </div>
                            {regionalSettings.currency === `${currency.code} - ${currency.symbol}` && (
                              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center ml-2">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer with quick actions */}
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">Settings are saved automatically</p>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 font-medium">Synced</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Heart icon */}
            {user && (
              <button 
                onClick={() => router.push('/account?section=favorites')}
                className="relative w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-300 rounded-full flex items-center justify-center hover:from-orange-200 hover:to-orange-300 hover:border-orange-400 transition-all duration-200 group shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 text-orange-600 group-hover:text-orange-700 transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {/* Optional notification badge */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
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
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'User'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <button 
                        onClick={() => router.push('/account?section=account')}
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
                        onClick={() => router.push('/account?section=bookings')}
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
                        onClick={() => router.push('/settings')}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors duration-150">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="font-medium">Settings</span>
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
        <div className="md:hidden bg-white border-t border-gray-200 shadow-xl animate-fadeIn">
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

              <a 
                href="#mission" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:text-orange-600 font-medium text-base transition-all duration-200 hover:bg-orange-50 rounded-xl group"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Our Mission</span>
              </a>

              {user && (
                <>
                  <button 
                    onClick={() => {
                      handleMyBookingsClick()
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
                      router.push('/profile')
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:text-orange-600 font-medium text-base transition-all duration-200 hover:bg-orange-50 rounded-xl group"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors duration-200">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span>Profile</span>
                  </button>

                  <button 
                    onClick={() => {
                      router.push('/settings')
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:text-orange-600 font-medium text-base transition-all duration-200 hover:bg-orange-50 rounded-xl group"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors duration-200">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span>Settings</span>
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