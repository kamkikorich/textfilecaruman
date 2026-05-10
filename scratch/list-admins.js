const fs = require('fs')
const path = require('path')

// Manually load .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8')
  envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
      process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '')
    }
  })
}

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const admins = await prisma.user.findMany({
    where: {
      role: {
        in: ['admin', 'super_admin']
      }
    },
    select: {
      email: true,
      name: true,
      role: true
    }
  })

  console.log('--- SENARAI ADMIN/SUPER ADMIN ---')
  admins.forEach(admin => {
    console.log(`- ${admin.name || 'Tiada Nama'} (${admin.email}) [Role: ${admin.role}]`)
  })
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
