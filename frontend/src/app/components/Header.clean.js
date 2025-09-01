'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'

export default function Header() {
  const { user, loading, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isRegionalSettingsOpen, setIsRegionalSettingsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = () => {
    logout()
    setIsDropdownOpen(false)
    router.push('/')
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Airbcar</span>
          </Link>

          {/* Right side - Auth and Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Regional Settings */}
            <div className="relative">
              <button 
                onClick={() => setIsRegionalSettingsOpen(!isRegionalSettingsOpen)}
                className="w-10 h-10 bg-white border-2 border-orange-300 rounded-full flex items-center justify-center hover:bg-orange-50 hover:border-orange-400 transition-colors duration-200"
              >
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {isRegionalSettingsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-4"
                     style={{zIndex: 9998}}>
                  <div className="px-4 pb-3 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">Regional settings</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600">Language: English (United Kingdom)</p>
                    <p className="text-sm text-gray-600">Country: Belgium</p>
                    <p className="text-sm text-gray-600">Currency: EUR - €</p>
                  </div>
                </div>
              )}
            </div>

            {/* Heart/Favorites icon */}
            {user && (
              <Link href="/account?section=favorites" 
                    className="w-10 h-10 bg-white border-2 border-orange-300 rounded-full flex items-center justify-center hover:bg-orange-50 hover:border-orange-400 transition-colors duration-200">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </Link>
            )}
            
            {/* Authentication */}
            {loading ? (
              <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => {
                    console.log('Button clicked! Current dropdown state:', isDropdownOpen)
                    setIsDropdownOpen(!isDropdownOpen)
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

                {/* User Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.username || 'User'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
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
                      <Link 
                        href="/account?section=bookings" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        My Bookings
                      </Link>
                      {user.is_partner && (
                        <Link 
                          href="/partner/dashboard" 
                          className="block px-4 py-2 text-sm text-orange-600 hover:bg-orange-50"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Partner Dashboard
                        </Link>
                      )}
                      {(user.is_staff || user.is_superuser) && (
                        <Link 
                          href="/admin" 
                          className="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button 
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
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
    </header>
  )
}
