'use client';
import { useScrollAnimation, animations, animationPresets } from "../../hooks/useScrollAnimation";
import { useMagnetic } from "../../hooks/useAdvancedScrollEffects";

export default function Features() {
  const [feature1Ref, feature1Visible] = useScrollAnimation({ delay: 100 });
  const [feature2Ref, feature2Visible] = useScrollAnimation({ delay: 200 });
  const [feature3Ref, feature3Visible] = useScrollAnimation({ delay: 300 });

  // Magnetic effects for feature cards
  const [magneticRef1, magneticStyle1] = useMagnetic(0.15);
  const [magneticRef2, magneticStyle2] = useMagnetic(0.15);
  const [magneticRef3, magneticStyle3] = useMagnetic(0.15);

  const features = [
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: "Search for cheap car rental in seconds – anywhere in the world",
      gradient: "from-orange-500 to-red-500",
      magneticRef: magneticRef1,
      magneticStyle: magneticStyle1,
      animationRef: feature1Ref,
      isVisible: feature1Visible
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Compare deals from trusted car rental providers in one place",
      gradient: "from-blue-500 to-purple-500",
      magneticRef: magneticRef2,
      magneticStyle: magneticStyle2,
      animationRef: feature2Ref,
      isVisible: feature2Visible
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Rent a car with a flexible booking policy or free cancellation",
      gradient: "from-green-500 to-teal-500",
      magneticRef: magneticRef3,
      magneticStyle: magneticStyle3,
      animationRef: feature3Ref,
      isVisible: feature3Visible
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-r from-green-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {features.map((feature, index) => (
            <div 
              key={index}
              ref={feature.magneticRef}
              className="text-center group cursor-pointer"
              style={{
                ...animationPresets.feature(feature.isVisible, index),
                ...feature.magneticStyle
              }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-orange-200 relative overflow-hidden">
                
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon container */}
                <div className="flex justify-center mb-6 relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                    {feature.icon}
                  </div>
                  
                  {/* Glow effect */}
                  <div className={`absolute inset-0 w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-full opacity-0 group-hover:opacity-30 group-hover:scale-150 transition-all duration-700 filter blur-md`}></div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300 leading-relaxed">
                  {feature.title}
                </h3>

                {/* Progress bar animation on hover */}
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${feature.gradient} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out`}></div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full opacity-20 transform group-hover:scale-150 transition-all duration-700 group-hover:rotate-180"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-20 transform group-hover:scale-125 transition-all duration-500 group-hover:-rotate-90"></div>
              </div>
            </div>
          ))}

        </div>

        {/* Additional animated elements */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <span className="animate-pulse">✨</span>
            <span className="font-medium">Trusted by over 10 million travelers</span>
            <span className="animate-pulse">✨</span>
          </div>
        </div>
      </div>
    </section>
  );
}