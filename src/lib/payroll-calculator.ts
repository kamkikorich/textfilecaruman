import { lookupContribution, getSkbbkRate, type ContributionLookup } from "./perkeso"

const MONTHS_PER_YEAR = 12
const PERSONAL_RELIEF = 9000
const CHILD_RELIEF = 2000

interface TaxBracket {
  from: number; to: number; rate: number; cumulative: number
}

const TAX_BRACKETS: TaxBracket[] = [
  { from: 0, to: 5000, rate: 0, cumulative: 0 },
  { from: 5001, to: 20000, rate: 0.01, cumulative: 0 },
  { from: 20001, to: 35000, rate: 0.03, cumulative: 150 },
  { from: 35001, to: 50000, rate: 0.06, cumulative: 600 },
  { from: 50001, to: 70000, rate: 0.11, cumulative: 1800 },
  { from: 70001, to: 100000, rate: 0.19, cumulative: 4600 },
  { from: 100001, to: 400000, rate: 0.25, cumulative: 10900 },
  { from: 400001, to: 600000, rate: 0.26, cumulative: 81000 },
  { from: 600001, to: 2000000, rate: 0.28, cumulative: 133000 },
  { from: 2000001, to: Infinity, rate: 0.3, cumulative: 525000 },
]

function r(v: number): number { return Math.round(v * 100) / 100 }

export interface SalaryConfig {
  epfEmployeeRate?: number | null
  epfEmployerRate?: number | null
}

export interface PayItem {
  name: string
  type: "ALLOWANCE" | "DEDUCTION"
  amount: number
  epfTaxable: boolean
}

export interface PayrollInput {
  basicSalary: number
  allowanceAmount: number
  overtimePay: number
  overtimeHours: number
  commissionAmount: number
  bonusAmount: number
  customItems: PayItem[]
  enteredAfter55: boolean
  eisNoContribution57: boolean
  workerType: string
  age: number
  category: string
  month: number
  year: number
  pcbMaritalStatus: string
  pcbChildrenCount: number
  salaryConfig: SalaryConfig | null
  statutoryConfig: StatutoryConfig
  loanDeductionTotal: number
  attendanceDeduction: number
  workingDays: number
}

export interface StatutoryConfig {
  epfEmployeeRate: number
  epfEmployerRate: number
  epfEmployerRate2: number
  pcbEpfReliefCap: number
}

export interface PayrollOutput {
  basicSalary: number
  allowanceAmount: number
  overtimeHours: number
  overtimePay: number
  commissionAmount: number
  bonusAmount: number
  customAllowances: { name: string; amount: number; epfTaxable: boolean }[]
  customDeductions: { name: string; amount: number; epfTaxable: boolean }[]
  grossSalary: number
  epfEmployee: number
  epfEmployer: number
  socsoEmployee: number
  socsoEmployer: number
  eisEmployee: number
  eisEmployer: number
  pcbAmount: number
  loanDeduction: number
  attendanceDeduction: number
  totalDeductions: number
  netSalary: number
  epfEmployeeRateUsed: number
  epfEmployerRateUsed: number
}

export function getDefaultConfig(): StatutoryConfig {
  return {
    epfEmployeeRate: 0.11,
    epfEmployerRate: 0.12,
    epfEmployerRate2: 0.13,
    pcbEpfReliefCap: 4000,
  }
}

function calcEpf(
  epfGross: number,
  salaryConfig: SalaryConfig | null,
  config: StatutoryConfig,
  enteredAfter55: boolean
): { employee: number; employer: number; empRate: number; emplRate: number } {
  if (enteredAfter55) {
    return { employee: 0, employer: r(epfGross * 0.04), empRate: 0, emplRate: 0.04 }
  }
  const empRate = salaryConfig?.epfEmployeeRate ?? config.epfEmployeeRate
  const employee = r(epfGross * empRate)

  let emplRate: number
  if (salaryConfig?.epfEmployerRate != null) {
    emplRate = salaryConfig.epfEmployerRate
  } else {
    emplRate = epfGross > 5000 ? config.epfEmployerRate2 : config.epfEmployerRate
  }
  const employer = r(epfGross * emplRate)
  return { employee, employer, empRate, emplRate }
}

function calcSocsoFromTable(
  salary: number,
  age: number,
  category: string,
  enteredAfter55: boolean,
  workerType: string,
  month: number,
  year: number
): { employee: number; employer: number } {
  const lookup: ContributionLookup = lookupContribution(salary)
  const isForeigner = workerType === "FOREIGN"
  const isJenisKedua = age >= 60 || category === "JENIS2" || enteredAfter55

  if (isForeigner) {
    const skbbkRate = getSkbbkRate(month, year)
    const socsoEmployer = r(lookup.jp_se)
    const skbbkPortion = r(socsoEmployer * skbbkRate)
    return { employee: 0, employer: r(socsoEmployer + skbbkPortion) }
  }

  if (isJenisKedua) {
    return { employee: 0, employer: r(lookup.jk_se) }
  }

  return { employee: r(lookup.jp_ss), employer: r(lookup.jp_se) }
}

