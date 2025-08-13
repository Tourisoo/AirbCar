'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function BookingPage() {
  const router = useRouter()
  const params = useParams()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Book Car #{params.id}</h1>
          <p className="text-gray-600 mb-6">Booking functionality coming soon...</p>
          <button
            onClick={() => router.back()}
            className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
