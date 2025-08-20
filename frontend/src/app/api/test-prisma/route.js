import { PrismaClient } from '@prisma/client'

export async function GET() {
  let prisma
  try {
    console.log('DATABASE_URL from process.env:', process.env.DATABASE_URL)
    console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('DATABASE')))
    
    console.log('Creating Prisma client...')
    prisma = new PrismaClient()
    
    console.log('Querying core_user table...')
    const users = await prisma.core_user.findMany({ 
      take: 5,
      select: {
        id: true,
        username: true,
        email: true,
        is_active: true
      }
    })
    
    return new Response(JSON.stringify({ 
      success: true, 
      users, 
      count: users.length,
      databaseUrl: process.env.DATABASE_URL 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Prisma error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      databaseUrl: process.env.DATABASE_URL,
      envKeys: Object.keys(process.env).filter(key => key.includes('DATABASE'))
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}
