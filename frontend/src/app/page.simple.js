'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-orange-500 text-white p-4">
        <h1 className="text-2xl font-bold">Airbcar</h1>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Airbcar
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Your premium car rental experience starts here
          </p>
          
          <div className="bg-orange-50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Car Rental Made Simple</h3>
            <p className="text-gray-700">
              Find and book the perfect car for your journey with our easy-to-use platform.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white p-4 mt-16">
        <div className="text-center">
          <p>&copy; 2025 Airbcar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
