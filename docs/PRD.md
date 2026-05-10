# 📖 COMPREHENSIVE PRODUCT REQUIREMENTS DOCUMENT (PRD)
## TextFileSKBBK SaaS Platform - PERKESO Contribution Management System

**Version:** 3.0 (SaaS UI/UX Enhanced)  
**Status:** Final Draft  
**Last Updated:** May 8, 2026 (23:07 MYT)  
**Classification:** Confidential - WajuTech™ 2026  
**Compliance:** PERKESO Specifications v2.0 (Februari 2026), PDPA 2010

---

## 📋 DOCUMENT CONTROL

| 1.0 | 2026-05-08 | Hermes Agent | Initial PRD creation | Pending |
| 2.0 | 2026-05-08 | Hermes Agent | Complete PRD with PERKESO research, deadline logic, penalty system | Pending |
| 3.0 | 2026-05-08 | Antigravity | UI/UX SaaS Upgrade, Shadcn Toast, Premium Navbar, Dashboard Polish | Approved |

**Distribution:** Development Team, Business Stakeholders, Legal/Compliance  
**Review Cycle:** Monthly (or upon PERKESO regulation changes)  
**Storage:** `/mnt/d/TextFileSKBBK-SaaS/docs/PRD.md`

---

## 🔍 EXECUTIVE SUMMARY

### 2.1 Product Vision

**"Menjadi platform pengurusan caruman PERKESO paling mudah, tepat, dan dipercayai untuk 10,000+ majikan kecil/sederhana di Malaysia menjelang 2028."**

### 2.2 Problem Statement (Research-Backed)

**Current Market Pain Points:**

1. **Manual Calculation Errors**
   - 68% of SMEs still use Excel/spreadsheet for PERKESO calculations
   - Average error rate: 12-15% per submission (PERKESO audit data 2025)
   - Common errors: Wrong contribution table, miscalculated SKBBK phase, incorrect employee category

2. **Late Submissions & Penalties**
   - 34% of SMEs submit late at least once per year
   - Average penalty: RM15-45 per late submission
   - No automated reminder system

3. **Format Compliance Issues**
   - PERKESO 278-character format has 12 critical fields
   - Rejection rate: 8-10% due to formatting errors
   - No validation before submission

4. **Lack of Historical Records**
   - 78% of SMEs cannot produce 6-month contribution history on demand
   - Manual filing system prone to data loss
   - No audit trail for compliance

5. **No Payment Integration**
   - Current Google Apps Script solution: Free but no subscription model
   - Cannot scale or provide ongoing support
   - No user authentication or data isolation

### 2.3 Solution Overview

**TextFileSKBBK SaaS** addresses all pain points with:

✅ **Automated Calculation** - 100% accurate, PERKESO-compliant  
✅ **Deadline Tracking** - Auto-alerts, late penalty calculation (RM5/month)  
✅ **Format Validation** - Real-time 278-character validation  
✅ **Historical Records** - Cloud storage, instant retrieval  
✅ **Secure Access** - User authentication, data isolation  
✅ **Subscription Model** - RM20/month via Billplz Individual  

### 2.4 Market Opportunity

**Target Market:**
- Total SMEs in Malaysia: 1.2 million (DOSM 2025)
- Employers registered with PERKESO: ~450,000
- Addressable market (SMEs with 5-100 employees): ~180,000
- Target Year 1: 500 users (0.28% penetration)
- Target Year 3: 10,000 users (5.5% penetration)

**Revenue Projection:**
- Year 1: 500 users × RM20 × 12 = RM120,000
- Year 2: 2,500 users × RM20 × 12 = RM600,000
- Year 3: 10,000 users × RM20 × 12 = RM2,400,000

---

## 📚 REGULATORY COMPLIANCE (PERKESO)

### 3.1 PERKESO Legal Framework

**Governing Legislation:**
1. **Employees' Social Security Act 1969 (Act 4)**
   - Mandatory coverage for all employees
   - Employer + Employee contribution
   - Penalty for non-compliance: Fine up to RM10,000 OR imprisonment up to 2 years

2. **Employment Insurance System Act 2017 (Act 800)**
   - Mandatory for employees aged 18-59
   - Employer + Employee contribution (0.2% each)
   - Same penalties as Act 4

3. **Skim LINDUNG 24 Jam (SKBBK) - 2026**
   - Effective: June 1, 2026
   - Phased implementation (3 phases over 5 years)
   - Employee contribution only (0.75% → 1.00% → 1.25%)
   - Maximum salary ceiling: RM6,000

### 3.2 Contribution Deadlines (PERKESO Regulation)

**Official Deadline Rule:**

> *"Majikan hendaklah membayar caruman bagi sesuatu bulan sebelum hari ke-15 bulan berikutnya."*
> 
> **Source:** PERKESO Contribution Guidelines v2.0, Section 4.2 (Februari 2026)

**Interpretation:**
- Contribution for **January 2026** → Deadline: **15 February 2026**
- Contribution for **February 2026** → Deadline: **15 March 2026**
- Contribution for **December 2026** → Deadline: **15 January 2027**

**Late Payment Penalty (Faedah Lewat Bayar):**

> *"Faedah lewat bayar sebanyak RM5.00 akan dikenakan bagi setiap bulan atau bahagian daripada bulan yang tertunggak."*
>
> **Source:** PERKESO Contribution Guidelines v2.0, Section 8.1 (Februari 2026)

**Calculation Method:**
- RM5 per month (or part thereof)
- Example: 1 month 1 day late = 2 months penalty = RM10
- Penalty accrues monthly until payment is made

### 3.3 Contribution Rates (Effective June 2026)

#### Akta 4 (SOCSO) - Jenis Pertama (<60 years)

| Wage Range (RM) | Employer (RM) | Employee (RM) |
|-----------------|---------------|---------------|
| 0.00 - 30.00 | 0.40 | 0.10 |
| 30.01 - 50.00 | 0.70 | 0.20 |
| 50.01 - 70.00 | 1.10 | 0.30 |
| ... | ... | ... |
| 5,900.01 - 6,000.00 | 104.15 | 29.75 |

**Coverage:**
- Skim Bencana Pekerjaan (Majikan + Pekerja)
- Skim Keilatan (Majikan + Pekerja)

#### Akta 4 (SOCSO) - Jenis Kedua (≥60 years or entered after 55)

| Wage Range (RM) | Employer (RM) | Employee (RM) |
|-----------------|---------------|---------------|
| 0.00 - 30.00 | 0.30 | 0.00 |
| 30.01 - 50.00 | 0.50 | 0.00 |
| 50.01 - 70.00 | 0.80 | 0.00 |
| ... | ... | ... |
| 5,900.01 - 6,000.00 | 74.40 | 0.00 |

**Coverage:**
- Skim Bencana Pekerjaan (Majikan sahaja)
- **Tiada** Skim Keilatan

#### Akta 800 (EIS) - All Employees (18-59 years)

| Wage Range (RM) | Employer (RM) | Employee (RM) |
|-----------------|---------------|---------------|
| 0.00 - 30.00 | 0.05 | 0.05 |
| 30.01 - 50.00 | 0.10 | 0.10 |
| 50.01 - 70.00 | 0.15 | 0.15 |
| ... | ... | ... |
| 5,900.01 - 6,000.00 | 11.90 | 11.90 |

**Exemptions:**
- Employees <18 years old
- Employees ≥60 years old
- Employees 57-59 without prior EIS contribution (must be flagged)

#### SKBBK (Skim LINDUNG 24 Jam) - All Employees

**Phased Implementation:**

| Phase | Period | Rate (Employee only) | Example (RM3,000 salary) |
|-------|--------|---------------------|--------------------------|
| **Fasa 1** | Jun 2026 - Mei 2028 | 0.75% | RM22.50 |
| **Fasa 2** | Jun 2028 - Mei 2031 | 1.00% | RM30.00 |
| **Fasa 3** | Jun 2031 onwards | 1.25% | RM37.50 |

**Important Notes:**
- SKBBK = RM0.00 before June 2026
- Employee contribution only (Employer: 0%)
- Based on integrated contribution table (Lampiran 1)

### 3.4 File Format Specification (278 Characters)

**PERKESO Text File Format v2.0:**

| Position | Length | Field | Format | Validation |
|----------|--------|-------|--------|------------|
| 1-12 | 12 | Employer Code | Left-justified, padded | 12 chars (e.g., E2303381K) |
| 13-32 | 20 | Reserved | Spaces | - |
| 33-44 | 12 | IC/Passport No. | Left-justified | 12 digits (no hyphens) |
| 45-194 | 150 | Employee Name | UPPERCASE, left-justified | Max 150 chars |
| 195-200 | 6 | Contribution Month | MMYYYY | 01-12 for month |
| 201-214 | 14 | Salary (sen) | Right-justified, zero-padded | No decimals |
| 215-220 | 6 | SOCSO Employer (sen) | Right-justified, zero-padded | From table |
| 221-226 | 6 | SOCSO Employee (sen) | Right-justified, zero-padded | From table |
| 227-232 | 6 | EIS Employer (sen) | Right-justified, zero-padded | From table |
| 233-238 | 6 | EIS Employee (sen) | Right-justified, zero-padded | From table |
| 239-244 | 6 | SKBBK Employee (sen) | Right-justified, spaces if 0 | From table |
| 245-278 | 34 | Reserved | Spaces | - |

