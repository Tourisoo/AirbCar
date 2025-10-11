// Test to check localStorage token handling in browser environment
console.log('🧪 Browser Token Test Starting...');

// Test 1: Check if localStorage is available
console.log('📱 localStorage available:', typeof localStorage !== 'undefined');

// Test 2: Test token storage and retrieval
const testToken = 'test-token-12345';
localStorage.setItem('access_token', testToken);
const retrievedToken = localStorage.getItem('access_token');
console.log('🔐 Token storage test:', retrievedToken === testToken ? '✅ PASS' : '❌ FAIL');

// Test 3: Test the actual API client
if (window.apiClient) {
  const headers = window.apiClient.getHeaders();
  console.log('📋 API Client headers:', headers);
} else {
  console.log('❌ API Client not available');
}

// Test 4: Simulate login and immediate booking
async function testLoginAndBooking() {
  try {
    console.log('\n🔄 Testing login + immediate booking...');
    
    // Login
    const loginResponse = await fetch('/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'testpass123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful');
      
      // Store tokens
      localStorage.setItem('access_token', loginData.access);
      localStorage.setItem('refresh_token', loginData.refresh);
      
      // Immediate token check
      const storedToken = localStorage.getItem('access_token');
      console.log('🔑 Token immediately after storage:', storedToken ? 'Found' : 'Missing');
      
      // Try booking immediately
      const bookingResponse = await fetch('/bookings/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          listing: 16,
          start_time: '2025-10-15T09:00:00Z',
          end_time: '2025-10-18T18:00:00Z',
          price: 240,
          status: 'confirmed'
        })
      });
      
      console.log('📋 Booking response status:', bookingResponse.status);
      
      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json();
        console.log('❌ Booking error:', errorData);
      } else {
        const booking = await bookingResponse.json();
        console.log('✅ Booking success:', booking.id);
      }
    }
  } catch (error) {
    console.error('💥 Test error:', error.message);
  }
}

// Run the test
testLoginAndBooking();
