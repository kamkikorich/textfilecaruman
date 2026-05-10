const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const submissions = await prisma.submission.findMany({
    select: {
      id: true,
      status: true,
      contributionMonth: true,
      contributionYear: true,
      paidAt: true,
      paymentReference: true,
    }
  });
  console.log(JSON.stringify(submissions, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
