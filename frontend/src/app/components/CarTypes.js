export default function CarTypes() {
  const carTypes = [
    {
      name: "Compact",
      doors: "4 door",
      people: 4,
      bags: 3,
      price: 136,
      image: "https://ik.imagekit.io/szcfr7vth/carsymbol.jpg?updatedAt=1756817912641",
      bgColor: "bg-blue-100"
    },
    {
      name: "Economy", 
      doors: "4 door",
      people: 4,
      bags: 2,
      price: 145,
      image: "https://ik.imagekit.io/szcfr7vth/carsymbol.jpg?updatedAt=1756817912641",
      bgColor: "bg-green-100"
    },
    {
      name: "Intermediate",
      doors: "4 door", 
      people: 5,
      bags: 4,
      price: 170,
      image: "https://ik.imagekit.io/szcfr7vth/carsymbol.jpg?updatedAt=1756817912641",
      bgColor: "bg-purple-100"
    },
    {
      name: "Mini",
      doors: "4 door",
      people: 4,
      bags: 1, 
      price: 203,
      image: "https://ik.imagekit.io/szcfr7vth/carsymbol.jpg?updatedAt=1756817912641",
      bgColor: "bg-orange-100"
    },
    {
      name: "Full-size",
      doors: "4 door",
      people: 5,
      bags: 4,
      price: 257,
      image: "https://ik.imagekit.io/szcfr7vth/carsymbol.jpg?updatedAt=1756817912641",
      bgColor: "bg-teal-100"
    },
    {
      name: "Premium",
      doors: "4 door",
      people: 5,
      bags: 2,
      price: 419,
      image: "https://ik.imagekit.io/szcfr7vth/carsymbol.jpg?updatedAt=1756817912641", 
      bgColor: "bg-indigo-100"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Find the best deals on 
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
              car rental in Fes
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Here are the most popular types of rental cars you can pick up from a point near you in the next 30 days.
          </p>
        </div>

        {/* Car Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {carTypes.map((car, index) => (
            <div key={index} className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-2xl hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden">
              
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <div className="w-full h-full bg-orange-500 rounded-full transform translate-x-16 -translate-y-16"></div>
              </div>

              {/* Car Image Placeholder */}
              <div className={`w-full h-40 ${car.bgColor} rounded-2xl mb-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                {/* <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-300">{car.image}</span> */}
                <img src={car.image} alt={car.name} className="absolute inset-0 w-full h-full object-cover" />
              </div>

              {/* Car Type Info */}
              <div className="mb-6 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">{car.name}</h3>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">{car.doors}</span>
                </div>
                
                {/* Enhanced Icons and Stats */}
                <div className="flex items-center space-x-6 text-base">
                  <div className="flex items-center text-orange-500 bg-orange-50 px-3 py-2 rounded-lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-semibold">{car.people}</span>
                  </div>
                  <div className="flex items-center text-orange-500 bg-orange-50 px-3 py-2 rounded-lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="font-semibold">{car.bags}</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Pricing */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 relative z-10">
                <div>
                  <span className="text-3xl font-bold text-gray-900">{car.price} €</span>
                  <span className="text-base text-gray-500 ml-2">per day</span>
                </div>
                <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Select
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 md:p-12 border border-orange-100">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Need a different type of vehicle?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
              Explore our full range of rental cars including luxury vehicles, SUVs, vans, and electric cars.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                View More Cars
                <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button className="inline-flex items-center px-8 py-4 bg-white text-orange-600 border-2 border-orange-200 font-semibold rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-all duration-300">
                Compare Prices
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}