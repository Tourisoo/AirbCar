'use client';
import { useRef, useState, useEffect } from 'react';

export default function RentalProviders() {
  const scrollContainerRef = useRef(null);
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

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();

      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, []);

  const providers = [
    {
      name: "autoUnion",
      rating: 4.9,
      reviews: "Excellent",
      reviewCount: null,
      logo: "🏢",
      price: 43,
      categories: [
        { name: "Car condition", rating: "/5" },
        { name: "Car cleanliness", rating: "/5" },
        { name: "Customer service", rating: "/5" }, 
        { name: "Easy collection", rating: "/5" }
      ]
    },
    {
      name: "Europcar",
      rating: 4.8,
      reviews: "Good",
      reviewCount: "3 reviews",
      logo: "🟢",
      price: 77,
      categories: [
        { name: "Car condition", rating: "/5" },
        { name: "Car cleanliness", rating: "/5" },
        { name: "Customer service", rating: "/5" },
        { name: "Easy collection", rating: "/5" }
      ]
    },
    {
      name: "Budget",
      rating: 4.7,
      reviews: "Good", 
      reviewCount: "4 reviews",
      logo: "🔵",
      price: 27,
      categories: [
        { name: "Car condition", rating: "/5" },
        { name: "Car cleanliness", rating: "/5" },
        { name: "Customer service", rating: "/5" },
        { name: "Easy collection", rating: "/5" }
      ]
    },
    {
      name: "Hertz",
      rating: 4.6,
      reviews: "Good",
      reviewCount: "7 reviews",
      logo: "🟡",
      price: 52,
      categories: [
        { name: "Car condition", rating: "/5" },
        { name: "Car cleanliness", rating: "/5" },
        { name: "Customer service", rating: "/5" },
        { name: "Easy collection", rating: "/5" }
      ]
    },
    {
      name: "Avis",
      rating: 4.5,
      reviews: "Good",
      reviewCount: "12 reviews",
      logo: "🔴",
      price: 68,
      categories: [
        { name: "Car condition", rating: "/5" },
        { name: "Car cleanliness", rating: "/5" },
        { name: "Customer service", rating: "/5" },
        { name: "Easy collection", rating: "/5" }
      ]
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            The best car rental providers in Fes right now
          </h2>
        </div>

        {/* Providers Horizontal Scroll */}
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={scrollToLeft}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={scrollToRight}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {providers.map((provider, index) => (
              <div key={index} className="flex-shrink-0 w-80 bg-white rounded-lg border border-gray-200 p-6">
                
                {/* Provider Header - Horizontal Layout */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-xl">{provider.logo}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                    </div>
                  </div>
                  
                  {/* Rating on the same line */}
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900 mr-2">{provider.rating}</span>
                    <div className="text-sm text-right">
                      <div className="text-gray-600">/5 {provider.reviews}</div>
                      {provider.reviewCount && (
                        <div className="text-gray-500">{provider.reviewCount}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2 mb-6">
                  {provider.categories.map((category, catIndex) => (
                    <div key={catIndex} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{category.name}</span>
                      <span className="text-gray-400">{category.rating}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-sm text-gray-500">From</span>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-gray-900">{provider.price} €</span>
                      <span className="text-sm text-gray-500 ml-1">per day</span>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    View deals →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
