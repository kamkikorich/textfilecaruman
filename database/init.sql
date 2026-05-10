-- ============================================
-- TEXTFILESKBBK SAAS - DATABASE SCHEMA
-- PostgreSQL 16 (Local Development)
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS (Managed by NextAuth.js)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 2. EMPLOYERS (Majikan)
-- ============================================
CREATE TABLE employers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_reg_no TEXT, -- No. Pendaftaran Syarikat
  employer_code TEXT, -- Kod Majikan PERKESO (12 digits)
  address TEXT,
  city TEXT,
  state TEXT,
  postcode TEXT,
  phone TEXT,
  email TEXT,
  contact_person TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_employers_user_id ON employers(user_id);

-- ============================================
-- 3. EMPLOYEES (Pekerja)
-- ============================================
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  ic_no TEXT NOT NULL, -- No. IC / Passport / SSFW
  name TEXT NOT NULL,
  worker_type TEXT DEFAULT 'pertama' CHECK (worker_type IN ('pertama', 'kedua')),
  -- 'pertama' = < 60 tahun (Majikan + Pekerja)
  -- 'kedua' = 60+ tahun atau join selepas 55 (Majikan sahaja)
  salary DECIMAL(12,2) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_employees_employer_id ON employees(employer_id);
CREATE INDEX idx_employees_ic ON employees(ic_no);

-- ============================================
-- 4. SUBMISSIONS (Caruman Bulanan)
-- ============================================
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
  contribution_month DATE NOT NULL, -- 1st of month (e.g., 2026-01-01 for January 2026)
  deadline_date DATE NOT NULL, -- 15th of next month
  submitted_at TIMESTAMPTZ,
  total_employer_contribution DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_employee_contribution DECIMAL(12,2) NOT NULL DEFAULT 0,
  grand_total DECIMAL(12,2) NOT NULL DEFAULT 0,
  text_file_url TEXT, -- File path in local storage
  text_file_content TEXT, -- Store 278-char content for preview
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'late', 'paid')),
  late_penalty DECIMAL(10,2) DEFAULT 0, -- RM5 per month late
  months_late INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employer_id, contribution_month)
);

CREATE INDEX idx_submissions_employer_id ON submissions(employer_id);
CREATE INDEX idx_submissions_month ON submissions(contribution_month);
CREATE INDEX idx_submissions_status ON submissions(status);

-- ============================================
-- 5. SUBMISSION ITEMS (Perkara Caruman)
-- ============================================
CREATE TABLE submission_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  salary DECIMAL(12,2) NOT NULL,
  socso_employer DECIMAL(10,2) NOT NULL,
  socso_employee DECIMAL(10,2) NOT NULL,
  eis_employer DECIMAL(10,2) NOT NULL,
  eis_employee DECIMAL(10,2) NOT NULL,
  skbbk_employee DECIMAL(10,2) NOT NULL, -- 0.75% Fasa 1
  total_employer DECIMAL(10,2) NOT NULL,
  total_employee DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submission_items_submission_id ON submission_items(submission_id);
CREATE INDEX idx_submission_items_employee_id ON submission_items(employee_id);

-- ============================================
-- 6. PAYMENTS (Pembayaran Subscription)
-- ============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  billplz_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT, -- 'FPX', 'credit_card'
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================
-- 7. SUBSCRIPTIONS (Langganan)
-- ============================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  billplz_subscription_id TEXT UNIQUE,
  status TEXT DEFAULT 'inactive' CHECK (status IN ('inactive', 'active', 'cancelled', 'expired')),
  current_period_start DATE,
  current_period_end DATE,
  next_payment_date DATE, -- 15th of next month
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ============================================
-- 8. ALERTS (Notifikasi)
-- ============================================
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'danger', 'success')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_is_read ON alerts(is_read);

-- ============================================
-- TRIGGERS: Auto-update timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employers_updated_at
  BEFORE UPDATE ON employers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE users IS 'User accounts (NextAuth.js authentication)';
COMMENT ON TABLE employers IS 'Employer profiles (Majikan)';
COMMENT ON TABLE employees IS 'Employee records (Pekerja)';
COMMENT ON TABLE submissions IS 'Monthly contribution submissions (Caruman Bulanan)';
COMMENT ON TABLE submission_items IS 'Individual contribution items per employee';
COMMENT ON TABLE payments IS 'Payment transactions (Billplz)';
COMMENT ON TABLE subscriptions IS 'User subscriptions (RM20/month)';
COMMENT ON TABLE alerts IS 'System alerts and notifications';

COMMENT ON COLUMN submissions.deadline_date IS 'Deadline: 15th of next month (Caruman bulan X → 15 bulan X+1)';
COMMENT ON COLUMN submissions.late_penalty IS 'RM5 per month (or part thereof) from deadline';
COMMENT ON COLUMN employees.worker_type IS 'pertama: <60 years (Majikan+Pekerja), kedua: 60+ or joined after 55 (Majikan sahaja)';
