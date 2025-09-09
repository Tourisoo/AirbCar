'use client';
import { useRef, useState, useEffect } from 'react';

export default function RentalProviders() {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
      
      // Calculate active index based on scroll position
      const cardWidth = 320; // 288px card + 32px gap
      const currentIndex = Math.round(container.scrollLeft / cardWidth);
      setActiveIndex(Math.min(currentIndex, providers.length - 1));
    }
  };

  const scrollToLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({
        left: -320,
        behavior: 'smooth'
      });
    }
  };

  const scrollToRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({
        left: 320,
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
      logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536",
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
      logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536",
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
      logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536",
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
      logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536",
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
      logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536",
      price: 68,
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
      logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536",
      price: 52,
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
      logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536",
      price: 52,
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
      logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536",
      price: 52,
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
      logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536",
      price: 52,
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
      logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536",
      price: 52,
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
      logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536",
      price: 52,
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
      logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536",
      price: 52,
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
      logo: "https://ik.imagekit.io/szcfr7vth/vector-illustration-car-rental-logo-600nw-2314365359.webp?updatedAt=1756818617536",
      price: 52,
      categories: [
        { name: "Car condition", rating: "/5" },
        { name: "Car cleanliness", rating: "/5" },
        { name: "Customer service", rating: "/5" },
        { name: "Easy collection", rating: "/5" }
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Simple Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Top car rental providers in Fes
          </h2>
          <p className="text-gray-600">
            Compare trusted providers and find the best deals for your trip.
          </p>
        </div>

        {/* Scroll Container with Navigation */}
        <div className="relative">

          <style jsx global>{`
            .scrollbar-hide {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide px-2"
          >
            {providers.map((provider, index) => (
              <div key={index} className="flex-shrink-0 w-72 bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
                
                {/* Provider Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mr-3">
                      <img src={provider.logo} alt={provider.name} className="max-h-8 max-w-8 object-contain opacity-70" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                  </div>
                  
                  {/* Simple Rating */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{provider.rating}</div>
                    <div className="text-xs text-gray-500">{provider.reviews}</div>
                  </div>
                </div>

                {/* Simple Categories */}
                <div className="space-y-3 mb-6">
                  {provider.categories.slice(0, 3).map((category, catIndex) => (
                    <div key={catIndex} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{category.name}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-xs text-gray-300">★</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simple Pricing */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-xl font-bold text-gray-900">{provider.price} €</div>
                    <div className="text-sm text-gray-500">per day</div>
                  </div>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors duration-200">
                    View deals
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Navigation Controls */}
          <div className="flex justify-end items-center mt-6 space-x-4">
            {/* Left Scroll Button */}
            <button
              onClick={scrollToLeft}
              disabled={!showLeftArrow}
              className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                showLeftArrow 
                  ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>


            {/* Right Scroll Button */}
            <button
              onClick={scrollToRight}
              disabled={!showRightArrow}
              className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                showRightArrow 
                  ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
