import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      success: true,
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
      userCount: userCount,
      message: 'Database connection successful'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set'
    }, { status: 500 })
  }
}
