'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function ProcessSteps() {
  const [visibleSteps, setVisibleSteps] = useState(new Set());
  const stepRefs = useRef([]);

  useEffect(() => {
    const observers = stepRefs.current.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSteps(prev => new Set([...prev, index]));
          }
        },
        { threshold: 0.3 }
      );

      if (ref) observer.observe(ref);
      return observer;
    });

    return () => observers.forEach(observer => observer.disconnect());
  }, []);

  const steps = [
    {
      number: 1,
      title: "Set your prices",
      description: "Create your account and add all available bikes with rental prices for different seasons, optional extras, pre-payment policy, and cancellation policies. Our database has over 30,000 motorbike images and specifications, making setup super quick!",
      image: "https://cdn.riderly.com/storage/static/img/screenshots/bike_setup.png",
      icon: "fas fa-dollar-sign",
      color: "blue"
    },
    {
      number: 2,
      title: "Customers book on Riderly.com",
      description: "Your fleet will be shown to over 80,000 potential customers monthly. When visitors reserve your motorbikes, they make online pre-payment according to your criteria (minus our brokerage fee), then pay the remaining amount when collecting the bike.",
      image: "https://cdn.riderly.com/storage/static/img/screenshots/customer_reservation.png",
      icon: "fas fa-users",
      color: "green"
    },
    {
      number: 3,
      title: "You choose to accept or decline",
      description: "Receive email alerts for new bookings and take action from your Riderly account. View, accept, or decline reservations according to your needs. No fees or penalties for declining bookings.",
      image: "https://cdn.riderly.com/storage/static/img/screenshots/online_booking.png",
      icon: "fas fa-check-circle",
      color: "purple"
    },
    {
      number: 4,
      title: "Instant Confirmation",
      description: "Once accepted, we handle the rest. We issue vouchers with all necessary information and detailed terms. For cancellations or no-shows, we bill customers per your policy. Pre-payment amounts are transferred to you when bookings are initiated.",
      image: "https://cdn.riderly.com/storage/static/img/screenshots/voucher-2.png",
      icon: "fas fa-rocket",
      color: "orange"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600 border-blue-200",
      green: "bg-green-100 text-green-600 border-green-200",
      purple: "bg-purple-100 text-purple-600 border-purple-200",
      orange: "bg-orange-100 text-orange-600 border-orange-200"
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="py-20 bg-white" id="how-it-works">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            How does it work?
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-blue-600 font-bold text-xl mb-4">
              Simply put; we are a motorbike rental search engine.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              You upload your bikes and price-list, and we put them in front of +2700 visitors 
              everyday that come to Riderly to find their next rental motorbike. You keep complete 
              control of which reservations you accept, the pre-payment amounts and the cancellation policies.
            </p>
          </div>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Progress line for desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2">
            <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-600 to-purple-600 transition-all duration-2000" 
                 style={{ height: `${(visibleSteps.size / steps.length) * 100}%` }}></div>
          </div>

          {steps.map((step, index) => {
            const isVisible = visibleSteps.has(index);
            const isReverse = index % 2 === 1;

            return (
              <div
                key={step.number}
                ref={el => stepRefs.current[index] = el}
                className={`flex flex-wrap items-center mb-20 last:mb-0 ${
                  isReverse ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className={`w-full lg:w-5/12 ${isReverse ? 'lg:pl-16' : 'lg:pr-16'} mb-8 lg:mb-0`}>
                  <div className={`transition-all duration-1000 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}>
                    <div className="flex items-center mb-4">
                      <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center mr-4 ${getColorClasses(step.color)}`}>
                        <i className={`${step.icon} text-2xl`}></i>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          Step {step.number}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Center dot for desktop */}
                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
                  <div className={`w-6 h-6 rounded-full border-4 border-white shadow-lg transition-all duration-500 ${
                    isVisible ? getColorClasses(step.color).replace('border-', 'bg-').split(' ')[0] : 'bg-gray-300'
                  }`}></div>
                </div>

                {/* Image */}
                <div className={`w-full lg:w-6/12 ${isReverse ? 'lg:pr-16' : 'lg:pl-16'}`}>
                  <div className={`transition-all duration-1000 delay-300 ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}>
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                      <div className="aspect-w-16 aspect-h-10">
                        <img 
                          src={step.image}
                          alt={`Step ${step.number}: ${step.title}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA at the bottom */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to get started?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of successful rental partners worldwide
            </p>
            <a 
              href="/accounts/signup/business/"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Your Free Account Today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
