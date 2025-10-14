"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { registerPartner } from '@/hooks/usePartners';

export default function PartnerPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    tax_id: '',
    agree_on_terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user) {
        setError('Please sign in to continue.');
        setLoading(false);
        router.push('/auth/signin');
        return;
      }

      const payload = {
        company_name: formData.company_name,
        tax_id: formData.tax_id,
        agree_on_terms: formData.agree_on_terms,
      };

      await registerPartner(payload);

      setShowModal(false);
      router.replace('/partner/dashboard');
    } catch (err) {
      const message = err?.message || 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative text-white py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-orange-500 to-red-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Become a Partner
          </h1>
          <p className="text-xl sm:text-2xl mb-8 opacity-90">
            Start earning with your vehicles today
          </p>
          
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            START EARNING TODAY - FREE
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose AirbCar?
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of successful partners
            </p>
                  </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
              <h3 className="text-xl font-semibold mb-2">Free Setup</h3>
              <p className="text-gray-600">No setup fees, no hidden costs</p>
                </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
              <h3 className="text-xl font-semibold mb-2">Quick Approval</h3>
              <p className="text-gray-600">Get approved within 24 hours</p>
              </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
              <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600">Safe and reliable service</p>
                    </div>
          </div>
        </div>
      </section>

      {/* Partner Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Become a Partner</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                      <input
                        type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your business name"
                        required
                      />
                    </div>

                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax ID
                        </label>
                      <input
                    type="text"
                    name="tax_id"
                    value={formData.tax_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your tax ID"
                        required
                      />
                  </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agree_on_terms"
                    checked={formData.agree_on_terms}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                    required
                  />
                  <label className="text-sm text-gray-600">
                    I agree to AirbCar's Terms of Service and Privacy Policy
                </label>
              </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                      </div>
                    )}
                    
                        <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                      </div>
                    ) : (
                    'Create Partner Account'
                  )}
                        </button>
              </form>
                        </div>
                      </div>
                      </div>
                    )}

      <Footer />
    </div>
  );
}

