export default function TrustSignals() {
  const partners = [
    { name: "United", logo: "🏢" },
    { name: "GetAround", logo: "🔄" },
    { name: "MOVRIS", logo: "🚗" },
    { name: "AIRCAR", logo: "✈️" },
    { name: "addCar", logo: "➕" },
    { name: "NORTH Car Rental", logo: "🧭" }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your trusted car rental companies, all in one place
          </h2>
        </div>

        {/* Partner Logos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {partners.map((partner, index) => (
            <div key={index} className="flex flex-col items-center p-4 hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-2xl">{partner.logo}</span>
              </div>
              <span className="text-sm font-medium text-gray-700">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
