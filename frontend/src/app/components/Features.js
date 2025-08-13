'use client';
import { useScrollAnimation, animationPresets } from "../../hooks/useScrollAnimation";
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
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B35' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               animation: 'float 6s ease-in-out infinite'
             }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Airbcar?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the features that make us the best choice for your car rental needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={feature.animationRef}
              style={{
                ...animationPresets.card(feature.isVisible, index),
                ...feature.magneticStyle
              }}
              className="group"
            >
              <div
                ref={feature.magneticRef}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${feature.gradient} rounded-full transform transition-transform duration-1000 ${feature.isVisible ? 'translate-x-0' : '-translate-x-full'}`}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </section>
  );
}