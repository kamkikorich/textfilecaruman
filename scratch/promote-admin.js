const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

// Load .env.local
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

async function main() {
  await prisma.user.update({
    where: { email: "admin@waju.my" },
    data: { role: "super_admin" }
  })
  console.log("admin@waju.my promoted to super_admin")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
