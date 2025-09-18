// Django API Test Route - Testing Django PostgreSQL database
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 Testing Django PostgreSQL database connection...')
    
    // Test Django backend connection
    const response = await fetch('http://localhost:8000/users/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Django API error: ${response.status}`)
    }

    const users = await response.json()
    console.log(`✅ Found ${users.length} users in Django database`)

    return NextResponse.json({
      success: true,
      message: 'Django PostgreSQL database connection successful',
      database: 'PostgreSQL (via Django ORM)',
      backend: 'Django REST Framework',
      userCount: users.length,
      users: users.slice(0, 5), // Show first 5 users as sample
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Django database test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      database: 'PostgreSQL (via Django ORM)',
      backend: 'Django REST Framework',
      message: 'Django backend connection failed',
      troubleshooting: [
        'Make sure Docker containers are running: docker-compose up -d',
        'Check Django backend logs: docker-compose logs web',
        'Verify PostgreSQL is running: docker-compose logs db'
      ],
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
