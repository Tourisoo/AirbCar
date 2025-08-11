'use client';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section
      className="bg-slate-800 py-20 px-4 relative"
      style={{ backgroundImage: 'url(/background.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative max-w-7xl mx-auto">
        {/* Headline */}
        <div 
          className="text-center mb-12"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out'
          }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Find the best car rental deals
          </h1>
        </div>
        
        {/* Search Form */}
        <div 
          className="bg-orange-500 rounded-lg p-6 max-w-6xl mx-auto"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 0.8s ease-out 0.3s'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Pickup Location */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-white mb-2">
                Pickup location
              </label>
              <input
                type="text"
                placeholder="City, airport, or location"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all duration-300"
              />
            </div>
            
            {/* Pickup Date */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-white mb-2">
                Pickup date
              </label>
              <input
                type="date"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all duration-300"
              />
            </div>
            
            {/* Pickup Time */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-white mb-2">
                Time
              </label>
              <input
                type="time"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all duration-300"
              />
            </div>
            
            {/* Drop-off Date */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-white mb-2">
                Drop-off date
              </label>
              <input
                type="date"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all duration-300"
              />
            </div>
            
            {/* Search Button */}
            <div className="md:col-span-1 flex items-end">
              <button className="w-full bg-black text-white py-3 px-6 rounded-md font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}