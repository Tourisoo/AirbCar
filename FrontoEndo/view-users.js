import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./prisma/dev.db"
    }
  }
})

async function viewUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        accounts: {
          select: {
            provider: true,
            type: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log('📊 Users in database:')
    console.log('='.repeat(80))
    
    if (users.length === 0) {
      console.log('No users found. Create an account first!')
    } else {
      users.forEach((user, index) => {
        console.log(`\n👤 User ${index + 1}:`)
        console.log(`   ID: ${user.id}`)
        console.log(`   Name: ${user.name || 'Not set'}`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Email Verified: ${user.emailVerified ? 'Yes' : 'No'}`)
        console.log(`   Created: ${user.createdAt.toLocaleString()}`)
        console.log(`   Updated: ${user.updatedAt.toLocaleString()}`)
        if (user.accounts.length > 0) {
          console.log(`   Auth Providers: ${user.accounts.map(acc => acc.provider).join(', ')}`)
        }
      })
    }
    
    console.log('\n' + '='.repeat(80))
    console.log(`✅ Total users: ${users.length}`)
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

viewUsers()
