'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const benefits = [
    "It's free to list your Vehicle online.",
    "You set your prices, its your business.",
    "Manage online & offline bookings.",
    "Powerful earnings dashboard.",
    "24/7 support by phone, email, or chat."
  ];

  return (
    <section 
      className="relative bg-cover bg-center min-h-screen flex items-center py-20"
      style={{
        backgroundImage: "url('https://cdn.riderly.com/storage/static/img/custom/hero-banner-2.jpg')"
      }}
    >
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-wrap items-center text-white">
          {/* Left Content */}
          <div className={`w-full lg:w-7/12 mb-8 lg:mb-0 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Put your motorbikes in front of{' '}
              <span className="text-yellow-400">2700+</span>{' '}
              visitors every day
            </h1>
            <div className="mb-6">
              <span className="inline-block bg-yellow-400 text-black rounded-full px-6 py-3 text-lg font-semibold">
                📍 List your rental motorbikes on Riderly for free
              </span>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">82</div>
                <div className="text-sm opacity-90">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">2,500+</div>
                <div className="text-sm opacity-90">Rental Bikes</div>
              </div>
              <div className="text-center col-span-2 md:col-span-1">
                <div className="text-2xl font-bold text-yellow-400">100%</div>
                <div className="text-sm opacity-90">Free to Start</div>
              </div>
            </div>
          </div>

          {/* Right Content - Signup Card */}
          <div className={`w-full lg:w-5/12 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-white rounded-2xl shadow-2xl mb-4 p-6 lg:p-8 backdrop-blur-sm bg-white/95">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Join Riderly Today
              </h3>
              
              <ul className="list-none mb-6 space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className={`flex items-start transition-all duration-500 delay-${(index + 1) * 100} ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}>
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <i className="fas fa-check text-green-600 text-sm"></i>
                    </div>
                    <span className="text-gray-700 leading-relaxed">
                      <strong>{benefit.split(' ')[0]}{benefit.split(' ')[1] ? ' ' + benefit.split(' ')[1] : ''}</strong>
                      {benefit.split(' ').slice(benefit.split(' ')[1] ? 2 : 1).join(' ')}
                    </span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/accounts/signup/business/"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl block text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                🚀 Get Started for Free
              </Link>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  <i className="fas fa-shield-alt text-green-500 mr-1"></i>
                  No subscriptions or hidden fees, ever.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  You only pay commission on rentals from us.
                </p>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="text-center text-white">
              <div className="flex justify-center items-center space-x-4 text-sm opacity-90">
                <span className="flex items-center">
                  <i className="fas fa-star text-yellow-400 mr-1"></i>
                  4.8/5 Rating
                </span>
                <span className="flex items-center">
                  <i className="fas fa-users text-blue-400 mr-1"></i>
                  10k+ Partners
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block">
        <a href="#how-it-works" className="text-white hover:text-yellow-400 transition-colors">
          <div className="animate-bounce">
            <i className="fas fa-chevron-down text-2xl"></i>
          </div>
        </a>
      </div>
    </section>
  );
}
