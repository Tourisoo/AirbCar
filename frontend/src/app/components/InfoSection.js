export default function InfoSection() {
  const tips = [
    {
      icon: "https://ik.imagekit.io/szcfr7vth/calendar-icon.png?updatedAt=1756818617536",
      title: "Book now, cancel later",
      description: "There are many car and van rental options with flexible booking policies and free cancellation. So you can score the best deal with total flexibility to change your plans last-minute if you need to.",
      color: "orange"
    },
    {
      icon: "https://ik.imagekit.io/szcfr7vth/clock-icon.png?updatedAt=1756818617536",
      title: "Rent a car in Fes for a whole month",
      description: "Want to rent a car for almost a month? Often, car rental companies avoid costly admin in between pickups by renting out cars for longer periods. So see if a monthly car rental is cheaper than the three weeks you need it for by selecting 30 days.",
      color: "blue"
    },
    {
      icon: "https://ik.imagekit.io/szcfr7vth/fuel-icon.png?updatedAt=1756818617536",
      title: "Compare fuel policies",
      description: "To save money on topping up the tank before you take off, look out for deals with a \"full-to-full\" fuel tank policy.",
      color: "green"
    },
    {
      icon: "https://ik.imagekit.io/szcfr7vth/lightning-icon.png?updatedAt=1756818617536",
      title: "Skip the lines",
      description: "We call out keyless or self-service pick-up when you search with us. No keys to pick up or paperwork to fill in means no queues. Just head to your preferred car rental location, hop in and hit the road.",
      color: "purple"
    },
    {
      icon: "https://ik.imagekit.io/szcfr7vth/leaf-icon.png?updatedAt=1756818617536",
      title: "Go greener",
      description: "Limit your impact on this beautiful planet while you explore it. Filter by electric vehicles, which will be charged up and ready to go when you pick them up, meaning no worries about fuel policies either.",
      color: "emerald"
    },
    {
      icon: "https://ik.imagekit.io/szcfr7vth/location-icon.png?updatedAt=1756818617536",
      title: "Look further afield",
      description: "If you're on a budget, it's often cheaper to hop on public transportation to a car rental pick-up location a little farther away.",
      color: "indigo"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl overflow-hidden mb-20 min-h-[500px] md:min-h-[600px] lg:min-h-[650px] shadow-2xl">
          {/* Background Image */}
          <div 
						className="absolute inset-0 bg-cover bg-center bg-no-repeat"
						style={{ backgroundImage: "url('/info-background.png')" }}></div>
          
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
          
          {/* Content */}
          <div className="relative h-full flex items-center justify-start px-6 sm:px-8 md:px-12 lg:px-20 py-16 md:py-20">
            <div className="max-w-3xl w-full">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Making cities for
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                  people, not cars.
                </span>
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
                By sharing our knowledge of the industry and real-time data we're helping to improve our cities and create sustainable transportation solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r bg-orange-500/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold 0 hover:shadow-lg transition-all duration-300 text-base shadow-lg transform hover:bg-orange/20 hover:scale-105 hover:-translate-y-1 border border-orange-500/20 ">
                  Our Mission
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* How to find section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How to find the best car rental deal
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
              We're frequently named the most trusted travel search site out there. We're free to use and we'll do the hard work for you by searching hundreds of car rental companies, so you can instantly compare prices and then book.
            </p>
          </div>

          {/* Enhanced Tips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tips.map((tip, index) => (
              <div 
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                  <div className={`w-full h-full bg-${tip.color}-500 rounded-full transform translate-x-6 -translate-y-6 group-hover:scale-150 transition-transform duration-500`}></div>
                </div>
                
                {/* Icon */}
                <div className="flex items-center justify-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br from-${tip.color}-100 to-${tip.color}-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border border-${tip.color}-200`}>
                    <img 
                      src={tip.icon} 
                      alt={tip.title}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  {tip.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {tip.description}
                </p>

              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 md:p-12 border border-orange-100">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Ready to find your perfect rental?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Start comparing prices from over 500+ rental companies and save up to 40% on your next car rental.
              </p>
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Search Rentals Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
