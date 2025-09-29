'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [searchForm, setSearchForm] = useState({
    location: '',
    pickupDate: '',
    dropoffDate: ''
  });
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e) => {
    setSearchForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      location: searchForm.location,
      pickupDate: searchForm.pickupDate,
      dropoffDate: searchForm.dropoffDate
    });
    
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <section className="relative min-h-[700px] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/car-rental-tips.jpg)' }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-20">
        
        {/* Hero Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            Find the 
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"> best </span>
            car rental 
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"> deals</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Discover amazing deals on premium vehicles. Your perfect ride awaits with unbeatable prices and exceptional service.
          </p>
        </div>
        
        {/* Search Form */}
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              
              {/* Pickup Location */}
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📍 Pickup location
                </label>
                <input
                  type="text"
                  name="location"
                  value={searchForm.location}
                  onChange={handleInputChange}
                  placeholder="City, airport, or location"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white text-gray-800 placeholder-gray-500 font-medium"
                />
              </div>
              
              {/* Pickup Date */}
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 Pickup date
                </label>
                <input
                  type="date"
                  name="pickupDate"
                  value={searchForm.pickupDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white text-gray-800 font-medium"
                />
              </div>
              
              {/* Drop-off Date */}
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 Drop-off date
                </label>
                <input
                  type="date"
                  name="dropoffDate"
                  value={searchForm.dropoffDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white text-gray-800 font-medium"
                />
              </div>
              
              {/* Search Button */}
              <div className="md:col-span-1 flex items-end">
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  🔍 Search
                </button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="opacity-0 animate-fade-in" style={{'animationDelay': '0.5s', 'animationFillMode': 'forwards'}}>
                  <div className="text-2xl font-bold text-orange-600">500+</div>
                  <div className="text-sm text-gray-600 font-medium">Premium Cars</div>
                </div>
                <div className="opacity-0 animate-fade-in" style={{'animationDelay': '0.7s', 'animationFillMode': 'forwards'}}>
                  <div className="text-2xl font-bold text-orange-600">50+</div>
                  <div className="text-sm text-gray-600 font-medium">Locations</div>
                </div>
                <div className="opacity-0 animate-fade-in" style={{'animationDelay': '0.9s', 'animationFillMode': 'forwards'}}>
                  <div className="text-2xl font-bold text-orange-600">24/7</div>
                  <div className="text-sm text-gray-600 font-medium">Support</div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </section>
  );
}
