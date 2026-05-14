import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { calculateContribution } from '../src/lib/perkeso'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // ============================================
  // 1. Create Admin User
  // ============================================
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@waju.my' },
    update: {},
    create: {
      email: 'admin@waju.my',
      name: 'WAJUTECH ADMIN',
      password: hashedPassword,
      phone: '+60123456789',
      companyName: 'WAJUTECH SOLUTIONS',
      companyRegistration: '202401001234',
      role: 'admin',
    },
  })
  console.log('✅ Created admin user:', adminUser.email)

  // ============================================
  // 2. Create Employer
  // ============================================
  const employer = await prisma.employer.upsert({
    where: {
      userId_employerCode: {
        userId: adminUser.id,
        employerCode: 'E9402102464K',
      }
    },
    update: {},
    create: {
      userId: adminUser.id,
      employerCode: 'E9402102464K',
      employerName: 'LIM VUI CHEN @ VICTOR',
      employerNameMalay: 'LIM VUI CHEN @ VICTOR',
      businessType: 'SOLE_PROPRIETOR',
      ssmNumber: '202401001234',
      ssmDate: new Date('2024-01-15'),
      perkesoRegistrationDate: new Date('2024-01-15'),
      perkesoBranch: 'KUALA LUMPUR',
      addressLine1: 'No. 123, Jalan Example',
      addressLine2: 'Taman Business Park',
      city: 'KUALA LUMPUR',
      state: 'WILAYAH_PERSEKUTUAN',
      postcode: '50000',
      country: 'MALAYSIA',
      phonePrimary: '+60123456789',
      emailPrimary: 'admin@limvui.com',
      msicCode: '6201',
      msicDescription: 'Computer programming activities',
      industrySector: 'SERVICES',
      totalEmployees: 5,
      employeeCategory: 'MICRO',
      isActive: true,
      isVerified: false,
    },
  })
  console.log('✅ Created employer:', employer.employerName, `(${employer.employerCode})`)

  // ============================================
  // 3. Create Employees (5 Sample Workers)
  // ============================================
  const employeeData = [
    { ic: '900101010101', name: 'Ahmad bin Abdullah', age: 36, salary: 3500.00, category: 'JENIS1', after55: false, eis57: false, foreign: false, joined: new Date('2024-01-15') },
    { ic: '920202020202', name: 'Siti binti Mohd', age: 34, salary: 2800.00, category: 'JENIS1', after55: false, eis57: false, foreign: false, joined: new Date('2024-02-01') },
    { ic: '880303030303', name: 'Tan Ah Kow', age: 38, salary: 5500.00, category: 'JENIS1', after55: false, eis57: false, foreign: false, joined: new Date('2023-06-01') },
    { ic: '950404040404', name: 'Wong Mei Ling', age: 31, salary: 1800.00, category: 'JENIS1', after55: false, eis57: false, foreign: false, joined: new Date('2024-03-01') },
    { ic: 'A12345678', name: 'Nguyen Van A', age: 36, salary: 1500.00, category: 'JENIS1', after55: false, eis57: false, foreign: true, joined: new Date('2024-04-01') },
  ]

  const createdEmployees = []
  for (const ed of employeeData) {
    const emp = await prisma.employee.upsert({
      where: {
        employerId_icNumber: {
          employerId: employer.id,
          icNumber: ed.ic,
        }
      },
      update: {},
      create: {
        employerId: employer.id,
        icNumber: ed.ic,
        name: ed.name,
        nameMalay: ed.name.toUpperCase(),
        dateOfBirth: new Date(new Date().getFullYear() - ed.age, 0, 1),
        gender: ed.name.includes('binti') || ed.name.includes('Mei') ? 'FEMALE' : 'MALE',
        nationality: ed.foreign ? 'VIETNAMESE' : 'MALAYSIAN',
        passportNumber: ed.foreign ? ed.ic : null,
        workerType: ed.foreign ? 'FOREIGN' : 'LOCAL',
        category: ed.category,
        employmentDate: ed.joined,
        employmentType: 'PERMANENT',
        jobTitle: 'Staff',
        department: 'Operations',
        salary: ed.salary,
        salaryType: 'MONTHLY',
        enteredAfter55: ed.after55,
        eisNoContribution57: ed.eis57,
        isSkbbkEligible: !ed.foreign,
        isActive: true,
      },
    })
    createdEmployees.push(emp)
  }
  console.log('✅ Created', createdEmployees.length, 'employees')

  // ============================================
  // 4. Create Sample Submission (June 2026)
  // ============================================
  const month = 6
  const year = 2026
  const totalSalary = createdEmployees.reduce((sum, emp) => sum + Number(emp.salary), 0)

  const submission = await prisma.submission.upsert({
    where: {
      employerId_contributionMonth_contributionYear: {
        employerId: employer.id,
        contributionMonth: month,
        contributionYear: year,
      }
    },
    update: {},
    create: {
      employerId: employer.id,
      contributionMonth: month,
      contributionYear: year,
      deadlineDate: new Date('2026-07-15'),
      status: 'draft',
      totalEmployees: createdEmployees.length,
      totalSalary: totalSalary,
      totalEmployerContribution: 0,
      totalEmployeeContribution: 0,
      grandTotal: 0,
      latePenalty: 0,
      monthsLate: 0,
    },
  })
  console.log('✅ Created submission for June 2026')

  // ============================================
  // 5. Create Contributions for Each Employee
  // ============================================
  await prisma.contribution.deleteMany({
    where: { submissionId: submission.id }
  })

  let totalEmployerContribution = 0
  let totalEmployeeContribution = 0

  for (const emp of createdEmployees) {
    const salary = Number(emp.salary)
    const age = new Date().getFullYear() - emp.dateOfBirth!.getFullYear()
    const calc = calculateContribution(
      salary,
      age,
      emp.category,
      emp.enteredAfter55,
      emp.eisNoContribution57,
      emp.workerType === 'FOREIGN',
      month,
      year
    )

    totalEmployerContribution += calc.totalEmployer
    totalEmployeeContribution += calc.totalEmployee

    await prisma.contribution.create({
      data: {
        submissionId: submission.id,
        employeeId: emp.id,
        month,
        year,
        salary: salary,
        socsoEmployer: calc.socsoEmployer,
        socsoEmployee: calc.socsoEmployee,
        eisEmployer: calc.eisEmployer,
        eisEmployee: calc.eisEmployee,
        skbbkEmployee: calc.skbbkEmployee,
        totalEmployer: calc.totalEmployer,
        totalEmployee: calc.totalEmployee,
      },
    })
  }

  // Update submission totals
  await prisma.submission.update({
    where: { id: submission.id },
    data: {
      totalEmployerContribution: totalEmployerContribution,
      totalEmployeeContribution: totalEmployeeContribution,
      grandTotal: totalEmployerContribution + totalEmployeeContribution,
    },
  })

  console.log('✅ Created contributions for', createdEmployees.length, 'employees')
  console.log('\n📊 Summary:')
  console.log(`   Total Salary: RM${totalSalary.toFixed(2)}`)
  console.log(`   Employer Contribution: RM${totalEmployerContribution.toFixed(2)}`)
  console.log(`   Employee Contribution: RM${totalEmployeeContribution.toFixed(2)}`)
  console.log(`   Grand Total: RM${(totalEmployerContribution + totalEmployeeContribution).toFixed(2)}`)

  // ============================================
  // 6. Create Sample Subscription
  // ============================================
  await prisma.subscription.upsert({
    where: { userId: adminUser.id },
    update: {
      trialEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    create: {
      userId: adminUser.id,
      status: 'trial',
      planType: 'basic',
      trialStart: new Date(),
      trialEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  // ============================================
  // 7. Create Regular User (For Admin Testing)
  // ============================================
  const regularHashedPassword = await bcrypt.hash('user123', 12)
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'REGULAR USER',
      password: regularHashedPassword,
      role: 'user',
    },
  })
  console.log('✅ Created regular user:', regularUser.email)

  await prisma.subscription.upsert({
    where: { userId: regularUser.id },
    update: {
      trialEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    create: {
      userId: regularUser.id,
      status: 'trial',
      planType: 'basic',
      trialStart: new Date(),
      trialEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  // ============================================
  // 8. Default Payroll Statutory Config (KWSP/PERKESO/EIS/PCB rates)
  // ============================================
  await prisma.payrollStatutoryConfig.upsert({
    where: { name: "default" },
    update: {},
    create: {
      name: "default",
      isActive: true,
      epfEmployeeRate: 0.11,
      epfEmployerRate: 0.12,
      epfEmployerRate2: 0.13,
      epfWageCeiling: 5000.00,
      socsoEmployeeRate: 0.005,
      socsoEmployerRate: 0.0175,
      socsoWageCeiling: 5000.00,
      eisEmployeeRate: 0.002,
      eisEmployerRate: 0.002,
      eisWageCeiling: 5000.00,
      pcbEpfReliefCap: 4000.00,
    },
  })
  console.log('✅ Default statutory config created')

  console.log('\n🎉 Database seed completed!')
  console.log('\n📝 Login Credentials:')
  console.log('   Admin: admin@waju.my / admin123')
  console.log('   User:  user@example.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
