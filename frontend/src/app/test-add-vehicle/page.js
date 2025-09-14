'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createListing } from '@/hooks/useListYourVehicle'

export default function TestAddVehicle() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  // Sample vehicle data for testing
  const sampleVehicleData = {
    brand: 'Toyota',
    model: 'Camry',
    year: '2020',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: '5',
    condition: 'Excellent',
    features: ['GPS Navigation', 'Bluetooth Connectivity', 'USB Charging Port'],
    description: 'A well-maintained Toyota Camry perfect for city driving and long trips.',
    dailyRate: '500',
    location: 'Casablanca'
  }

  const testAddVehicle = async () => {
    if (!user) {
      setError('Please sign in first')
      return
    }

    if (!user.is_partner) {
      setError('You need to register as a partner first')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const listingResult = await createListing(sampleVehicleData)
      setResult(listingResult)
      console.log('Vehicle added successfully:', listingResult)
    } catch (err) {
      setError(err.message)
      console.error('Error adding vehicle:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Add Vehicle Integration</h1>
          
          {/* User Status */}
          <div className="mb-8 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">User Status</h2>
            {user ? (
              <div>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Is Partner:</strong> {user.is_partner ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Is Verified:</strong> {user.is_verified ? '✅ Yes' : '❌ No'}</p>
              </div>
            ) : (
              <p className="text-red-600">❌ Not signed in</p>
            )}
          </div>

          {/* Sample Data */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Sample Vehicle Data</h2>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(sampleVehicleData, null, 2)}
            </pre>
          </div>

          {/* Test Button */}
          <div className="mb-8">
            <button
              onClick={testAddVehicle}
              disabled={isLoading || !user}
              className={`px-6 py-3 rounded-lg font-semibold ${
                isLoading || !user
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Adding Vehicle...' : 'Test Add Vehicle'}
            </button>
          </div>

          {/* Results */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {result && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Success! Vehicle Added</h3>
              <pre className="text-sm overflow-x-auto text-green-700">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {/* Backend Status */}
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Backend Connection</h2>
            <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_DJANGO_API_URL || 'http://localhost:8000'}</p>
            <p><strong>Token:</strong> {typeof window !== 'undefined' && localStorage.getItem('access_token') ? '✅ Present' : '❌ Missing'}</p>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Make sure the Django backend is running on <code>http://localhost:8000</code></li>
              <li>Sign in as a user</li>
              <li>Register as a partner at <code>/partner</code></li>
              <li>Come back here and test adding a vehicle</li>
              <li>Check the partner dashboard to see your vehicle listed</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
