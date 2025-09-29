'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [searchForm, setSearchForm] = useState({
    location: '',
    pickupDate: '',
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
      dropoffDate: searchForm.dropoffDate
    });
    
    // Navigate to search results page
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <section
      className="bg-slate-800 py-40 px-4 relative h-[800px]" 
      style={{ backgroundImage: 'url(/image_homepage.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-center items-center">
        {/* Headline */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Find the best car rental deals
          </h1>
        </div>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-6xl w-full mx-auto shadow-2xl border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Pickup Location */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Pickup location
              </label>
              <input
                type="text"
                name="location"
                value={searchForm.location}
                onChange={handleInputChange}
                placeholder="City, airport, or location"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                required
              />
            </div>
            
            {/* Pickup Date */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Pickup date
              </label>
              <input
                type="date"
                name="pickupDate"
                value={searchForm.pickupDate}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 text-gray-700"
                required
              />
            </div>
            
            {/* Drop-off Date */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Drop-off date
              </label>
              <input
                type="date"
                name="dropoffDate"
                value={searchForm.dropoffDate}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200 text-gray-700"
                required
              />
            </div>
            
            {/* Search Button */}
            <div className="md:col-span-1 flex items-end">
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Search Cars
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}