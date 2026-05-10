const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' }
  })
  console.log('--- ALL ANNOUNCEMENTS ---')
  console.log(JSON.stringify(announcements, null, 2))

  const dismissals = await prisma.announcementDismissal.findMany()
  console.log('--- DISMISSALS ---')
  console.log(JSON.stringify(dismissals, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
