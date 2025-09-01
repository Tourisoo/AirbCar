'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [searchForm, setSearchForm] = useState({
    location: '',
    pickupDate: '',
    pickupTime: '',
    dropoffDate: ''
  });
  const router = useRouter();

  const handleInputChange = (e) => {
    setSearchForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Create search params from form data
    const searchParams = new URLSearchParams({
      location: searchForm.location,
      pickupDate: searchForm.pickupDate,
      pickupTime: searchForm.pickupTime,
      dropoffDate: searchForm.dropoffDate
    });
    
    // Navigate to search results page
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <section
      className="bg-slate-800 py-20 px-4 relative"
      style={{ backgroundImage: 'url(/background.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative max-w-7xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Find the best car rental deals
          </h1>
        </div>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-orange-500 rounded-lg p-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Pickup Location */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-white mb-2">
                Pickup location
              </label>
              <input
                type="text"
                name="location"
                value={searchForm.location}
                onChange={handleInputChange}
                placeholder="City, airport, or location"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
                required
              />
            </div>
            
            {/* Pickup Date */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-white mb-2">
                Pickup date
              </label>
              <input
                type="date"
                name="pickupDate"
                value={searchForm.pickupDate}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
                required
              />
            </div>
            
            {/* Pickup Time */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-white mb-2">
                Time
              </label>
              <input
                type="time"
                name="pickupTime"
                value={searchForm.pickupTime}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
                required
              />
            </div>
            
            {/* Drop-off Date */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-white mb-2">
                Drop-off date
              </label>
              <input
                type="date"
                name="dropoffDate"
                value={searchForm.dropoffDate}
                onChange={handleInputChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600"
                required
              />
            </div>
            
            {/* Search Button */}
            <div className="md:col-span-1 flex items-end">
              <button 
                type="submit"
                className="w-full bg-black text-white py-3 px-6 rounded-md font-semibold hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}