import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const prisma = new PrismaClient();
async function main() {
  const employerCode = 'F9400000001F';
  const employers = await prisma.employer.findMany({ where: { employerCode } });
  console.log(`Employers with code ${employerCode}:`, employers.length);
  
  for (const emp of employers) {
    const user = await prisma.user.findUnique({ where: { id: emp.userId } });
    const subs = await prisma.submission.findMany({ where: { employerId: emp.id } });
    console.log(`- User: ${user?.email}, Submissions: ${subs.length}`);
    
    // List ALL employers for this user
    const allEmps = await prisma.employer.findMany({ where: { userId: emp.userId } });
    console.log(`  All employers for this user:`, allEmps.map(e => e.employerCode));
  }
}
main();
