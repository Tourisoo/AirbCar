import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./prisma/dev.db"
    }
  }
})

async function testRegistration() {
  try {
    console.log('Testing user registration...')
    
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
      }
    })
    
    console.log('✅ User created successfully:', {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    })
    
    // Clean up
    await prisma.user.delete({
      where: { id: user.id }
    })
    
    console.log('✅ Test completed and cleaned up')
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️  User already exists, trying to fetch...')
      const existingUser = await prisma.user.findUnique({
        where: { email: 'test@example.com' }
      })
      console.log('Found existing user:', existingUser)
    } else {
      console.error('❌ Error:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

testRegistration()
