import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { PrismaClient } from '@prisma/client'

async function main() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL)
  
  const prisma = new PrismaClient()
  
  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Test creating a user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword'
      }
    })
    
    console.log('✅ User created:', user)
    
    // Clean up
    await prisma.user.delete({
      where: { id: user.id }
    })
    
    console.log('✅ Test completed successfully')
  } catch (error) {
    console.error('❌ Database error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
