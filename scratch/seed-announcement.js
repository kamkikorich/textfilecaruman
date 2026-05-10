const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: 'admin' }
  })

  if (!admin) {
    console.log('No admin found')
    return
  }

  const announcement = await prisma.announcement.create({
    data: {
      title: "Selamat Datang ke Sistem TextFileSKBBK!",
      content: "Sistem penjanaan fail teks PERKESO anda kini telah dikemaskini dengan format 278-aksara terbaru termasuk pengiraan SKBBK. Sila hubungi admin jika anda memerlukan bantuan.",
      type: "info",
      isActive: true,
      isDismissable: true,
      publishedAt: new Date(),
      createdBy: admin.id
    }
  })
  console.log('Announcement created:', announcement.id)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
