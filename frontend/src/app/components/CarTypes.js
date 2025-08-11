'use client';
import { useState } from 'react';
import { useScrollAnimation, animations } from "../../hooks/useScrollAnimation";

export default function CarTypes() {
  const [headerRef, headerVisible] = useScrollAnimation({ delay: 100 });
  const [gridRef, gridVisible] = useScrollAnimation({ delay: 200 });
  const [showAllDeals, setShowAllDeals] = useState(false);
  
  const carTypes = [
    {
      name: "Compact",
      doors: "4 door",
      people: 4,
      bags: 3,
      price: 136,
      image: "🚗",
      bgColor: "bg-blue-100",
      features: ["Fuel efficient", "Easy parking", "City driving"]
    },
    {
      name: "Economy", 
      doors: "4 door",
      people: 4,
      bags: 2,
      price: 145,
      image: "🚙",
      bgColor: "bg-green-100",
      features: ["Budget friendly", "Low fuel consumption", "Reliable"]
    },
    {
      name: "Intermediate",
      doors: "4 door", 
      people: 5,
      bags: 4,
      price: 170,
      image: "🚗",
      bgColor: "bg-purple-100",
      features: ["More space", "Comfortable ride", "Family friendly"]
    },
    {
      name: "Mini",
      doors: "4 door",
      people: 4,
      bags: 1, 
      price: 203,
      image: "🚗",
      bgColor: "bg-orange-100",
      features: ["Ultra compact", "Easy maneuverability", "Urban perfect"]
    },
    {
      name: "Full-size",
      doors: "4 door",
      people: 5,
      bags: 4,
      price: 257,
      image: "🚗",
      bgColor: "bg-teal-100",
      features: ["Spacious interior", "Comfort features", "Highway cruising"]
    },
    {
      name: "Premium",
      doors: "4 door",
      people: 5,
      bags: 2,
      price: 419,
      image: "🚗", 
      bgColor: "bg-indigo-100",
      features: ["Luxury features", "Premium comfort", "High-end brands"]
    }
  ];

  // Additional car types for "View all deals"
  const additionalCarTypes = [
    {
      name: "SUV",
      doors: "5 door",
      people: 7,
      bags: 5,
      price: 320,
      image: "🚙",
      bgColor: "bg-red-100",
      features: ["Off-road capable", "Large capacity", "Adventure ready"]
    },
    {
      name: "Convertible",
      doors: "2 door",
      people: 4,
      bags: 2,
      price: 450,
      image: "🏎️",
      bgColor: "bg-yellow-100",
      features: ["Open-top driving", "Sporty design", "Premium experience"]
    },
    {
      name: "Van",
      doors: "4 door",
      people: 8,
      bags: 6,
      price: 380,
      image: "🚐",
      bgColor: "bg-gray-100",
      features: ["Group travel", "Maximum space", "Commercial use"]
    },
    {
      name: "Luxury",
      doors: "4 door",
      people: 5,
      bags: 3,
      price: 650,
      image: "🚘",
      bgColor: "bg-pink-100",
      features: ["Ultimate luxury", "Executive class", "VIP treatment"]
    },
    {
      name: "Electric",
      doors: "4 door",
      people: 5,
      bags: 3,
      price: 290,
      image: "⚡",
      bgColor: "bg-green-200",
      features: ["Zero emissions", "Silent driving", "Eco-friendly"]
    },
    {
      name: "Hybrid",
      doors: "4 door",
      people: 5,
      bags: 3,
      price: 240,
      image: "🌿",
      bgColor: "bg-lime-100",
      features: ["Fuel efficient", "Environment friendly", "Cost effective"]
    }
  ];

  const displayedCars = showAllDeals ? [...carTypes, ...additionalCarTypes] : carTypes;

  const toggleShowAllDeals = () => {
    setShowAllDeals(!showAllDeals);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-12" style={animations.fadeInDown(headerVisible)}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Find the best deals on car rental in Fes
          </h2>
          <p className="text-gray-600">
            Here are the most popular types of rental cars you can pick up from a point near you in the next 30 days.
          </p>
        </div>

        {/* Car Types Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCars.map((car, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover-lift group"
              style={animations.staggeredFadeInUp(gridVisible, index)}
            >
              
              {/* Car Image Placeholder */}
              <div className={`w-full h-32 ${car.bgColor} rounded-lg mb-4 flex items-center justify-center transform hover:scale-105 transition-transform duration-300 relative overflow-hidden`}>
                <span className="text-4xl z-10 relative">{car.image}</span>
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Car Type Info */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">{car.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{car.doors}</p>
                
                {/* Icons and Stats */}
                <div className="flex items-center space-x-4 text-sm mb-3">
                  <div className="flex items-center text-orange-500">
                    <span className="mr-1">👥</span>
                    <span>{car.people}</span>
                  </div>
                  <div className="flex items-center text-orange-500">
                    <span className="mr-1">🎒</span>
                    <span>{car.bags}</span>
                  </div>
                </div>

                {/* Features list (shown for additional cars) */}
                {car.features && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {car.features.slice(0, 2).map((feature, featureIndex) => (
                        <span 
                          key={featureIndex}
                          className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-gray-900">{car.price} €</span>
                  <span className="text-sm text-gray-500 ml-1">per day</span>
                </div>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 opacity-0 group-hover:opacity-100">
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Animated transition for additional cars */}
        {showAllDeals && (
          <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🎉 Exclusive Additional Options</h3>
              <p className="text-gray-600 text-sm">Premium and specialty vehicles for your perfect trip</p>
            </div>
          </div>
        )}

        {/* View All Deals Button */}
        <div className="text-center mt-8">
          <button 
            onClick={toggleShowAllDeals}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>{showAllDeals ? 'Show Less' : 'View all deals'}</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${showAllDeals ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Counter showing total cars */}
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              Showing {displayedCars.length} of {carTypes.length + additionalCarTypes.length} car types
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}