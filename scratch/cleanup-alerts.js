const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Get all alerts with submissionId
  const alerts = await prisma.alert.findMany({
    where: {
      submissionId: { not: null }
    }
  });

  // 2. Get all existing submission IDs
  const submissions = await prisma.submission.findMany({
    select: { id: true }
  });
  const subIds = new Set(submissions.map(s => s.id));

  // 3. Delete orphan alerts
  let count = 0;
  for (const alert of alerts) {
    if (!subIds.has(alert.submissionId)) {
      await prisma.alert.delete({ where: { id: alert.id } });
      count++;
    }
  }

  console.log(`Deleted ${count} orphan alerts.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
