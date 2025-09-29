'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui'
import { APP_NAME } from '@/constants'

export default function Header() {
  const { user, loading, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isRegionalSettingsOpen, setIsRegionalSettingsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [regionalSettings, setRegionalSettings] = useState({
    language: 'English',
    country: 'Morocco',
    currency: 'MAD - DH'
  })

  const pathname = usePathname()
  const router = useRouter()

  // Language and Currency options
  const languageOptions = [
    { code: 'en', name: 'English'},
    { code: 'ar', name: 'العربية'},
    { code: 'fr', name: 'Français'}
  ]

  const currencyOptions = [
    { code: 'MAD', symbol: 'DH', name: 'Dirham' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'Dollar' }
  ]

  // Navigation items
  const navigationItems = [
    { label: 'Search', href: '/search' },
    { label: 'How it Works', href: '/#how-it-works' },
    { label: 'Become a Partner', href: '/partner' },
    { label: 'Mission', href: '/mission' },
  ]

  // Check if user is admin or partner
  useEffect(() => {
    if (user) {
      setIsAdmin(
        user.email === 'admin@airbcar.com' ||
        user.role === 'admin' ||
        user.is_admin === true
      )
    } else {
      setIsAdmin(false)
    }
  }, [user])

  // Load regional settings from localStorage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage')
    const storedCurrency = localStorage.getItem('selectedCurrency')
    
    if (storedLanguage) {
      setRegionalSettings(prev => ({ ...prev, language: storedLanguage }))
    }
    if (storedCurrency) {
      setRegionalSettings(prev => ({ ...prev, currency: storedCurrency }))
    }
  }, [])

  const handleLanguageChange = (language) => {
    setRegionalSettings(prev => ({ ...prev, language: language.name }))
    localStorage.setItem('selectedLanguage', language.name)
    setIsRegionalSettingsOpen(false)
  }

  const handleCurrencyChange = (currency) => {
    const currencyString = `${currency.code} - ${currency.symbol}`
    setRegionalSettings(prev => ({ ...prev, currency: currencyString }))
    localStorage.setItem('selectedCurrency', currencyString)
    setIsRegionalSettingsOpen(false)
  }

  const handleSignOut = () => {
    localStorage.removeItem('isPartnerUser')
    logout()
    setIsDropdownOpen(false)
  }

  const isPartner = user && (
    user.is_partner === true || 
    user.role === 'partner' || 
    pathname.startsWith('/partner')
  )

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Regional Settings */}
            <div className="relative">
              <button
                onClick={() => setIsRegionalSettingsOpen(!isRegionalSettingsOpen)}
                className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
                <span>{regionalSettings.currency}</span>
              </button>
              
              {isRegionalSettingsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-1 z-50">
                  <div className="px-4 py-2 border-b">
                    <h3 className="font-medium text-gray-900">Language</h3>
                    <div className="mt-2 space-y-1">
                      {languageOptions.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang)}
                          className={`block w-full text-left px-2 py-1 text-sm rounded ${
                            regionalSettings.language === lang.name
                              ? 'bg-orange-100 text-orange-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="px-4 py-2">
                    <h3 className="font-medium text-gray-900">Currency</h3>
                    <div className="mt-2 space-y-1">
                      {currencyOptions.map((currency) => (
                        <button
                          key={currency.code}
                          onClick={() => handleCurrencyChange(currency)}
                          className={`block w-full text-left px-2 py-1 text-sm rounded ${
                            regionalSettings.currency.includes(currency.code)
                              ? 'bg-orange-100 text-orange-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {currency.name} ({currency.symbol})
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-medium">
                      {user.first_name?.[0] || user.email?.[0] || 'U'}
                    </span>
                  </div>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Account Settings
                    </Link>
                    
                    <Link
                      href="/bookings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Bookings
                    </Link>

                    {isPartner && (
                      <Link
                        href="/partner/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Partner Dashboard
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-orange-600 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Click outside handler */}
      {(isDropdownOpen || isRegionalSettingsOpen) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setIsDropdownOpen(false)
            setIsRegionalSettingsOpen(false)
          }}
        />
      )}
    </header>
  )
}
