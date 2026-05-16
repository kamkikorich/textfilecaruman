import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Inline PERKESO contribution table (Lampiran 1 - SKBBK Fasa 1)
// Format: [GajiMin, JP_Majikan, JP_Pekerja, SKBBK_Pekerja, JK_Majikan, JK_SKBBK, EIS_Majikan, EIS_Pekerja]
const CT: number[][] = [
  [0, 0.40, 0.10, 0.20, 0.30, 0.20, 0.05, 0.05],
  [30.01, 0.70, 0.20, 0.30, 0.50, 0.30, 0.10, 0.10],
  [50.01, 1.10, 0.30, 0.50, 0.80, 0.50, 0.15, 0.15],
  [70.01, 1.50, 0.40, 0.65, 1.10, 0.65, 0.20, 0.20],
  [100.01, 2.10, 0.60, 0.90, 1.50, 0.90, 0.25, 0.25],
  [140.01, 2.95, 0.85, 1.25, 2.10, 1.25, 0.35, 0.35],
  [200.01, 4.35, 1.25, 1.85, 3.10, 1.85, 0.50, 0.50],
  [300.01, 6.15, 1.75, 2.65, 4.40, 2.65, 0.70, 0.70],
  [400.01, 7.85, 2.25, 3.35, 5.60, 3.35, 0.90, 0.90],
  [500.01, 9.65, 2.75, 4.15, 6.90, 4.15, 1.10, 1.10],
  [600.01, 11.35, 3.25, 4.85, 8.10, 4.85, 1.30, 1.30],
  [700.01, 13.15, 3.75, 5.65, 9.40, 5.65, 1.50, 1.50],
  [800.01, 14.85, 4.25, 6.35, 10.60, 6.35, 1.70, 1.70],
  [900.01, 16.65, 4.75, 7.15, 11.90, 7.15, 1.90, 1.90],
  [1000.01, 18.35, 5.25, 7.85, 13.10, 7.85, 2.10, 2.10],
  [1100.01, 20.15, 5.75, 8.65, 14.40, 8.65, 2.30, 2.30],
  [1200.01, 21.85, 6.25, 9.35, 15.60, 9.35, 2.50, 2.50],
  [1300.01, 23.65, 6.75, 10.15, 16.90, 10.15, 2.70, 2.70],
  [1400.01, 25.35, 7.25, 10.85, 18.10, 10.85, 2.90, 2.90],
  [1500.01, 27.15, 7.75, 11.65, 19.40, 11.65, 3.10, 3.10],
  [1600.01, 28.85, 8.25, 12.35, 20.60, 12.35, 3.30, 3.30],
  [1700.01, 30.65, 8.75, 13.15, 21.90, 13.15, 3.50, 3.50],
  [1800.01, 32.35, 9.25, 13.85, 23.10, 13.85, 3.70, 3.70],
  [1900.01, 34.15, 9.75, 14.65, 24.40, 14.65, 3.90, 3.90],
  [2000.01, 35.85, 10.25, 15.35, 25.60, 15.35, 4.10, 4.10],
  [2100.01, 37.65, 10.75, 16.15, 26.90, 16.15, 4.30, 4.30],
  [2200.01, 39.35, 11.25, 16.85, 28.10, 16.85, 4.50, 4.50],
  [2300.01, 41.15, 11.75, 17.65, 29.40, 17.65, 4.70, 4.70],
  [2400.01, 42.85, 12.25, 18.35, 30.60, 18.35, 4.90, 4.90],
  [2500.01, 44.65, 12.75, 19.15, 31.90, 19.15, 5.10, 5.10],
  [2600.01, 46.35, 13.25, 19.85, 33.10, 19.85, 5.30, 5.30],
  [2700.01, 48.15, 13.75, 20.65, 34.40, 20.65, 5.50, 5.50],
  [2800.01, 49.85, 14.25, 21.35, 35.60, 21.35, 5.70, 5.70],
  [2900.01, 51.65, 14.75, 22.15, 36.90, 22.15, 5.90, 5.90],
  [3000.01, 53.35, 15.25, 22.85, 38.10, 22.85, 6.10, 6.10],
  [3100.01, 55.15, 15.75, 23.65, 39.40, 23.65, 6.30, 6.30],
  [3200.01, 56.85, 16.25, 24.35, 40.60, 24.35, 6.50, 6.50],
  [3300.01, 58.65, 16.75, 25.15, 41.90, 25.15, 6.70, 6.70],
  [3400.01, 60.35, 17.25, 25.85, 43.10, 25.85, 6.90, 6.90],
  [3500.01, 62.15, 17.75, 26.65, 44.40, 26.65, 7.10, 7.10],
  [3600.01, 63.85, 18.25, 27.35, 45.60, 27.35, 7.30, 7.30],
  [3700.01, 65.65, 18.75, 28.15, 46.90, 28.15, 7.50, 7.50],
  [3800.01, 67.35, 19.25, 28.85, 48.10, 28.85, 7.70, 7.70],
  [3900.01, 69.15, 19.75, 29.65, 49.40, 29.65, 7.90, 7.90],
  [4000.01, 70.85, 20.25, 30.35, 50.60, 30.35, 8.10, 8.10],
  [4100.01, 72.65, 20.75, 31.15, 51.90, 31.15, 8.30, 8.30],
  [4200.01, 74.35, 21.25, 31.85, 53.10, 31.85, 8.50, 8.50],
  [4300.01, 76.15, 21.75, 32.65, 54.40, 32.65, 8.70, 8.70],
  [4400.01, 77.85, 22.25, 33.35, 55.60, 33.35, 8.90, 8.90],
  [4500.01, 79.65, 22.75, 34.15, 56.90, 34.15, 9.10, 9.10],
  [4600.01, 81.35, 23.25, 34.85, 58.10, 34.85, 9.30, 9.30],
  [4700.01, 83.15, 23.75, 35.65, 59.40, 35.65, 9.50, 9.50],
  [4800.01, 84.85, 24.25, 36.35, 60.60, 36.35, 9.70, 9.70],
  [4900.01, 86.65, 24.75, 37.15, 61.90, 37.15, 9.90, 9.90],
  [5000.01, 88.35, 25.25, 37.85, 63.10, 37.85, 10.10, 10.10],
  [5100.01, 90.15, 25.75, 38.65, 64.40, 38.65, 10.30, 10.30],
  [5200.01, 91.85, 26.25, 39.35, 65.60, 39.35, 10.50, 10.50],
  [5300.01, 93.65, 26.75, 40.15, 66.90, 40.15, 10.70, 10.70],
  [5400.01, 95.35, 27.25, 40.85, 68.10, 40.85, 10.90, 10.90],
  [5500.01, 97.15, 27.75, 41.65, 69.40, 41.65, 11.10, 11.10],
  [5600.01, 98.85, 28.25, 42.35, 70.60, 42.35, 11.30, 11.30],
  [5700.01, 100.65, 28.75, 43.15, 71.90, 43.15, 11.50, 11.50],
  [5800.01, 102.35, 29.25, 43.85, 73.10, 43.85, 11.70, 11.70],
  [5900.01, 104.15, 29.75, 44.65, 74.40, 44.65, 11.90, 11.90],
  [6000.01, 104.15, 29.75, 44.65, 74.40, 44.65, 11.90, 11.90],
]

