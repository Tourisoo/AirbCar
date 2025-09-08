export default function CarRentalFacts() {
  const facts = [
    {
      image: "/635798891991116891-ThinkstockPhotos-506493415.webp",
      alt: "Car keys being handed over",
      title: "Best deal found",
      description: "Save up to 40% compared to booking directly with rental companies.",
      value: "$25/day",
      subtext: "Economy cars from"
    },
    {
      image: "/exotel_idc_banner-scaled.jpg",
      alt: "Professional using mobile app",
      title: "Cheapest provider",
      description: "Compare prices from over 500+ rental companies worldwide.",
      value: "Budget Rent",
      subtext: "Most affordable option"
    },
    {
      image: "/large_pexels_vlada_karpovich_4050388_caa0bc8107.jpg",
      alt: "Woman booking online",
      title: "Highest-rated provider", 
      description: "Customer satisfaction ratings based on verified reviews.",
      value: "4.8/5",
      subtext: "Enterprise rating"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Car Rental Fast Facts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know to hit the road happy. Compare, save, and drive with confidence.
          </p>
        </div>

        {/* Facts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {facts.map((fact, index) => (
            <div 
              key={index} 
              className="group text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              
              {/* Image */}
              <div className="flex justify-center mb-6">
                <div className="w-100 h-60 overflow-hidden shadow-lg transition-transform duration-300 ">
                  <img 
                    src={fact.image} 
                    alt={fact.alt}
                    className="w-full h-full object-cover border-4 border-none rounded-xl"
                  />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">{fact.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{fact.description}</p>
              
              {/* Data Display */}
              <div className="mt-6 p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border ">
                <div className="text-2xl font-bold text-orange-600 mb-1">{fact.value}</div>
                <div className="text-sm text-orange-500 font-medium">{fact.subtext}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
