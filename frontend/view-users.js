// Django API version - fetches users from Django backend (Browser-compatible version)
const http = require('http')

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const req = http.request(url, options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : []
          resolve({ status: res.statusCode, data: jsonData })
        } catch (e) {
          resolve({ status: res.statusCode, data: [] })
        }
      })
    })
    req.on('error', reject)
    req.end()
  })
}

async function viewUsers() {
  try {
    console.log('🔍 Fetching users from Django API...')
    
    const response = await makeRequest('http://localhost:8000/api/users/list/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.status >= 400) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const responseData = response.data || {}
    const users = responseData.users || []
    const count = responseData.count || 0
    
    console.log('📊 Users from Django database:')
    console.log('='.repeat(80))
    
    if (!users || users.length === 0) {
      console.log('No users found. Create an account first through Django!')
    } else {
      users.forEach((user, index) => {
        console.log(`\n👤 User ${index + 1}:`)
        console.log(`   ID: ${user.id}`)
        console.log(`   Username: ${user.username || 'Not set'}`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Name: ${user.name || 'Not set'}`)
        console.log(`   Staff: ${user.is_staff ? 'Yes' : 'No'}`)
        console.log(`   Superuser: ${user.is_superuser ? 'Yes' : 'No'}`)
        console.log(`   Partner: ${user.is_partner ? 'Yes' : 'No'}`)
        console.log(`   Email Verified: ${user.email_verified ? 'Yes' : 'No'}`)
        console.log(`   Created: ${user.created_at}`)
        console.log(`   Role: ${user.role || 'user'}`)
      })
    }
    
    console.log('\n' + '='.repeat(80))
    console.log(`✅ Total users: ${count}`)
    console.log('🔗 Data source: Django PostgreSQL Database')
  } catch (error) {
    console.error('❌ Error fetching users from Django API:', error.message)
    console.log('💡 Make sure Django backend is running on http://localhost:8000')
    console.log('🧪 Test with: curl http://localhost:8000/api/users/list/')
  }
}

viewUsers()
