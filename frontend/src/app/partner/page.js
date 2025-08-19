'use client';

import { useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './partner-styles.css';
// Removed unused import

export default function BecomePartner() {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    vehicleCount: '',
    agreeToTerms: false
  });

  const testimonialsRef = useRef(null);

  const scrollLeft = () => {
    if (testimonialsRef.current) {
      testimonialsRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (testimonialsRef.current) {
      testimonialsRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative text-white py-20 lg:py-32 overflow-hidden" style={{
        backgroundImage: 'url(/bg_image.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        
        {/* Animated Background Pattern - Updated for orange theme */}
        {/* <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-orange-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-red-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-40 right-1/3 w-12 h-12 bg-amber-400 rounded-full animate-pulse"></div>
        </div> */}
        
        {/* Background image overlay */}
        <div 
          className="absolute inset-0 opacity-15 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/bg_image.png')`,
            mixBlendMode: 'overlay'
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-left">
              <div className="inline-flex items-center px-4 py-2 bg-yellow-400 bg-opacity-20 rounded-full text-yellow-300 text-sm font-medium mb-4" style={{ color: '#ffffff' }}>
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                #1 Vehicle Rental Platform
              </div>

              <h3 className="text-4xl lg:text-6xl font-bold leading-tight" style={{ fontSize: '45px' }}>
                Put your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">vehicle</span> in<br />
                front of <span className="text-yellow-400 animate-pulse">2700+</span> visitors<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">every day</span>
              </h3>
              
              {/* Feature List */}
              <div className="space-y-5 text-lg">
                <div className="flex items-center space-x-4 group hover:bg-white hover:bg-opacity-10 rounded-lg p-3 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-200 group-hover:text-white transition-colors duration-300">It's <span className="font-bold text-green-400">100% free</span> to list your motorbikes online.</span>
                </div>
                <div className="flex items-center space-x-4 group hover:bg-white hover:bg-opacity-10 rounded-lg p-3 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <span className="text-gray-200 group-hover:text-white transition-colors duration-300">You set your <span className="font-bold text-purple-400">own prices</span>, control your business.</span>
                </div>
                <div className="flex items-center space-x-4 group hover:bg-white hover:bg-opacity-10 rounded-lg p-3 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="text-gray-200 group-hover:text-white transition-colors duration-300">Manage <span className="font-bold text-pink-400">online & offline</span> bookings seamlessly.</span>
                </div>
                <div className="flex items-center space-x-4 group hover:bg-white hover:bg-opacity-10 rounded-lg p-3 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-gray-200 group-hover:text-white transition-colors duration-300"><span className="font-bold text-yellow-400">Advanced analytics</span> & earnings dashboard.</span>
                </div>
                <div className="flex items-center space-x-4 group hover:bg-white hover:bg-opacity-10 rounded-lg p-3 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-200 group-hover:text-white transition-colors duration-300"><span className="font-bold text-red-400">24/7 premium support</span> by phone, email, or chat.</span>
                </div>
              </div>

              <div className="pt-6 px-4 py-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="font-bold text-white">100% Transparent</span>
                </div>
                <p className="text-sm text-green-100">
                  No subscriptions or hidden fees, ever.<br />
                  You only pay <span className="font-bold text-white">15% commission</span> on successful rentals from our platform.
                </p>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="relative animate-fade-in-right">
              <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Join AirbCar Partner Network</h3>
                  <p className="text-gray-600">Start earning from your motorbike fleet today</p>
                  
                  <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Free Setup
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      2-min Process
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Instant Approval
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="relative">
                    <input
                      type="text"
                      name="businessName"
                      placeholder="Business Name"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="Business Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="WhatsApp Number (+91 98765 43210)"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <select 
                    name="vehicleCount"
                    value={formData.vehicleCount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white appearance-none"
                    required
                  >
                    <option value="">How many vehicles do you have?</option>
                    <option value="1-5">1-5 vehicles (Perfect for starters)</option>
                    <option value="6-20">6-20 vehicles (Growing business)</option>
                    <option value="21-50">21-50 vehicles (Established fleet)</option>
                    <option value="50+">50+ vehicles (Enterprise partner)</option>
                  </select>
                  
                  <div className="flex items-start space-x-3 pt-2">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
                      required
                    />
                    <label className="text-sm text-gray-600 leading-relaxed">
                      I agree to AirbCar's <span className="text-blue-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>. I consent to receive marketing communications.
                    </label>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                  >
                    <span>START EARNING TODAY - FREE</span>
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Quick approval in 24 hours • Start earning immediately • Secure & trusted platform
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Everything you need to grow your business */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to grow your business
            </h2>
            <p className="text-xl text-gray-600">
              Professional tools designed specifically for motorbike rental businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Instant Search",
                description: "Customers can instantly find and book your motorcycles"
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "World-class support",
                description: "Get support in multiple languages around the clock"
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Smart calculator",
                description: "Calculate your earnings and optimize your pricing"
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                title: "Reservation Management",
                description: "Manage bookings online and offline seamlessly"
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Analytics Dashboard",
                description: "Track your performance with detailed insights"
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                ),
                title: "Dynamic Pricing",
                description: "Automatically optimize your rates for maximum revenue"
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Multiple Locations",
                description: "Manage multiple rental locations from one dashboard"
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Quality Assurance",
                description: "We verify all bookings and provide customer support"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join the Success Story</h2>
            <p className="text-xl text-gray-600">Real numbers from our thriving partner network</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "2,700+", label: "Daily visitors", color: "from-blue-500 to-cyan-500", icon: "👥" },
              { number: "80K+", label: "Monthly bookings", color: "from-green-500 to-emerald-500", icon: "📅" },
              { number: "10K+", label: "Active partners", color: "from-purple-500 to-pink-500", icon: "🤝" },
              { number: "98%", label: "Customer satisfaction", color: "from-orange-500 to-red-500", icon: "⭐" }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 card-hover">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent stat-pulse mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
                  <div className={`h-1 w-20 mx-auto mt-4 rounded-full bg-gradient-to-r ${stat.color}`}></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Trust badges */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-8">Trusted by leading motorcycle rental businesses worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="bg-gray-200 px-6 py-3 rounded-lg">Partner Logo 1</div>
              <div className="bg-gray-200 px-6 py-3 rounded-lg">Partner Logo 2</div>
              <div className="bg-gray-200 px-6 py-3 rounded-lg">Partner Logo 3</div>
              <div className="bg-gray-200 px-6 py-3 rounded-lg">Partner Logo 4</div>
            </div>
          </div>
        </div>
      </section>

      {/* How does it work? */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How does it work?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our motorcycle rental network in 4 simple steps and start earning within 24 hours.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 text-center mb-12 leading-relaxed bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
              🚀 <strong>Quick Setup Process:</strong> Upload your motorcycle fleet, set competitive prices on our partner portal. 
              List motorcycles individually or in batches, then we verify your vehicle details and business 
              credentials through our secure verification process.
            </p>

            {/* Process Steps with Enhanced Images */}
            <div className="space-y-20">
              {/* Step 1 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 animate-fade-in-up">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      1
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Set your prices & upload fleet</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    📋 <strong>Easy Fleet Management:</strong> Choose competitive rental rates for your motorbikes and list them on our platform!
                    <br /><br />
                    💰 Set dynamic pricing for different motorcycle categories, get recommended pricing based on market analysis, 
                    and optimize your rates to maximize bookings and revenue goals.
                  </p>
                  <div className="flex space-x-4 pt-4">
                    <div className="flex items-center text-green-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Free listing
                    </div>
                    <div className="flex items-center text-green-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Bulk upload
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl h-80 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-10"></div>
                  
                  {/* Dashboard Mockup */}
                  <div className="p-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="bg-white rounded-lg p-3 mb-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <span className="text-sm font-semibold text-gray-800">AirbCar Partner</span>
                        </div>
                        <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Vehicle Cards */}
                    <div className="space-y-3 flex-1">
                      <div className="bg-white rounded-lg p-3 shadow-sm flex items-center space-x-3">
                        <div className="w-12 h-8 bg-gray-300 rounded"></div>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 bg-blue-200 rounded w-3/4"></div>
                        </div>
                        <div className="text-xs font-bold text-green-600">₹500/day</div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 shadow-sm flex items-center space-x-3">
                        <div className="w-12 h-8 bg-gray-300 rounded"></div>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 bg-purple-200 rounded w-2/3"></div>
                        </div>
                        <div className="text-xs font-bold text-green-600">₹750/day</div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 shadow-sm flex items-center space-x-3">
                        <div className="w-12 h-8 bg-gray-300 rounded"></div>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 bg-orange-200 rounded w-1/2"></div>
                        </div>
                        <div className="text-xs font-bold text-green-600">₹600/day</div>
                      </div>
                    </div>
                    
                    {/* Add Button */}
                    <div className="bg-blue-500 rounded-lg p-2 text-center">
                      <span className="text-white text-xs font-semibold">+ Add New Vehicle</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl h-80 md:order-1 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 opacity-10"></div>
                  
                  {/* Booking Interface Mockup */}
                  <div className="p-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="bg-white rounded-lg p-3 mb-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800">New Booking Requests</span>
                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</div>
                      </div>
                    </div>
                    
                    {/* Booking Cards */}
                    <div className="space-y-3 flex-1">
                      <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">RK</span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold">Raj Kumar</div>
                              <div className="text-xs text-gray-500">★★★★★ 4.9</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-600">₹1,500</div>
                            <div className="text-xs text-gray-500">3 days</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-3">Royal Enfield Classic 350 • Aug 15-17</div>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-green-500 text-white text-xs py-2 rounded font-semibold">Accept</button>
                          <button className="flex-1 bg-gray-200 text-gray-700 text-xs py-2 rounded font-semibold">Decline</button>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-orange-500">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-purple-600">AS</span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold">Arjun Singh</div>
                              <div className="text-xs text-gray-500">★★★★☆ 4.2</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-600">₹2,800</div>
                            <div className="text-xs text-gray-500">5 days</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-3">Yamaha R15 V4 • Aug 20-24</div>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-green-500 text-white text-xs py-2 rounded font-semibold">Accept</button>
                          <button className="flex-1 bg-gray-200 text-gray-700 text-xs py-2 rounded font-semibold">Decline</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 md:order-2 animate-fade-in-up">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      2
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Accept or reject bookings</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    ⚡ <strong>Smart Control System:</strong> Review every booking request and choose which ones to accept!
                    <br /><br />
                    📱 Get instant notifications for new booking requests, view detailed customer profiles and reviews, 
                    manage your availability calendar, and maintain full control over your rental business.
                  </p>
                  <div className="flex space-x-4 pt-4">
                    <div className="flex items-center text-green-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Instant notifications
                    </div>
                    <div className="flex items-center text-green-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Full control
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 animate-fade-in-up">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      3
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Customers discover & book</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    🌟 <strong>Maximum Visibility:</strong> Once you're live, customers across our network can find and book your motorcycles!
                    <br /><br />
                    🗺️ We showcase your fleet across 150+ major cities, connect you with thousands of daily visitors, 
                    handle secure payment processing, and provide 24/7 customer support for all bookings.
                  </p>
                  <div className="flex space-x-4 pt-4">
                    <div className="flex items-center text-purple-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Global reach
                    </div>
                    <div className="flex items-center text-purple-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Secure payments
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl h-80 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 opacity-10"></div>
                  
                  {/* Customer Platform Mockup */}
                  <div className="p-6 h-full flex flex-col">
                    {/* Search Header */}
                    <div className="bg-white rounded-lg p-3 mb-4 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 h-6 bg-gray-100 rounded text-xs flex items-center px-2 text-gray-500">
                          Search motorcycles in Mumbai...
                        </div>
                      </div>
                    </div>
                    
                    {/* Motorcycle Listings */}
                    <div className="space-y-3 flex-1">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex space-x-3">
                          <div className="w-16 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold mb-1">Royal Enfield Classic 350</div>
                            <div className="text-xs text-gray-500 mb-1">★★★★★ 4.8 • 250+ rides</div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Available now</span>
                              <span className="text-sm font-bold text-purple-600">₹500/day</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex space-x-3">
                          <div className="w-16 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold mb-1">Yamaha R15 V4</div>
                            <div className="text-xs text-gray-500 mb-1">★★★★☆ 4.6 • 180+ rides</div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Available now</span>
                              <span className="text-sm font-bold text-purple-600">₹750/day</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex space-x-3">
                          <div className="w-16 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold mb-1">Honda CB350RS</div>
                            <div className="text-xs text-gray-500 mb-1">★★★★★ 4.9 • 320+ rides</div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-green-600 font-semibold">Book Now</span>
                              <span className="text-sm font-bold text-purple-600">₹600/day</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl h-80 md:order-1 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 opacity-10"></div>
                  
                  {/* Payment Interface Mockup */}
                  <div className="p-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="bg-white rounded-lg p-3 mb-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800">Instant Payouts</span>
                        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Live</div>
                      </div>
                    </div>
                    
                    {/* Payment Cards */}
                    <div className="space-y-3 flex-1">
                      <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="text-sm font-semibold text-gray-800">Payment Received</div>
                            <div className="text-xs text-gray-500">Booking #ARC-2024-001</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">+₹1,275</div>
                            <div className="text-xs text-gray-500">₹1,500 - 15% fee</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">Royal Enfield Classic 350 • 3 days</div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Just now</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Credited</span>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="text-sm font-semibold text-gray-800">Payment Received</div>
                            <div className="text-xs text-gray-500">Booking #ARC-2024-002</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">+₹2,380</div>
                            <div className="text-xs text-gray-500">₹2,800 - 15% fee</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">Yamaha R15 V4 • 5 days</div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">2 min ago</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Credited</span>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-gray-800">Total Earnings Today</div>
                            <div className="text-xs text-gray-500">2 completed bookings</div>
                          </div>
                          <div className="text-xl font-bold text-orange-600">₹3,655</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 md:order-2 animate-fade-in-up">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      4
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Get paid instantly</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    💸 <strong>Fast & Secure Payments:</strong> Receive automatic confirmations and instant payments for every completed rental!
                    <br /><br />
                    ✅ Both you and customers get immediate email confirmations, payments are processed securely within 24 hours, 
                    and for cancellations, funds are credited immediately to maintain cash flow.
                  </p>
                  <div className="flex space-x-4 pt-4">
                    <div className="flex items-center text-orange-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      24h payouts
                    </div>
                    <div className="flex items-center text-orange-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Auto confirmations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to get started? */}
      <section className="py-20 relative overflow-hidden" style={{
        backgroundImage: 'url(/partner-cta-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/85 via-red-600/80 to-pink-700/85"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-white rounded-full"></div>
          <div className="absolute top-40 right-40 w-16 h-16 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 left-40 w-20 h-20 bg-white rounded-full animate-bounce"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-white text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
            Limited Time: Zero Setup Fees
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">transform</span> your business?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of successful motorbike rental partners earning an average of <strong className="text-yellow-400">₹50,000+ monthly</strong> with AirbCar
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            <button className="bg-white text-blue-600 py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 glow-on-hover flex items-center space-x-2">
              <span>START EARNING TODAY - FREE</span>
            </button>
            <div className="flex items-center text-white">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Or call us: <strong>+91 98765 43210</strong></span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-400">24hrs</div>
              <div className="text-sm opacity-80">Quick Approval</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">₹0</div>
              <div className="text-sm opacity-80">Setup Cost</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">15%</div>
              <div className="text-sm opacity-80">Commission Only</div>
            </div>
          </div>
        </div>
      </section>

      {/* What our partners say */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What our partners say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from successful rental business owners worldwide
            </p>
            <div className="mt-6 flex justify-center items-center space-x-2 text-sm text-gray-500">
              <span>Use scroll buttons or swipe to see more</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>

          {/* Scrollable Testimonials Container */}
          <div className="relative">
            {/* Left Scroll Button */}
            <button 
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-500 group"
            >
              <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Scroll Button */}
            <button 
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-500 group"
            >
              <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div ref={testimonialsRef} className="flex overflow-x-auto space-x-6 pb-6 scrollbar-hide" style={{scrollBehavior: 'smooth'}}>
              {/* Testimonial 1 */}
              <div className="flex-none w-96 bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 text-center mb-6 italic leading-relaxed">
                  "AirbCar transformed my small motorcycle rental business. The platform is incredibly user-friendly and the support team is outstanding. I've increased my revenue by 300% in just 6 months!"
                </blockquote>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                    AR
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Amandee Rajpal</div>
                    <div className="text-gray-600">Pune, India • 25 Motorcycles</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    💰 ₹75,000/month earnings
                  </span>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="flex-none w-96 bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 text-center mb-6 italic leading-relaxed">
                  "The analytics dashboard is amazing! I can track everything in real-time and optimize my pricing. Customer support responds within minutes. Best decision for my rental business."
                </blockquote>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                    RK
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Rajesh Kumar</div>
                    <div className="text-gray-600">Mumbai, India • 40 Motorcycles</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    📈 98% booking rate
                  </span>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="flex-none w-96 bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-center mb-6">
                  {[...Array(4)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <blockquote className="text-lg text-gray-700 text-center mb-6 italic leading-relaxed">
                  "Started with just 3 bikes and now I manage 50+ motorcycles. The booking system is so smooth, and payments are always on time. My customers love the easy booking process!"
                </blockquote>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                    PS
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Priya Sharma</div>
                    <div className="text-gray-600">Delhi, India • 50 Motorcycles</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    🚀 500% growth in 2 years
                  </span>
                </div>
              </div>

              {/* Testimonial 4 */}
              <div className="flex-none w-96 bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 text-center mb-6 italic leading-relaxed">
                  "The customer support is exceptional! They helped me set up everything in just 2 hours. Now I'm earning more than my full-time job. AirbCar changed my life completely!"
                </blockquote>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                    VG
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Vikash Gupta</div>
                    <div className="text-gray-600">Bangalore, India • 15 Motorcycles</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    ⚡ 2-hour setup time
                  </span>
                </div>
              </div>

              {/* Testimonial 5 */}
              <div className="flex-none w-96 bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 text-center mb-6 italic leading-relaxed">
                  "Best platform for motorcycle rentals! The app is so intuitive, and I love how I can manage everything from my phone. My bookings increased by 400% in the first month!"
                </blockquote>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                    AS
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Ankit Singh</div>
                    <div className="text-gray-600">Jaipur, India • 30 Motorcycles</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                    📱 Mobile-first experience
                  </span>
                </div>
              </div>

              {/* Testimonial 6 */}
              <div className="flex-none w-96 bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-center mb-6">
                  {[...Array(4)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <blockquote className="text-lg text-gray-700 text-center mb-6 italic leading-relaxed">
                  "Finally found a platform that actually cares about partners! The commission is fair, payments are instant, and they even help with marketing. Highly recommend to everyone!"
                </blockquote>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                    MS
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Manish Shah</div>
                    <div className="text-gray-600">Ahmedabad, India • 35 Motorcycles</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    💯 Fair commission rates
                  </span>
                </div>
              </div>
            </div>

            {/* Scroll Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-gray-300 rounded-full"></div>
              ))}
            </div>
          </div>

          {/* Partner Success Metrics */}
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Partner Success Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">₹65K</div>
                <div className="text-sm text-gray-600">Average Monthly Earnings</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">87%</div>
                <div className="text-sm text-gray-600">Average Utilization Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">4.8★</div>
                <div className="text-sm text-gray-600">Average Partner Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">24h</div>
                <div className="text-sm text-gray-600">Average Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Statistics */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "98%", label: "Partner Satisfaction", color: "text-green-600" },
              { number: "24/7", label: "Partner Support", color: "text-blue-600" },
              { number: "150+", label: "Major Cities", color: "text-purple-600" },
              { number: "0€", label: "Cost of listing", color: "text-orange-600" }
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
