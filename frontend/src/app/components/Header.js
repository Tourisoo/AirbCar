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
  const [regionalSettings, setRegionalSettings] = useState({
    language: 'English (United Kingdom)',
    country: 'Belgium',
    currency: 'EUR - €'
  })
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
    router.push('/bookings')
  }

  const handleAdminClick = () => {
    router.push('/admin')
  }

  const handlePartnerDashboardClick = () => {
    router.push('/partner/dashboard')
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-lg font-bold text-gray-900">
              Airbcar
            </Link>
          </div>
          
          {/* Navigation - Center */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={handleBecomePartnerClick}
              className="text-gray-700 hover:text-gray-900 font-medium text-sm underline"
            >
              Become a Partner
            </button>
            <a href="#mission" className="text-gray-700 hover:text-gray-900 font-medium text-sm underline">
              Our mission
            </a>
            {user && (
              <button 
                onClick={handleMyBookingsClick}
                className="text-gray-700 hover:text-gray-900 font-medium text-sm underline"
              >
                My Bookings
              </button>
            )}
            {isAdmin && (
              <button 
                onClick={handleAdminClick}
                className="text-red-600 hover:text-red-800 font-medium text-sm underline"
              >
                Admin Dashboard
              </button>
            )}
            {isPartner && (
              <button 
                onClick={handlePartnerDashboardClick}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
              >
                Partner Dashboard
              </button>
            )}
          </nav>
          
          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Regional Settings */}
            <div className="relative">
              <button
                onClick={() => setIsRegionalSettingsOpen(!isRegionalSettingsOpen)}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-sm"
              >
                <span>🌍</span>
                <span className="hidden md:block">{regionalSettings.currency}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isRegionalSettingsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Regional Settings</p>
                  </div>
                  <div className="px-4 py-2">
                    <p className="text-xs text-gray-500 mb-2">Language</p>
                    <p className="text-sm text-gray-700 mb-3">{regionalSettings.language}</p>
                    
                    <p className="text-xs text-gray-500 mb-2">Country</p>
                    <p className="text-sm text-gray-700 mb-3">{regionalSettings.country}</p>
                    
                    <p className="text-xs text-gray-500 mb-2">Currency</p>
                    <p className="text-sm text-gray-700">{regionalSettings.currency}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Heart icon */}
            {user && (
              <button className="w-10 h-10 bg-white border-2 border-orange-300 rounded-full flex items-center justify-center hover:bg-orange-25 hover:border-orange-400 hover:border-2 group">
                <svg className="w-4 h-4 text-orange-500 group-hover:fill-orange-500 transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            )}
            
            {/* Authentication */}
            {loading ? (
              <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={user.first_name || 'User'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-orange-300 hover:border-orange-400 transition-colors duration-200"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-2 border-orange-300 hover:border-orange-400 transition-colors duration-200">
                      <span className="text-white text-sm font-semibold">
                        {user.first_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="hidden md:flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      {user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email}
                    </span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'User'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={() => router.push('/profile')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </button>
                    <button 
                      onClick={handleMyBookingsClick}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      My Bookings
                    </button>
                    <button 
                      onClick={() => router.push('/settings')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </button>
                    {isPartner && (
                      <button 
                        onClick={handlePartnerDashboardClick}
                        className="flex items-center w-full px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 transition-colors duration-150"
                      >
                        <svg className="w-4 h-4 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Partner Dashboard
                      </button>
                    )}
                    {isAdmin && (
                      <button 
                        onClick={handleAdminClick}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors duration-150"
                      >
                        <svg className="w-4 h-4 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Admin Dashboard
                      </button>
                    )}
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-gray-900 font-medium text-sm"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop for dropdowns */}
      {(isDropdownOpen || isRegionalSettingsOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsDropdownOpen(false)
            setIsRegionalSettingsOpen(false)
          }}
        ></div>
      )}
    </header>
  );
}