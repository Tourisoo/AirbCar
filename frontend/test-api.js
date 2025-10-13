// Test the API service
const API_BASE_URL = 'http://localhost:8000'
const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/login/',
    PROFILE: '/users/',
    VERIFY_TOKEN: '/api/verify-token/',
  }
}

// Simple fetch test
async function testLogin() {
  try {
    console.log('Testing login...')
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'ayacheyassine2000@gmail.com',
        password: 'testpass123'
      })
    })
    
    const data = await response.json()
    console.log('Login response:', data)
    
    if (data.access) {
      console.log('Testing getCurrentUser...')
      const userResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.PROFILE}me/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.access}`
        }
      })
      
      const userData = await userResponse.json()
      console.log('User data:', userData)
      
      console.log('Testing profile update...')
      const updateResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.PROFILE}me/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.access}`
        },
        body: JSON.stringify({
          first_name: 'Test Updated',
          last_name: 'From API'
        })
      })
      
      const updatedData = await updateResponse.json()
      console.log('Updated user data:', updatedData)
      
      console.log('✅ All API tests passed!')
    }
  } catch (error) {
    console.error('❌ API test failed:', error)
  }
}

testLogin()
