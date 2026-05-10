-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "companyName" TEXT,
    "companyRegistration" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employerCode" CHAR(12) NOT NULL,
    "employerName" TEXT NOT NULL,
    "employerNameMalay" TEXT,
    "businessType" TEXT,
    "ssmNumber" TEXT,
    "ssmDate" TIMESTAMP(3),
    "perkesoRegistrationDate" TIMESTAMP(3),
    "perkesoBranch" TEXT,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "addressLine3" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postcode" CHAR(5) NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'MALAYSIA',
    "phonePrimary" TEXT NOT NULL,
    "phoneAlternative" TEXT,
    "fax" TEXT,
    "emailPrimary" TEXT NOT NULL,
    "emailAlternative" TEXT,
    "website" TEXT,
    "msicCode" CHAR(4),
    "msicDescription" TEXT,
    "industrySector" TEXT,
    "totalEmployees" INTEGER NOT NULL DEFAULT 0,
    "employeeCategory" TEXT,
    "bankName" TEXT,
    "bankAccountNumber" TEXT,
    "bankAccountHolder" TEXT,
    "bankBranch" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "employers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "icNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameMalay" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "nationality" TEXT NOT NULL DEFAULT 'MALAYSIAN',
    "passportNumber" TEXT,
    "passportExpiry" TIMESTAMP(3),
    "workerType" TEXT NOT NULL DEFAULT 'LOCAL',
    "category" TEXT NOT NULL DEFAULT 'JENIS1',
    "isDisabled" BOOLEAN NOT NULL DEFAULT false,
    "employmentDate" TIMESTAMP(3) NOT NULL,
    "employmentType" TEXT,
    "jobTitle" TEXT,
    "jobDescription" TEXT,
    "department" TEXT,
    "salary" DECIMAL(10,2) NOT NULL,
    "salaryType" TEXT NOT NULL DEFAULT 'MONTHLY',
    "overtimeEligible" BOOLEAN NOT NULL DEFAULT true,
    "commissionEligible" BOOLEAN NOT NULL DEFAULT false,
    "allowanceAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "enteredAfter55" BOOLEAN NOT NULL DEFAULT false,
    "eisNoContribution57" BOOLEAN NOT NULL DEFAULT false,
    "isSkbbkEligible" BOOLEAN NOT NULL DEFAULT true,
    "skbbkPhase" INTEGER NOT NULL DEFAULT 1,
    "firstPerkesoRegistration" TIMESTAMP(3),
    "previousEmployerCode" TEXT,
    "isConcurrentEmployment" BOOLEAN NOT NULL DEFAULT false,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "addressLine3" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postcode" CHAR(5),
    "phonePrimary" TEXT,
    "phoneAlternative" TEXT,
    "email" TEXT,
    "bankName" TEXT,
    "bankAccountNumber" TEXT,
    "bankAccountHolder" TEXT,
    "bankBranch" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "terminationDate" TIMESTAMP(3),
    "terminationReason" TEXT,
    "lastContributionMonth" INTEGER,
    "lastContributionYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "contributionMonth" INTEGER NOT NULL,
    "contributionYear" INTEGER NOT NULL,
    "deadlineDate" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "totalEmployees" INTEGER NOT NULL DEFAULT 0,
    "totalSalary" DECIMAL(12,2) NOT NULL,
    "totalEmployerContribution" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalEmployeeContribution" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "grandTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "textFileUrl" TEXT,
    "textFileContent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "latePenalty" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "monthsLate" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contributions" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "salary" DECIMAL(10,2) NOT NULL,
    "socsoEmployer" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "socsoEmployee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "eisEmployer" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "eisEmployee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "skbbkEmployee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalEmployer" DECIMAL(10,2) NOT NULL,
    "totalEmployee" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'trial',
    "planType" TEXT NOT NULL DEFAULT 'basic',
    "billplzCustomerId" TEXT,
    "billplzSubscriptionId" TEXT,
    "trialStart" TIMESTAMP(3),
    "trialEnd" TIMESTAMP(3),
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'MYR',
    "status" TEXT NOT NULL,
    "billplzChargeId" TEXT,
    "billplzPaymentUrl" TEXT,
    "paidAt" TIMESTAMP(3),
    "description" TEXT,
    "metadata" JSONB,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employerId" TEXT,
    "submissionId" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE INDEX "employers_userId_idx" ON "employers"("userId");

-- CreateIndex
CREATE INDEX "employers_employerCode_idx" ON "employers"("employerCode");

-- CreateIndex
CREATE INDEX "employers_state_idx" ON "employers"("state");

-- CreateIndex
CREATE INDEX "employers_msicCode_idx" ON "employers"("msicCode");

-- CreateIndex
CREATE INDEX "employers_isActive_idx" ON "employers"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "employers_userId_employerCode_key" ON "employers"("userId", "employerCode");

-- CreateIndex
CREATE INDEX "employees_employerId_idx" ON "employees"("employerId");

-- CreateIndex
CREATE INDEX "employees_icNumber_idx" ON "employees"("icNumber");

-- CreateIndex
CREATE INDEX "employees_isActive_idx" ON "employees"("isActive");

-- CreateIndex
CREATE INDEX "employees_category_idx" ON "employees"("category");

-- CreateIndex
CREATE INDEX "employees_isSkbbkEligible_skbbkPhase_idx" ON "employees"("isSkbbkEligible", "skbbkPhase");

-- CreateIndex
CREATE UNIQUE INDEX "employees_employerId_icNumber_key" ON "employees"("employerId", "icNumber");

-- CreateIndex
CREATE INDEX "submissions_employerId_idx" ON "submissions"("employerId");

-- CreateIndex
CREATE INDEX "submissions_deadlineDate_idx" ON "submissions"("deadlineDate");

-- CreateIndex
CREATE INDEX "submissions_status_idx" ON "submissions"("status");

-- CreateIndex
CREATE INDEX "submissions_contributionYear_contributionMonth_idx" ON "submissions"("contributionYear", "contributionMonth");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_employerId_contributionMonth_contributionYear_key" ON "submissions"("employerId", "contributionMonth", "contributionYear");

-- CreateIndex
CREATE INDEX "contributions_submissionId_idx" ON "contributions"("submissionId");

-- CreateIndex
CREATE INDEX "contributions_employeeId_idx" ON "contributions"("employeeId");

-- CreateIndex
CREATE INDEX "contributions_year_month_idx" ON "contributions"("year", "month");

-- CreateIndex
CREATE INDEX "subscriptions_userId_status_idx" ON "subscriptions"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_billplzChargeId_key" ON "payments"("billplzChargeId");

-- CreateIndex
CREATE INDEX "payments_userId_idx" ON "payments"("userId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_billplzChargeId_idx" ON "payments"("billplzChargeId");

-- CreateIndex
CREATE INDEX "alerts_userId_isRead_idx" ON "alerts"("userId", "isRead");

-- CreateIndex
CREATE INDEX "alerts_createdAt_idx" ON "alerts"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "employers" ADD CONSTRAINT "employers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "employers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "employers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
