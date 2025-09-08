'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'
import AddVehicleModal from '../components/AddVehicleModal'

export default function PartnerDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false)
  const [vehicles, setVehicles] = useState([])
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeBookings: 0,
    monthlyEarnings: 0,
    averageRating: 0
  })

  // Initial vehicle data structure
  const [vehicleData, setVehicleData] = useState({
    brand: '',
    model: '',
    year: '',
    color: '',
    fuelType: '',
    transmission: '',
    seatingCapacity: '',
    condition: '',
    dailyRate: '',
    weeklyRate: '',
    monthlyRate: '',
    securityDeposit: '',
    location: '',
    description: '',
    features: []
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?redirect=/partner-dashboard')
    }
  }, [user, loading, router])

  const handleAddVehicle = async (data) => {
    try {
      // Here you would normally send data to your backend
      console.log('Adding vehicle:', data)
      
      // Simulate adding vehicle
      const newVehicle = {
        id: Date.now(),
        ...data,
        status: 'active',
        bookings: 0,
        earnings: 0,
        rating: 0,
        createdAt: new Date().toISOString()
      }
      
      setVehicles(prev => [...prev, newVehicle])
      setStats(prev => ({
        ...prev,
        totalVehicles: prev.totalVehicles + 1
      }))
      
      // Reset form data
      setVehicleData({
        brand: '',
        model: '',
        year: '',
        color: '',
        fuelType: '',
        transmission: '',
        seatingCapacity: '',
        condition: '',
        dailyRate: '',
        weeklyRate: '',
        monthlyRate: '',
        securityDeposit: '',
        location: '',
        description: '',
        features: []
      })
      
      alert('Vehicle added successfully!')
    } catch (error) {
      console.error('Error adding vehicle:', error)
      alert('Error adding vehicle. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.username}!</h1>
              <p className="text-orange-100">Ready to manage your vehicle fleet and grow your business?</p>
            </div>
            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m-4 0h2m2 0h4m-5 0v-5a2 2 0 012-2h2a2 2 0 012 2v5" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVehicles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${stats.monthlyEarnings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'vehicles', name: 'My Vehicles', icon: '🚗' },
                { id: 'bookings', name: 'Bookings', icon: '📅' },
                { id: 'earnings', name: 'Earnings', icon: '💰' },
                { id: 'settings', name: 'Settings', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Quick Actions */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowAddVehicleModal(true)}
                        className="w-full bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add New Vehicle</span>
                      </button>
                      <button className="w-full bg-white border border-gray-300 text-gray-700 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        View All Bookings
                      </button>
                      <button className="w-full bg-white border border-gray-300 text-gray-700 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        Download Earnings Report
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">No recent activity</span>
                        <p className="text-xs text-gray-700 mt-1">Add your first vehicle to get started!</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Getting Started Guide */}
                {stats.totalVehicles === 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">🚀 Get Started as a Partner</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-blue-600 font-semibold mb-2">1. Add Your Vehicle</div>
                        <p className="text-sm text-gray-600 mb-3">Upload vehicle details, photos, and set your pricing</p>
                        <button
                          onClick={() => setShowAddVehicleModal(true)}
                          className="text-blue-600 text-sm font-medium hover:text-blue-800"
                        >
                          Add Vehicle →
                        </button>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-blue-600 font-semibold mb-2">2. Get Verified</div>
                        <p className="text-sm text-gray-600 mb-3">Submit required documents for partner verification</p>
                        <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                          Start Verification →
                        </button>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <div className="text-blue-600 font-semibold mb-2">3. Start Earning</div>
                        <p className="text-sm text-gray-700 mb-3">Receive bookings and manage your rental business</p>
                        <button className="text-gray-600 text-sm font-medium cursor-not-allowed">
                          Coming Soon
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Vehicles Tab */}
            {activeTab === 'vehicles' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">My Vehicles</h3>
                  <button
                    onClick={() => setShowAddVehicleModal(true)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Vehicle</span>
                  </button>
                </div>

                {vehicles.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m-4 0h2m2 0h4m-5 0v-5a2 2 0 012-2h2a2 2 0 012 2v5" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles yet</h3>
                    <p className="text-gray-700 mb-4">Start by adding your first vehicle to begin earning</p>
                    <button
                      onClick={() => setShowAddVehicleModal(true)}
                      className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Add Your First Vehicle
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                      <div key={vehicle.id} className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">{vehicle.brand} {vehicle.model}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            vehicle.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {vehicle.status}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Year:</span>
                            <span>{vehicle.year}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Daily Rate:</span>
                            <span className="font-medium text-green-600">${vehicle.dailyRate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Location:</span>
                            <span>{vehicle.location}</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex space-x-2">
                            <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                              Edit
                            </button>
                            <button className="flex-1 bg-orange-100 text-orange-700 py-2 rounded-lg hover:bg-orange-200 transition-colors text-sm">
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Other tabs content */}
            {activeTab === 'bookings' && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bookings</h3>
                <p className="text-gray-600">Booking management features coming soon</p>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Earnings</h3>
                <p className="text-gray-600">Earnings dashboard coming soon</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Settings</h3>
                <p className="text-gray-600">Account settings coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        showModal={showAddVehicleModal}
        setShowModal={setShowAddVehicleModal}
        vehicleData={vehicleData}
        setVehicleData={setVehicleData}
        onSubmit={handleAddVehicle}
      />
    </div>
  )
}
