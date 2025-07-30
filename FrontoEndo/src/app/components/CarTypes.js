export default function CarTypes() {
  const carTypes = [
    {
      name: "Compact",
      doors: "4 door",
      people: 4,
      bags: 3,
      price: 136,
      image: "🚗",
      bgColor: "bg-blue-100"
    },
    {
      name: "Economy", 
      doors: "4 door",
      people: 4,
      bags: 2,
      price: 145,
      image: "🚙",
      bgColor: "bg-green-100"
    },
    {
      name: "Intermediate",
      doors: "4 door", 
      people: 5,
      bags: 4,
      price: 170,
      image: "🚗",
      bgColor: "bg-purple-100"
    },
    {
      name: "Mini",
      doors: "4 door",
      people: 4,
      bags: 1, 
      price: 203,
      image: "🚗",
      bgColor: "bg-orange-100"
    },
    {
      name: "Full-size",
      doors: "4 door",
      people: 5,
      bags: 4,
      price: 257,
      image: "🚗",
      bgColor: "bg-teal-100"
    },
    {
      name: "Premium",
      doors: "4 door",
      people: 5,
      bags: 2,
      price: 419,
      image: "🚗", 
      bgColor: "bg-indigo-100"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Find the best deals on car rental in Fes
          </h2>
          <p className="text-gray-600">
            Here are the most popular types of rental cars you can pick up from a point near you in the next 30 days.
          </p>
        </div>

        {/* Car Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carTypes.map((car, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              
              {/* Car Image Placeholder */}
              <div className={`w-full h-32 ${car.bgColor} rounded-lg mb-4 flex items-center justify-center`}>
                <span className="text-4xl">{car.image}</span>
              </div>

              {/* Car Type Info */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{car.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{car.doors}</p>
                
                {/* Icons and Stats */}
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center text-orange-500">
                    <span className="mr-1">👥</span>
                    <span>{car.people}</span>
                  </div>
                  <div className="flex items-center text-orange-500">
                    <span className="mr-1">🎒</span>
                    <span>{car.bags}</span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-gray-900">{car.price} €</span>
                  <span className="text-sm text-gray-500 ml-1">per day</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Deals Link */}
        <div className="text-center mt-8">
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            View all deals →
          </button>
        </div>
      </div>
    </section>
  );
}