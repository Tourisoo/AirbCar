'use client';
import { useState, useEffect } from 'react';
import CarTypes from "./components/CarTypes";
import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import PopularDestinations from "./components/PopularDestinations";
import Footer from "./components/Footer";
import TrustSignals from "./components/TrustSignals";
import RentalProviders from "./components/RentalProviders";
import CarRentalFacts from "./components/CarRentalFacts";
import InfoSection from "./components/InfoSection";
import { useScrollAnimation, animations, animationPresets } from "../hooks/useScrollAnimation";
import { useScrollBackground, useParallax } from "../hooks/useAdvancedScrollEffects";

// Enhanced Loading Component
function PageLoader({ isLoading }) {
  const [shouldRender, setShouldRender] = useState(true);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    // Dynamic loading text
    const textSequence = [
      'Initializing...',
      'Loading your experience...',
      'Preparing your journey...',
      'Almost ready...'
    ];
    
    let index = 0;
    const textInterval = setInterval(() => {
      setLoadingText(textSequence[index % textSequence.length]);
      index++;
    }, 400);

    if (!isLoading) {
      clearInterval(textInterval);
      setLoadingText('Welcome aboard!');
      // Delay unmounting to allow fade-out animation
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 800);
      return () => clearTimeout(timer);
    }

    return () => clearInterval(textInterval);
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 transition-all duration-800 ${
      isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
    }`}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {['🚗', '⭐', '🎯', '💎'][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>

      <div className="text-center relative z-10">
        {/* Enhanced Logo with glow effect */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-orange-400 rounded-full opacity-20 animate-ping"></div>
          <h1 className="text-5xl font-bold text-orange-500 mb-2 relative animate-pulse">
            Airbcar
          </h1>
          <p className="text-gray-600 text-sm animate-fade-in">Car Rental Made Simple</p>
        </div>
        
        {/* Enhanced Loading Spinner */}
        <div className="relative mb-8">
          {/* Outer ring */}
          <div className="w-24 h-24 border-4 border-orange-100 rounded-full mx-auto mb-4"></div>
          {/* Inner spinning ring */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 border-4 border-transparent border-t-orange-500 border-r-orange-400 rounded-full animate-spin"></div>
          {/* Center pulse */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-orange-400 rounded-full animate-pulse opacity-60"></div>
          
          {/* Progress dots with wave animation */}
          <div className="flex justify-center space-x-3 mt-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-orange-500 rounded-full animate-wave"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1.4s'
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Dynamic Loading Text with typewriter effect */}
        <div className="h-8 flex items-center justify-center">
          <p className="text-gray-600 font-medium animate-typewriter">
            {loadingText}
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-progress"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-30px) rotate(180deg) scale(1.2); }
        }
        
        @keyframes wave {
          0%, 40%, 100% { transform: translateY(0); }
          20% { transform: translateY(-10px); }
        }
        
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-100px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(-15deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) rotate(-2deg);
          }
          70% {
            transform: scale(0.9) rotate(1deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.8);
          }
        }

        @keyframes fade-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-soft {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes progress-bar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-wave {
          animation: wave 1.4s ease-in-out infinite;
        }
        
        .animate-progress {
          animation: progress 3s ease-out;
        }
        
        .animate-typewriter {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out 0.5s both;
        }

        .animate-slideInFromTop {
          animation: slideInFromTop 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .animate-bounce-in {
          animation: bounce-in 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-fade-up {
          animation: fade-up 0.8s ease-out 0.5s both;
        }

        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }

        .animate-progress-bar {
          animation: progress-bar 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
  const [showEntryAnimation, setShowEntryAnimation] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // Handle loading state with more sophisticated timing
  useEffect(() => {
    // Minimum loading time
    const minLoadingTime = setTimeout(() => {
      setContentReady(true);
    }, 1200);

    // Hide loading when content is ready
    const hideLoading = setTimeout(() => {
      if (contentReady) {
        setIsLoading(false);
        // Start entry animation sequence
        setTimeout(() => {
          setShowEntryAnimation(true);
          // Trigger animation steps
          const stepTimers = [
            setTimeout(() => setAnimationStep(1), 300),
            setTimeout(() => setAnimationStep(2), 800),
            setTimeout(() => setAnimationStep(3), 1200),
            setTimeout(() => setAnimationStep(4), 1600),
          ];
          return () => stepTimers.forEach(clearTimeout);
        }, 300);
      }
    }, 1500);

    return () => {
      clearTimeout(minLoadingTime);
      clearTimeout(hideLoading);
    };
  }, [contentReady]);

  // Hide loading when content is ready
  useEffect(() => {
    if (contentReady) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        // Start entry animation with enhanced sequencing
        setTimeout(() => {
          setShowEntryAnimation(true);
          setAnimationStep(1);
        }, 500);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [contentReady]);
  // Basic scroll animations with reduced delays for faster response
  const [destinationsRef, destinationsVisible] = useScrollAnimation({ 
    delay: 50, 
    trackProgress: true 
  });
  const [carTypesRef, carTypesVisible] = useScrollAnimation({ delay: 50 });
  const [trustRef, trustVisible] = useScrollAnimation({ delay: 75 });
  const [providersRef, providersVisible] = useScrollAnimation({ delay: 50 });
  const [factsRef, factsVisible] = useScrollAnimation({ delay: 100 });
  const [howItWorksRef, howItWorksVisible] = useScrollAnimation({ delay: 50 });
  const [infoRef, infoVisible] = useScrollAnimation({ delay: 75 });

  // Advanced scroll effects
  const backgroundColor = useScrollBackground([
    '#ffffff',
    '#f8fafc',
    '#f1f5f9',
    '#e2e8f0',
    '#cbd5e1'
  ], { smooth: true });

  const [parallaxRef, parallaxStyle] = useParallax(-0.3);

  return (
    <>
      {/* Loading Screen */}
      <PageLoader isLoading={isLoading} />
      
      {/* Main Content */}
      <div 
        className={`min-h-screen transition-all duration-1000 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundColor }}
      >
        {/* Header with entry animation */}
        <div className={`transform transition-all duration-800 ease-out ${
          showEntryAnimation ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
        }`}>
          <Header />
        </div>
        
        {/* Hero with staggered entry animation */}
        <div className={`transform transition-all duration-1000 delay-200 ease-out ${
          showEntryAnimation ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'
        }`}>
          <Hero />
        </div>
        
        {/* Enhanced animated welcome banner */}
        {showEntryAnimation && (
          <div className="relative z-20 -mt-16 mb-8 animate-slideInFromTop">
            <div className="max-w-5xl mx-auto px-4">
              {/* Main welcome banner */}
              <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-3xl p-8 shadow-2xl transform animate-bounce-in relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-full h-full animate-shimmer"></div>
                </div>
                
                {/* Floating decorative elements */}
                <div className="absolute top-4 right-4 animate-float">⭐</div>
                <div className="absolute bottom-4 left-4 animate-float" style={{ animationDelay: '0.5s' }}>🎯</div>
                <div className="absolute top-1/2 right-8 animate-float" style={{ animationDelay: '1s' }}>💎</div>
                
                <div className="flex items-center justify-center space-x-6 relative z-10">
                  <span className="text-3xl animate-bounce">🎉</span>
                  
                  <div className="text-center flex-1">
                    <h3 className="text-2xl font-bold mb-2 animate-glow">
                      Welcome to Airbcar!
                    </h3>
                    <p className="text-lg opacity-90 animate-fade-up">
                      Your premium car rental experience starts here
                    </p>
                  </div>
                  
                  <span className="text-3xl animate-spin-slow">🚗</span>
                </div>
                
                {/* Progress indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                  <div className="h-full bg-white rounded-full animate-progress-bar" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
              
              {/* Additional info cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {[
                  { icon: '⚡', title: 'Instant Booking', desc: 'Book in seconds' },
                  { icon: '💳', title: 'Best Prices', desc: 'Guaranteed savings' },
                  { icon: '🛡️', title: 'Secure & Safe', desc: 'Premium protection' }
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-xl p-4 shadow-lg transform transition-all duration-800 hover:scale-105 ${
                      animationStep >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}
                    style={{ transitionDelay: `${600 + index * 200}ms` }}
                  >
                    <div className="text-center">
                      <span className="text-2xl block mb-2 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                        {item.icon}
                      </span>
                      <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Parallax background element */}
        <div 
          ref={parallaxRef}
          className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-10 z-0"
          style={{
            ...parallaxStyle,
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 165, 0, 0.1) 0%, transparent 70%)'
          }}
        />
      
      <div className="relative z-10">
        
        {/* Sections with cascading entry animations */}
        <div className={`transform transition-all duration-800 delay-400 ease-out ${
          showEntryAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div ref={destinationsRef} style={animations.morphIn(destinationsVisible, {
            duration: '0.6s',
            distance: '40px',
            blur: '2px'
          })}>
            <PopularDestinations />
          </div>
        </div>
        
        <div className={`transform transition-all duration-800 delay-500 ease-out ${
          showEntryAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div ref={carTypesRef} style={animations.glideIn(carTypesVisible, 'left', {
            duration: '0.7s',
            distance: '60px'
          })}>
            <CarTypes />
          </div>
        </div>
        
        <div className={`transform transition-all duration-800 delay-600 ease-out ${
          showEntryAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div ref={trustRef} style={animations.bounceIn(trustVisible, {
            duration: '0.6s'
          })}>
            <TrustSignals />
          </div>
        </div>
        
        <div className={`transform transition-all duration-800 delay-700 ease-out ${
          showEntryAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div ref={providersRef} style={animations.flipInY(providersVisible, {
            duration: '0.6s',
            rotation: '45deg'
          })}>
            <RentalProviders />
          </div>
        </div>
        
        <div className={`transform transition-all duration-800 delay-800 ease-out ${
          showEntryAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div ref={factsRef} style={animations.slideAndScale(factsVisible, {
            duration: '0.7s',
            distance: '30px',
            scale: '0.9'
          })}>
            <CarRentalFacts />
          </div>
        </div>
        
        <div className={`transform transition-all duration-800 delay-900 ease-out ${
          showEntryAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div ref={howItWorksRef} style={animations.rotateIn(howItWorksVisible, {
            duration: '0.8s',
            rotation: '10deg'
          })}>
            <HowItWorks />
          </div>
        </div>
        
        <div className={`transform transition-all duration-800 delay-1000 ease-out ${
          showEntryAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div ref={infoRef} style={animationPresets.hero(infoVisible)}>
            <InfoSection />
          </div>
        </div>
        </div>
        
        {/* Footer with entry animation */}
        <div className={`transform transition-all duration-800 delay-1100 ease-out ${
          showEntryAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <Footer />
        </div>
      </div>
      
      {/* Custom CSS for post-loading animations */}
      <style jsx>{`
        @keyframes slideInFromTop {
          0% {
            transform: translateY(-100px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes bounce-in {
          0% {
            transform: scale(0.3) rotate(-10deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.05) rotate(2deg);
          }
          70% {
            transform: scale(0.9) rotate(-1deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        
        .animate-slideInFromTop {
          animation: slideInFromTop 0.8s ease-out 0.6s both;
        }
        
        .animate-bounce-in {
          animation: bounce-in 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.8s both;
        }
        
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.2) 20%,
            rgba(255, 255, 255, 0.5) 60%,
            rgba(255, 255, 255, 0)
          );
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
}// Header/Navigation - Fixed or sticky header
// Hero Section - "Find the best car rental deals" with search form
// Features Section - 3 feature cards with icons
// Popular Destinations - Cards for Marrakech, Agadir, Tangier, etc.
// Car Categories - Mini, Economy, Premium, etc.
// How It Works - 3-step process (Search, Compare, Book)
// Trust Signals - Partner companies logos
// Footer - Links and company info
