'use client';

import { useState, useEffect, useRef } from 'react';

export default function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: "fas fa-globe",
      title: "Global Reach",
      description: "Connect with travelers from 82+ cities worldwide"
    },
    {
      icon: "fas fa-coins",
      title: "Multi-Currency Support",
      description: "Accept payments in multiple currencies seamlessly"
    },
    {
      icon: "fas fa-calendar-alt",
      title: "Smart Calendar",
      description: "Advanced booking calendar with availability management"
    },
    {
      icon: "fas fa-tasks",
      title: "Reservation Management",
      description: "Complete control over your booking requests"
    },
    {
      icon: "fas fa-chart-line",
      title: "Analytics Dashboard",
      description: "Track performance with detailed insights"
    },
    {
      icon: "fas fa-images",
      title: "Professional Photos",
      description: "30k+ motorbike photos ready to use"
    },
    {
      icon: "fas fa-sun",
      title: "Seasonal Pricing",
      description: "Dynamic pricing for peak and off-seasons"
    },
    {
      icon: "fas fa-map-marker-alt",
      title: "Multiple Locations",
      description: "Manage multiple office locations easily"
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Everything you need to grow your business
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional tools designed specifically for motorbike rental businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                  <i className={`${feature.icon} text-2xl text-blue-600 group-hover:text-white transition-colors duration-300`}></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats section */}
        <div className={`mt-16 bg-white rounded-2xl p-8 shadow-lg transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">2,700+</div>
              <div className="text-gray-600">Daily Visitors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">80k+</div>
              <div className="text-gray-600">Monthly Searches</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10k+</div>
              <div className="text-gray-600">Active Partners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
