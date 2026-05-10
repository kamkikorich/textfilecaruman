const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.submission.updateMany({
    data: {
      status: 'draft',
      paidAt: null,
      paymentReference: null
    }
  });
  console.log("All submissions reset to draft.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
