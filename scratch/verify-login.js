const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (match) {
      const key = match[1]
      let value = match[2] || ''
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
      process.env[key] = value
    }
  })
}

const prisma = new PrismaClient()

async function testLogin() {
  const email = "walter@waju.my"
  const password = "admin123"

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    console.log("User not found")
    return
  }

  const isValid = await bcrypt.compare(password, user.password)
  console.log(`Login test for ${email}: ${isValid ? "SUCCESS" : "FAILED"}`)
  console.log(`User Role: ${user.role}`)
}

testLogin()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
