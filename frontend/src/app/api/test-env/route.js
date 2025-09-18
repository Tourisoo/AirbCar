import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test Django backend connection instead of Prisma
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
    
    return NextResponse.json({
      success: true,
      database: 'Django PostgreSQL',
      backend: 'Django REST Framework',
      userCount: users.length,
      message: 'Django database connection successful',
      djangoBackend: 'Connected to http://localhost:8000'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      database: 'Django PostgreSQL',
      backend: 'Django REST Framework',
      message: 'Django backend connection failed',
      troubleshooting: 'Make sure Docker containers are running: docker-compose up -d'
    }, { status: 500 })
  }
}
