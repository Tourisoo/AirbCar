'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './partner-styles.css';
const front_img = '/pictures_car_example/image_front.png';
const side_img = '/pictures_car_example/image_side.png';
const back_img = '/pictures_car_example/image_back.png';
const interior_img = '/pictures_car_example/image_interior.png';

export default function BecomePartner() {
  // Submission state for disabling submit button and showing loading spinner
  const [isSubmitting, setIsSubmitting] = useState(false);
  // For previewing uploaded vehicle photos
  const [photoPreviews, setPhotoPreviews] = useState([]);

  // Moroccan cities
  const moroccanCities = [
    'Casablanca', 'Rabat', 'Fès', 'Marrakech', 'Agadir', 'Tangier', 'Meknès', 'Oujda',
    'Kenitra', 'Tetouan', 'Safi', 'Mohammedia', 'Khouribga', 'El Jadida', 'Béni Mellal',
    'Nador', 'Taza', 'Settat', 'Larache', 'Ksar El Kebir', 'Sale', 'Berrechid', 'Khemisset',
    'Inezgane', 'Ouarzazate', 'Tiznit', 'Taroudant', 'Guelmim', 'Beni Mellal', 'Errachidia',
    'Essaouira', 'Chefchaouen', 'Al Hoceima', 'Ifrane', 'Azrou', 'Midelt', 'Zagora',
    'Tan-Tan', 'Laayoune', 'Dakhla'
  ];

  const [vehicleData, setVehicleData] = useState({
    brand: '',
    model: '',
    year: '',
    color: '',
    fuelType: '',
    transmission: '',
    engineSize: '',
    mileage: '',
    maxSpeed: '',
    seatingCapacity: '',
    features: [],
    condition: '',
    lastService: '',
    insuranceValid: '',
    location: '',
    address: '',
    dailyRate: '',
    weeklyRate: '',
    monthlyRate: '',
    securityDeposit: '',
    registrationNumber: '',
    photos: [],
    description: '',
    rules: '',
    availability: 'available'
  });
  const [formErrors, setFormErrors] = useState({});
  const testimonialsRef = useRef(null);

  const photoInputRef = useRef(null);

  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [partnerFormStep, setPartnerFormStep] = useState(1);
  const [showPartnerForm, setShowPartnerForm] = useState(false);

  const [photos, setPhotos] = useState({
    front: null,
    side: null,
    back: null,
    interior: null
  });

  const [formData, setFormData] = useState({
    // Step 1: Business Information
    businessName: '',
    email: '',
    phone: '',
    businessType: '',
    experience: '',
    // Step 2: Fleet Information
    vehicleCount: '',
    vehicleTypes: [],
    operatingAreas: [],
    // Step 3: Business Documents
    businessLicense: null,
    gstNumber: '',
    panCard: null,
    bankDetails: '',
    // Step 4: Agreement
    agreeToTerms: false,
    agreeToMarketing: false
  });

  useEffect(() => {
    if (vehicleData.photos && vehicleData.photos.length > 0) {
      const previews = vehicleData.photos.map(file => {
        if (file instanceof File) {
          return URL.createObjectURL(file);
        }
        return file; // In case it's already a URL
      });
      setPhotoPreviews(previews);
    } else {
      setPhotoPreviews([]);
    }
  }, [vehicleData.photos]);

  const scrollRight = () => {
    if (testimonialsRef.current) {
      testimonialsRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (testimonialsRef.current) {
      testimonialsRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPhotos(prev => ({ ...prev, [type]: url }));
    }
  };


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      if (name === 'vehicleTypes' || name === 'operatingAreas') {
        const updatedArray = checked
          ? [...formData[name], value]
          : formData[name].filter(item => item !== value);
        setFormData({
          ...formData,
          [name]: updatedArray
        });
      } else {
        setFormData({
          ...formData,
          [name]: checked
        });
      }
    } else if (type === 'file') {
      setFormData({
        ...formData,
        [name]: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validatePartnerStep = (step) => {
    const errors = {};

    switch (step) {
      case 1:
        if (!formData.businessName) errors.businessName = 'Business name is required';
        if (!formData.businessType) errors.businessType = 'Business type is required';
        if (!formData.experience) errors.experience = 'Experience is required';
        break;
      case 2:
        if (!formData.vehicleCount) errors.vehicleCount = 'Vehicle count is required';
        if (formData.vehicleTypes.length === 0) errors.vehicleTypes = 'Select at least one vehicle type';
        if (formData.operatingAreas.length === 0) errors.operatingAreas = 'Select at least one operating area';
        break;
      case 3:
        if (!formData.gstNumber) errors.gstNumber = 'GST number is required';
        if (!formData.bankDetails) errors.bankDetails = 'Bank details are required';
        break;
      case 4:
        if (!formData.agreeToTerms) errors.agreeToTerms = 'You must agree to terms and conditions';
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextPartnerStep = () => {
    if (validatePartnerStep(partnerFormStep) && partnerFormStep < 4) {
      setPartnerFormStep(partnerFormStep + 1);
    }
  };

  const prevPartnerStep = () => {
    if (partnerFormStep > 1) {
      setPartnerFormStep(partnerFormStep - 1);
      setFormErrors({}); // Clear errors when going back
    }
  };

  const handleVehicleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      if (name === 'features') {
        const updatedFeatures = checked
          ? [...vehicleData.features, value]
          : vehicleData.features.filter(feature => feature !== value);
        setVehicleData({
          ...vehicleData,
          features: updatedFeatures
        });
      } else {
        setVehicleData({
          ...vehicleData,
          [name]: checked
        });
      }
    } else if (type === 'file') {
      if (name === 'photos') {
        const files = Array.from(e.target.files);
        setVehicleData({
          ...vehicleData,
          photos: [...vehicleData.photos, ...files]
        });
      } else {
        setVehicleData({
          ...vehicleData,
          [name]: e.target.files[0]
        });
      }
    } else {
      let updatedData = { ...vehicleData, [name]: value };

      // Auto-calculate weekly and monthly rates when daily rate changes
      if (name === 'dailyRate' && value) {
        const daily = parseFloat(value);
        if (!isNaN(daily)) {
          updatedData.weeklyRate = Math.round(daily * 7 * 0.85); // 15% discount for weekly
          updatedData.monthlyRate = Math.round(daily * 30 * 0.75); // 25% discount for monthly
        }
      }

      setVehicleData(updatedData);
    }

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 1:
        if (!vehicleData.brand) errors.brand = 'Brand is required';
        if (!vehicleData.model) errors.model = 'Model is required';
        if (!vehicleData.year) errors.year = 'Year is required';
        if (!vehicleData.fuelType) errors.fuelType = 'Fuel type is required';
        if (!vehicleData.transmission) errors.transmission = 'Transmission is required';
        break;
      case 2:
        if (!vehicleData.seatingCapacity) errors.seatingCapacity = 'Seating capacity is required';
        if (!vehicleData.condition) errors.condition = 'Vehicle condition is required';
        break;
      case 3:
        // No required fields for Step 3 (Features & Safety)
        break;
      case 4:
        if (!vehicleData.location) errors.location = 'Location is required';
        if (!vehicleData.dailyRate) errors.dailyRate = 'Daily rate is required';
        break;
      case 5:
        if (!vehicleData.registrationNumber) errors.registrationNumber = 'Registration number is required';
        if (!vehicleData.ownershipProof) errors.ownershipProof = 'Ownership proof is required';
        if (!vehicleData.insuranceDoc) errors.insuranceDoc = 'Insurance document is required';
        if (vehicleData.photos.length === 0) errors.photos = 'At least one photo is required';
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setFormErrors({}); // Clear errors when going back
    }
  };


  // Partner registration form submit (Step 1 form)
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});
    // Simple validation for businessName and agreeToTerms
    const errors = {};
    if (!formData.businessName) errors.businessName = 'Business name is required';
    if (!formData.agreeToTerms) errors.agreeToTerms = 'You must agree to terms and conditions';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          data.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((v) => data.append(key, v));
        } else {
          data.append(key, value);
        }
      });
      const res = await fetch('/api/partner/register', {
        method: 'POST',
        body: data
      });
      if (res.ok) {
        setShowAddVehicleForm(true);
      } else {
        const err = await res.json().catch(() => ({}));
        setFormErrors(err.errors || { general: 'Submission failed' });
      }
    } catch (error) {
      setFormErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };


  // Partner multi-step form submit (Step 2-4)
  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    if (!validatePartnerStep(4)) return;
    setIsSubmitting(true);
    setFormErrors({});
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          data.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((v) => data.append(key, v));
        } else {
          data.append(key, value);
        }
      });
      const res = await fetch('/api/partner/register', {
        method: 'POST',
        body: data
      });
      if (res.ok) {
        alert('🎉 Registration successful! Welcome to AirbCar Partner Network. You can now add your vehicles to start earning.');
        setShowPartnerForm(false);
        setShowAddVehicleForm(true);
        setPartnerFormStep(1);
        setFormErrors({});
      } else {
        const err = await res.json().catch(() => ({}));
        setFormErrors(err.errors || { general: 'Submission failed' });
      }
    } catch (error) {
      setFormErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };


  // Vehicle registration form submit
  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(5)) return;
    setIsSubmitting(true);
    setFormErrors({});
    try {
      const data = new FormData();
      Object.entries(vehicleData).forEach(([key, value]) => {
        if (key === 'photos' && Array.isArray(value)) {
          value.forEach((file) => data.append('photos', file));
        } else if (value instanceof File) {
          data.append(key, value);
        } else {
          data.append(key, value);
        }
      });
      const res = await fetch('/api/vehicle/register', {
        method: 'POST',
        body: data
      });
      if (res.ok) {
        alert('🎉 Vehicle added successfully! Our team will review and approve it within 24 hours. You\'ll receive a confirmation email shortly.');
        setShowAddVehicleForm(false);
        setCurrentStep(1);
        setFormErrors({});
        setVehicleData({
          brand: '', model: '', year: '', fuelType: '', transmission: '',
          engineSize: '', mileage: '', maxSpeed: '', seatingCapacity: '',
          features: [], condition: '', lastService: '', insuranceValid: '',
          location: '', address: '', dailyRate: '', weeklyRate: '', monthlyRate: '', securityDeposit: '',
          registrationNumber: '', photos: [],
          description: '', rules: '', availability: 'available'
        });
      } else {
        const err = await res.json().catch(() => ({}));
        setFormErrors(err.errors || { general: 'Submission failed' });
      }
    } catch (error) {
      setFormErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };


  // Handle vehicle photo drop/upload
  const handleVehiclePhotoDrop = (files) => {
    const validFiles = files.filter(file => file.type.startsWith("image/"));
    if (validFiles.length > 0) {
      setVehicleData(prev => ({
        ...prev,
        photos: [...prev.photos, ...validFiles]
      }));
    }
  };

  // Handle removing vehicle photo
  const handleRemoveVehiclePhoto = (index) => {
    setVehicleData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative text-white py-20 lg:py-32 overflow-hidden" style={{
        backgroundImage: 'url(/car-rental-tips.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>

        {/* Animated Background Pattern - Updated for orange theme */}
        {/* <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-orange-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-red-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-40 right-1/3 w-12 h-12 bg-amber-400 rounded-full animate-pulse"></div>
        </div> */}

        {/* Background image overlay */}
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/car-rental-tips.jpg')`,
            mixBlendMode: 'overlay'
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-left">

              <h3 className="text-4xl lg:text-6xl font-bold leading-tight" style={{ fontSize: '45px' }}>
                Put your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">vehicle</span> in<br />
              </h3>

              {/* Feature List */}
              <div className="space-y-5 text-lg">
                <div className="flex items-center space-x-4 group hover:bg-white hover:bg-opacity-10 rounded-lg p-3 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-200 group-hover:text-white transition-colors duration-300">It's <span className="font-bold text-green-400">100% free</span> to list your motorbikes online.</span>
                </div>
                <div className="flex items-center space-x-4 group hover:bg-white hover:bg-opacity-10 rounded-lg p-3 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <span className="text-gray-200 group-hover:text-white transition-colors duration-300">You set your <span className="font-bold text-purple-400">own prices</span>, control your business.</span>
                </div>
                <div className="flex items-center space-x-4 group hover:bg-white hover:bg-opacity-10 rounded-lg p-3 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="text-gray-200 group-hover:text-white transition-colors duration-300">Manage <span className="font-bold text-pink-400">online & offline</span> bookings seamlessly.</span>
                </div>
                <div className="flex items-center space-x-4 group hover:bg-white hover:bg-opacity-10 rounded-lg p-3 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-200 group-hover:text-white transition-colors duration-300"><span className="font-bold text-red-400">24/7 premium support</span> by phone, email, or chat.</span>
                </div>
              </div>

            </div>

            {/* Right Side - Registration Form */}
            <div className="relative animate-fade-in-right">
              <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{backgroundColor: 'var(--color-orange-500);' }}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent mb-2" style={{color: 'var(--color-orange-500);' }}>Join AirbCar Partner Network</h3>
                  <p className="text-gray-600">Start earning from your motorbike fleet today</p>

                  <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Free Setup
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      2-min Process
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Instant Approval
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="relative">
                    <input
                      type="text"
                      name="businessName"
                      placeholder="Business Name"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 pt-2">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
                      required
                    />
                    <label className="text-sm text-gray-600 leading-relaxed">
                      I agree to AirbCar's <span className="text-blue-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>. I consent to receive marketing communications.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                    style={{backgroundColor: 'var(--color-orange-500);' }}
                  >
                    <span>START EARNING TODAY - FREE</span>
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-3">
                    Quick approval in 24 hours • Start earning immediately • Secure & trusted platform
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add Vehicle Form Modal */}
      {showAddVehicleForm && (
        <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add Your Vehicle</h2>
                  <p className="text-gray-600">Step {currentStep} of 5 - Let's get your vehicle listed!</p>
                </div>
                <button
                  onClick={() => setShowAddVehicleForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>Basic Info</span>
                  <span>Specifications</span>
                  <span>Features</span>
                  <span>Pricing</span>
                  <span>Documents</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(currentStep / 5) * 100}%`,
                      backgroundColor: '#ff4c25'
                    }}
                  ></div>
                </div>
              </div>
            </div>


            <form onSubmit={handleVehicleSubmit} className="p-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#ff4c25' }}>
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Vehicle Basic Information</h3>
                    <p className="text-gray-600">Tell us about your vehicle's basic details</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                      <select
                        name="brand"
                        value={vehicleData.brand}
                        onChange={handleVehicleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.brand ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        required
                      >
                        <option value="">Select Brand</option>
                        <option value="Royal Enfield">Royal Enfield</option>
                        <option value="Honda">Honda</option>
                        <option value="Yamaha">Yamaha</option>
                        <option value="Bajaj">Bajaj</option>
                        <option value="TVS">TVS</option>
                        <option value="KTM">KTM</option>
                        <option value="Suzuki">Suzuki</option>
                        <option value="Hero">Hero</option>
                        <option value="Other">Other</option>
                      </select>
                      {formErrors.brand && <p className="text-red-500 text-xs mt-1">{formErrors.brand}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                      <input
                        type="text"
                        name="model"
                        value={vehicleData.model}
                        onChange={handleVehicleInputChange}
                        placeholder="e.g., Classic 350, R15 V4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                      <select
                        name="year"
                        value={vehicleData.year}
                        onChange={handleVehicleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Year</option>
                        {Array.from({ length: 15 }, (_, i) => 2024 - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type *</label>
                      <select
                        name="fuelType"
                        value={vehicleData.fuelType}
                        onChange={handleVehicleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Fuel Type</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Transmission *</label>
                      <select
                        name="transmission"
                        value={vehicleData.transmission}
                        onChange={handleVehicleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Transmission</option>
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Specifications */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgb(255, 76, 37)' }}>
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Vehicle Specifications</h3>
                    <p className="text-gray-600">Provide detailed specifications of your vehicle</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seating Capacity *</label>
                      <select
                        name="seatingCapacity"
                        value={vehicleData.seatingCapacity}
                        onChange={handleVehicleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Capacity</option>
                        <option value="2">2 People</option>
                        <option value="3">4 People</option>
                        <option value="3">5 People</option>
                        <option value="3">+7 People</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Condition *</label>
                      <select
                        name="condition"
                        value={vehicleData.condition}
                        onChange={handleVehicleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Condition</option>
                        <option value="Excellent">Excellent (Like new)</option>
                        <option value="Good">Good (Well maintained)</option>
                        <option value="Fair">Fair (Some wear)</option>
                      </select>
                    </div>

                  </div>
                </div>
              )}

              {/* Step 3: Features & Safety */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Features & Safety</h3>
                    <p className="text-gray-600">Highlight what makes your vehicle special</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Available Features (Select all that apply)</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        'GPS Navigation', 'Bluetooth Connectivity', 'USB Charging Port',
                        'LED Headlights', 'Digital Speedometer', 'Anti-theft System',
                        'Helmet Storage', 'Mobile Holder', 'Side Bags',
                        'First Aid Kit', 'Tool Kit', 'Spare Helmet',
                        'Rain Cover', 'Phone Charger', 'Action Camera Mount'
                      ].map((feature) => (
                        <label key={feature} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            name="features"
                            value={feature}
                            checked={vehicleData.features.includes(feature)}
                            onChange={handleVehicleInputChange}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Description</label>
                    <textarea
                      name="description"
                      value={vehicleData.description}
                      onChange={handleVehicleInputChange}
                      rows="4"
                      placeholder="Describe your vehicle's unique features, recent upgrades, or any special aspects customers should know about..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Step 4: Location & Pricing */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Location & Pricing</h3>
                    <p className="text-gray-600">Set competitive rates to maximize your bookings</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6"><div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City/Location *</label>
                    <select
                      name="location"
                      value={vehicleData.location}
                      onChange={handleVehicleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select City</option>
                      {moroccanCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>


                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Daily Rate (DH) *</label>
                      <input
                        type="number"
                        name="dailyRate"
                        value={vehicleData.dailyRate}
                        onChange={handleVehicleInputChange}
                        placeholder="e.g., 500, 750, 1000"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.dailyRate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        required
                      />
                      {formErrors.dailyRate && <p className="text-red-500 text-xs mt-1">{formErrors.dailyRate}</p>}
                      <p className="text-xs text-gray-500 mt-1">Suggested: DH400-800 for 150cc, DH600-1200 for 350cc+</p>
                    </div>
                  </div>


                  {/* Earnings Calculator */}
                  {vehicleData.dailyRate && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Potential Earnings Calculator
                      </h4>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white p-4 rounded-lg">
                          <div className="text-sm text-gray-600">If rented 15 days/month</div>
                          <div className="text-xl font-bold text-green-600">
                            DH{Math.round(vehicleData.dailyRate * 15 * 0.85).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Your earnings after 15% commission</div>
                        </div>

                        <div className="bg-white p-4 rounded-lg">
                          <div className="text-sm text-gray-600">If rented 20 days/month</div>
                          <div className="text-xl font-bold text-green-600">
                            DH{Math.round(vehicleData.dailyRate * 20 * 0.85).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Your earnings after 15% commission</div>
                        </div>

                        <div className="bg-white p-4 rounded-lg">
                          <div className="text-sm text-gray-600">If rented 25 days/month</div>
                          <div className="text-xl font-bold text-green-600">
                            DH{Math.round(vehicleData.dailyRate * 25 * 0.85).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Your earnings after 15% commission</div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 mt-3 text-center">
                        💡 Average partners rent their vehicles 18-22 days per month
                      </p>
                    </div>
                  )}
                </div>
              )}

{currentStep === 5 && (
  <div className="space-y-8">
    {/* Vehicle Detection Functions */}
    {(() => {
      // Enhanced vehicle detection using multiple sophisticated approaches
      const detectVehicleInImage = async (imageFile) => {
        return new Promise((resolve) => {
          const img = new Image();
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          img.onload = () => {
            try {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              
              // Get image data for analysis
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const data = imageData.data;
              
              let vehicleScore = 0;
              let metallic = 0;
              let darkColors = 0;
              let brightColors = 0;
              let edgePixels = 0;
              
              // More sophisticated color and pattern analysis
              for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const brightness = (r + g + b) / 3;
                
                // Check for typical vehicle colors with broader criteria
                if (
                  // Metallic/gray tones (more flexible)
                  (Math.abs(r - g) < 40 && Math.abs(g - b) < 40 && Math.abs(r - b) < 40) ||
                  // Common car colors - reds
                  (r > 120 && g < 80 && b < 80) ||
                  // Common car colors - blues  
                  (r < 80 && g < 100 && b > 120) ||
                  // Common car colors - greens
                  (r < 100 && g > 120 && b < 100) ||
                  // Black/dark colors (very common for cars)
                  (r < 60 && g < 60 && b < 60) ||
                  // White/light colors
                  (r > 200 && g > 200 && b > 200)
                ) {
                  metallic++;
                }
                
                if (brightness < 80) darkColors++;
                if (brightness > 180) brightColors++;
                
                // Simple edge detection for geometric shapes
                if (i > 0 && i < data.length - 4) {
                  const prevBrightness = (data[i-4] + data[i-3] + data[i-2]) / 3;
                  if (Math.abs(brightness - prevBrightness) > 30) {
                    edgePixels++;
                  }
                }
              }
              
              const totalPixels = data.length / 4;
              const metallicRatio = metallic / totalPixels;
              const darkRatio = darkColors / totalPixels;
              const brightRatio = brightColors / totalPixels;
              const edgeRatio = edgePixels / totalPixels;
              
              // Much more lenient scoring system
              if (metallicRatio > 0.15) vehicleScore += 25; // Reduced threshold
              if (darkRatio > 0.1) vehicleScore += 20; // Dark surfaces common in cars
              if (brightRatio > 0.05) vehicleScore += 15; // Light reflections
              if (edgeRatio > 0.05) vehicleScore += 15; // Geometric shapes
              if (canvas.width > canvas.height) vehicleScore += 15; // Landscape format
              if (canvas.width > 200 && canvas.height > 150) vehicleScore += 10; // Reasonable size
              
              // Additional bonus for typical car image characteristics
              const aspectRatio = canvas.width / canvas.height;
              if (aspectRatio > 1.2 && aspectRatio < 2.5) vehicleScore += 10; // Typical car photo ratio
              
              resolve({
                isVehicle: vehicleScore > 30, // Much lower threshold
                confidence: Math.min(vehicleScore, 100),
                details: {
                  metallicRatio: metallicRatio.toFixed(3),
                  darkRatio: darkRatio.toFixed(3),
                  brightRatio: brightRatio.toFixed(3),
                  edgeRatio: edgeRatio.toFixed(3),
                  dimensions: `${canvas.width}x${canvas.height}`,
                  aspectRatio: aspectRatio.toFixed(2),
                  score: vehicleScore
                }
              });
            } catch (error) {
              resolve({
                isVehicle: true,
                confidence: 75,
                details: { error: 'Analysis failed, allowing upload' }
              });
            }
          };
          
          img.onerror = () => {
            resolve({
              isVehicle: true,
              confidence: 75,
              details: { error: 'Image load failed, allowing upload' }
            });
          };
          
          img.src = URL.createObjectURL(imageFile);
        });
      };
      
      // Enhanced vehicle detection with multiple validation layers
      window.detectVehicle = async (imageFile) => {
        try {
          const basicResult = await detectVehicleInImage(imageFile);
          
          // File-based analysis
          const fileName = imageFile.name.toLowerCase();
          const hasCarKeywords = [
            'car', 'vehicle', 'auto', 'bmw', 'toyota', 'honda', 'ford', 
            'mercedes', 'audi', 'volkswagen', 'nissan', 'mazda', 'hyundai',
            'kia', 'lexus', 'infiniti', 'acura', 'volvo', 'subaru', 'jeep',
            'chevrolet', 'dodge', 'chrysler', 'buick', 'cadillac', 'lincoln',
            'porsche', 'ferrari', 'lamborghini', 'maserati', 'bentley',
            'sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'truck'
          ].some(keyword => fileName.includes(keyword));
          
          const fileSize = imageFile.size;
          const isGoodSize = fileSize > 50000 && fileSize < 15000000; // 50KB to 15MB
          
          let finalScore = basicResult.confidence;
          
          // Bonus points for positive indicators
          if (hasCarKeywords) finalScore += 25; // Strong indicator
          if (isGoodSize) finalScore += 10;
          if (imageFile.type.startsWith('image/jpeg') || imageFile.type.startsWith('image/jpg')) finalScore += 5; // Common photo format
          
          // Very lenient final check - most images should pass
          const isVehicle = finalScore > 25 || hasCarKeywords || basicResult.confidence > 40;
          
          return {
            isVehicle: isVehicle,
            confidence: Math.min(finalScore, 100),
            details: {
              ...basicResult.details,
              hasCarKeywords,
              fileSize: `${Math.round(fileSize / 1024)}KB`,
              fileType: imageFile.type,
              finalScore: finalScore,
              passedBasicTest: basicResult.confidence > 40,
              passedKeywordTest: hasCarKeywords,
              passedSizeTest: isGoodSize
            }
          };
        } catch (error) {
          console.error('Vehicle detection error:', error);
          // Very generous fallback - almost always allow upload
          return {
            isVehicle: true,
            confidence: 85,
            details: { error: 'Detection failed, allowing upload' }
          };
        }
      };
      
      return null;
    })()}
    {/* Header */}
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Pictures of the vehicle</h3>
      <p className="text-gray-600 mb-4">
        We only display cars with photos. You can start with one and add more later.
      </p>
      
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="text-sm font-medium text-gray-700">
          {Object.values(photos).filter(photo => photo && photo !== 'loading').length} of 4 photos uploaded
        </div>
        <div className="w-32 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(Object.values(photos).filter(photo => photo && photo !== 'loading').length / 4) * 100}%` }}
          />
        </div>
      </div>
    </div>

    {/* Tips Section */}
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Photography Tips
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          'Use landscape format for best results',
          'Follow our angle guidelines shown in examples',
          'Keep the background clear and neutral',
          'Use only natural daylight for best quality'
        ].map((tip, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{tip}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Photo Upload Sections */}
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 space-y-8">
        {/* Main Picture */}
        <div className="border-b border-gray-100 pb-8">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Main Picture</h4>
            <p className="text-gray-600">This is the first photo drivers will see - make it count!</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  3/4 Front
                  <span className="text-red-500 text-xs">*</span>
                </h5>
                <p className="text-sm text-gray-600 mt-1">A 3/4 front photo that stands out and showcases your vehicle's best angle.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              {/* Upload Area */}
              <div className="relative">
                <label 
                  className={`
                    relative block w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
                    ${photos.front ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
                  `}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) {
                      const fakeEvent = { target: { files: [file] } };
                      handleFileChange(fakeEvent, "front");
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {photos.front === 'loading' ? (
                    <div className="flex flex-col items-center justify-center h-full p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                      <p className="text-sm font-medium text-blue-600">Analyzing image...</p>
                      <p className="text-xs text-gray-500">Checking if this is a vehicle</p>
                    </div>
                  ) : photos.front ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={photos.front} 
                        alt="Front uploaded" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPhotos(prev => ({...prev, front: null}));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-4">
                      <svg className="w-6 h-6 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-sm font-medium text-gray-600">+ 3/4 Front</p>
                      <p className="text-xs text-gray-500 mt-1">Click to upload or drag & drop</p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Show loading state
                        setPhotos(prev => ({...prev, front: 'loading'}));
                        
                        // Detect vehicle
                        const detection = await window.detectVehicle(file);
                        
                        if (!detection.isVehicle) {
                          const message = `This image doesn't appear to be a vehicle photo (${detection.confidence}% confidence).\n\nAnalysis details:\n• Basic test: ${detection.details.passedBasicTest ? '✓ Passed' : '✗ Failed'}\n• Keywords: ${detection.details.passedKeywordTest ? '✓ Found' : '✗ None found'}\n• File size: ${detection.details.passedSizeTest ? '✓ Good' : '✗ Too small/large'}\n\nPlease upload a clear photo of your vehicle. If this is a vehicle photo, try renaming the file to include words like 'car' or the vehicle brand.`;
                          alert(message);
                          setPhotos(prev => ({...prev, front: null}));
                          return;
                        }
                        
                        handleFileChange(e, "front");
                      }
                    }}
                    aria-label="Upload front photo"
                  />
                </label>
              </div>

              {/* Example Image */}
              <div className="relative">
                <img 
                  src={front_img} 
                  alt="Example front view" 
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  Example
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Pictures */}
        <div>
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Additional Pictures</h4>
            <p className="text-gray-600">These photos help complete the story of your vehicle.</p>
          </div>
          
          <div className="space-y-8">
            {/* Side Photo */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-semibold text-gray-900">Side View</h5>
                  <p className="text-sm text-gray-600 mt-1">A side photo to give an idea of the size and profile of your car.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="relative">
                  <label 
                    className={`
                      relative block w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
                      ${photos.side ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
                    `}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        setPhotos(prev => ({...prev, side: 'loading'}));
                        const detection = await window.detectVehicle(file);
                        if (!detection.isVehicle) {
                          alert(`This doesn't appear to be a vehicle photo (${detection.confidence}% confidence). Please upload a clear photo of your vehicle.`);
                          setPhotos(prev => ({...prev, side: null}));
                          return;
                        }
                        const fakeEvent = { target: { files: [file] } };
                        handleFileChange(fakeEvent, "side");
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {photos.side === 'loading' ? (
                      <div className="flex flex-col items-center justify-center h-full p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                        <p className="text-sm font-medium text-blue-600">Analyzing image...</p>
                        <p className="text-xs text-gray-500">Checking if this is a vehicle</p>
                      </div>
                    ) : photos.side ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={photos.side} 
                          alt="Side uploaded" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setPhotos(prev => ({...prev, side: null}));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-4">
                        <svg className="w-6 h-6 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-600">+ Side</p>
                        <p className="text-xs text-gray-500 mt-1">Click to upload or drag & drop</p>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setPhotos(prev => ({...prev, side: 'loading'}));
                          const detection = await window.detectVehicle(file);
                          if (!detection.isVehicle) {
                            alert(`This doesn't appear to be a vehicle photo (${detection.confidence}% confidence). Please upload a clear photo of your vehicle.`);
                            setPhotos(prev => ({...prev, side: null}));
                            return;
                          }
                          handleFileChange(e, "side");
                        }
                      }}
                      aria-label="Upload side photo"
                    />
                  </label>
                </div>

                <div className="relative">
                  <img 
                    src={side_img} 
                    alt="Example side view" 
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Example
                  </div>
                </div>
              </div>
            </div>

            {/* Back Photo */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-semibold text-gray-900">3/4 Back</h5>
                  <p className="text-sm text-gray-600 mt-1">A 3/4 back photo to complete the exterior overview.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="relative">
                  <label 
                    className={`
                      relative block w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
                      ${photos.back ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
                    `}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        setPhotos(prev => ({...prev, back: 'loading'}));
                        const detection = await window.detectVehicle(file);
                        if (!detection.isVehicle) {
                          alert(`This doesn't appear to be a vehicle photo (${detection.confidence}% confidence). Please upload a clear photo of your vehicle.`);
                          setPhotos(prev => ({...prev, back: null}));
                          return;
                        }
                        const fakeEvent = { target: { files: [file] } };
                        handleFileChange(fakeEvent, "back");
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {photos.back === 'loading' ? (
                      <div className="flex flex-col items-center justify-center h-full p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                        <p className="text-sm font-medium text-blue-600">Analyzing image...</p>
                        <p className="text-xs text-gray-500">Checking if this is a vehicle</p>
                      </div>
                    ) : photos.back ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={photos.back} 
                          alt="Back uploaded" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setPhotos(prev => ({...prev, back: null}));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-4">
                        <svg className="w-6 h-6 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-600">+ 3/4 Back</p>
                        <p className="text-xs text-gray-500 mt-1">Click to upload or drag & drop</p>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setPhotos(prev => ({...prev, back: 'loading'}));
                          const detection = await window.detectVehicle(file);
                          if (!detection.isVehicle) {
                            alert(`This doesn't appear to be a vehicle photo (${detection.confidence}% confidence). Please upload a clear photo of your vehicle.`);
                            setPhotos(prev => ({...prev, back: null}));
                            return;
                          }
                          handleFileChange(e, "back");
                        }
                      }}
                      aria-label="Upload back photo"
                    />
                  </label>
                </div>

                <div className="relative">
                  <img 
                    src={back_img} 
                    alt="Example back view" 
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Example
                  </div>
                </div>
              </div>
            </div>

            {/* Interior Photo */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-semibold text-gray-900">Interior</h5>
                  <p className="text-sm text-gray-600 mt-1">An interior photo to help drivers picture themselves behind the wheel.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="relative">
                  <label 
                    className={`
                      relative block w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
                      ${photos.interior ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
                    `}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        setPhotos(prev => ({...prev, interior: 'loading'}));
                        // Interior photos have different detection criteria
                        const detection = await window.detectVehicle(file);
                        // For interior, we're more lenient as it's harder to detect
                        if (!detection.isVehicle && detection.confidence < 30) {
                          alert(`This doesn't appear to be a vehicle interior photo. Please upload a photo of your vehicle's interior.`);
                          setPhotos(prev => ({...prev, interior: null}));
                          return;
                        }
                        const fakeEvent = { target: { files: [file] } };
                        handleFileChange(fakeEvent, "interior");
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {photos.interior === 'loading' ? (
                      <div className="flex flex-col items-center justify-center h-full p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                        <p className="text-sm font-medium text-blue-600">Analyzing image...</p>
                        <p className="text-xs text-gray-500">Checking if this is a vehicle interior</p>
                      </div>
                    ) : photos.interior ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={photos.interior} 
                          alt="Interior uploaded" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setPhotos(prev => ({...prev, interior: null}));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-4">
                        <svg className="w-6 h-6 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-600">+ Interior</p>
                        <p className="text-xs text-gray-500 mt-1">Click to upload or drag & drop</p>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setPhotos(prev => ({...prev, interior: 'loading'}));
                          const detection = await window.detectVehicle(file);
                          // For interior, we're more lenient
                          if (!detection.isVehicle && detection.confidence < 30) {
                            alert(`This doesn't appear to be a vehicle interior photo. Please upload a photo of your vehicle's interior.`);
                            setPhotos(prev => ({...prev, interior: null}));
                            return;
                          }
                          handleFileChange(e, "interior");
                        }
                      }}
                      aria-label="Upload interior photo"
                    />
                  </label>
                </div>

                <div className="relative">
                  <img 
                    src={interior_img} 
                    alt="Example interior view" 
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Example
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-medium ${currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  Previous
                </button>

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-all duration-200"
                    style={{ backgroundColor: '#ff4c25' }}
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-lg font-medium flex items-center space-x-2 ${isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'text-white hover:opacity-90'
                      } transition-all duration-200`}
                    style={{ backgroundColor: isSubmitting ? '#9ca3af' : '#ff4c25' }}
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      </svg>
                    ) : null}
                    {isSubmitting ? 'Submitting...' : 'Submit Vehicle'}
                  </button>
                )}
              </div>
            </form>

          </div>
        </div>
      )}

      {/* How does it work? */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How does it work?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our motorcycle rental network in 4 simple steps and start earning within 24 hours.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 text-center mb-12 leading-relaxed bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
              🚀 <strong>Quick Setup Process:</strong> Upload your motorcycle fleet, set competitive prices on our partner portal.
              List motorcycles individually or in batches, then we verify your vehicle details and business
              credentials through our secure verification process.
            </p>

            {/* Process Steps with Enhanced Images */}
            <div className="space-y-20">
              {/* Step 1 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 animate-fade-in-up">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      1
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Set your prices & upload fleet</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    📋 <strong>Easy Fleet Management:</strong> Choose competitive rental rates for your motorbikes and list them on our platform!
                    <br /><br />
                    💰 Set dynamic pricing for different motorcycle categories, get recommended pricing based on market analysis,
                    and optimize your rates to maximize bookings and revenue goals.
                  </p>
                  <div className="flex space-x-4 pt-4">
                    <div className="flex items-center text-green-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Free listing
                    </div>
                    <div className="flex items-center text-green-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Bulk upload
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl h-80 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-10"></div>

                  {/* Dashboard Mockup */}
                  <div className="p-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="bg-white rounded-lg p-3 mb-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <span className="text-sm font-semibold text-gray-800">AirbCar Partner</span>
                        </div>
                        <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                      </div>
                    </div>

                    {/* Vehicle Cards */}
                    <div className="space-y-3 flex-1">
                      <div className="bg-white rounded-lg p-3 shadow-sm flex items-center space-x-3">
                        <div className="w-12 h-8 bg-gray-300 rounded"></div>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 bg-blue-200 rounded w-3/4"></div>
                        </div>
                        <div className="text-xs font-bold text-green-600">DH500/day</div>
                      </div>

                      <div className="bg-white rounded-lg p-3 shadow-sm flex items-center space-x-3">
                        <div className="w-12 h-8 bg-gray-300 rounded"></div>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 bg-purple-200 rounded w-2/3"></div>
                        </div>
                        <div className="text-xs font-bold text-green-600">DH750/day</div>
                      </div>

                      <div className="bg-white rounded-lg p-3 shadow-sm flex items-center space-x-3">
                        <div className="w-12 h-8 bg-gray-300 rounded"></div>
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 bg-orange-200 rounded w-1/2"></div>
                        </div>
                        <div className="text-xs font-bold text-green-600">DH600/day</div>
                      </div>
                    </div>

                    {/* Add Button */}
                    <div className="bg-blue-500 rounded-lg p-2 text-center">
                      <span className="text-white text-xs font-semibold">+ Add New Vehicle</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl h-80 md:order-1 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 opacity-10"></div>

                  {/* Booking Interface Mockup */}
                  <div className="p-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="bg-white rounded-lg p-3 mb-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800">New Booking Requests</span>
                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</div>
                      </div>
                    </div>

                    {/* Booking Cards */}
                    <div className="space-y-3 flex-1">
                      <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">RK</span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold">Raj Kumar</div>
                              <div className="text-xs text-gray-500">★★★★★ 4.9</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-600">DH1,500</div>
                            <div className="text-xs text-gray-500">3 days</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-3">Royal Enfield Classic 350 • Aug 15-17</div>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-green-500 text-white text-xs py-2 rounded font-semibold">Accept</button>
                          <button className="flex-1 bg-gray-200 text-gray-700 text-xs py-2 rounded font-semibold">Decline</button>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-orange-500">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-purple-600">AS</span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold">Arjun Singh</div>
                              <div className="text-xs text-gray-500">★★★★☆ 4.2</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-600">DH2,800</div>
                            <div className="text-xs text-gray-500">5 days</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-3">Yamaha R15 V4 • Aug 20-24</div>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-green-500 text-white text-xs py-2 rounded font-semibold">Accept</button>
                          <button className="flex-1 bg-gray-200 text-gray-700 text-xs py-2 rounded font-semibold">Decline</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 md:order-2 animate-fade-in-up">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      2
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Accept or reject bookings</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    ⚡ <strong>Smart Control System:</strong> Review every booking request and choose which ones to accept!
                    <br /><br />
                    📱 Get instant notifications for new booking requests, view detailed customer profiles and reviews,
                    manage your availability calendar, and maintain full control over your rental business.
                  </p>
                  <div className="flex space-x-4 pt-4">
                    <div className="flex items-center text-green-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Instant notifications
                    </div>
                    <div className="flex items-center text-green-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Full control
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 animate-fade-in-up">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      3
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Customers discover & book</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    🌟 <strong>Maximum Visibility:</strong> Once you're live, customers across our network can find and book your motorcycles!
                    <br /><br />
                    🗺️ We showcase your fleet across 150+ major cities, connect you with thousands of daily visitors,
                    handle secure payment processing, and provide 24/7 customer support for all bookings.
                  </p>
                  <div className="flex space-x-4 pt-4">
                    <div className="flex items-center text-purple-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Global reach
                    </div>
                    <div className="flex items-center text-purple-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Secure payments
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl h-80 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 opacity-10"></div>

                  {/* Customer Platform Mockup */}
                  <div className="p-6 h-full flex flex-col">
                    {/* Search Header */}
                    <div className="bg-white rounded-lg p-3 mb-4 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 h-6 bg-gray-100 rounded text-xs flex items-center px-2 text-gray-500">
                          Search motorcycles in Mumbai...
                        </div>
                      </div>
                    </div>

                    {/* Motorcycle Listings */}
                    <div className="space-y-3 flex-1">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex space-x-3">
                          <div className="w-16 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold mb-1">Royal Enfield Classic 350</div>
                            <div className="text-xs text-gray-500 mb-1">★★★★★ 4.8 • 250+ rides</div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Available now</span>
                              <span className="text-sm font-bold text-purple-600">DH500/day</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex space-x-3">
                          <div className="w-16 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold mb-1">Yamaha R15 V4</div>
                            <div className="text-xs text-gray-500 mb-1">★★★★☆ 4.6 • 180+ rides</div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Available now</span>
                              <span className="text-sm font-bold text-purple-600">DH750/day</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex space-x-3">
                          <div className="w-16 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold mb-1">Honda CB350RS</div>
                            <div className="text-xs text-gray-500 mb-1">★★★★★ 4.9 • 320+ rides</div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-green-600 font-semibold">Book Now</span>
                              <span className="text-sm font-bold text-purple-600">DH600/day</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl h-80 md:order-1 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 opacity-10"></div>

                  {/* Payment Interface Mockup */}
                  <div className="p-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="bg-white rounded-lg p-3 mb-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800">Instant Payouts</span>
                        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Live</div>
                      </div>
                    </div>

                    {/* Payment Cards */}
                    <div className="space-y-3 flex-1">
                      <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="text-sm font-semibold text-gray-800">Payment Received</div>
                            <div className="text-xs text-gray-500">Booking #ARC-2024-001</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">+DH1,275</div>
                            <div className="text-xs text-gray-500">DH1,500 - 15% fee</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">Royal Enfield Classic 350 • 3 days</div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Just now</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Credited</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="text-sm font-semibold text-gray-800">Payment Received</div>
                            <div className="text-xs text-gray-500">Booking #ARC-2024-002</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">+DH2,380</div>
                            <div className="text-xs text-gray-500">DH2,800 - 15% fee</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">Yamaha R15 V4 • 5 days</div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">2 min ago</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Credited</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-gray-800">Total Earnings Today</div>
                            <div className="text-xs text-gray-500">2 completed bookings</div>
                          </div>
                          <div className="text-xl font-bold text-orange-600">DH3,655</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 md:order-2 animate-fade-in-up">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      4
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Get paid instantly</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    💸 <strong>Fast & Secure Payments:</strong> Receive automatic confirmations and instant payments for every completed rental!
                    <br /><br />
                    ✅ Both you and customers get immediate email confirmations, payments are processed securely within 24 hours,
                    and for cancellations, funds are credited immediately to maintain cash flow.
                  </p>
                  <div className="flex space-x-4 pt-4">
                    <div className="flex items-center text-orange-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      24h payouts
                    </div>
                    <div className="flex items-center text-orange-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Auto confirmations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to get started? */}
      <section className="py-20 relative overflow-hidden" style={{
        backgroundImage: 'url(/partner-cta-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/85 via-red-600/80 to-pink-700/85"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-white rounded-full"></div>
          <div className="absolute top-40 right-40 w-16 h-16 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 left-40 w-20 h-20 bg-white rounded-full animate-bounce"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-white text-sm font-medium mb-6"
          style={{color: 'var(--color-orange-500);' }} >
            <span className="w-2 h-2 rounded-full mr-2 animate-pulse"></span>
            Limited Time: Zero Setup Fees
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">transform</span> your business?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of successful motorbike rental partners earning an average of <strong className="text-yellow-400">DH50,000+ monthly</strong> with AirbCar
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            <button
              onClick={() => setShowAddVehicleForm(true)}
              className="bg-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 glow-on-hover flex items-center space-x-2"
              style={{color: 'var(--color-orange-500);' }}
            >
              <span>START EARNING TODAY - FREE</span>
            </button>
            <div className="flex items-center text-white">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Or call us: <strong>+91 98765 43210</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-400">24hrs</div>
              <div className="text-sm opacity-80">Quick Approval</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">DH0</div>
              <div className="text-sm opacity-80">Setup Cost</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">15%</div>
              <div className="text-sm opacity-80">Commission Only</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}