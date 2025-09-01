'use client'

import Link from 'next/link'

export default function SmartAuthDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-500 mb-4">Airbcar</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Smart Authentication System</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everyone signs in through the same simple page, but gets automatically redirected to their appropriate dashboard based on their role.
          </p>
        </div>

        {/* Main Auth Card */}
        <div className="max-w-md mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-orange-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Universal Sign In</h3>
              <p className="text-gray-600 mb-6">One page for all users - we'll take you where you need to go</p>
              
              <div className="space-y-3">
                <Link 
                  href="/auth/signin"
                  className="block w-full py-3 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup"
                  className="block w-full py-3 px-4 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            🧠 How Smart Redirection Works
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admin Flow */}
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Admin Users</h4>
              <p className="text-sm text-gray-600 mb-2">if <code className="bg-gray-100 px-1 rounded">is_staff</code> or <code className="bg-gray-100 px-1 rounded">is_superuser</code></p>
              <div className="flex items-center justify-center text-sm text-purple-600">
                <span>→ Admin Dashboard</span>
              </div>
            </div>

            {/* Partner Flow */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Partner Users</h4>
              <p className="text-sm text-gray-600 mb-2">if <code className="bg-gray-100 px-1 rounded">is_partner</code> or <code className="bg-gray-100 px-1 rounded">role = 'partner'</code></p>
              <div className="flex items-center justify-center text-sm text-green-600">
                <span>→ Partner Dashboard</span>
              </div>
            </div>

            {/* Regular User Flow */}
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Regular Users</h4>
              <p className="text-sm text-gray-600 mb-2">Default role: <code className="bg-gray-100 px-1 rounded">'user'</code></p>
              <div className="flex items-center justify-center text-sm text-blue-600">
                <span>→ Home Page</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            ✨ Key Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Simple Interface</h4>
                <p className="text-gray-600 text-sm">Clean, single sign-in page for all users</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Automatic Routing</h4>
                <p className="text-gray-600 text-sm">Smart redirection based on user permissions</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Role-Based Access</h4>
                <p className="text-gray-600 text-sm">Priority-based redirection (Admin {'>'} Partner {'>'} User)</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Legacy Support</h4>
                <p className="text-gray-600 text-sm">Old admin/partner links redirect seamlessly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Main Site */}
        <div className="text-center mt-8">
          <Link 
            href="/"
            className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Main Site
          </Link>
        </div>
      </div>
    </div>
  )
}
