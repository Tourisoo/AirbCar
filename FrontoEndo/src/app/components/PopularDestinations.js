'use client';
import { useRef, useState, useEffect } from 'react';

export default function PopularDestinations() {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

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
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular car rental destinations
          </h2>
        </div>

        {/* City Cards Horizontal Scroll */}
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={scrollToLeft}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
              aria-label="Scroll left"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={scrollToRight}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110"
              aria-label="Scroll right"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide cursor-grab select-none pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          
          {/* Marrakech Card */}
          <div className="flex-shrink-0 w-72 relative bg-blue-600 rounded-lg overflow-hidden aspect-[9/14] group cursor-pointer">
            {/* Background image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url(/cities/marrakesh.jpg)' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
            <div className="absolute top-6 left-6 text-white z-10">
              <h3 className="text-2xl font-bold mb-1">Marrakech</h3>
              <p className="text-sm font-medium">Most popular car type: Economy</p>
              <button className="mt-3 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-sm font-semibold transition-colors">
                Get More
              </button>
            </div>
          </div>

          {/* Agadir Card */}
          <div className="flex-shrink-0 w-72 relative bg-blue-500 rounded-lg overflow-hidden aspect-[9/14] group cursor-pointer">
            {/* Background image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url(/cities/agadir.jpg)' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
            <div className="absolute top-6 left-6 text-white z-10">
              <h3 className="text-2xl font-bold mb-1">Agadir</h3>
              <p className="text-sm font-medium">Most popular car type: Economy</p>
              <button className="mt-3 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-sm font-semibold transition-colors">
                Get More
              </button>
            </div>
          </div>

          {/* Tangier Card */}
          <div className="flex-shrink-0 w-72 relative bg-teal-500 rounded-lg overflow-hidden aspect-[9/14] group cursor-pointer">
            {/* Background image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url(/cities/tangier.jpg)' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
            <div className="absolute top-6 left-6 text-white z-10">
              <h3 className="text-2xl font-bold mb-1">Tangier</h3>
              <p className="text-sm font-medium">Most popular car type: Economy</p>
              <button className="mt-3 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-sm font-semibold transition-colors">
                Get More
              </button>
            </div>
          </div>

          {/* Casablanca Card */}
          <div className="flex-shrink-0 w-72 relative bg-purple-500 rounded-lg overflow-hidden aspect-[9/14] group cursor-pointer">
            {/* Background image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url(/cities/casablanca.jpg)' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
            <div className="absolute top-6 left-6 text-white z-10">
              <h3 className="text-2xl font-bold mb-1">Casablanca</h3>
              <p className="text-sm font-medium">Most popular car type: Economy</p>
              <button className="mt-3 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-sm font-semibold transition-colors">
                Get More
              </button>
            </div>
          </div>

          {/* Rabat Card */}
          <div className="flex-shrink-0 w-72 relative bg-emerald-500 rounded-lg overflow-hidden aspect-[9/14] group cursor-pointer">
            {/* Background image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url(/cities/rabat.jpg)' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
            <div className="absolute top-6 left-6 text-white z-10">
              <h3 className="text-2xl font-bold mb-1">Rabat</h3>
              <p className="text-sm font-medium">Most popular car type: Economy</p>
              <button className="mt-3 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-sm font-semibold transition-colors">
                Get More
              </button>
            </div>
          </div>

          {/* Tetouan Card */}
          <div className="flex-shrink-0 w-72 relative bg-indigo-500 rounded-lg overflow-hidden aspect-[9/14] group cursor-pointer">
            {/* Background image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url(/cities/tetouan.jpg)' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
            <div className="absolute top-6 left-6 text-white z-10">
              <h3 className="text-2xl font-bold mb-1">Tetouan</h3>
              <p className="text-sm font-medium">Most popular car type: Economy</p>
              <button className="mt-3 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-sm font-semibold transition-colors">
                Get More
              </button>
            </div>
          </div>

          </div>
        </div>
      </div>
    </section>
  );
}