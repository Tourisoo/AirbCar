'use client'

import { useState } from 'react'

export default function RentalPolicies() {
  const [activeSection, setActiveSection] = useState('general')

  const sections = [
    { id: 'general', title: 'General Terms', icon: '📋' },
    { id: 'booking', title: 'Booking & Cancellation', icon: '📅' },
    { id: 'insurance', title: 'Insurance & Protection', icon: '🛡️' },
    { id: 'vehicle', title: 'Vehicle Usage', icon: '🚗' },
    { id: 'payment', title: 'Payment & Fees', icon: '💳' },
    { id: 'support', title: 'Support & Contact', icon: '📞' }
  ]

  const policies = {
    general: {
      title: 'General Terms & Conditions',
      content: [
        {
          subtitle: 'Eligibility Requirements',
          items: [
            'Must be at least 21 years old to rent a vehicle',
            'Valid driver\'s license required (minimum 1 year)',
            'International driving permit required for foreign licenses',
            'Credit card in the primary driver\'s name required'
          ]
        },
        {
          subtitle: 'Rental Agreement',
          items: [
            'All rentals are subject to vehicle availability',
            'Rental period begins and ends on specified dates',
            'Late returns may incur additional charges',
            'All drivers must be listed on the rental agreement'
          ]
        }
      ]
    },
    booking: {
      title: 'Booking & Cancellation Policy',
      content: [
        {
          subtitle: 'Booking Process',
          items: [
            'Reservations can be made online or through our mobile app',
            'Confirmation email will be sent within 24 hours',
            'Full payment or deposit required at time of booking',
            'Vehicle pickup location must be confirmed'
          ]
        },
        {
          subtitle: 'Cancellation Policy',
          items: [
            'Free cancellation up to 48 hours before pickup',
            '50% refund for cancellations 24-48 hours before pickup',
            'No refund for cancellations less than 24 hours before pickup',
            'Emergency cancellations will be reviewed case by case'
          ]
        }
      ]
    },
    insurance: {
      title: 'Insurance & Protection Plans',
      content: [
        {
          subtitle: 'Basic Coverage',
          items: [
            'Third-party liability insurance included',
            'Collision damage waiver available',
            'Theft protection coverage available',
            'Personal accident insurance optional'
          ]
        },
        {
          subtitle: 'Damage Policy',
          items: [
            'Renter responsible for damage not covered by insurance',
            'Security deposit held until vehicle inspection',
            'Minor damages may be deducted from deposit',
            'Major damages require insurance claim process'
          ]
        }
      ]
    },
    vehicle: {
      title: 'Vehicle Usage Guidelines',
      content: [
        {
          subtitle: 'Permitted Use',
          items: [
            'Personal use only, no commercial activities',
            'Driving within specified geographic boundaries',
            'Maximum number of passengers as per vehicle capacity',
            'No smoking or pets allowed in vehicles'
          ]
        },
        {
          subtitle: 'Prohibited Activities',
          items: [
            'Off-road driving or racing',
            'Towing other vehicles or trailers',
            'Transporting hazardous materials',
            'Using vehicle under influence of alcohol or drugs'
          ]
        }
      ]
    },
    payment: {
      title: 'Payment Terms & Fees',
      content: [
        {
          subtitle: 'Payment Methods',
          items: [
            'Credit cards (Visa, MasterCard, American Express)',
            'Debit cards accepted with additional verification',
            'Cash payments not accepted',
            'Payment must be in the name of primary driver'
          ]
        },
        {
          subtitle: 'Additional Fees',
          items: [
            'Late return fee: €25 per hour',
            'Fuel service charge if returned empty',
            'Cleaning fee for excessive dirt or odors',
            'Traffic violation fees passed to renter'
          ]
        }
      ]
    },
    support: {
      title: 'Customer Support & Contact',
      content: [
        {
          subtitle: 'Emergency Support',
          items: [
            '24/7 roadside assistance available',
            'Emergency contact number provided with rental',
            'Breakdown and accident reporting procedures',
            'Replacement vehicle service when available'
          ]
        },
        {
          subtitle: 'Contact Information',
          items: [
            'Customer service: +212 5XX-XXXXXX',
            'Email support: support@airbcar.com',
            'Emergency line: +212 6XX-XXXXXX',
            'Online chat available 9 AM - 6 PM'
          ]
        }
      ]
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Rental Policies & Terms
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about renting with Airbcar. 
              Please read these policies carefully before making your reservation.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                    }`}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {policies[activeSection].title}
                </h2>
              </div>

              <div className="space-y-8">
                {policies[activeSection].content.map((section, index) => (
                  <div key={index} className="border-b border-gray-100 pb-8 last:border-b-0 last:pb-0">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      {section.subtitle}
                    </h3>
                    <ul className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Important Notice */}
              <div className="mt-12 p-6 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-orange-800 mb-2">Important Notice</h4>
                    <p className="text-orange-700 leading-relaxed">
                      These policies are subject to change without notice. By completing a reservation, 
                      you agree to abide by all current terms and conditions. For questions about our 
                      policies, please contact our customer support team.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl">🤝</div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Need clarification?</p>
                    <p className="text-sm text-gray-600">Our support team is here to help</p>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}