function calcEisFromTable(
  salary: number,
  age: number,
  eisNoContribution57: boolean,
  workerType: string
): { employee: number; employer: number } {
  if (workerType === "FOREIGN") return { employee: 0, employer: 0 }
  if (age < 18 || age > 59) return { employee: 0, employer: 0 }
  if (eisNoContribution57) return { employee: 0, employer: 0 }

  const lookup: ContributionLookup = lookupContribution(salary)
  return { employee: r(lookup.es), employer: r(lookup.ee) }
}

function calcPcb(
  grossSalary: number,
  epfEmployee: number,
  pcbMaritalStatus: string,
  pcbChildrenCount: number,
  config: StatutoryConfig
): number {
  const monthlyNet = grossSalary - Math.min(epfEmployee, 333.33)
  const annualNet = monthlyNet * MONTHS_PER_YEAR
  const annualEpfRelief = Math.min(epfEmployee * MONTHS_PER_YEAR, config.pcbEpfReliefCap)
  const childrenRelief = Math.min(pcbChildrenCount, 4) * CHILD_RELIEF

  let categoryRelief = 0
  if (pcbMaritalStatus === "MARRIED") {
    categoryRelief = 0
  }

  const chargeable = Math.max(0, annualNet - PERSONAL_RELIEF - annualEpfRelief - childrenRelief - categoryRelief)

  for (const b of TAX_BRACKETS) {
    if (chargeable <= b.to) {
      return r((b.cumulative + r((chargeable - b.from) * b.rate)) / MONTHS_PER_YEAR)
    }
  }
  return 0
}

export function calculatePayroll(input: PayrollInput): PayrollOutput {
  const { basicSalary, allowanceAmount, overtimePay, commissionAmount, bonusAmount } = input

  const customAllowances = input.customItems
    .filter(i => i.type === "ALLOWANCE")
    .map(i => ({ name: i.name, amount: i.amount, epfTaxable: i.epfTaxable }))

  const customDeductions = input.customItems
    .filter(i => i.type === "DEDUCTION")
    .map(i => ({ name: i.name, amount: i.amount, epfTaxable: i.epfTaxable }))

  const totalCustomAllowances = customAllowances.reduce((s, i) => s + i.amount, 0)
  const totalCustomDeductions = customDeductions.reduce((s, i) => s + i.amount, 0)

  const grossSalary = r(
    basicSalary + allowanceAmount + overtimePay + commissionAmount + bonusAmount + totalCustomAllowances
  )

  const epfTaxableAllowances = customAllowances
    .filter(i => i.epfTaxable)
    .reduce((s, i) => s + i.amount, 0)

  const epfGross = r(basicSalary + allowanceAmount + epfTaxableAllowances + commissionAmount + bonusAmount)

  const epf = calcEpf(epfGross, input.salaryConfig, input.statutoryConfig, input.enteredAfter55)

  const socso = calcSocsoFromTable(
    grossSalary, input.age, input.category,
    input.enteredAfter55, input.workerType, input.month, input.year
  )

  const eis = calcEisFromTable(
    grossSalary, input.age, input.eisNoContribution57, input.workerType
  )

  const pcbAmount = calcPcb(
    grossSalary, epf.employee,
    input.pcbMaritalStatus, input.pcbChildrenCount, input.statutoryConfig
  )

  const totalDeductions = r(
    epf.employee + socso.employee + eis.employee +
    pcbAmount + input.loanDeductionTotal +
    input.attendanceDeduction + totalCustomDeductions
  )

  const netSalary = r(grossSalary - totalDeductions)

  return {
    basicSalary: r(basicSalary),
    allowanceAmount: r(allowanceAmount),
    overtimeHours: input.overtimeHours,
    overtimePay: r(overtimePay),
    commissionAmount: r(commissionAmount),
    bonusAmount: r(bonusAmount),
    customAllowances,
    customDeductions,
    grossSalary,
    epfEmployee: epf.employee,
    epfEmployer: epf.employer,
    socsoEmployee: socso.employee,
    socsoEmployer: socso.employer,
    eisEmployee: eis.employee,
    eisEmployer: eis.employer,
    pcbAmount,
    loanDeduction: input.loanDeductionTotal,
    attendanceDeduction: input.attendanceDeduction,
    totalDeductions,
    netSalary,
    epfEmployeeRateUsed: epf.empRate,
    epfEmployerRateUsed: epf.emplRate,
  }
}
