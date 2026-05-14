-- CreateTable: payroll_periods
CREATE TABLE "payroll_periods" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "totalGross" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalDeductions" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalNet" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_periods_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "payroll_periods_employerId_month_year_key" ON "payroll_periods"("employerId", "month", "year");
CREATE INDEX "payroll_periods_employerId_idx" ON "payroll_periods"("employerId");

ALTER TABLE "payroll_periods" ADD CONSTRAINT "payroll_periods_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "employers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: payroll_employees
CREATE TABLE "payroll_employees" (
    "id" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "basicSalary" DECIMAL(10,2) NOT NULL,
    "allowanceAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "overtimeHours" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "overtimePay" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "commissionAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "grossSalary" DECIMAL(10,2) NOT NULL,
    "epfEmployee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "socsoEmployee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "eisEmployee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "pcbAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "otherDeductions" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "epfEmployer" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "socsoEmployer" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "eisEmployer" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalDeductions" DECIMAL(10,2) NOT NULL,
    "netSalary" DECIMAL(10,2) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payroll_employees_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "payroll_employees_periodId_employeeId_key" ON "payroll_employees"("periodId", "employeeId");
CREATE INDEX "payroll_employees_employeeId_idx" ON "payroll_employees"("employeeId");

ALTER TABLE "payroll_employees" ADD CONSTRAINT "payroll_employees_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "payroll_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payroll_employees" ADD CONSTRAINT "payroll_employees_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: overtime_entries
CREATE TABLE "overtime_entries" (
    "id" TEXT NOT NULL,
    "periodId" TEXT,
    "employeeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hours" DECIMAL(6,2) NOT NULL,
    "rate" DECIMAL(10,2) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "overtime_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "overtime_entries_periodId_idx" ON "overtime_entries"("periodId");
CREATE INDEX "overtime_entries_employeeId_idx" ON "overtime_entries"("employeeId");

ALTER TABLE "overtime_entries" ADD CONSTRAINT "overtime_entries_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "payroll_periods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "overtime_entries" ADD CONSTRAINT "overtime_entries_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: payroll_statutory_configs
CREATE TABLE "payroll_statutory_configs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "epfEmployeeRate" DECIMAL(6,4) NOT NULL DEFAULT 0.11,
    "epfEmployerRate" DECIMAL(6,4) NOT NULL DEFAULT 0.12,
    "epfEmployerRate2" DECIMAL(6,4) NOT NULL DEFAULT 0.13,
    "epfWageCeiling" DECIMAL(10,2) NOT NULL DEFAULT 5000.00,
    "socsoEmployeeRate" DECIMAL(6,4) NOT NULL DEFAULT 0.005,
    "socsoEmployerRate" DECIMAL(6,4) NOT NULL DEFAULT 0.0175,
    "socsoWageCeiling" DECIMAL(10,2) NOT NULL DEFAULT 5000.00,
    "eisEmployeeRate" DECIMAL(6,4) NOT NULL DEFAULT 0.002,
    "eisEmployerRate" DECIMAL(6,4) NOT NULL DEFAULT 0.002,
    "eisWageCeiling" DECIMAL(10,2) NOT NULL DEFAULT 5000.00,
    "pcbScheduleJson" JSONB,
    "pcbEpfReliefCap" DECIMAL(10,2) NOT NULL DEFAULT 4000.00,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_statutory_configs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "payroll_statutory_configs_name_key" ON "payroll_statutory_configs"("name");
CREATE INDEX "payroll_statutory_configs_isActive_idx" ON "payroll_statutory_configs"("isActive");

-- AlterTable: employees — add payroll fields
ALTER TABLE "employees" ADD COLUMN "epfNumber" TEXT;
ALTER TABLE "employees" ADD COLUMN "taxNumber" TEXT;
ALTER TABLE "employees" ADD COLUMN "epfEmployeeRate" DECIMAL(6,4) NOT NULL DEFAULT 0.11;
ALTER TABLE "employees" ADD COLUMN "pcbMaritalStatus" TEXT NOT NULL DEFAULT 'SINGLE';
ALTER TABLE "employees" ADD COLUMN "pcbChildrenCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "employees" ADD COLUMN "basicSalary" DECIMAL(10,2);
