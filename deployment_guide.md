# 🚀 Secure Deployment Guide - TextFileSKBBK SaaS

## ⚠️ PRE-DEPLOYMENT SECURITY CHECKLIST

### Files That Should NEVER Be Committed to GitHub

| File | Reason | Status |
|------|--------|--------|
| `.env` | Contains local database password | ✅ Excluded in .gitignore |
| `.env.local` | Contains email SMTP password | ✅ Excluded in .gitignore |
| `.env.production` | Contains production database password | ✅ Excluded in .gitignore |
| `.env.coolify` | Contains ALL production secrets | ✅ Excluded in .gitignore |
| `.claude/` | Contains VPS credentials in history | ✅ Excluded in .gitignore |
| `.qwen/` | IDE configuration | ✅ Excluded in .gitignore |

### Files That Are SAFE to Commit

| File | Purpose | Status |
|------|---------|--------|
| `.env.example` | Template for development | ✅ Safe - no real values |
| `.env.coolify.example` | Template for production | ✅ Safe - uses placeholders |
| `DEPLOYMENT_GUIDE.md` | This guide | ✅ Safe - no credentials |

---

## Step 1: Verify Git Ignore

Before pushing, ensure your `.gitignore` includes:

```gitignore
# Environment files
.env
.env*.local
.env.production
.env.coolify

# IDE & tools
.claude/
.qwen/
.vscode/

# Logs
*.log
```

---

## Step 2: Database Setup (Already Configured ✅)

- **Container**: `b859kqfsu6plkz3z84bh6nli`
- **Database**: `textfileskbbk` (PostgreSQL 18)
- **Tables**: 14 tables created via migrations
- **Port**: 5434 (exposed through nginx proxy)

**Status**: Database is ready for production.

---

## Step 3: Environment Variables for Coolify

### ⚠️ IMPORTANT: Get these from your actual Coolify Dashboard

Go to: Coolify > Your Project > Environment Variables

```bash
# Database (Get from Coolify Database Settings)
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@YOUR_VPS_IP:5434/textfileskbbk

# Authentication (Generate NEW secret - DO NOT reuse)
NEXTAUTH_SECRET=GENERATE_WITH_OPENSSL_RAND_BASE64_32
NEXTAUTH_URL=https://waju.my

# App Info
NEXT_PUBLIC_APP_NAME=TextFileSKBBK SaaS
NEXT_PUBLIC_APP_URL=https://waju.my

# Email (Dynamail)
SMTP_HOST=mail9.dynamail.asia
SMTP_PORT=587
SMTP_USER=walter@waju.my
SMTP_PASSWORD=YOUR_ACTUAL_SMTP_PASSWORD
SMTP_SECURE=false

# Payment (Get from https://www.billplz.com/enterprise/api)
BILLPLZ_SECRET_KEY=YOUR_BILLPLZ_SECRET
BILLPLZ_WEBHOOK_KEY=YOUR_BILLPLZ_WEBHOOK
BILLPLZ_FORM_ID=YOUR_BILLPLZ_FORM

# Server
NODE_ENV=production
PORT=3000
```

### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

---

## Step 4: Post-Deployment Commands

After deployment succeeds, run in Coolify Terminal:

```bash
# Apply database migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Verify database connection
npx prisma db pull
```

---

## Step 5: Verify Deployment

✅ **Check these:**
- [ ] Website accessible at https://waju.my
- [ ] Login page loads without errors
- [ ] Database connection shows "healthy"
- [ ] No authentication errors in logs

---

## 🔐 Security Best Practices

1. **NEVER commit actual credentials to Git**
   - Only commit `.env.example` files
   - Real values go in Coolify Dashboard only

2. **Generate strong NEXTAUTH_SECRET**
   - Must be 32+ characters
   - Randomly generated
   - Different for each environment

3. **Database Security**
   - Database password only in Coolify
   - Never share or commit
   - Rotate if compromised

4. **API Keys (Billplz)**
   - Use environment-specific keys (test vs live)
   - Store only in production environment
   - Monitor for unauthorized usage

---

## 🆘 Troubleshooting

### Error: "Database connection failed"
**Solution:**
- Check Coolify > Database > Status = Running
- Verify DATABASE_URL matches Coolify Internal URL
- Try: `npx prisma db pull`

### Error: "Authentication failed"
**Solution:**
- Ensure NEXTAUTH_SECRET is exactly 32 chars
- Generate new: `openssl rand -base64 32`
- Restart container after env change

### Error: "Prisma Client not found"
**Solution:**
```bash
npx prisma generate
npm run build
```

---

## 📋 Pre-Push Checklist

Before pushing to GitHub, verify:

- [ ] `.env` is in `.gitignore`
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.production` is in `.gitignore`
- [ ] `.env.coolify` is in `.gitignore`
- [ ] `.claude/` is in `.gitignore`
- [ ] No credential files in `git status`
- [ ] Only commit `.env.example` files
- [ ] `DEPLOYMENT_GUIDE.md` has no real credentials

---

## 🚀 Push to GitHub

```bash
# Add safe files only
git add .

# Check what's being committed
git status

# Should NOT see: .env, .env.local, .env.production, .env.coolify

# Commit
git commit -m "Production deployment setup

- Database configured in Coolify
- Migrations applied
- Environment templates added
- Security check completed"

# Push
git remote add origin https://github.com/YOUR_USERNAME/textfileskbbk-saas.git
git push -u origin main
```

---

## 📞 Support

- Coolify Dashboard: http://waju.my:8000
- Database Container: `b859kqfsu6plkz3z84bh6nli`
- Production URL: https://waju.my

**⚠️ Remember**: Never share credentials or commit them to Git!
