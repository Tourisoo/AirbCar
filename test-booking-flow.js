#!/usr/bin/env node

// Test script to simulate the booking flow and see our debugging
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:8000';

async function testBookingFlow() {
  console.log('🧪 Testing Booking Flow...\n');
  
  try {
    // Step 1: Login to get tokens
    console.log('1️⃣ Logging in...');
    const loginResponse = await fetch(`${API_BASE}/api/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'testpass123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login successful:', { hasAccess: !!loginData.access, hasRefresh: !!loginData.refresh });
    
    if (!loginData.access) {
      throw new Error('No access token received');
    }
    
    // Step 2: Get listings to find a car to book
    console.log('\n2️⃣ Getting listings...');
    const listingsResponse = await fetch(`${API_BASE}/listings/`, {
      headers: {
        'Authorization': `Bearer ${loginData.access}`,
        'Content-Type': 'application/json'
      }
    });
    
    const listings = await listingsResponse.json();
    console.log('✅ Listings retrieved:', listings.length, 'cars available');
    
    if (listings.length === 0) {
      throw new Error('No listings available for booking');
    }
    
    const firstCar = listings[0];
    console.log('🚗 Using car:', { id: firstCar.id, make: firstCar.make, model: firstCar.model, price: firstCar.price_per_day });
    
    // Step 3: Create booking
    console.log('\n3️⃣ Creating booking...');
    const bookingData = {
      listing: firstCar.id,
      start_time: '2025-10-15T09:00:00Z',
      end_time: '2025-10-18T18:00:00Z',
      price: parseFloat(firstCar.price_per_day) * 3, // 3 days
      status: 'confirmed'
    };
    
    console.log('📋 Booking data:', bookingData);
    
    const bookingResponse = await fetch(`${API_BASE}/bookings/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.access}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });
    
    console.log('📥 Booking response status:', bookingResponse.status);
    
    if (bookingResponse.ok) {
      const booking = await bookingResponse.json();
      console.log('✅ Booking created successfully:', { id: booking.id, status: booking.status });
    } else {
      const errorData = await bookingResponse.json();
      console.log('❌ Booking failed:', errorData);
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

testBookingFlow();
