const MONTHS_PER_YEAR = 12

const PERSONAL_RELIEF = 9000
const CHILD_RELIEF = 2000
const EPF_RELIEF_CAP = 4000

interface TaxBracket {
  from: number
  to: number
  rate: number
  cumulative: number
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

export interface StatutoryConfig {
  epfEmployeeRate: number
  epfEmployerRate: number
  epfEmployerRate2: number
  epfWageCeiling: number
  socsoEmployeeRate: number
  socsoEmployerRate: number
  socsoWageCeiling: number
  eisEmployeeRate: number
  eisEmployerRate: number
  eisWageCeiling: number
  pcbEpfReliefCap: number
}

export interface PayrollInput {
  basicSalary: number
  allowanceAmount: number
  overtimePay: number
  commissionAmount: number
  epfEmployeeRate: number
  enteredAfter55: boolean
  eisNoContribution57: boolean
  pcbMaritalStatus: string
  pcbChildrenCount: number
  config: StatutoryConfig
}

export interface PayrollOutput {
  basicSalary: number
  allowanceAmount: number
  overtimePay: number
  commissionAmount: number
  grossSalary: number
  epfEmployee: number
  epfEmployer: number
  socsoEmployee: number
  socsoEmployer: number
  eisEmployee: number
  eisEmployer: number
  pcbAmount: number
  totalDeductions: number
  netSalary: number
}

function round(value: number): number {
  return Math.round(value * 100) / 100
}

function calcEpf(
  grossSalary: number,
  employeeRate: number,
  config: StatutoryConfig,
  enteredAfter55: boolean
): { employee: number; employer: number } {
  if (enteredAfter55) {
    return {
      employee: 0,
      employer: round(grossSalary * 0.04),
    }
  }

  const effectiveRate = employeeRate > 0 ? employeeRate : config.epfEmployeeRate
  const employee = round(grossSalary * effectiveRate)

  const isHighSalary = grossSalary > config.epfWageCeiling
  const employerRate = isHighSalary ? config.epfEmployerRate2 : config.epfEmployerRate
  const employer = round(grossSalary * employerRate)

  return { employee, employer }
}

function calcSocso(
  grossSalary: number,
  config: StatutoryConfig
): { employee: number; employer: number } {
  const cappedSalary = Math.min(grossSalary, config.socsoWageCeiling)
  const employee = round(cappedSalary * config.socsoEmployeeRate)
  const employer = round(cappedSalary * config.socsoEmployerRate)
  return { employee, employer }
}

function calcEis(
  grossSalary: number,
  config: StatutoryConfig,
  eisNoContribution57: boolean
): { employee: number; employer: number } {
  if (eisNoContribution57) {
    return { employee: 0, employer: 0 }
  }
  const cappedSalary = Math.min(grossSalary, config.eisWageCeiling)
  const employee = round(cappedSalary * config.eisEmployeeRate)
  const employer = round(cappedSalary * config.eisEmployerRate)
  return { employee, employer }
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
  if (pcbMaritalStatus === "MARRIED" || pcbMaritalStatus === "MARRIED_SEPARATE") {
    categoryRelief = 0
  }

  const chargeableIncome = Math.max(
    0,
    annualNet - PERSONAL_RELIEF - annualEpfRelief - childrenRelief - categoryRelief
  )

  for (const bracket of TAX_BRACKETS) {
    if (chargeableIncome <= bracket.to) {
      const taxForBracket = round((chargeableIncome - bracket.from) * bracket.rate)
      const annualTax = round(bracket.cumulative + taxForBracket)
      return round(annualTax / MONTHS_PER_YEAR)
    }
  }

  return 0
}

export function calculatePayroll(input: PayrollInput): PayrollOutput {
  const { basicSalary, allowanceAmount, overtimePay, commissionAmount } = input

  const grossSalary = round(
    basicSalary + allowanceAmount + overtimePay + commissionAmount
  )

  const epf = calcEpf(grossSalary, input.epfEmployeeRate, input.config, input.enteredAfter55)
  const socso = calcSocso(grossSalary, input.config)
  const eis = calcEis(grossSalary, input.config, input.eisNoContribution57)

  const pcbAmount = calcPcb(
    grossSalary,
    epf.employee,
    input.pcbMaritalStatus,
    input.pcbChildrenCount,
    input.config
  )

  const totalDeductions = round(
    epf.employee + socso.employee + eis.employee + pcbAmount
  )
  const netSalary = round(grossSalary - totalDeductions)

  return {
    basicSalary: round(basicSalary),
    allowanceAmount: round(allowanceAmount),
    overtimePay: round(overtimePay),
    commissionAmount: round(commissionAmount),
    grossSalary,
    epfEmployee: epf.employee,
    epfEmployer: epf.employer,
    socsoEmployee: socso.employee,
    socsoEmployer: socso.employer,
    eisEmployee: eis.employee,
    eisEmployer: eis.employer,
    pcbAmount,
    totalDeductions,
    netSalary,
  }
}

export function getDefaultConfig(): StatutoryConfig {
  return {
    epfEmployeeRate: 0.11,
    epfEmployerRate: 0.12,
    epfEmployerRate2: 0.13,
    epfWageCeiling: 5000,
    socsoEmployeeRate: 0.005,
    socsoEmployerRate: 0.0175,
    socsoWageCeiling: 5000,
    eisEmployeeRate: 0.002,
    eisEmployerRate: 0.002,
    eisWageCeiling: 5000,
    pcbEpfReliefCap: 4000,
  }
}
