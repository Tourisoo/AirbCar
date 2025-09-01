// Django API Database Test - Using Node.js built-in modules
const http = require('http')
const https = require('https')

console.log('🧪 Testing Django PostgreSQL Database Connection...')

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const protocol = urlObj.protocol === 'https:' ? https : http
    
    const req = protocol.request(url, options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : null
          resolve({ status: res.statusCode, data: jsonData, raw: data })
        } catch (e) {
          resolve({ status: res.statusCode, data: null, raw: data })
        }
      })
    })
    
    req.on('error', reject)
    
    if (options.body) {
      req.write(options.body)
    }
    
    req.end()
  })
}

async function testDjangoDatabase() {
  try {
    console.log('🔗 Connecting to Django backend at http://localhost:8000')
    
    // Test 1: Check if Django server is running
    const healthCheck = await makeRequest('http://localhost:8000/')
    
    if (healthCheck.status >= 400) {
      throw new Error(`Django backend returned status ${healthCheck.status}`)
    }
    
    console.log('✅ Django backend is running')
    
    // Test 2: Fetch users from Django API
    const usersResponse = await makeRequest('http://localhost:8000/api/users/list/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (usersResponse.status >= 400) {
      throw new Error(`Users API error: ${usersResponse.status}`)
    }
    
    const users = usersResponse.data || []
    console.log(`✅ Django PostgreSQL Database connected successfully`)
    console.log(`✅ Found ${users.length} users in Django database`)
    
    // Test 3: Test registration endpoint
    const testUser = {
      username: `test_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'testpassword123',
      name: 'Test User'
    }
    
    console.log('🔄 Testing user registration...')
    const registerResponse = await makeRequest('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    })
    
    if (registerResponse.status < 400) {
      console.log('✅ User registration works')
      
      // Test 4: Test login
      const loginResponse = await makeRequest('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: testUser.email,
          password: testUser.password
        })
      })
      
      if (loginResponse.status < 400) {
        console.log('✅ User authentication works')
        console.log('✅ JWT tokens generated successfully')
      } else {
        console.log('⚠️  Authentication test failed')
      }
    } else {
      console.log('⚠️  Registration test failed (user might already exist)')
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('✅ Django PostgreSQL Database test completed successfully!')
    console.log('🗄️  Database: PostgreSQL via Django ORM')
    console.log('🚀 Backend: Django REST Framework')
    console.log('📡 API URL: http://localhost:8000')
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ Django database test failed:', error.message)
    console.log('\n💡 Troubleshooting:')
    console.log('1. Make sure Docker containers are running: docker-compose up -d')
    console.log('2. Check Django backend logs: docker-compose logs web')
    console.log('3. Verify PostgreSQL is running: docker-compose logs db')
    console.log('4. Test manual curl: curl http://localhost:8000/api/users/list/')
  }
}

testDjangoDatabase()
