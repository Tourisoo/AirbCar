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
    </section>
  );
}
