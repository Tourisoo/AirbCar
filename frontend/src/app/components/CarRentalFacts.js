export default function CarRentalFacts() {
  const facts = [
    {
      icon: "💎",
      title: "Best deal found",
      description: "Everything you need to know to hit the road happy."
    },
    {
      icon: "🚗", 
      title: "Cheapest provider",
      description: "Everything you need to know to hit the road happy."
    },
    {
      icon: "❤️",
      title: "Highest-rated provider", 
      description: "Everything you need to know to hit the road happy."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Car rental fast facts
          </h2>
          <p className="text-gray-600">
            Everything you need to know to hit the road happy.
          </p>
        </div>

        {/* Facts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {facts.map((fact, index) => (
            <div key={index} className="text-center">
              
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">{fact.icon}</span>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{fact.title}</h3>
              <p className="text-gray-600">{fact.description}</p>
              
              {/* Placeholder for specific data */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-full h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
