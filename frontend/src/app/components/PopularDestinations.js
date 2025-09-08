'use client';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PopularDestinations() {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const router = useRouter();

  const handleDestinationClick = (destination) => {
    // Navigate to search page with destination pre-filled
    const searchParams = new URLSearchParams({
      location: destination,
      pickupDate: new Date().toISOString().split('T')[0], // Today's date
      pickupTime: '10:00',
      dropoffDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Tomorrow's date
    });
    
    router.push(`/search?${searchParams.toString()}`);
  };

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  const scrollToLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollToRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = 'grab';
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('scroll', checkScrollPosition);

      // Initial check
      checkScrollPosition();

      return () => {
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, [isDragging, startX, scrollLeft]);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Popular Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover Morocco's most beautiful cities and find the perfect rental car for your adventure
          </p>
        </div>

        {/* City Cards Horizontal Scroll */}
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={scrollToLeft}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/95 hover:bg-white shadow-xl rounded-full p-4 transition-all duration-300 hover:scale-110 border border-gray-200"
              aria-label="Scroll left"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={scrollToRight}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white/95 hover:bg-white shadow-xl rounded-full p-4 transition-all duration-300 hover:scale-110 border border-gray-200"
              aria-label="Scroll right"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div 
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide cursor-grab select-none pb-6 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          
          {/* Marrakech Card */}
          <div 
            onClick={() => handleDestinationClick('Marrakech')}
            className="flex-shrink-0 w-80 relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg h-[600px] w-[350px]"
          >
            {/* Background image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-700"
              style={{ 
                backgroundImage: 'url(/cities/marrakesh.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:-translate-y-2">
              <div className="mb-4">
                <h3 className="text-3xl font-bold mb-2 group-hover:text-orange-300 transition-colors duration-300">Marrakech</h3>
                <p className="text-sm font-medium opacity-90 mb-1">Imperial City • Red City</p>
                <p className="text-xs opacity-75">Most popular: Economy Cars</p>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDestinationClick('Marrakech');
                }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full"
              >
                Explore Cars
              </button>
            </div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Agadir Card */}
          <div 
            onClick={() => handleDestinationClick('Agadir')}
            className="flex-shrink-0 w-80 relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg w-[350px]"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-700"
              style={{ 
                backgroundImage: 'url(/cities/agadir.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:-translate-y-2">
              <div className="mb-4">
                <h3 className="text-3xl font-bold mb-2 group-hover:text-orange-300 transition-colors duration-300">Agadir</h3>
                <p className="text-sm font-medium opacity-90 mb-1">Beach Resort • Atlantic Coast</p>
                <p className="text-xs opacity-75">Most popular: SUV & Economy</p>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDestinationClick('Agadir');
                }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full"
              >
                Explore Cars
              </button>
            </div>
            
            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Tangier Card */}
          <div 
            onClick={() => handleDestinationClick('Tangier')}
            className="flex-shrink-0 w-80 relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg w-[350px]"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-700"
              style={{ 
                backgroundImage: 'url(/cities/tangier.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:-translate-y-2">
              <div className="mb-4">
                <h3 className="text-3xl font-bold mb-2 group-hover:text-orange-300 transition-colors duration-300">Tangier</h3>
                <p className="text-sm font-medium opacity-90 mb-1">Gateway to Africa • Mediterranean</p>
                <p className="text-xs opacity-75">Most popular: Compact Cars</p>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDestinationClick('Tangier');
                }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full"
              >
                Explore Cars
              </button>
            </div>
            
            <div className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Casablanca Card */}
          <div 
            onClick={() => handleDestinationClick('Casablanca')}
            className="flex-shrink-0 w-80 relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg w-[350px]"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-700"
              style={{ 
                backgroundImage: 'url(/cities/casablanca.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:-translate-y-2">
              <div className="mb-4">
                <h3 className="text-3xl font-bold mb-2 group-hover:text-orange-300 transition-colors duration-300">Casablanca</h3>
                <p className="text-sm font-medium opacity-90 mb-1">Economic Capital • Modern City</p>
                <p className="text-xs opacity-75">Most popular: Business Class</p>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDestinationClick('Casablanca');
                }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full"
              >
                Explore Cars
              </button>
            </div>
            
            <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Rabat Card */}
          <div 
            onClick={() => handleDestinationClick('Rabat')}
            className="flex-shrink-0 w-80 relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg w-[350px]"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-700"
              style={{ 
                backgroundImage: 'url(/cities/rabat.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:-translate-y-2">
              <div className="mb-4">
                <h3 className="text-3xl font-bold mb-2 group-hover:text-orange-300 transition-colors duration-300">Rabat</h3>
                <p className="text-sm font-medium opacity-90 mb-1">Royal Capital • UNESCO Heritage</p>
                <p className="text-xs opacity-75">Most popular: Luxury & Economy</p>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDestinationClick('Rabat');
                }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full"
              >
                Explore Cars
              </button>
            </div>
            
            <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Tetouan Card */}
          <div 
            onClick={() => handleDestinationClick('Tetouan')}
            className="flex-shrink-0 w-80 relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg w-[350px]"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-110 transition-transform duration-700"
              style={{ 
                backgroundImage: 'url(/cities/tetouan.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:-translate-y-2">
              <div className="mb-4">
                <h3 className="text-3xl font-bold mb-2 group-hover:text-orange-300 transition-colors duration-300">Tetouan</h3>
                <p className="text-sm font-medium opacity-90 mb-1">White Dove • Andalusian Heritage</p>
                <p className="text-xs opacity-75">Most popular: Compact Cars</p>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDestinationClick('Tetouan');
                }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full"
              >
                Explore Cars
              </button>
            </div>
            
            <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          </div>
        </div>
      </div>
    </section>
  );
}