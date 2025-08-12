'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [searchForm, setSearchForm] = useState({
    location: '',
    pickupDate: '',
    pickupTime: '',
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
    <>
      <style jsx>{`
        .hero-enter {
          animation: heroEnter 0.8s ease-out forwards;
        }
        
        .hero-title {
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }
        
        .hero-subtitle {
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }
        
        .hero-form {
          animation: fadeInUp 0.8s ease-out 0.6s both;
        }
        
        .form-field {
          transition: all 0.3s ease;
        }
        
        .form-field:hover {
          transform: translateY(-2px);
        }
        
        .search-button {
          transition: all 0.3s ease;
        }
        
        .search-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(249, 115, 22, 0.3);
        }
        
        .stat-item {
          animation: fadeInUp 0.6s ease-out calc(0.8s + var(--delay)) both;
        }
        
        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes heroEnter {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.05);
          }
        }
      `}</style>
      
      <section
        className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen py-20 px-4 relative flex items-center overflow-hidden ${mounted ? 'hero-enter' : ''}`}
        style={{ backgroundImage: 'url(/car-rental-tips.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl floating-element"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl floating-element" style={{animationDelay: '2s'}}></div>
        
        <div className="relative max-w-full mx-auto px-8 z-10">
          {/* Headline */}
          <div className="text-center mb-20">
            <h1 className="hero-title text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight">
              Find the 
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"> best </span>
              car rental 
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent"> deals</span>
            </h1>
            <p className="hero-subtitle text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Discover amazing deals on premium vehicles. Your perfect ride awaits with unbeatable prices and exceptional service.
            </p>
          </div>
          
          {/* Search Form */}
          <div className="hero-form relative">
          <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 max-w-7xl mx-auto shadow-2xl border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Pickup Location */}
              <div className="md:col-span-1 form-field">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  📍 Pickup location
                </label>
                <input
                  type="text"
                  name="location"
                  value={searchForm.location}
                  onChange={handleInputChange}
                  placeholder="City, airport, or location"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white/80 text-gray-800 placeholder-gray-500 font-medium"
                />
              </div>
              
              {/* Pickup Date */}
              <div className="md:col-span-1 form-field">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  📅 Pickup date
                </label>
                <input
                  type="date"
                  name="pickupDate"
                  value={searchForm.pickupDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white/80 text-gray-800 font-medium"
                />
              </div>
              
              {/* Pickup Time */}
              <div className="md:col-span-1 form-field">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  ⏰ Time
                </label>
                <input
                  type="time"
                  name="pickupTime"
                  value={searchForm.pickupTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white/80 text-gray-800 font-medium"
                />
              </div>
              
              {/* Drop-off Date */}
              <div className="md:col-span-1 form-field">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  📅 Drop-off date
                </label>
                <input
                  type="date"
                  name="dropoffDate"
                  value={searchForm.dropoffDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-white/80 text-gray-800 font-medium"
                />
              </div>
              
              {/* Search Button */}
              <div className="md:col-span-1 flex items-end">
                <button type="submit" className="search-button w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300">
                  🔍 Search
                </button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="stat-item" style={{'--delay': '0.1s'}}>
                  <div className="text-2xl font-bold text-orange-600">500+</div>
                  <div className="text-sm text-gray-600 font-medium">Premium Cars</div>
                </div>
                <div className="stat-item" style={{'--delay': '0.2s'}}>
                  <div className="text-2xl font-bold text-orange-600">50+</div>
                  <div className="text-sm text-gray-600 font-medium">Locations</div>
                </div>
                <div className="stat-item" style={{'--delay': '0.3s'}}>
                  <div className="text-2xl font-bold text-orange-600">24/7</div>
                  <div className="text-sm text-gray-600 font-medium">Support</div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
    </>
  );
}