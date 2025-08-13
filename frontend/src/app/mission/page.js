'use client'

import { useEffect, useRef, useCallback } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useScrollAnimation, animations } from '../../hooks/useScrollAnimation'

export default function MissionPage() {
  const [heroRef, heroVisible] = useScrollAnimation({ delay: 100 })
  const [challengeRef, challengeVisible] = useScrollAnimation({ delay: 200 })
  const [solutionRef, solutionVisible] = useScrollAnimation({ delay: 150 })
  const [impactRef, impactVisible] = useScrollAnimation({ delay: 100 })
  const [whyUsRef, whyUsVisible] = useScrollAnimation({ delay: 200 })
  const [factsRef, factsVisible] = useScrollAnimation({ delay: 150 })
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation({ delay: 100 })

  // Testimonials scroll functions with dynamic scroll amount
  const scrollLeft = useCallback(() => {
    const container = document.getElementById('testimonials-container');
    if (container) {
      const cardWidth = 350; // Adjust based on card width
      const gap = 24; // space-x-6 = 24px
      const scrollAmount = cardWidth + gap;
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  }, []);

  const scrollRight = useCallback(() => {
    const container = document.getElementById('testimonials-container');
    if (container) {
      const cardWidth = 50; // Adjust based on card width
      const gap = 24; // space-x-6 = 24px
      const scrollAmount = cardWidth + gap;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative bg-gradient-to-br from-orange-400 to-orange-600 min-h-[70vh] flex items-center justify-center text-white overflow-hidden"
        style={animations.fadeInUp(heroVisible, { duration: '1s' })}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 800\"><path fill=\"%23ffffff08\" d=\"M0,400 C300,500 600,300 1200,400 L1200,800 L0,800 Z\"/></svg>')"
          }}
        ></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Make cities for<br />
            people, not cars.
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto mb-8">
            We're building a sustainable future where mobility is accessible, affordable, and environmentally conscious.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1">
              Start Your Journey
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-orange-600 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Car Sharing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div 
              ref={challengeRef}
              style={animations.glideIn(challengeVisible, 'left', { duration: '0.8s' })}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <img 
                  src="/public/Background.jpg" 
                  alt="People in a car" 
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
              </div>
            </div>
            <div 
              style={animations.glideIn(challengeVisible, 'right', { duration: '0.8s' })}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-gray-900">
                Shared mobility for a better tomorrow
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Every day, millions of cars sit unused while people struggle with expensive, 
                inefficient transportation. Our car sharing platform creates a more sustainable 
                way to move around cities, reducing congestion and carbon emissions.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium">Sustainable transportation solution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge Section */}
      <section 
        ref={challengeRef}
        className="py-20 bg-white"
        style={animations.fadeInUp(challengeVisible, { duration: '0.9s' })}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">The challenge</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Traditional car ownership is becoming increasingly unsustainable. With rising costs, 
                environmental concerns, and urban congestion, we need innovative solutions that 
                prioritize people and communities over individual car ownership.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Cities around the world are struggling with air pollution, traffic congestion, and 
                the enormous space requirements of parking. Meanwhile, many people can't afford to 
                own a car but still need reliable transportation.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-300 group">
                  <div className="text-2xl font-bold text-red-600 group-hover:scale-110 transition-transform duration-300">95%</div>
                  <div className="text-sm text-gray-600">Cars sit unused daily</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-300 group">
                  <div className="text-2xl font-bold text-red-600 group-hover:scale-110 transition-transform duration-300">30%</div>
                  <div className="text-sm text-gray-600">Urban space for parking</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/public/step1.webp" 
                alt="Urban traffic challenge" 
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section 
        ref={solutionRef}
        className="py-20 bg-gray-50"
        style={animations.morphIn(solutionVisible, { duration: '1s' })}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Solution For a Better Future</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Airbcar provides an innovative car sharing platform that makes sustainable transportation 
              accessible to everyone. Our technology-driven approach creates a seamless experience 
              while reducing environmental impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reduce Carbon Footprint</h3>
              <p className="text-gray-600">
                Every shared car replaces up to 15 private vehicles, significantly reducing emissions 
                and environmental impact in urban areas.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Affordable Access</h3>
              <p className="text-gray-600">
                Car sharing costs 60% less than car ownership, making reliable transportation 
                accessible to more people in urban communities.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors duration-300">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Urban Planning</h3>
              <p className="text-gray-600">
                Fewer cars mean more space for parks, bike lanes, and community areas, 
                creating livable cities designed for people.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section 
        ref={impactRef}
        className="py-20 bg-white"
        style={animations.slideAndScale(impactVisible, { duration: '0.9s' })}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">The impact</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our mission goes beyond just providing cars. We're creating a movement towards 
                sustainable urban mobility that benefits individuals, communities, and the environment.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Reduced traffic congestion in urban areas</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Lower carbon emissions per capita</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">More affordable transportation options</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Increased space for community development</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="/public/step2.webp" 
                  alt="Green transportation" 
                  className="w-full h-48 object-cover rounded-xl shadow-lg"
                />
                <div className="bg-green-50 p-4 rounded-xl hover:bg-green-100 transition-colors duration-300 group">
                  <div className="text-2xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">85%</div>
                  <div className="text-sm text-gray-600">Reduction in personal vehicle need</div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-colors duration-300 group">
                  <div className="text-2xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">60%</div>
                  <div className="text-sm text-gray-600">Cost savings vs car ownership</div>
                </div>
                <img 
                  src="/public/step3.png" 
                  alt="Community impact" 
                  className="w-full h-48 object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section 
        ref={whyUsRef}
        className="py-20 bg-gradient-to-br from-orange-50 to-orange-100"
        style={animations.bounceIn(whyUsVisible, { duration: '0.8s' })}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              We <span className="text-orange-600">care</span> for you
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="/public/Background.jpg" 
                alt="Customer care" 
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 to-transparent rounded-xl"></div>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">High-quality support</h3>
                  <p className="text-gray-600">
                    Our dedicated support team is available 24/7 to help you with any questions 
                    or concerns about your car sharing experience.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Secure and reliable</h3>
                  <p className="text-gray-600">
                    All our vehicles are regularly maintained and insured. We prioritize your 
                    safety and security with every trip you take.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Easy and fast</h3>
                  <p className="text-gray-600">
                    Book a car in seconds with our intuitive app. No paperwork, no waiting - 
                    just sustainable transportation when you need it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Facts Section */}
      <section 
        ref={factsRef}
        className="py-20 bg-white"
        style={animations.rotateIn(factsVisible, { duration: '1s' })}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Key facts of our impact</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="/public/car-rental-tips.jpg" 
                alt="Car sharing impact" 
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <div className="text-3xl font-bold">Making a difference</div>
                <div className="text-lg opacity-90">One shared ride at a time</div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700 text-lg">Every shared car removes 15 private vehicles from roads</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700 text-lg">65% reduction in carbon emissions per user</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700 text-lg">Saves users an average of $4,000 annually</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700 text-lg">Available 24/7 in major Moroccan cities</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700 text-lg">Over 95% customer satisfaction rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section 
        ref={testimonialsRef}
        className="py-20 bg-gray-50"
        style={animations.flipInY(testimonialsVisible, { duration: '0.7s' })}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What our customers say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real experiences from real customers who trust Airbcar for their transportation needs
            </p>
          </div>
          
          {/* Testimonials Carousel */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button 
              className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all duration-300 group"
              onClick={scrollLeft}
              aria-label="Previous testimonials"
            >
              <svg className="w-6 h-6 text-gray-600 group-hover:text-orange-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all duration-300 group"
              onClick={scrollRight}
              aria-label="Next testimonials"
            >
              <svg className="w-6 h-6 text-gray-600 group-hover:text-orange-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Scrollable Container */}
            <div 
              id="testimonials-container"
              className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4 px-16 md:px-0 snap-x snap-mandatory"
            >
              {/* Testimonial 1 */}
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg min-w-[320px] md:min-w-[350px] flex-shrink-0 hover:shadow-xl transition-shadow duration-300 snap-start">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
                  "Airbcar has completely changed how I think about transportation. It's so convenient 
                  and affordable, and I love knowing I'm helping the environment."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-orange-600 font-bold">S</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Sarah M.</div>
                    <div className="text-sm text-gray-500">Casablanca</div>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg min-w-[320px] md:min-w-[350px] flex-shrink-0 hover:shadow-xl transition-shadow duration-300 snap-start">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
                  "Perfect for city living! I sold my car and haven't looked back. The app is 
                  super easy to use and cars are always clean and well-maintained."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-orange-600 font-bold">A</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Ahmed B.</div>
                    <div className="text-sm text-gray-500">Rabat</div>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg min-w-[320px] md:min-w-[350px] flex-shrink-0 hover:shadow-xl transition-shadow duration-300 snap-start">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
                  "As a student, Airbcar is a lifesaver. It's so much cheaper than owning a car, 
                  and I can still get around the city whenever I need to."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-orange-600 font-bold">L</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Leila K.</div>
                    <div className="text-sm text-gray-500">Marrakech</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 4 */}
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg min-w-[320px] md:min-w-[350px] flex-shrink-0 hover:shadow-xl transition-shadow duration-300 snap-start">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
                  "The perfect solution for weekend trips! I can rent a car when I need it without 
                  the hassle of ownership. Great selection and competitive prices."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-orange-600 font-bold">M</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Mohamed F.</div>
                    <div className="text-sm text-gray-500">Fez</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 5 */}
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg min-w-[320px] md:min-w-[350px] flex-shrink-0 hover:shadow-xl transition-shadow duration-300 snap-start">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
                  "Excellent customer service and reliable vehicles. I use Airbcar for business trips 
                  and they never disappoint. Highly recommend!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-orange-600 font-bold">Z</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Zineb H.</div>
                    <div className="text-sm text-gray-500">Agadir</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 6 */}
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg min-w-[320px] md:min-w-[350px] flex-shrink-0 hover:shadow-xl transition-shadow duration-300 snap-start">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
                  "Great for exploring Morocco! Clean cars, easy booking process, and fantastic 
                  support team. Made our vacation planning stress-free."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-orange-600 font-bold">Y</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Youssef A.</div>
                    <div className="text-sm text-gray-500">Tangier</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-400 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="text-center lg:text-left">
              <div className="mb-6">
                <span className="text-white/80 text-lg">About us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Airbcar is the first Moroccan<br />
                mobility rental car app.
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl">
                We're making cities for people, offering better alternatives for 
                every purpose a private car serves — including 
                ride-hailing, shared cars, scooters, 
                and food and grocery delivery.
              </p>
              <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg">
                Be Partner
              </button>
            </div>
            
            {/* Right side - Mobile app mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone frame */}
                <div className="w-80 h-[600px] bg-black rounded-[3rem] p-3 shadow-2xl">
                  {/* Screen */}
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Status bar */}
                    <div className="flex justify-between items-center px-6 py-3 text-black text-sm">
                      <span className="font-medium">9:41</span>
                      <div className="flex space-x-1">
                        <div className="w-4 h-2 bg-black rounded-sm"></div>
                        <div className="w-4 h-2 bg-black rounded-sm"></div>
                        <div className="w-4 h-2 bg-black rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* App content */}
                    <div className="px-6 py-4 space-y-3">
                      {/* Premium option */}
                      <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-8 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                            <svg className="w-10 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M5,11L6.5,6.5H17.5L19,11H5M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"/>
                            </svg>
                          </div>
                          <div>
                            <div className="text-gray-900 font-medium text-base">Premium</div>
                            <div className="text-gray-500 text-sm">Mid-size and luxury cars</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-900 font-bold text-lg">4.50 €</div>
                        </div>
                      </div>
                      
                      {/* Soft option */}
                      <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-8 rounded-xl overflow-hidden bg-orange-100 flex items-center justify-center">
                            <svg className="w-10 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M5,11L6.5,6.5H17.5L19,11H5M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"/>
                            </svg>
                          </div>
                          <div>
                            <div className="text-gray-900 font-medium text-base">Soft</div>
                            <div className="text-gray-500 text-sm">Eco and economy cars</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-900 font-bold text-lg">3.50 €</div>
                        </div>
                      </div>
                      
                      {/* Air option */}
                      <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-8 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center">
                            <svg className="w-10 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M5,11L6.5,6.5H17.5L19,11H5M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"/>
                            </svg>
                          </div>
                          <div>
                            <div className="text-gray-900 font-medium text-base">Air</div>
                            <div className="text-gray-500 text-sm">Standard car</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-900 font-bold text-lg">5.25 €</div>
                        </div>
                      </div>
                      
                      {/* Premium option 2 */}
                      <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-8 rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center">
                            <svg className="w-10 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M5,11L6.5,6.5H17.5L19,11H5M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M18.92,6C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6Z"/>
                            </svg>
                          </div>
                          <div>
                            <div className="text-gray-900 font-medium text-base">Premium</div>
                            <div className="text-gray-500 text-sm">Mid-size and luxury cars</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-orange-600 font-bold text-lg">3.50 €</div>
                        </div>
                      </div>
                      
                      {/* Bolt Drive option - highlighted */}
                      <div className="flex items-center justify-between py-4 bg-orange-50 rounded-2xl px-4 -mx-2">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                            </svg>
                          </div>
                          <div>
                            <div className="text-orange-600 font-bold text-base">Bolt Drive</div>
                            <div className="text-gray-500 text-sm">13 min walk 👥 4</div>
                            <div className="text-gray-500 text-sm">VVP-556</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-orange-600 font-bold text-lg">3.50 €</div>
                        </div>
                      </div>
                      
                      {/* Scooter option */}
                      <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                            <svg className="w-8 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M7.82 18c-.4 0-.8-.16-1.06-.44L5.5 16.3c-.54-.54-.54-1.42 0-1.96l.71-.71c.39-.39 1.02-.39 1.41 0l.71.71c.54.54.54 1.42 0 1.96l-1.26 1.26c-.26.28-.66.44-1.06.44m8.36 0c.4 0 .8-.16 1.06-.44l1.26-1.26c.54-.54.54-1.42 0-1.96l-.71-.71c-.39-.39-1.02-.39-1.41 0l-.71.71c-.54.54-.54 1.42 0 1.96l1.26 1.26c.26.28.66.44 1.06.44M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2"/>
                            </svg>
                          </div>
                          <div>
                            <div className="text-orange-600 font-bold text-base">Scooter</div>
                            <div className="text-gray-500 text-sm">5 min walk</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-orange-600 font-bold text-lg">3.80 €</div>
                        </div>
                      </div>
                      
                      {/* Tuk-Tuk option */}
                      <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-8 rounded-xl bg-orange-500 flex items-center justify-center relative">
                            <svg className="w-10 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M3 17h2c0 1.1.9 2 2 2s2-.9 2-2h6c0 1.1.9 2 2 2s2-.9 2-2h2v-5l-3-4H3v7zM3 6h8v5H3V6zm16 7.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 13.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
                            </svg>
                          </div>
                          <div>
                            <div className="text-orange-600 font-bold text-base">Tuk-Tuk</div>
                            <div className="text-gray-500 text-sm">5 min 👥 4</div>
                            <div className="text-gray-500 text-sm">3-wheel rides</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-orange-600 font-bold text-lg">3.80 €</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements for visual appeal */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact form</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                      Your Firstname *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="Enter your firstname"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                      Your Lastname *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Enter your lastname"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                    Your Message for us *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Enter your message"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400 resize-vertical"
                    required
                  ></textarea>
                </div>
                
                {/* reCAPTCHA */}
                <div className="flex items-center">
                  <div className="bg-gray-100 border border-gray-300 rounded p-4 flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="recaptcha"
                      className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      required
                    />
                    <label htmlFor="recaptcha" className="text-sm text-gray-700">
                      Je ne suis pas un robot
                    </label>
                    <div className="ml-auto">
                      <div className="text-xs text-gray-500">reCAPTCHA</div>
                      <div className="text-xs text-gray-400">Confidentialité - Conditions</div>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wide transition-colors duration-200 border-2 border-orange-500 hover:border-orange-600"
                >
                  Send Message
                </button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div className="lg:pl-12">
              <div className="space-y-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  We are here to help! If you are thinking of joining us as a rental partner, 
                  or have a question about booking through us, complete the form and we'll get 
                  back to you as soon as possible.
                </p>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our team aims to respond to all communications within 24hrs, so if you need 
                  an answer a little faster, please call us or use the live-chat functionality instead.
                </p>
                
                {/* Social Media Icons */}
                <div className="flex space-x-4 pt-6">
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center text-white transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
