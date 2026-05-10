const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const email = "walter@waju.my"
  const password = "admin123"
  const hashedPassword = await bcrypt.hash(password, 10)

  // Find if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        role: "super_admin",
        emailVerified: true
      }
    })
    console.log(`Updated existing user ${email} to Super Admin with password: ${password}`)
  } else {
    // Check if test@test.com exists and rename it, or just create new
    const testUser = await prisma.user.findUnique({
      where: { email: "test@test.com" }
    })

    if (testUser) {
      await prisma.user.update({
        where: { email: "test@test.com" },
        data: {
          email: email,
          password: hashedPassword,
          role: "super_admin",
          emailVerified: true
        }
      })
      console.log(`Renamed test@test.com to ${email} and updated password to: ${password}`)
    } else {
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: "super_admin",
          name: "Super Admin",
          emailVerified: true
        }
      })
      console.log(`Created NEW Super Admin user: ${email} with password: ${password}`)
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