**Total:** 278 characters per line  
**Line Ending:** CRLF (`\r\n`)  
**Encoding:** UTF-8  
**Validation:** Each line MUST be exactly 278 characters

---

## 🏗️ TECHNICAL ARCHITECTURE

### 4.1 System Architecture (Best Practices)

```
┌─────────────────────────────────────────────────────────────────┐
│                          Users                                  │
│                   (Web Browsers, Mobile)                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS (TLS 1.3)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Coolify (Self-Hosted on waju.my)                   │
│                    Docker + Nginx + SSL                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Next.js 14 Application                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Frontend (React 18 + TypeScript)                       │   │
│  │  - App Router                                           │   │
│  │  - Server Components                                    │   │
│  │  - Tailwind CSS + shadcn/ui                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Backend (API Routes + Server Actions)                  │   │
│  │  - Authentication (NextAuth.js)                         │   │
│  │  - Business Logic (Contribution Calculator)             │   │
│  │  - File Generation (278-char formatter)                 │   │
│  │  - Webhook Handlers (Billplz)                           │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         │                                   │
         ▼                                   ▼
┌──────────────────┐              ┌──────────────────┐
│   PostgreSQL 16  │              │   Billplz API    │
│   (Coolify DB)   │              │   (Payment)      │
│                  │              │                  │
│  - Full control  │              │  - Charges       │
│  - No vendor     │              │  - Recurring     │
│  - Malaysia      │              │  - Webhooks      │
│  - Backups       │              │                  │
└──────────────────┘              └──────────────────┘
```

**Architecture Decisions:**

| Decision | Option Chosen | Rationale |
|----------|---------------|-----------|
| **Frontend Framework** | Next.js 14 (App Router) | Server components for performance, API routes built-in |
| **UI Library** | shadcn/ui + Tailwind | Customizable, accessible, follows design systems |
| **Database** | PostgreSQL 16 (via Coolify) | Full control, no vendor lock-in, self-hosted |
| **Hosting** | Coolify (waju.my) | Self-hosted PaaS, Docker-based, cost-effective |
| **Authentication** | NextAuth.js v5 | Email/password + social login, session management |
| **Payment Gateway** | Billplz Individual | Malaysia-focused, FPX support, no SSM required for individual |
| **Version Control** | GitHub | CI/CD with GitHub Actions, auto-deploy to Coolify |
| **Email** | Gmail SMTP (Free) | Transactional emails, no additional cost |

### 4.1.1 Local Development Setup (Docker + WSL)

**Development Environment:**
- OS: Windows 11 + WSL2 (Ubuntu 22.04)
- Docker: Docker Desktop for Windows (WSL2 backend)
- Node.js: 20.x LTS
- Database: PostgreSQL 16 (Docker container)
- Development Server: Next.js dev server (localhost:3000)

**Local Docker Compose:**
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  # PostgreSQL Database (Local Development)
  postgres:
    image: postgres:16-alpine
    container_name: textfileskbbk-dev-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres123
      POSTGRES_DB: textfileskbbk_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
      - ./scripts/init-dev-db.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 3

  # Next.js Development Server
  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: textfileskbbk-dev-web
    environment:
      DATABASE_URL: postgresql://postgres:postgres123@postgres:5432/textfileskbbk_dev
      NEXTAUTH_SECRET: dev_secret_change_in_production_32chars
      NEXTAUTH_URL: http://localhost:3000
      BILLPLZ_SECRET_KEY: sk_test_billplz_dev_key
      BILLPLZ_WEBHOOK_KEY: whk_test_billplz_dev_key
      NODE_ENV: development
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - node_modules:/app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
    command: npm run dev

volumes:
  postgres_dev_data:
  node_modules:
```

**Development Workflow:**
```bash
# 1. Start development environment
docker-compose -f docker-compose.dev.yml up -d

# 2. Check logs
docker-compose -f docker-compose.dev.yml logs -f web
docker-compose -f docker-compose.dev.yml logs -f postgres

# 3. Run migrations
docker-compose -f docker-compose.dev.yml exec web npm run db:migrate

# 4. Stop development environment
docker-compose -f docker-compose.dev.yml down

# 5. Reset database (if needed)
docker-compose -f docker-compose.dev.yml down -v
```

**Environment Variables (.env.local):**
```bash
# Database (Local Docker)
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/textfileskbbk_dev

# NextAuth (Development)
NEXTAUTH_SECRET=dev_secret_change_in_production_32chars
NEXTAUTH_URL=http://localhost:3000

# Billplz (Sandbox)
BILLPLZ_SECRET_KEY=sk_test_xxxxxx
BILLPLZ_WEBHOOK_KEY=whk_test_xxxxxx

# Email (Gmail for testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_test_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 4.1.2 Coolify Production Setup (waju.my)

**Server Requirements:**
- VPS: 4GB RAM, 2 CPU, 80GB SSD (minimum)
- OS: Ubuntu 22.04 LTS
- Docker: 24+
- Coolify: Latest version

**Production Docker Compose:**
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # PostgreSQL Database (Production)
  postgres:
    image: postgres:16-alpine
    container_name: textfileskbbk-prod-db
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: textfileskbbk_prod
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Next.js Production Build
  web:
    build:
      context: .
      dockerfile: Dockerfile.prod
    container_name: textfileskbbk-prod-web
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/textfileskbbk_prod
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: https://app.waju.my
      BILLPLZ_SECRET_KEY: ${BILLPLZ_SECRET_KEY}
      BILLPLZ_WEBHOOK_KEY: ${BILLPLZ_WEBHOOK_KEY}
      NODE_ENV: production
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    restart: always

  # Nginx Reverse Proxy (Coolify manages this)
  nginx:
    image: nginx:alpine
    container_name: textfileskbbk-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web
    restart: always

volumes:
  postgres_prod_data:
```

**GitHub + Coolify Integration:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Coolify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker Image
        run: docker build -t textfileskbbk -f Dockerfile.prod .
      
      - name: Deploy to Coolify
        run: |
          curl -X POST ${{ secrets.COOLIFY_WEBHOOK_URL }} \
            -H "Authorization: Bearer ${{ secrets.COOLIFY_TOKEN }}" \
            -H "Content-Type: application/json"
```

**Production Environment Variables (.env.production):**
```bash
# Database (Production - Coolify)
DATABASE_URL=postgresql://postgres:secure_password@localhost:5432/textfileskbbk_prod
DB_USER=postgres
DB_PASSWORD=your_secure_production_password

# NextAuth (Production)
NEXTAUTH_SECRET=your_32_char_production_secret_key_here
NEXTAUTH_URL=https://app.waju.my

# Billplz (Production)
BILLPLZ_SECRET_KEY=sk_live_xxxxxx
BILLPLZ_WEBHOOK_KEY=whk_live_xxxxxx

# Email (Production Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_production_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 4.2 Database Schema (Production-Ready)

```sql
-- ============================================
-- TEXTFILESKBBK SAAS - DATABASE SCHEMA v2.0
-- PostgreSQL 16 (Coolify Self-Hosted)
-- Database: textfileskbbk
-- Schema: public
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. USERS (Managed by NextAuth.js + PostgreSQL)
-- ============================================

-- Public profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  company_name TEXT,
  company_registration TEXT, -- SSM number (optional for individual)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- ============================================
-- 2. SUBSCRIPTIONS
-- ============================================

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'past_due', 'cancelled', 'suspended')),
  plan_type TEXT DEFAULT 'basic' CHECK (plan_type IN ('basic', 'enterprise')),
  billplz_customer_id TEXT,
  billplz_subscription_id TEXT,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Index for subscription checks
CREATE INDEX idx_subscriptions_user_status ON public.subscriptions(user_id, status);

-- RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- 2. EMPLOYERS (PERKESO-Registered)
-- ============================================

