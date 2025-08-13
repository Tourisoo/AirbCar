'use client';

import { useState, useEffect } from 'react';

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Marco Rodriguez",
      location: "Barcelona, Spain",
      business: "Barcelona Moto Tours",
      text: "Riderly has transformed our business! We've increased our bookings by 300% in just 6 months. The platform is easy to use and the support team is fantastic.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Sofia Chen",
      location: "Bali, Indonesia",
      business: "Island Riders",
      text: "The best decision we made was joining Riderly. International customers find us easily, and the booking system is so smooth. Our revenue doubled this year!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Alessandro Rossi",
      location: "Rome, Italy",
      business: "Roman Adventures",
      text: "Professional platform with excellent tools. The dashboard gives us everything we need to manage our fleet efficiently. Highly recommended for serious rental businesses.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            What our partners say
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of successful rental businesses worldwide
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 p-8 md:p-12">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <i key={i} className="fas fa-star text-yellow-400 text-xl mr-1"></i>
                      ))}
                    </div>
                    
                    <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 italic leading-relaxed">
                      "{testimonial.text}"
                    </blockquote>
                    
                    <div className="flex items-center justify-center">
                      <img 
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full mr-4 object-cover"
                      />
                      <div className="text-left">
                        <div className="font-bold text-gray-800 text-lg">
                          {testimonial.name}
                        </div>
                        <div className="text-blue-600 font-medium">
                          {testimonial.business}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center space-x-2 pb-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
            <div className="text-gray-600">Partner Satisfaction</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl font-bold text-purple-600 mb-2">150+</div>
            <div className="text-gray-600">Countries Served</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl font-bold text-orange-600 mb-2">0€</div>
            <div className="text-gray-600">Setup Costs</div>
          </div>
        </div>
      </div>
    </section>
  );
}
