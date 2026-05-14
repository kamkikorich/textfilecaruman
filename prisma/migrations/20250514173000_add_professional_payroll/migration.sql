-- CreateTable: employee_salary_configs
CREATE TABLE "employee_salary_configs" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "epfEmployeeRate" DECIMAL(6,4),
    "epfEmployerRate" DECIMAL(6,4),
    "socsoCategory" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "employee_salary_configs_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "employee_salary_configs_employeeId_key" ON "employee_salary_configs"("employeeId");
ALTER TABLE "employee_salary_configs" ADD CONSTRAINT "employee_salary_configs_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: employee_loans
CREATE TABLE "employee_loans" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "monthlyDeduction" DECIMAL(10,2) NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "employee_loans_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "employee_loans_employeeId_status_idx" ON "employee_loans"("employeeId", "status");
ALTER TABLE "employee_loans" ADD CONSTRAINT "employee_loans_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: pay_item_templates
CREATE TABLE "pay_item_templates" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "epfTaxable" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pay_item_templates_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "pay_item_templates_employerId_name_key" ON "pay_item_templates"("employerId", "name");
ALTER TABLE "pay_item_templates" ADD CONSTRAINT "pay_item_templates_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "employers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: loan_deductions
CREATE TABLE "loan_deductions" (
    "id" TEXT NOT NULL,
    "loanId" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "loan_deductions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "loan_deductions_loanId_periodId_key" ON "loan_deductions"("loanId", "periodId");
ALTER TABLE "loan_deductions" ADD CONSTRAINT "loan_deductions_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "employee_loans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "loan_deductions" ADD CONSTRAINT "loan_deductions_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "payroll_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: payslip_pay_items
CREATE TABLE "payslip_pay_items" (
    "id" TEXT NOT NULL,
    "payslipId" TEXT NOT NULL,
    "templateId" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "epfTaxable" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "payslip_pay_items_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "payslip_pay_items" ADD CONSTRAINT "payslip_pay_items_payslipId_fkey" FOREIGN KEY ("payslipId") REFERENCES "payroll_employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payslip_pay_items" ADD CONSTRAINT "payslip_pay_items_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "pay_item_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable: attendance_penalties
CREATE TABLE "attendance_penalties" (
    "id" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "absentDays" DECIMAL(4,1) NOT NULL DEFAULT 0,
    "lateHours" DECIMAL(4,1) NOT NULL DEFAULT 0,
    "deductionAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attendance_penalties_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "attendance_penalties_periodId_employeeId_key" ON "attendance_penalties"("periodId", "employeeId");
ALTER TABLE "attendance_penalties" ADD CONSTRAINT "attendance_penalties_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "payroll_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "attendance_penalties" ADD CONSTRAINT "attendance_penalties_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: payroll_employees — add new columns
ALTER TABLE "payroll_employees" ADD COLUMN "bonusAmount" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "payroll_employees" ADD COLUMN "loanDeduction" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "payroll_employees" ADD COLUMN "attendanceDeduction" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "payroll_employees" ADD COLUMN "epfEmployerRateUsed" DECIMAL(6,4);
ALTER TABLE "payroll_employees" ADD COLUMN "epfEmployeeRateUsed" DECIMAL(6,4);
ALTER TABLE "payroll_employees" ADD COLUMN "workingDays" INTEGER NOT NULL DEFAULT 26;