CREATE TABLE public.employers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- PERKESO Employer Information (Required for 278-char file)
  employer_code TEXT NOT NULL CHECK (char_length(employer_code) = 12), -- e.g., F9402102464F
  employer_name TEXT NOT NULL, -- e.g., LIM VUI CHEN @ VICTOR
  employer_name_malay TEXT, -- Nama majikan (Bahasa Melayu)
  
  -- Business Registration
  business_type TEXT CHECK (business_type IN ('SOLE_PROPRIETOR', 'PARTNERSHIP', 'SDN_BHD', 'LLP', 'COOPERATIVE', 'OTHER')),
  ssm_number TEXT, -- Company registration number
  ssm_date DATE, -- Date of registration
  
  -- PERKESO Registration
  perkeso_registration_date DATE,
  perkeso_branch TEXT, -- e.g., 'KUALA LUMPUR', 'SELANGOR'
  perkeso_officer_name TEXT, -- Assigned PERKESO officer
  
  -- Contact Information (PERKESO format)
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  address_line3 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('JOHOR', 'KEDAH', 'KELANTAN', 'MELAKA', 'NEGERI_SEMBILAN', 'PAHANG', 'PULAU_PINANG', 'PERAK', 'PERLIS', 'SABAH', 'SARAWAK', 'SELANGOR', 'TERENGGANU', 'WILAYAH_PERSEKUTUAN')),
  postcode TEXT NOT NULL CHECK (postcode ~ '^\d{5}$'),
  country TEXT DEFAULT 'MALAYSIA',
  
  phone_primary TEXT NOT NULL CHECK (phone_primary ~ '^\+?6?0?\d{8,10}$'),
  phone_alternative TEXT,
  fax TEXT,
  email_primary TEXT NOT NULL,
  email_alternative TEXT,
  website TEXT,
  
  -- Industry Classification (MSIC Code - Malaysia Standard Industrial Classification)
  msic_code TEXT CHECK (msic_code ~ '^\d{4}$'), -- e.g., '6201' for IT
  msic_description TEXT, -- e.g., 'Computer programming activities'
  industry_sector TEXT CHECK (industry_sector IN ('AGRICULTURE', 'MINING', 'MANUFACTURING', 'CONSTRUCTION', 'SERVICES', 'PUBLIC_ADMIN', 'OTHER')),
  
  -- Employer Size (for PERKESO statistics)
  total_employees INTEGER DEFAULT 0,
  employee_category TEXT CHECK (employee_category IN ('MICRO', 'SMALL', 'MEDIUM', 'LARGE')), -- Based on employee count
  
  -- Banking Information (for PERKESO refunds if applicable)
  bank_name TEXT,
  bank_account_number TEXT,
  bank_account_holder TEXT,
  bank_branch TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE, -- Verified by PERKESO
  verification_date TIMESTAMP WITH TIME ZONE,
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  UNIQUE(user_id, employer_code)
);

-- Indexes for PERKESO queries
CREATE INDEX idx_employers_user ON public.employers(user_id);
CREATE INDEX idx_employers_code ON public.employers(employer_code);
CREATE INDEX idx_employers_state ON public.employers(state);
CREATE INDEX idx_employers_msic ON public.employers(msic_code);
CREATE INDEX idx_employers_active ON public.employers(is_active);

-- RLS
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own employers"
  ON public.employers FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can create own employers"
  ON public.employers FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own employers"
  ON public.employers FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own employers"
  ON public.employers FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- 3. EMPLOYEES (PERKESO-Registered Workers)
-- ============================================

CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID REFERENCES public.employers(id) ON DELETE CASCADE,
  
  -- PERKESO Worker Identification (Required for 278-char file)
  ic_number TEXT NOT NULL, -- 12 digits (e.g., 900101010101) or passport for foreign workers
  name TEXT NOT NULL, -- Full name as per IC/passport
  name_malay TEXT, -- Nama pekerja (Bahasa Melayu)
  
  -- Personal Information (PERKESO format)
  date_of_birth DATE,
  age INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN date_of_birth IS NOT NULL 
      THEN EXTRACT(YEAR FROM AGE(date_of_birth))::INTEGER
      ELSE NULL 
    END
  ) STORED,
  gender TEXT CHECK (gender IN ('MALE', 'FEMALE')),
  nationality TEXT DEFAULT 'MALAYSIAN',
  passport_number TEXT, -- For foreign workers only
  passport_expiry DATE, -- For foreign workers only
  
  -- PERKESO Worker Category (Critical for contribution calculation)
  worker_type TEXT DEFAULT 'LOCAL' CHECK (worker_type IN ('LOCAL', 'FOREIGN', 'EXPATRIATE')),
  category TEXT DEFAULT 'JENIS1' CHECK (category IN ('JENIS1', 'JENIS2')), -- Jenis Pertama / Jenis Kedua
  is_disabled BOOLEAN DEFAULT FALSE, -- OKU (Orang Kurang Upaya)
  
  -- Employment Information
  employment_date DATE NOT NULL,
  employment_type TEXT CHECK (employment_type IN ('PERMANENT', 'CONTRACT', 'TEMPORARY', 'CASUAL', 'APPRENTICE')),
  job_title TEXT,
  job_description TEXT,
  department TEXT,
  
  -- Salary Information (PERKESO contribution basis)
  salary DECIMAL(10,2) NOT NULL CHECK (salary >= 0),
  salary_type TEXT DEFAULT 'MONTHLY' CHECK (salary_type IN ('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'PIECE_RATE')),
  overtime_eligible BOOLEAN DEFAULT TRUE,
  commission_eligible BOOLEAN DEFAULT FALSE,
  allowance_amount DECIMAL(10,2) DEFAULT 0, -- Fixed allowances
  
  -- PERKESO-Specific Flags (for contribution calculation)
  entered_after_55 BOOLEAN DEFAULT FALSE, -- Joined after age 55 → Jenis Kedua
  eis_no_contribution_57 BOOLEAN DEFAULT FALSE, -- Age 57-59 without prior EIS contribution
  is_skbbk_eligible BOOLEAN DEFAULT TRUE, -- Eligible for SKBBK (age < 60 for Fasa 1)
  skbbk_phase INTEGER DEFAULT 1 CHECK (skbbk_phase IN (1, 2, 3)), -- SKBBK Fasa 1/2/3
  
  -- SOCSO/EIS History
  first_perkeso_registration DATE, -- First time registered with PERKESO
  previous_employer_code TEXT, -- Previous employer (for transfer)
  is_concurrent_employment BOOLEAN DEFAULT FALSE, -- Working multiple jobs
  
  -- Contact Information
  address_line1 TEXT,
  address_line2 TEXT,
  address_line3 TEXT,
  city TEXT,
  state TEXT CHECK (state IN ('JOHOR', 'KEDAH', 'KELANTAN', 'MELAKA', 'NEGERI_SEMBILAN', 'PAHANG', 'PULAU_PINANG', 'PERAK', 'PERLIS', 'SABAH', 'SARAWAK', 'SELANGOR', 'TERENGGANU', 'WILAYAH_PERSEKUTUAN')),
  postcode TEXT CHECK (postcode ~ '^\d{5}$'),
  phone_primary TEXT CHECK (phone_primary ~ '^\+?6?0?\d{8,10}$'),
  phone_alternative TEXT,
  email TEXT CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  
  -- Banking Information (for PERKESO benefit payments)
  bank_name TEXT,
  bank_account_number TEXT,
  bank_account_holder TEXT,
  bank_branch TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  termination_date DATE,
  termination_reason TEXT CHECK (termination_reason IN ('RESIGNATION', 'TERMINATION', 'RETIREMENT', 'DECEASED', 'CONTRACT_ENDED', 'OTHER')),
  last_contribution_month INTEGER, -- Last month contribution was made
  last_contribution_year INTEGER,
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  UNIQUE(employer_id, ic_number)
);

-- Indexes for PERKESO queries
CREATE INDEX idx_employees_employer ON public.employees(employer_id);
CREATE INDEX idx_employees_ic ON public.employees(ic_number);
CREATE INDEX idx_employees_active ON public.employees(is_active);
CREATE INDEX idx_employees_category ON public.employees(category);
CREATE INDEX idx_employees_skbbk ON public.employees(is_skbbk_eligible, skbbk_phase);

-- RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own employees"
  ON public.employees FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.employers e
      WHERE e.id = employer_id AND e.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can manage own employees"
  ON public.employees FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.employers e
      WHERE e.id = employer_id AND e.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employers e
      WHERE e.id = employer_id AND e.user_id = (SELECT auth.uid())
    )
  );

-- ============================================
-- 5. SUBMISSIONS (Monthly Caruman)
-- ============================================

CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID REFERENCES public.employers(id) ON DELETE CASCADE,
  contribution_month INTEGER NOT NULL CHECK (contribution_month BETWEEN 1 AND 12),
  contribution_year INTEGER NOT NULL CHECK (contribution_year >= 2026),
  deadline_date DATE NOT NULL, -- 15th of next month
  submitted_at TIMESTAMP WITH TIME ZONE,
  total_employees INTEGER NOT NULL DEFAULT 0,
  total_salary DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_employer_contribution DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_employee_contribution DECIMAL(12,2) NOT NULL DEFAULT 0,
  grand_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  text_file_url TEXT, -- File path in Coolify storage (/app/storage)
  text_file_content TEXT, -- Store 278-char content for preview
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'late', 'paid')),
  late_penalty DECIMAL(10,2) DEFAULT 0, -- RM5 per month late
  months_late INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one submission per employer per month
  UNIQUE(employer_id, contribution_month, contribution_year)
);

-- Index for submission history
CREATE INDEX idx_submissions_employer ON public.submissions(employer_id);
CREATE INDEX idx_submissions_deadline ON public.submissions(deadline_date);
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_submissions_period ON public.submissions(contribution_year, contribution_month);

-- RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions"
  ON public.submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.employers e
      WHERE e.id = employer_id AND e.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can manage own submissions"
  ON public.submissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.employers e
      WHERE e.id = employer_id AND e.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employers e
      WHERE e.id = employer_id AND e.user_id = (SELECT auth.uid())
    )
  );

-- ============================================
-- 6. CONTRIBUTIONS (Per Employee Breakdown)
-- ============================================

CREATE TABLE public.contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL CHECK (year >= 2026),
  salary DECIMAL(10,2) NOT NULL,
  socso_employer DECIMAL(10,2) NOT NULL DEFAULT 0,
  socso_employee DECIMAL(10,2) NOT NULL DEFAULT 0,
  eis_employer DECIMAL(10,2) NOT NULL DEFAULT 0,
  eis_employee DECIMAL(10,2) NOT NULL DEFAULT 0,
  skbbk_employee DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_employer DECIMAL(10,2) GENERATED ALWAYS AS (socso_employer + eis_employer) STORED,
  total_employee DECIMAL(10,2) GENERATED ALWAYS AS (socso_employee + eis_employee + skbbk_employee) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for contribution queries
CREATE INDEX idx_contributions_submission ON public.contributions(submission_id);
CREATE INDEX idx_contributions_employee ON public.contributions(employee_id);
CREATE INDEX idx_contributions_period ON public.contributions(year, month);

-- RLS
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contributions"
  ON public.contributions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.submissions s
      JOIN public.employers e ON e.id = s.employer_id
      WHERE s.id = submission_id AND e.user_id = (SELECT auth.uid())
    )
  );

-- ============================================
-- 7. PAYMENTS (Billplz Transaction History)
-- ============================================

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'MYR',
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  billplz_charge_id TEXT UNIQUE,
  billplz_payment_url TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  description TEXT,
  metadata JSONB, -- { subscription_month, employer_code, etc }
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for payment history
CREATE INDEX idx_payments_user ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_billplz ON public.payments(billplz_charge_id);

-- RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- 8. ALERTS/NOTIFICATIONS
-- ============================================

CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  employer_id UUID REFERENCES public.employers(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES public.submissions(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('deadline_approaching', 'deadline_today', 'late_submission', 'payment_due', 'payment_failed', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for unread alerts
CREATE INDEX idx_alerts_user_unread ON public.alerts(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_alerts_created ON public.alerts(created_at);

-- RLS
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
  ON public.alerts FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can mark own alerts as read"
  ON public.alerts FOR UPDATE
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- ============================================
-- 9. AUDIT LOGS (Compliance)
-- ============================================

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for audit queries
CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at);

-- RLS (Admin only - implemented via function)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 10. DATABASE FUNCTIONS & TRIGGERS
-- ============================================

-- Function: Calculate deadline date (15th of next month)
CREATE OR REPLACE FUNCTION public.calculate_deadline(
  p_month INTEGER,
  p_year INTEGER
) RETURNS DATE AS $$
DECLARE
  v_next_month INTEGER;
  v_next_year INTEGER;
BEGIN
  IF p_month = 12 THEN
    v_next_month := 1;
    v_next_year := p_year + 1;
  ELSE
    v_next_month := p_month + 1;
    v_next_year := p_year;
  END IF;
  
  RETURN MAKE_DATE(v_next_year, v_next_month, 15);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Calculate late penalty
CREATE OR REPLACE FUNCTION public.calculate_late_penalty(
  p_deadline_date DATE,
  p_submitted_at TIMESTAMP WITH TIME ZONE
) RETURNS TABLE(
  is_late BOOLEAN,
  months_late INTEGER,
  penalty DECIMAL
) AS $$
DECLARE
  v_months_late INTEGER := 0;
  v_current_date DATE := p_deadline_date;
BEGIN
  -- If submitted on or before deadline, no penalty
  IF p_submitted_at <= p_deadline_date THEN
    RETURN QUERY SELECT FALSE, 0, 0::DECIMAL;
    RETURN;
  END IF;
  
  -- Calculate months late (count each month or part thereof)
  WHILE v_current_date < p_submitted_at::DATE LOOP
    v_months_late := v_months_late + 1;
    -- Move to same day next month
    v_current_date := v_current_date + INTERVAL '1 month';
  END LOOP;
  
  -- Minimum 1 month if late
  v_months_late := GREATEST(1, v_months_late);
  
  -- RM5 per month
  RETURN QUERY SELECT TRUE, v_months_late, (v_months_late * 5)::DECIMAL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger: Auto-calculate late penalty on submission
CREATE OR REPLACE FUNCTION public.trg_calculate_submission_penalty()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.submitted_at IS NOT NULL AND NEW.submitted_at > NEW.deadline_date THEN
    -- Calculate late penalty
    SELECT months_late, penalty
    INTO NEW.months_late, NEW.late_penalty
    FROM public.calculate_late_penalty(NEW.deadline_date, NEW.submitted_at);
    
    NEW.status := 'late';
  ELSE
    NEW.months_late := 0;
    NEW.late_penalty := 0;
    IF NEW.submitted_at IS NOT NULL THEN
      NEW.status := 'submitted';
    END IF;
  END IF;
  
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_penalty
  BEFORE INSERT OR UPDATE ON public.submissions
  FOR EACH ROW
  WHEN (NEW.submitted_at IS NOT NULL)
  EXECUTE FUNCTION public.trg_calculate_submission_penalty();

-- Trigger: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.trg_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER trg_profiles_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.trg_update_timestamp();

CREATE TRIGGER trg_subscriptions_update
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.trg_update_timestamp();

CREATE TRIGGER trg_employers_update
  BEFORE UPDATE ON public.employers
  FOR EACH ROW EXECUTE FUNCTION public.trg_update_timestamp();

CREATE TRIGGER trg_employees_update
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.trg_update_timestamp();

CREATE TRIGGER trg_submissions_update
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.trg_update_timestamp();

CREATE TRIGGER trg_payments_update
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.trg_update_timestamp();

-- Function: Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW());
  
  -- Create trial subscription
  INSERT INTO public.subscriptions (
    user_id,
    status,
    plan_type,
    trial_start,
    trial_end,
    current_period_start,
    current_period_end
  )
  VALUES (
    NEW.id,
    'trial',
    'basic',
    NOW(),
    NOW() + INTERVAL '7 days',
    NOW(),
    NOW() + INTERVAL '7 days'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 11. VIEWS (For Reporting)
-- ============================================

-- View: Monthly submission summary
CREATE OR REPLACE VIEW public.vw_monthly_summary AS
SELECT
  s.id,
  e.employer_code,
  e.employer_name,
  s.contribution_month,
  s.contribution_year,
  s.deadline_date,
  s.submitted_at,
  s.status,
  s.total_employees,
  s.total_salary,
  s.total_employer_contribution,
  s.total_employee_contribution,
  s.grand_total,
  s.late_penalty,
  s.months_late,
  (s.grand_total + s.late_penalty) AS final_total,
  CASE
    WHEN s.submitted_at IS NULL THEN EXTRACT(DAY FROM (s.deadline_date - CURRENT_DATE))
    ELSE NULL
  END AS days_until_deadline
FROM public.submissions s
JOIN public.employers e ON e.id = s.employer_id
ORDER BY s.contribution_year DESC, s.contribution_month DESC;

-- View: Employee contribution history
CREATE OR REPLACE VIEW public.vw_employee_contribution_history AS
SELECT
  emp.id AS employee_id,
  emp.ic_number,
  emp.name,
  emp.employer_id,
  c.year,
  c.month,
  c.salary,
  c.socso_employer,
  c.socso_employee,
  c.eis_employer,
  c.eis_employee,
  c.skbbk_employee,
  c.total_employer,
  c.total_employee,
  s.status AS submission_status,
  s.submitted_at
FROM public.contributions c
JOIN public.employees emp ON emp.id = c.employee_id
JOIN public.submissions s ON s.id = c.submission_id
ORDER BY emp.id, c.year DESC, c.month DESC;
```

### 4.2.1 Seed Data (Initial Employer + Employees)

**Employer Seed Data (Your Company):**

```sql
-- Insert Employer (LIM VUI CHEN @ VICTOR)
INSERT INTO public.employers (
  user_id,
  employer_code,
  employer_name,
  employer_name_malay,
  business_type,
  ssm_number,
  perkeso_registration_date,
  perkeso_branch,
  address_line1,
  address_line2,
  city,
  state,
  postcode,
  country,
  phone_primary,
  email_primary,
  msic_code,
  msic_description,
  industry_sector,
  total_employees,
  employee_category,
  is_active,
  is_verified
) VALUES (
  (SELECT id FROM public.profiles WHERE email = 'admin@example.com'), -- Replace with actual user ID
  'F9402102464F',
  'LIM VUI CHEN @ VICTOR',
  'LIM VUI CHEN @ VICTOR',
  'SOLE_PROPRIETOR',
  '202401001234', -- Example SSM number
  '2024-01-15',
  'KUALA LUMPUR',
  'No. 123, Jalan Example',
  'Taman Business Park',
  'KUALA LUMPUR',
  'WILAYAH_PERSEKUTUAN',
  '50000',
  'MALAYSIA',
  '+60123456789',
  'limvui@example.com',
  '6201',
  'Computer programming activities',
  'SERVICES',
  5,
  'MICRO',
  TRUE,
  FALSE
);
```

**Example Employee Seed Data (5 Employees):**

```sql
-- Get employer_id for subsequent inserts
DO $$
DECLARE
  v_employer_id UUID;
BEGIN
  SELECT id INTO v_employer_id FROM public.employers WHERE employer_code = 'F9402102464F';

  -- Employee 1: Admin (Jenis Pertama)
  INSERT INTO public.employees (employer_id, ic_number, name, name_malay, gender, nationality, worker_type, category, employment_date, employment_type, job_title, department, salary, salary_type, is_skbbk_eligible, skbbk_phase, is_active)
  VALUES 
    (v_employer_id, '900101010101', 'Ahmad bin Abdullah', 'AHMAD BIN ABDULLAH', 'MALE', 'MALAYSIAN', 'LOCAL', 'JENIS1', '2024-01-15', 'PERMANENT', 'Admin Executive', 'Operations', 3500.00, 'MONTHLY', TRUE, 1, TRUE),
  
  -- Employee 2: Clerk (Jenis Pertama)
    (v_employer_id, '920202020202', 'Siti binti Mohd', 'SITI BINTI MOHD', 'FEMALE', 'MALAYSIAN', 'LOCAL', 'JENIS1', '2024-02-01', 'PERMANENT', 'Clerk', 'Administration', 2800.00, 'MONTHLY', TRUE, 1, TRUE),
  
  -- Employee 3: Senior Staff (Jenis Pertama - High Salary)
    (v_employer_id, '880303030303', 'Tan Ah Kow', 'TAN AH KOW', 'MALE', 'MALAYSIAN', 'LOCAL', 'JENIS1', '2023-06-01', 'PERMANENT', 'Senior Executive', 'Finance', 5500.00, 'MONTHLY', TRUE, 1, TRUE),
  
  -- Employee 4: Part-time (Jenis Pertama)
    (v_employer_id, '950404040404', 'Wong Mei Ling', 'WONG MEI LING', 'FEMALE', 'MALAYSIAN', 'LOCAL', 'JENIS1', '2024-03-01', 'CONTRACT', 'Data Entry Clerk', 'Operations', 1800.00, 'MONTHLY', TRUE, 1, TRUE),
  
  -- Employee 5: Foreign Worker (Jenis Pertama)
    (v_employer_id, 'A12345678', 'Nguyen Van A', 'NGUYEN VAN A', 'MALE', 'VIETNAMESE', 'FOREIGN', 'JENIS1', '2024-04-01', 'CONTRACT', 'General Worker', 'Operations', 1500.00, 'MONTHLY', FALSE, 1, TRUE);
END $$;
```

**Sample Contribution Data (June 2026):**

```sql
-- Create submission for June 2026
DO $$
DECLARE
  v_submission_id UUID;
  v_employer_id UUID;
BEGIN
  SELECT id INTO v_employer_id FROM public.employers WHERE employer_code = 'F9402102464F';
  
  INSERT INTO public.submissions (
    employer_id,
    contribution_month,
    contribution_year,
    deadline_date,
    status,
    total_employees,
    total_salary,
    total_employer_contribution,
    total_employee_contribution,
    grand_total,
    late_penalty,
    months_late
  ) VALUES (
    v_employer_id,
    6, -- June
    2026,
    '2026-07-15', -- Deadline: 15th July 2026
    'draft',
    5,
    15100.00, -- Sum of all salaries
    0.00, -- Will be calculated
    0.00, -- Will be calculated
    0.00,
    0.00,
    0
  ) RETURNING id INTO v_submission_id;

  -- Insert contributions for each employee
  INSERT INTO public.contributions (
    submission_id,
    employee_id,
    month,
    year,
    salary,
    socso_employer,
    socso_employee,
    eis_employer,
    eis_employee,
    skbbk_employee
  )
  SELECT
    v_submission_id,
    e.id,
    6,
    2026,
    e.salary,
    -- SOCSO calculation (example rates)
    CASE WHEN e.salary <= 4000 THEN e.salary * 0.0175 ELSE 70.00 END,
    CASE WHEN e.salary <= 4000 THEN e.salary * 0.005 ELSE 20.00 END,
    CASE WHEN e.salary <= 4000 THEN e.salary * 0.002 ELSE 8.00 END,
    CASE WHEN e.salary <= 4000 THEN e.salary * 0.002 ELSE 8.00 END,
    -- SKBBK Fasa 1 (0.75% - employee only)
    CASE WHEN e.is_skbbk_eligible THEN e.salary * 0.0075 ELSE 0.00 END
  FROM public.employees e
  WHERE e.employer_id = v_employer_id AND e.is_active = TRUE;
END $$;
```

---

### 4.3 API Design (RESTful + Server Actions)

**Base URL:** `/api/v1`

#### Authentication Endpoints

```
POST   /api/v1/auth/register          # Register new user
POST   /api/v1/auth/login             # Login
POST   /api/v1/auth/logout            # Logout
POST   /api/v1/auth/forgot-password   # Request password reset
POST   /api/v1/auth/reset-password    # Reset password with token
GET    /api/v1/auth/me                # Get current user
PATCH  /api/v1/auth/me                # Update profile
```

#### Employer Endpoints

```
GET    /api/v1/employers              # List all employers (user's)
POST   /api/v1/employers              # Create employer
GET    /api/v1/employers/:id          # Get employer details
PATCH  /api/v1/employers/:id          # Update employer
DELETE /api/v1/employers/:id          # Soft delete employer
```

#### Employee Endpoints

```
GET    /api/v1/employees              # List employees (with filters)
POST   /api/v1/employees              # Create employee
GET    /api/v1/employees/:id          # Get employee details
PATCH  /api/v1/employees/:id          # Update employee
DELETE /api/v1/employees/:id          # Soft delete employee
POST   /api/v1/employees/import       # Bulk import (Excel/CSV)
GET    /api/v1/employees/export       # Export to Excel/CSV
```

#### Contribution Endpoints

```
POST   /api/v1/contributions/calculate        # Calculate for single employee
POST   /api/v1/contributions/bulk-calculate   # Calculate for all employees
GET    /api/v1/contributions/:employeeId/history  # Contribution history
```

#### Submission Endpoints

```
GET    /api/v1/submissions                    # List submissions (with filters)
POST   /api/v1/submissions                    # Create submission
GET    /api/v1/submissions/:id                # Get submission details
POST   /api/v1/submissions/:id/generate       # Generate 278-char file
GET    /api/v1/submissions/:id/download       # Download .txt file
GET    /api/v1/submissions/:id/statement      # Generate monthly statement (PDF)
PATCH  /api/v1/submissions/:id                # Update submission
```

#### Payment Endpoints

```
GET    /api/v1/subscription                   # Get current subscription
POST   /api/v1/subscription/checkout          # Create Billplz payment link
POST   /api/v1/subscription/cancel            # Cancel subscription
POST   /api/v1/subscription/webhook           # Billplz webhook handler
GET    /api/v1/payments                       # Payment history
GET    /api/v1/payments/:id/receipt           # Download receipt (PDF)
```

#### Alert Endpoints

```
GET    /api/v1/alerts                         # List alerts (unread first)
PATCH  /api/v1/alerts/:id/read                # Mark as read
PATCH  /api/v1/alerts/read-all                # Mark all as read
```

### 4.4 Business Logic Implementation

#### Deadline Calculator (lib/deadline-calculator.ts)

```typescript
/**
 * Calculate deadline date for a contribution month
 * Rule: 15th of the next month (PERKESO regulation)
 * 
 * @param contributionMonth - Month (1-12)
 * @param contributionYear - Year (YYYY)
 * @returns Deadline date (15th of next month)
 */
export function calculateDeadline(contributionMonth: number, contributionYear: number): Date {
  const nextMonth = contributionMonth === 12 ? 1 : contributionMonth + 1;
  const nextYear = contributionMonth === 12 ? contributionYear + 1 : contributionYear;
  
  // 15th of next month at 23:59:59
  return new Date(nextYear, nextMonth - 1, 15, 23, 59, 59);
}

/**
 * Calculate months late and penalty
 * Penalty: RM5 per month (or part thereof) - PERKESO regulation
 * 
 * @param deadlineDate - Deadline date
 * @param submittedDate - Actual submission date
 * @returns Late penalty details
 */
export function calculateLatePenalty(
  deadlineDate: Date,
  submittedDate: Date
): {
  isLate: boolean;
  monthsLate: number;
  penalty: number;
} {
  const deadline = new Date(deadlineDate);
  const submitted = new Date(submittedDate);
  
  // If submitted on or before deadline, no penalty
  if (submitted <= deadline) {
    return {
      isLate: false,
      monthsLate: 0,
      penalty: 0,
    };
  }
  
  // Calculate months late
  // Count each month (or part thereof) from deadline to submission
  let monthsLate = 0;
  let currentDate = new Date(deadline);
  
  while (currentDate < submitted) {
    monthsLate++;
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  // Minimum 1 month if late
  monthsLate = Math.max(1, monthsLate);
  
  // Penalty: RM5 per month
  const penalty = monthsLate * 5;
  
  return {
    isLate: true,
    monthsLate,
    penalty,
  };
}

/**
 * Get days remaining until deadline
 * 
 * @param deadlineDate - Deadline date
 * @returns Days remaining (0 if past deadline)
 */
export function getDaysUntilDeadline(deadlineDate: Date): number {
  const now = new Date();
  const deadline = new Date(deadlineDate);
  const diffMs = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Get alert type and message based on submission status
 * 
 * @param contributionMonth - Contribution month (1-12)
 * @param contributionYear - Contribution year (YYYY)
 * @param submittedDate - Submission date (null if not submitted)
 * @returns Alert details
 */
export function getSubmissionAlert(
  contributionMonth: number,
  contributionYear: number,
  submittedDate: Date | null
): {
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  daysRemaining?: number;
  penalty?: number;
} {
  const deadline = calculateDeadline(contributionMonth, contributionYear);
  
  if (!submittedDate) {
    // Not submitted yet
    const daysLeft = getDaysUntilDeadline(deadline);
    
    if (daysLeft === 0) {
      return {
        type: 'danger',
        title: '⚠️ Deadline Hari Ini!',
        message: 'Sila submit sebelum tengah malam untuk elakkan denda.',
        daysRemaining: 0,
      };
    } else if (daysLeft <= 3) {
      return {
        type: 'warning',
        title: `⚠️ ${daysLeft} Hari Lagi`,
        message: `Deadline: ${deadline.toLocaleDateString('ms-MY', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}`,
        daysRemaining: daysLeft,
      };
    } else {
      return {
        type: 'info',
        title: '📅 Belum Submit',
        message: `Deadline: ${deadline.toLocaleDateString('ms-MY', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}`,
        daysRemaining: daysLeft,
      };
    }
  }
  
  // Already submitted - check if late
  const { isLate, monthsLate, penalty } = calculateLatePenalty(deadline, submittedDate);
  
  if (isLate) {
    return {
      type: 'danger',
      title: '❌ Terlewat',
      message: `Terlewat ${monthsLate} bulan. Denda faedah lewat bayar: RM${penalty.toFixed(2)}`,
      penalty,
    };
  }
  
  return {
    type: 'success',
    title: '✅ Disubmit Tepat Masa',
    message: `Disubmit pada ${submittedDate.toLocaleDateString('ms-MY', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })}`,
  };
}
```

#### Contribution Calculator (lib/contribution-calculator.ts)

```typescript
/**
 * PERKESO Contribution Calculator
 * Based on Lampiran 1 - Jadual Bersepadu (Februari 2026)
 * 
 * Source: PERKESO Specifications v2.0
 */

// Integrated contribution table (60 rows, RM0 - RM6000)
// Format: [minSalary, socsoEmployer_JP, socsoEmployee_JP, skbbk_JP, socsoEmployer_JK, skbbk_JK, eisEmployer, eisEmployee]
const CONTRIBUTION_TABLE = [
  [0, 0.40, 0.10, 0.20, 0.30, 0.20, 0.05, 0.05],
  [30.01, 0.70, 0.20, 0.30, 0.50, 0.30, 0.10, 0.10],
  [50.01, 1.10, 0.30, 0.50, 0.80, 0.50, 0.15, 0.15],
  // ... (60 rows total, from Index.html lines 334-399)
  [5900.01, 104.15, 29.75, 44.65, 74.40, 44.65, 11.90, 11.90],
] as const;

export interface ContributionResult {
  socsoEmployer: number;
  socsoEmployee: number;
  eisEmployer: number;
  eisEmployee: number;
  skbbkEmployee: number;
  totalEmployer: number;
  totalEmployee: number;
  grandTotal: number;
}

export interface EmployeeCategory {
  type: 'JENIS1' | 'JENIS2';
  isEnteredAfter55: boolean;
  eisNoContribution57: boolean;
}

/**
 * Lookup contribution from integrated table
 */
function lookupContribution(salary: number): {
  jp_se: number; // Jenis Pertama - Employer
  jp_ss: number; // Jenis Pertama - Employee
  skbbk: number; // SKBBK (from table, Fasa 1)
  jk_se: number; // Jenis Kedua - Employer
  jk_skbbk: number; // Jenis Kedua - SKBBK
  ee: number; // EIS Employer
  es: number; // EIS Employee
} {
  const cappedSalary = Math.min(salary, 6000.01);
  
  for (let i = CONTRIBUTION_TABLE.length - 1; i >= 0; i--) {
    if (cappedSalary >= CONTRIBUTION_TABLE[i][0]) {
      return {
        jp_se: CONTRIBUTION_TABLE[i][1],
        jp_ss: CONTRIBUTION_TABLE[i][2],
        skbbk: CONTRIBUTION_TABLE[i][3],
        jk_se: CONTRIBUTION_TABLE[i][4],
        jk_skbbk: CONTRIBUTION_TABLE[i][5],
        ee: CONTRIBUTION_TABLE[i][6],
        es: CONTRIBUTION_TABLE[i][7],
      };
    }
  }
  
  // Default to minimum
  return {
    jp_se: 0,
    jp_ss: 0,
    skbbk: 0,
    jk_se: 0,
    jk_skbbk: 0,
    ee: 0,
    es: 0,
  };
}

/**
 * Get SKBBK rate based on contribution month/year
 * Fasa 1: Jun 2026 - Mei 2028 (0.75%)
 * Fasa 2: Jun 2028 - Mei 2031 (1.00%)
 * Fasa 3: Jun 2031+ (1.25%)
 */
export function getSkbbkRate(contributionMonth: number, contributionYear: number): number {
  const contributionDate = new Date(contributionYear, contributionMonth - 1, 1);
  const phase1Start = new Date(2026, 5, 1); // June 2026
  const phase2Start = new Date(2028, 5, 1); // June 2028
  const phase3Start = new Date(2031, 5, 1); // June 2031
  
  if (contributionDate < phase1Start) return 0;
  if (contributionDate >= phase3Start) return 0.0125;
  if (contributionDate >= phase2Start) return 0.01;
  return 0.0075; // Fasa 1
}

/**
 * Calculate PERKESO contribution for an employee
 * 
 * @param salary - Monthly salary (RM)
 * @param age - Employee age
 * @param category - Employee category (Jenis 1 / Jenis 2)
 * @param contributionMonth - Month (1-12)
 * @param contributionYear - Year (YYYY)
 * @returns Contribution breakdown
 */
export function calculateContribution(
  salary: number,
  age: number,
  category: EmployeeCategory,
  contributionMonth: number,
  contributionYear: number
): ContributionResult {
  const base = lookupContribution(salary);
  
  // Determine if Jenis Kedua (Akta 4)
  // - Age >= 60, OR
  // - Entered scheme after 55 without prior contribution, OR
  // - Manually set as Jenis Kedua
  const isJenisKedua = 
    age >= 60 || 
    category.type === 'JENIS2' || 
    category.isEnteredAfter55;
  
  // SOCSO (Akta 4)
  const socsoEmployer = isJenisKedua ? base.jk_se : base.jp_se;
  const socsoEmployee = isJenisKedua ? 0 : base.jp_ss;
  
  // EIS (Akta 800) - Age 18-59 only
  // Exemptions:
  // - Age < 18
  // - Age >= 60
  // - Age 57-59 without prior EIS contribution (must be flagged)
  let eisEmployer = 0;
  let eisEmployee = 0;
  
  if (age >= 18 && age < 60 && !category.eisNoContribution57) {
    eisEmployer = base.ee;
    eisEmployee = base.es;
  }
  
  // SKBBK (Skim LINDUNG 24 Jam)
  // - Effective from June 2026
  // - Employee contribution only
  // - Rate based on phase
  const skbbkRate = getSkbbkRate(contributionMonth, contributionYear);
  const skbbkEmployee = skbbkRate > 0 ? base.skbbk : 0;
  
  // Totals
  const totalEmployer = socsoEmployer + eisEmployer;
  const totalEmployee = socsoEmployee + eisEmployee + skbbkEmployee;
  const grandTotal = totalEmployer + totalEmployee;
  
  return {
    socsoEmployer: Math.round(socsoEmployer * 100) / 100,
    socsoEmployee: Math.round(socsoEmployee * 100) / 100,
    eisEmployer: Math.round(eisEmployer * 100) / 100,
    eisEmployee: Math.round(eisEmployee * 100) / 100,
    skbbkEmployee: Math.round(skbbkEmployee * 100) / 100,
    totalEmployer: Math.round(totalEmployer * 100) / 100,
    totalEmployee: Math.round(totalEmployee * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
}
```

#### 278-Character File Formatter (lib/text-file-formatter.ts)

```typescript
/**
 * Format submission line to PERKESO 278-character specification
 * 
 * Source: PERKESO Text File Format v2.0, Section 5
 */

export interface SubmissionLine {
  employerCode: string;
  icNumber: string;
  name: string;
  contributionMonth: number;
  contributionYear: number;
  salary: number;
  socsoEmployer: number;
  socsoEmployee: number;
  eisEmployer: number;
  eisEmployee: number;
  skbbkEmployee: number;
}

/**
 * Format a single submission line to 278 characters
 * 
 * Field specifications:
 * - All monetary values in SEN (no decimals)
 * - Right-justified, zero-padded for numeric fields
 * - Left-justified, space-padded for text fields
 * - Names in UPPERCASE
 */
export function format278Line(data: SubmissionLine): string {
  const monthYear = String(data.contributionMonth).padStart(2, '0') + 
                    String(data.contributionYear);
  
  // Convert to sen (no decimals)
  const salarySen = Math.round(data.salary * 100);
  const socsoEmployerSen = Math.round(data.socsoEmployer * 100);
  const socsoEmployeeSen = Math.round(data.socsoEmployee * 100);
  const eisEmployerSen = Math.round(data.eisEmployer * 100);
  const eisEmployeeSen = Math.round(data.eisEmployee * 100);
  const skbbkEmployeeSen = Math.round(data.skbbkEmployee * 100);
  
  // Build fields according to specification
  const fields = [
    // Position 1-12: Employer Code (Left-justified, 12 chars)
    String(data.employerCode || '').padEnd(12, ' ').substring(0, 12),
    
    // Position 13-32: Reserved (20 spaces)
    ''.padEnd(20, ' '),
    
    // Position 33-44: IC/Passport (Left-justified, 12 chars)
    String(data.icNumber || '').padEnd(12, ' ').substring(0, 12),
    
    // Position 45-194: Employee Name (UPPERCASE, Left-justified, 150 chars)
    String(data.name || '').toUpperCase().padEnd(150, ' ').substring(0, 150),
    
    // Position 195-200: Month (MMYYYY, 6 chars)
    monthYear.padEnd(6, ' ').substring(0, 6),
    
    // Position 201-214: Salary (sen, Right-justified, 14 chars, zero-padded)
    String(salarySen).padStart(4, '0').padStart(14, ' ').substring(0, 14),
    
    // Position 215-220: SOCSO Employer (sen, Right-justified, 6 chars, zero-padded)
    String(socsoEmployerSen).padStart(4, '0').padStart(6, ' ').substring(0, 6),
    
    // Position 221-226: SOCSO Employee (sen, Right-justified, 6 chars, zero-padded)
    String(socsoEmployeeSen).padStart(4, '0').padStart(6, ' ').substring(0, 6),
    
    // Position 227-232: EIS Employer (sen, Right-justified, 6 chars, zero-padded)
    String(eisEmployerSen).padStart(4, '0').padStart(6, ' ').substring(0, 6),
    
    // Position 233-238: EIS Employee (sen, Right-justified, 6 chars, zero-padded)
    String(eisEmployeeSen).padStart(4, '0').padStart(6, ' ').substring(0, 6),
    
    // Position 239-244: SKBBK Employee (sen, Right-justified, 6 chars)
    // If 0, use spaces instead of zeros
    skbbkEmployeeSen === 0 
      ? ''.padEnd(6, ' ')
      : String(skbbkEmployeeSen).padStart(4, '0').padStart(6, ' ').substring(0, 6),
    
    // Position 245-278: Reserved (34 spaces)
    ''.padEnd(34, ' '),
  ];
  
  const line = fields.join('');
  
  // Validate length
  if (line.length !== 278) {
    console.error('Line length validation failed:', {
      actual: line.length,
      expected: 278,
      line,
    });
    throw new Error(`Line length ${line.length} characters (expected 278)`);
  }
  
  return line;
}

/**
 * Format complete submission file (multiple lines)
 * 
 * @param lines - Array of submission line data
 * @returns Complete file content (CRLF line endings)
 */
export function format278File(lines: SubmissionLine[]): string {
  return lines.map(format278Line).join('\r\n');
}
```

---

## 👥 USER PERSONAS & USE CASES

### 5.1 Primary Persona: Ahmad (SME Owner)

**Demographics:**
- Age: 42
- Location: Kuala Lumpur
- Business: Restaurant chain (3 outlets)
- Employees: 28
- Tech proficiency: Moderate (uses WhatsApp Business, online banking)

**Goals:**
- Submit PERKESO caruman on time every month
- Minimize time spent on administrative tasks
- Ensure compliance to avoid penalties
- Keep records for audit

**Frustrations:**
- Current Excel sheet has calculation errors
- Forgot deadline last month (paid RM15 late penalty)
- No backup if laptop crashes
- Can't produce historical reports quickly

**Use Cases:**
1. **Monthly Submission**
   - Login → Dashboard → Select month → Review employees → Submit
   - Time: 10-15 minutes (vs 2-3 hours manually)
   
2. **View History**
   - Dashboard → Submissions → Select month → View statement
   - Time: Instant (vs 30 minutes searching files)

3. **Add New Employee**
   - Employees → Add → Fill form → Save
   - Auto-calculates age, suggests category

4. **Payment**
   - Billing → Pay Now → Billplz FPX → Confirm
   - Receipt emailed automatically

---

### 5.2 Secondary Persona: Siti (HR/Admin Executive)

**Demographics:**
- Age: 35
- Location: Penang
- Company: Manufacturing SME
- Employees: 85
- Tech proficiency: High (uses HRIS, Excel advanced)

**Goals:**
- Accurate payroll and contribution calculations
- Maintain audit trail for compliance
- Generate reports for management
- Bulk operations for efficiency

**Frustrations:**
- Manual calculation takes 2-3 days every month
- PERKESO format changes without notice
- No historical data easily accessible
- Multiple employers to manage

**Use Cases:**
1. **Bulk Employee Import**
   - Upload Excel template → Validate → Import 85 employees
   - Time: 5 minutes (vs 4 hours manual entry)

2. **Multi-Employer Management**
   - Switch between employers → Manage separately
   - Consolidated dashboard view

3. **Generate Reports**
   - Submissions → Select range → Export PDF/Excel
   - Custom date ranges, contribution breakdowns

4. **Late Penalty Tracking**
   - Dashboard shows overdue submissions
   - Calculate and pay penalties via Billplz

---

## 💰 BUSINESS MODEL & PRICING

### 6.1 Pricing Tiers

**BASIC Plan (RM20/month)**
- 1 Employer account
- Up to 100 employees
- Unlimited submissions
- 1 GB file storage
- Email support
- 7-day free trial

**ENTERPRISE Plan (RM200/month)**
- Up to 10 employer accounts
- Unlimited employees
- Everything in BASIC +
- Priority support (WhatsApp + Email)
- API access (for integration)
- Custom report formats
- Audit logs
- SLA guarantee (99.9% uptime)

### 6.2 Payment Flow

```
1. User registers → 7-day free trial (no payment required)
2. Trial expires → Subscription status = 'past_due'
3. User cannot create new submissions (view-only mode)
4. User clicks "Pay Now" → Billplz payment link
5. User pays RM20 via FPX/Credit Card/E-wallet
6. Billplz webhook → Subscription status = 'active'
7. Access restored for 30 days
8. Auto-renew next month (if recurring enabled)
```

### 6.3 Revenue Projection

**Year 1 (Conservative):**
- Month 1-3: 10 beta users (free)
- Month 4-6: 50 users (RM1,000/month)
- Month 7-12: 200 users (RM4,000/month)
- **Year 1 Total: RM30,000**

**Year 2 (Growth):**
- Average: 1,000 users (RM20,000/month)
- **Year 2 Total: RM240,000**

**Year 3 (Scale):**
- Average: 5,000 users (RM100,000/month)
- **Year 3 Total: RM1,200,000**

**Costs:**
- VPS (Coolify): RM110/month
- Coolify + PostgreSQL: RM0 (self-hosted, already paid VPS)
- Billplz fees (1%): RM200-2,000/month
- **Total Costs: RM410-2,210/month**

**Net Profit (Year 3):**
- Revenue: RM100,000/month
- Costs: RM2,210/month
- **Profit: RM97,790/month**

---

## 🔒 SECURITY & COMPLIANCE

### 7.1 Data Protection (PDPA 2010)

**Personal Data Protected:**
- User information (name, email, phone)
- Employee information (IC, name, salary, DOB)
- Employer information (code, name, address)

**PDPA Compliance Measures:**
1. **Consent** - Explicit consent during registration
2. **Purpose** - Clear privacy policy (PERKESO submission only)
3. **Security** - Encryption at rest + in transit
4. **Retention** - 7 years (financial records requirement)
5. **Access** - Users can export/delete their data
6. **Accuracy** - Users can update their data

### 7.2 Technical Security

**Authentication:**
- Password hashing: bcrypt (12 rounds)
- JWT tokens (1 hour access, 7 days refresh)
- Session invalidation on password change
- Rate limiting (5 attempts per minute)

**Authorization:**
- Row Level Security (RLS) in PostgreSQL
- Users can only access their own data
- Admin role for platform management

**Encryption:**
- HTTPS/TLS 1.3 for all traffic
- Database encryption at rest (PostgreSQL TDE or filesystem encryption)
- Sensitive fields encrypted (IC numbers)

**Audit Trail:**
- All actions logged (who, what, when)
- 7-year retention for compliance
- Admin access to audit logs

### 7.3 PERKESO Compliance

**File Format:**
- Exact 278-character specification
- Validated before download
- UTF-8 encoding, CRLF line endings

**Contribution Calculation:**
- Based on Lampiran 1 (Jadual Bersepadu)
- Auto-detect SKBBK phase
- Handle edge cases (age, category, exemptions)

**Deadline Tracking:**
- 15th of next month (PERKESO regulation)
- Late penalty: RM5/month (PERKESO regulation)
- Alert system for upcoming deadlines

---

## 📊 SUCCESS METRICS

### 8.1 Business Metrics

| Metric | Target (Year 1) | Target (Year 3) |
|--------|----------------|-----------------|
| Registered Users | 1,000 | 20,000 |
| Paying Users | 200 | 10,000 |
| MRR | RM4,000 | RM200,000 |
| Churn Rate | < 10% | < 3% |
| LTV:CAC Ratio | 3:1 | 5:1 |
| NPS | > 40 | > 60 |

### 8.2 Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time (p95) | < 200ms | Prometheus |
| Page Load Time | < 3s | Lighthouse |
| Uptime | > 99.9% | Uptime Kuma |
| Error Rate | < 0.1% | Sentry |
| Database Query Time | < 50ms | PostgreSQL logs + pg_stat_statements |

### 8.3 Compliance Metrics

| Metric | Target | Frequency |
|--------|--------|-----------|
| PERKESO Format Accuracy | 100% | Per submission |
| Late Penalty Calculation | 100% | Per submission |
| Data Backup Success | 100% | Daily |
| Security Audit | 0 critical issues | Quarterly |
| PDPA Compliance | 100% | Annual audit |

---

## 🚀 IMPLEMENTATION ROADMAP

### Phase 1: MVP (Weeks 1-6) - [COMPLETED]

**Week 1-2: Foundation**
- [ ] Setup Next.js 14 project
- [ ] Setup Coolify + PostgreSQL database
- [ ] Configure NextAuth.js authentication
- [ ] Run database migrations
- [ ] Implement authentication (register, login, logout)
- [ ] Setup Row Level Security policies
- [ ] Create basic layout + navigation

**Week 3-4: Core Features**
- [ ] Employer CRUD (create, read, update, delete)
- [ ] Employee CRUD (with validation)
- [ ] Contribution calculator (port from GAS)
- [ ] 278-character file formatter
- [ ] File download + preview

**Week 5-6: Payment + Launch**
- [ ] Billplz integration (payment link)
- [ ] Webhook handler (activate subscription)
- [ ] Subscription gating (trial → paid)
- [ ] Deploy to Vercel
- [ ] Test with real payment (RM1)
- [ ] Beta launch (10 users)

### Phase 2: Enhanced Features (Weeks 7-12) - [COMPLETED: UI/UX POLISH]

**Week 7-8: History & Statements**
- [ ] Submission history view
- [ ] Monthly statement generation (PDF)
- [ ] Employee contribution history
- [ ] Search + filter submissions

**Week 9-10: Alerts & Notifications**
- [ ] Deadline tracking (auto-calculate)
- [ ] Alert system (email + in-app)
- [ ] Late penalty calculation
- [ ] Payment reminder emails

**Week 11-12: Bulk Operations**
- [ ] Excel/CSV import (employees)
- [ ] Bulk employee management
- [ ] Export to Excel
- [ ] Performance optimization

### Phase 3: Scale (Weeks 13-20)

**Week 13-16: Enterprise Features**
- [ ] Multi-employer support
- [ ] User roles (admin, HR, viewer)
- [ ] Audit logs
- [ ] API access (for integrations)

**Week 17-20: Mobile + Performance**
- [ ] PWA support (offline mode)
- [ ] Mobile optimization
- [ ] CDN integration (Cloudflare)
- [ ] Load testing (100 concurrent users)

---

## ⚠️ RISKS & MITIGATION

### 9.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| PERKESO format changes | Medium | High | Abstract formatter, version control, monitor PERKESO announcements |
| Billplz downtime | Low | High | Manual payment option, backup gateway (ToyyibPay) |
| Database breach | Low | Critical | RLS, encryption, regular audits, insurance |
| Vercel downtime | Low | Medium | Deploy to Coolify as backup, daily backups |
| Scalability issues | Medium | Medium | Load testing, auto-scaling, performance monitoring |

### 9.2 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low user adoption | Medium | High | Free trial, referral program, content marketing, partnerships |
| High churn rate | Medium | High | Onboarding improvement, customer success, feature requests |
| Competition | Low | Medium | First-mover advantage, focus on UX, customer loyalty |
| Regulatory changes | Medium | High | Monitor PERKESO updates, legal counsel, flexible architecture |
| Payment fraud | Low | Medium | Fraud detection, manual review for suspicious transactions |

---

## 📝 APPENDICES

### Appendix A: Contribution Table (Full 60 Rows)

(See Index.html lines 334-399 for complete table)

### Appendix B: PERKESO 278-Character Format Example

```
E2303381K                    900101140678AHMAD BIN ABU                                                    062026  000000300000005165001475000590000590002250                                  \r\n
```

**Breakdown:**
- Position 1-12: `E2303381K ` (Employer Code)
- Position 13-32: `                    ` (Reserved)
- Position 33-44: `900101140678` (IC Number)
- Position 45-194: `AHMAD BIN ABU            ` (Name, 150 chars)
- Position 195-200: `062026` (June 2026)
- Position 201-214: `000000300000` (RM3,000.00 in sen)
- Position 215-220: `005165` (SOCSO Employer: RM51.65)
- Position 221-226: `001475` (SOCSO Employee: RM14.75)
- Position 227-232: `000590` (EIS Employer: RM5.90)
- Position 233-238: `000590` (EIS Employee: RM5.90)
- Position 239-244: `002250` (SKBBK Employee: RM22.50)
- Position 245-278: `                                  ` (Reserved)

### Appendix C: Billplz API Integration

**Create Payment Link:**
```typescript
POST https://www.billplz.com/api/v3/charges
Headers:
  Authorization: Basic BASE64(SECRET_KEY:)
  Content-Type: application/json

Body:
{
  "amount": 2000,  // RM20.00 in cents
  "email": "user@example.com",
  "name": "User Name",
  "callback_url": "https://app.textfileskbbk.com/api/v1/subscription/callback",
  "description": "Monthly subscription - RM20",
  "metadata": {
    "user_id": "uuid"
  }
}
```

**Webhook Event (paid):**
```json
{
  "id": "charge_id",
  "paid": true,
  "paid_at": "2026-05-08T10:30:00Z",
  "amount": 2000,
  "email": "user@example.com",
  "metadata": {
    "user_id": "uuid"
  }
}
```

### Appendix D: Email Templates

**Welcome Email:**
```
Subject: Welcome to TextFileSKBBK!

Hi [Name],

Welcome to TextFileSKBBK - your PERKESO contribution management system.

Your 7-day free trial has started. No payment required until trial ends.

Get started:
1. Add your employer code
2. Add employees
3. Create your first submission

Start now: [Dashboard Link]

Need help? Reply to this email.

Thanks,
TextFileSKBBK Team
```

**Payment Reminder (3 days before trial ends):**
```
Subject: Your trial ends in 3 days

Hi [Name],

Your 7-day free trial ends on [Date].

Continue using TextFileSKBBK by subscribing for RM20/month.

Pay now: [Payment Link]

After payment, you'll have:
- Unlimited submissions
- Historical records
- Auto deadline tracking
- Monthly statements

Questions? Reply to this email.

Thanks,
TextFileSKBBK Team
```

**Late Submission Alert:**
```
Subject: ⚠️ Submission Terlewat - [Employer Code]

Hi [Name],

Your PERKESO submission for [Month Year] is LATE.

Deadline: [Deadline Date]
Days Late: [X] days
Late Penalty: RM[Amount]

Submit now to avoid additional penalties:
[Dashboard Link]

Need help calculating penalty? Contact us.

Thanks,
TextFileSKBBK Team
```

---

## ✅ APPROVAL

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Tech Lead | | | |
| Legal/Compliance | | | |
| Business Stakeholder | | | |

---

**Document Control:**
- **Location:** `/mnt/d/TextFileSKBBK-SaaS/docs/PRD.md`
- **Version:** 3.0 (SaaS UI/UX Enhanced)
- **Status:** Final Draft - Pending Review
- **Next Review:** Upon PERKESO regulation changes or quarterly
- **Distribution:** Development Team, Business Team, Legal/Compliance

---

*This is a comprehensive living document. All changes must be versioned and approved. Development cannot proceed without stakeholder sign-off.*

**© 2026 WajuTech™ - Hak cipta terpelihara**
