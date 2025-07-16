// Test the signup API
const testSignup = async () => {
  const response = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    }),
  })

  const data = await response.json()
  console.log('Status:', response.status)
  console.log('Response:', data)
}

testSignup().catch(console.error)
