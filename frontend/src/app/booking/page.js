'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '../components/Header'
import Footer from '../components/Footer'

function BookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const carId = searchParams.get('carId')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Book Car {carId ? `#${carId}` : ''}
          </h1>
          <p className="text-gray-600 mb-6">
            Complete booking functionality will be implemented in the next phase. 
            This includes step-by-step booking process with date selection, driver information, 
            payment processing, and confirmation.
          </p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-orange-800 mb-2">Booking Features Coming Soon:</h3>
            <ul className="text-orange-700 text-sm space-y-1">
              <li>• Date and time selection</li>
              <li>• Driver information form</li>
              <li>• Insurance options</li>
              <li>• Optional extras selection</li>
              <li>• Secure payment processing</li>
              <li>• Booking confirmation</li>
            </ul>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => router.back()}
              className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => router.push('/search')}
              className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  )
}
