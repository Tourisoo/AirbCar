import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        accounts: {
          select: {
            provider: true,
            type: true
          }
        },
        sessions: {
          select: {
            expires: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const stats = {
      totalUsers: users.length,
      verifiedUsers: users.filter(u => u.emailVerified).length,
      googleUsers: users.filter(u => u.accounts.some(acc => acc.provider === 'google')).length,
      credentialUsers: users.filter(u => u.accounts.some(acc => acc.provider === 'credentials')).length,
      activeUsers: users.filter(u => u.sessions.length > 0).length
    }

    return NextResponse.json({
      users,
      stats,
      success: true
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    )
  }
}