function lookupContribution(salary: number) {
  const s = Math.min(salary || 0, 6000.01)
  for (let i = CT.length - 1; i >= 0; i--) {
    if (s >= CT[i][0]) {
      return {
        jp_se: CT[i][1], jp_ss: CT[i][2], skbbk: CT[i][3],
        jk_se: CT[i][4], jk_skbbk: CT[i][5], ee: CT[i][6], es: CT[i][7],
      }
    }
  }
  return { jp_se: 0, jp_ss: 0, skbbk: 0, jk_se: 0, jk_skbbk: 0, ee: 0, es: 0 }
}

function getSkbbkRate(month: number, year: number) {
  const dt = new Date(year, month - 1, 1)
  const phase1Start = new Date(2026, 5, 1)
  const phase2Start = new Date(2028, 5, 1)
  const phase3Start = new Date(2031, 5, 1)
  if (dt < phase1Start) return { rate: 0 }
  if (dt >= phase3Start) return { rate: 0.0125 }
  if (dt >= phase2Start) return { rate: 0.01 }
  return { rate: 0.0075 }
}

function r(v: number) { return Math.round(v * 100) / 100 }

function calculateContribution(
  salary: number, age: number, category: string,
  isEnteredAfter55: boolean, isEisNoContribution57: boolean,
  isForeign: boolean, month: number, year: number
) {
  const base = lookupContribution(salary)
  const isJenisKedua = age >= 60 || category === 'JENIS2' || isEnteredAfter55
  let socsoEmpl = isJenisKedua ? base.jk_se : base.jp_se
  let socsoEmp = isJenisKedua ? 0 : base.jp_ss
  let eisEmpl = base.ee
  let eisEmp = base.es
  if (age < 18 || age >= 60 || isEisNoContribution57 || isForeign) { eisEmpl = 0; eisEmp = 0 }
  const skbbkInfo = getSkbbkRate(month, year)
  let skbbk = skbbkInfo.rate === 0 ? 0 : (isJenisKedua ? base.jk_skbbk : base.skbbk)
  return {
    socsoEmployer: r(socsoEmpl), socsoEmployee: r(socsoEmp),
    eisEmployer: r(eisEmpl), eisEmployee: r(eisEmp),
    skbbkEmployee: r(skbbk),
    totalEmployer: r(socsoEmpl + eisEmpl),
    totalEmployee: r(socsoEmp + eisEmp + skbbk),
  }
}

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
