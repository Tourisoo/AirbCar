'use client';
import CarTypes from "./components/CarTypes";
import Features from "./components/Features";
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

export default function Home() {
  // Basic scroll animations
  const [featuresRef, featuresVisible] = useScrollAnimation({ delay: 100 });
  const [destinationsRef, destinationsVisible] = useScrollAnimation({ 
    delay: 200, 
    trackProgress: true 
  });
  const [carTypesRef, carTypesVisible] = useScrollAnimation({ delay: 100 });
  const [trustRef, trustVisible] = useScrollAnimation({ delay: 150 });
  const [providersRef, providersVisible] = useScrollAnimation({ delay: 100 });
  const [factsRef, factsVisible] = useScrollAnimation({ delay: 200 });
  const [howItWorksRef, howItWorksVisible] = useScrollAnimation({ delay: 100 });
  const [infoRef, infoVisible] = useScrollAnimation({ delay: 150 });

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
    <div 
      className="min-h-screen transition-colors duration-1000"
      style={{ backgroundColor }}
    >
      <Header />
      <Hero />
      
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
        <div ref={featuresRef} style={animationPresets.section(featuresVisible)}>
          <Features />
        </div>
        
        <div ref={destinationsRef} style={animations.morphIn(destinationsVisible, {
          duration: '1s',
          distance: '60px',
          blur: '3px'
        })}>
          <PopularDestinations />
        </div>
        
        <div ref={carTypesRef} style={animations.glideIn(carTypesVisible, 'left', {
          duration: '0.9s',
          distance: '80px'
        })}>
          <CarTypes />
        </div>
        
        <div ref={trustRef} style={animations.bounceIn(trustVisible, {
          duration: '0.8s'
        })}>
          <TrustSignals />
        </div>
        
        <div ref={providersRef} style={animations.flipInY(providersVisible, {
          duration: '0.7s',
          rotation: '60deg'
        })}>
          <RentalProviders />
        </div>
        
        <div ref={factsRef} style={animations.slideAndScale(factsVisible, {
          duration: '0.9s',
          distance: '50px',
          scale: '0.85'
        })}>
          <CarRentalFacts />
        </div>
        
        <div ref={howItWorksRef} style={animations.rotateIn(howItWorksVisible, {
          duration: '1s',
          rotation: '15deg'
        })}>
          <HowItWorks />
        </div>
        
        <div ref={infoRef} style={animationPresets.hero(infoVisible)}>
          <InfoSection />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

// Header/Navigation - Fixed or sticky header
// Hero Section - "Find the best car rental deals" with search form
// Features Section - 3 feature cards with icons
// Popular Destinations - Cards for Marrakech, Agadir, Tangier, etc.
// Car Categories - Mini, Economy, Premium, etc.
// How It Works - 3-step process (Search, Compare, Book)
// Trust Signals - Partner companies logos
// Footer - Links and company info