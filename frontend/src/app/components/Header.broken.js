'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import z from 'zod'

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
  const isPartnerDashboard = pathname === '/partner/dashboard'
  const dropdownRef = useRef(null)
  
  // Check if user is a partner based on user properties or if they've been to partner dashboard
  const isPartner = user && (
    user.is_partner === true || 
    user.role === 'partner' || 
    user.userType === 'partner' ||
    isPartnerUser // Persistent partner status
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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

  // Debug logging
  useEffect(() => {
    console.log('Dropdown state changed:', isDropdownOpen)
  }, [isDropdownOpen])

  // Debug logging
  useEffect(() => {
    if (user) {
      console.log('User object:', user)
      console.log('Is partner dashboard:', isPartnerDashboard)
      console.log('Is partner user (stored):', isPartnerUser)
      console.log('Is partner (final):', isPartner)
    }
  }, [user, isPartnerDashboard, isPartnerUser, isPartner])

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      setIsAdmin(false)
      return
    }

    const checkAdminStatus = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'
        const token = localStorage.getItem('access_token')
        
        if (!token) {
          setIsAdmin(false)
          return
        }

        const response = await fetch(`${apiUrl}/api/verify-token/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const userData = await response.json()
          setIsAdmin(userData.is_staff === true || userData.is_superuser === true)
        } else {
          setIsAdmin(false)
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      }
    }

    checkAdminStatus()
  }, [user])

  const handleSignOut = () => {
    logout()
    setIsDropdownOpen(false)
    // Clear partner status on logout
    setIsPartnerUser(false)
    localStorage.removeItem('isPartnerUser')
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
            <Link href="/partner" className="text-gray-700 hover:text-gray-900 font-medium text-sm underline">
              Become a Partner
            </Link>
            <Link href="/mission" className="text-gray-700 hover:text-gray-900 font-medium text-sm underline">
              Our mission
            </Link>
            {user && !isAdmin && (
              <Link href="/account?section=bookings" className="text-gray-700 hover:text-gray-900 font-medium text-sm underline">
                My Bookings
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="text-gray-700 hover:text-gray-900 font-medium text-sm underline">
                Admin Dashboard
              </Link>
            )}
          </nav>
          
          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Regional Settings Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsRegionalSettingsOpen(!isRegionalSettingsOpen)}
                className="w-10 h-10 bg-white border-2 border-orange-300 rounded-full flex items-center justify-center hover:bg-orange-50 hover:border-orange-400 transition-colors duration-200 group"
              >
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {isRegionalSettingsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-4"
                 style={{zIndex: 9998}}
                 >
                  {/* Header */}
                  <div className="px-4 pb-3 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Regional settings</h3>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-4">
                    {/* Language Section */}
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                          </svg>
                        </div>
                        <label className="text-sm font-medium text-gray-900">Language</label>
                      </div>
                      <select 
                        value={regionalSettings.language}
                        onChange={(e) => setRegionalSettings({...regionalSettings, language: e.target.value})}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
                      >
                        <option>English (United Kingdom)</option>
                        <option>English (United States)</option>
                        <option>French</option>
                        <option>Spanish</option>
                        <option>German</option>
                      </select>
                    </div>

                    {/* Country/Region Section */}
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <label className="text-sm font-medium text-gray-900">Country / Region</label>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        Selecting the country you're in will give you local deals and information.
                      </p>
                      <select 
                        value={regionalSettings.country}
                        onChange={(e) => setRegionalSettings({...regionalSettings, country: e.target.value})}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
                      >
                        <option>Belgium</option>
                        <option>France</option>
                        <option>Germany</option>
                        <option>Netherlands</option>
                        <option>United Kingdom</option>
                        <option>United States</option>
                      </select>
                    </div>

                    {/* Currency Section */}
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <label className="text-sm font-medium text-gray-900">Currency</label>
                      </div>
                      <select 
                        value={regionalSettings.currency}
                        onChange={(e) => setRegionalSettings({...regionalSettings, currency: e.target.value})}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
                      >
                        <option>EUR - €</option>
                        <option>USD - $</option>
                        <option>GBP - £</option>
                        <option>JPY - ¥</option>
                      </select>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 pt-3 border-t border-gray-100 space-y-2">
                    <button
                      onClick={() => {
                        console.log('Saving regional settings:', regionalSettings)
                        setIsRegionalSettingsOpen(false)
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsRegionalSettingsOpen(false)}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Heart icon */}
            {user && (
              <Link href="/account?section=favorites" className="w-10 h-10 bg-white border-2 border-orange-300 rounded-full flex items-center justify-center hover:bg-orange-25 hover:border-orange-400 hover:border-2 group">
                <svg className="w-4 h-4 text-orange-500 group-hover:fill-orange-500 transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </Link>
            )}
            
            {/* Authentication */}
            {loading ? (
              <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    console.log('Button clicked! Current dropdown state:', isDropdownOpen)
                    setIsDropdownOpen(prev => {
                      console.log('Setting dropdown from', prev, 'to', !prev)
                      return !prev
                    })
                  }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-300"
                >
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.username || 'User'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-orange-300"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-2 border-orange-300">
                      <span className="text-white text-sm font-semibold">
                        {user.username?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="hidden md:flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      {user.username || user.email}
                    </span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Simple test dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4">
                      <p className="text-sm text-gray-700 font-medium">{user.username || 'User'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <hr className="border-gray-100" />
                    <div className="py-1">
                      <Link 
                        href="/account" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link 
                        href="/account?section=favorites" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Favorites
                      </Link>
                      <button 
                        onClick={() => {
                          logout()
                          setIsDropdownOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.username || 'User'}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    <Link href="/account" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    
                    {/* My Bookings - shown for both normal users and partners */}
                    {isPartner ? (
                      isPartnerDashboard ? (
                        <button 
                          onClick={() => {
                            setIsDropdownOpen(false)
                            window.dispatchEvent(new CustomEvent('switchTab', { detail: 'bookings' }))
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          My Bookings
                        </button>
                      ) : (
                        <Link href="/partner/dashboard?tab=bookings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          My Bookings
                        </Link>
                      )
                    ) : (
                      <Link href="/account?section=bookings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Bookings
                      </Link>
                    )}
                    
                    {/* Partner-only menu items */}
                    {isPartner && (
                      <>
                        {isPartnerDashboard ? (
                          <button 
                            onClick={() => {
                              setIsDropdownOpen(false)
                              window.dispatchEvent(new CustomEvent('switchTab', { detail: 'bookings' }))
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Reservations
                          </button>
                        ) : (
                          <Link href="/partner/dashboard?tab=bookings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Reservations
                          </Link>
                        )}
                        
                        {isPartnerDashboard ? (
                          <button 
                            onClick={() => {
                              setIsDropdownOpen(false)
                              window.dispatchEvent(new CustomEvent('switchTab', { detail: 'earnings' }))
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            Earnings
                          </button>
                        ) : (
                          <Link href="/partner/dashboard?tab=earnings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            Earnings
                          </Link>
                        )}
                        
                        {isPartnerDashboard ? (
                          <button 
                            onClick={() => {
                              setIsDropdownOpen(false)
                              window.dispatchEvent(new CustomEvent('openAddVehicle'))
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create New Listing
                          </button>
                        ) : (
                          <Link href="/partner/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create New Listing
                          </Link>
                        )}
                      </>
                    )}
                    
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <Link href="/account" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Account Settings
                    </Link>
                    
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