"use client";

import { useState, useEffect } from 'react';

export default function TrustSignals() {
  const partners = [
    { name: "United", logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536" },
    { name: "GetAround", logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536" },
    { name: "MOVRIS", logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536" },
    { name: "AIRCAR", logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536" },
    { name: "addCar", logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536" },
    { name: "NORTH Car Rental", logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536" },
    { name: "United", logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536" },
    { name: "GetAround", logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536" },
    { name: "MOVRIS", logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536" },
    { name: "AIRCAR", logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536" },
    { name: "addCar", logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536" },
    { name: "NORTH Car Rental", logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536" },
    { name: "United", logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536" },
    { name: "GetAround", logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536" },
    { name: "MOVRIS", logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536" },
    { name: "AIRCAR", logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536" },
    { name: "addCar", logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536" },
    { name: "NORTH Car Rental", logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemWidth = 96; // 16 (width) + 32 (space-x-8) = 96px per item
  const itemsPerView = 6; // Number of items visible at once
  const totalPages = Math.ceil(partners.length / itemsPerView);

  const scrollLeft = () => {
    const container = document.getElementById('partners-scroll');
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('partners-scroll');
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    const container = document.getElementById('partners-scroll');
    if (container) {
      const scrollLeft = container.scrollLeft;
      const itemWidth = 96; // Width + margin of each item
      const newIndex = Math.round(scrollLeft / (itemWidth * 3)); // 3 items per page approx
      setCurrentIndex(Math.min(newIndex, totalPages - 1));
    }
  };

  useEffect(() => {
    const container = document.getElementById('partners-scroll');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Modern Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Partner Network
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust our verified rental partners worldwide.
          </p>
        </div>

        {/* Modern Partner Grid */}
        <div className="relative">
          {/* Scroll Container */}
          <div 
            id="partners-scroll"
            className="flex overflow-x-auto scrollbar-hide space-x-6 pb-6 px-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {partners.map((partner, index) => (
              <div key={index} className="flex-shrink-0 group">
                
                {/* Modern Card Design */}
                <div className="w-full h-full flex items-center justify-center">
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      className="max-h-22 max-w-20 object-contain opacity-60 group-hover:opacity-90 transition-opacity duration-300 filter grayscale group-hover:grayscale-0" style={{ borderRadius: '12px' }} 
                    />
                </div>
                
                {/* Modern Partner Name */}
                <div className="mt-3 text-center">
                  <span className="text-xs font-semibold text-gray-400 group-hover:text-orange-500 transition-colors duration-300 block max-w-20 truncate">
                    {partner.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Modern Bottom Controls */}
          <div className="flex justify-end items-center mt-6 space-x-4">
            {/* Elegant Indicators */}
            <div className="flex space-x-3">
            </div>

            {/* Modern Navigation Buttons */}
            <div className="flex items-end space-x-6">
              <button 
                onClick={scrollLeft}
                className="group flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-orange-300 hover:text-orange-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Previous</span>
              </button>

              <button 
                onClick={scrollRight}
                className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <span className="font-medium">Next</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
