export default function HowItWorks() {
  const steps = [
    {
      step: "Step 1",
      title: "Search",
      description: "Enter your location and see what's available. From family-friendly SUVs to luxury convertibles, you'll get a great price on every type of car rental.",
      image: "/step1.webp",
      bgColor: "bg-gradient-to-br from-cyan-100 to-cyan-200",
      iconBg: "bg-gradient-to-br from-cyan-400 to-cyan-500",
      accentColor: "cyan",
      number: "01"
    },
    {
      step: "Step 2",
      title: "Compare", 
      description: "Compare rental cars on fuel policy, mileage, provider rating, flexible booking, cleanliness, customer service and more.",
      image: "/step2.webp",
      bgColor: "bg-gradient-to-br from-pink-100 to-pink-200", 
      iconBg: "bg-gradient-to-br from-pink-400 to-pink-500",
      accentColor: "pink",
      number: "02"
    },
    {
      step: "Step 3",
      title: "Book",
      description: "We compare car rental prices on hundreds of sites for you, so once you've found your ride, you'll be redirected to book with the provider, with no extra fees.",
      image: "/step3.png",
      bgColor: "bg-gradient-to-br from-yellow-100 to-yellow-200",
      iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-500",
      accentColor: "yellow",
      number: "03"
    }
  ];

  return (
    <section className="py-20 " style={{ background: 'linear-gradient(180deg, #ffffff 0%, #ffffff 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enhanced Container */}
        <div className="relative bg-gradient-to-br from-orange-50 via-white to-orange-100/50 rounded-3xl pt-16 pb-16 px-8 md:px-12 shadow-xl border border-orange-100/50 overflow-hidden">
          
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-200/40 rounded-full blur-2xl"></div>
          
          {/* Section Header */}
          <div className="text-center mb-20 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Book a car rental in 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                three simple steps
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our streamlined process makes car rental booking quick, easy, and transparent. Get on the road in minutes.
            </p>
          </div>

          {/* Enhanced Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="group relative">
                
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent z-0 transform translate-x-6"></div>
                )}
                
                {/* Step Card */}
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 group-hover:border-orange-200">
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">{step.number}</span>
                  </div>
                  
                  {/* Step Icon */}
                  <div className="flex justify-center mb-8">
                    <div className={`w-36 h-36 ${step.bgColor} rounded-full flex items-center justify-center relative shadow-lg group-hover:scale-110 transition-all duration-500 border-4 border-white`}>
                      {/* Floating Animation Ring */}
                      <div className={`absolute inset-0 ${step.iconBg} rounded-full opacity-20 animate-pulse`}></div>
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-24 h-24 object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-sm font-semibold text-gray-500 mr-2">{step.step}</span>
                      <div className="w-8 h-0.5 bg-gradient-to-r from-orange-400 to-transparent"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base">
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom Accent */}
                  <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-${step.accentColor}-400 to-${step.accentColor}-600 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}