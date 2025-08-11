'use client';
import { useScrollAnimation, animations } from "../../hooks/useScrollAnimation";
import { useScrollCounter, useMagnetic } from "../../hooks/useAdvancedScrollEffects";

export default function CarRentalFacts() {
  const [headerRef, headerVisible] = useScrollAnimation({ delay: 100 });
  const [gridRef, gridVisible] = useScrollAnimation({ delay: 200 });
  
  // Animated counters
  const [counter1Ref, counter1Value] = useScrollCounter(95, { duration: 2500 });
  const [counter2Ref, counter2Value] = useScrollCounter(12000, { duration: 3000 });
  const [counter3Ref, counter3Value] = useScrollCounter(87, { duration: 2000 });
  
  // Magnetic effects for cards
  const [magneticRef1, magneticStyle1] = useMagnetic(0.2);
  const [magneticRef2, magneticStyle2] = useMagnetic(0.2);
  const [magneticRef3, magneticStyle3] = useMagnetic(0.2);
  
  const facts = [
    {
      icon: "💎",
      title: "Best deal found",
      description: "Average savings on rental bookings",
      value: counter1Value,
      unit: "%",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: "🚗", 
      title: "Happy customers",
      description: "Satisfied customers worldwide",
      value: counter2Value,
      unit: "+",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: "❤️",
      title: "Highest-rated provider", 
      description: "Provider satisfaction rate",
      value: counter3Value,
      unit: "%",
      color: "from-red-500 to-pink-600"
    }
  ];

  const magneticRefs = [magneticRef1, magneticRef2, magneticRef3];
  const magneticStyles = [magneticStyle1, magneticStyle2, magneticStyle3];
  const counterRefs = [counter1Ref, counter2Ref, counter3Ref];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6b35' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               animation: 'float 6s ease-in-out infinite'
             }}>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div ref={headerRef} className="mb-12 text-center" style={animations.fadeInDown(headerVisible)}>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Car rental fast facts
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real numbers that showcase our commitment to excellence and customer satisfaction.
          </p>
        </div>

        {/* Facts Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {facts.map((fact, index) => (
            <div 
              key={index} 
              ref={magneticRefs[index]}
              className="text-center group cursor-pointer"
              style={{
                ...animations.staggeredFadeInUp(gridVisible, index),
                ...magneticStyles[index]
              }}
            >
              
              {/* Card Container */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-orange-200 relative overflow-hidden">
                
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${fact.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className="flex justify-center mb-6 relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-500 group-hover:rotate-12">
                    <span className="text-3xl filter group-hover:drop-shadow-lg transition-all duration-500">{fact.icon}</span>
                  </div>
                </div>

                {/* Counter Display */}
                <div ref={counterRefs[index]} className="mb-4">
                  <div className="text-5xl font-bold text-gray-900 mb-2 relative">
                    <span className="inline-block transform group-hover:scale-110 transition-transform duration-500">
                      {fact.value.toLocaleString()}
                    </span>
                    <span className="text-3xl text-orange-500 ml-1">{fact.unit}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                  {fact.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {fact.description}
                </p>
                
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full opacity-20 transform group-hover:scale-150 transition-all duration-700 group-hover:rotate-180"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-20 transform group-hover:scale-125 transition-all duration-500 group-hover:-rotate-90"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Stats Bar */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white text-center transform hover:scale-105 transition-all duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm opacity-90">Customer Support</div>
            </div>
            <div>
              <div className="text-2xl font-bold">150+</div>
              <div className="text-sm opacity-90">Countries</div>
            </div>
            <div>
              <div className="text-2xl font-bold">5★</div>
              <div className="text-sm opacity-90">Average Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold">10M+</div>
              <div className="text-sm opacity-90">Bookings</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </section>
  );
}
