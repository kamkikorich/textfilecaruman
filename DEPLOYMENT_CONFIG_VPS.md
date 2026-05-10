# =====================================================
# DEPLOYMENT CONFIGURATION - TextFileSKBBK SaaS
# =====================================================
# This file contains all configuration for deploying
# TextFileSKBBK SaaS application to Coolify
# =====================================================

# =====================================================
# 1. DATABASE CONFIGURATION (ALREADY SETUP ✅)
# =====================================================
# Database: textfileskbbk
# Container: b859kqfsu6plkz3z84bh6nli
# Network: coolify
# Port: 5434 (exposed via nginx proxy)
# Host: 43.156.140.185

# Internal connection string (for apps in same network):
DATABASE_URL_INTERNAL=postgresql://postgres:nqImjUXxz5CQRzdDXd8cyZwzHV6ARqhO63v1K5ryHIgkh4pQqA2cNtmpO9dkRgqg@b859kqfsu6plkz3z84bh6nli:5432/textfileskbbk

# External connection string (for apps in different network):
DATABASE_URL_EXTERNAL=postgresql://postgres:nqImjUXxz5CQRzdDXd8cyZwzHV6ARqhO63v1K5ryHIgkh4pQqA2cNtmpO9dkRgqg@43.156.140.185:5434/textfileskbbk

# =====================================================
# 2. COOLIFY ENVIRONMENT VARIABLES
# =====================================================
# Copy these to Coolify > Project > Environment Variables
# Production Domain: https://caruman.waju.my

DATABASE_URL=postgresql://postgres:nqImjUXxz5CQRzdDXd8cyZwzHV6ARqhO63v1K5ryHIgkh4pQqA2cNtmpO9dkRgqg@43.156.140.185:5434/textfileskbbk
NEXTAUTH_SECRET=9JD2KoJuzDEb6Uvpfx3hVBxVMghUR/Uq7kebAvX04iw=
NEXTAUTH_URL=https://caruman.waju.my
NEXT_PUBLIC_APP_NAME=TextFileSKBBK SaaS
NEXT_PUBLIC_APP_URL=https://caruman.waju.my
SMTP_HOST=mail9.dynamail.asia
SMTP_PORT=587
SMTP_USER=walter@waju.my
SMTP_PASSWORD=NamaSayaWalter@77
SMTP_SECURE=false
BILLPLZ_SECRET_KEY=sk_test_xxxxxx_or_sk_live_xxxxxx
BILLPLZ_WEBHOOK_KEY=whk_xxxxxx
BILLPLZ_FORM_ID=xxxxxx
NODE_ENV=production
PORT=3000

# =====================================================
# 3. DOCKER COMPOSE CONFIGURATION
# =====================================================
# Use this for manual deployment if Coolify doesn't work

version: '3.8'
services:
  textfileskbbk:
    image: node:18-alpine
    working_dir: /app
    command: sh -c "npm install && npm run build && npm start"
    environment:
      - DATABASE_URL=postgresql://postgres:nqImjUXxz5CQRzdDXd8cyZwzHV6ARqhO63v1K5ryHIgkh4pQqA2cNtmpO9dkRgqg@b859kqfsu6plkz3z84bh6nli:5432/textfileskbbk
      - NEXTAUTH_SECRET=9JD2KoJuzDEb6Uvpfx3hVBxVMghUR/Uq7kebAvX04iw=
      - NEXTAUTH_URL=https://caruman.waju.my
      - NEXT_PUBLIC_APP_NAME=TextFileSKBBK SaaS
      - NEXT_PUBLIC_APP_URL=https://caruman.waju.my
      - SMTP_HOST=mail9.dynamail.asia
      - SMTP_PORT=587
      - SMTP_USER=walter@waju.my
      - SMTP_PASSWORD=NamaSayaWalter@77
      - SMTP_SECURE=false
      - BILLPLZ_SECRET_KEY=sk_test_xxxxxx_or_sk_live_xxxxxx
      - BILLPLZ_WEBHOOK_KEY=whk_xxxxxx
      - BILLPLZ_FORM_ID=xxxxxx
      - NODE_ENV=production
      - PORT=3000
    ports:
      - "3000:3000"
    networks:
      - coolify
    depends_on:
      - b859kqfsu6plkz3z84bh6nli
    restart: unless-stopped

networks:
  coolify:
    external: true
    name: coolify

# =====================================================
# 4. POST-DEPLOYMENT COMMANDS
# =====================================================
# Run these in Coolify terminal after deployment

# Apply database migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Verify database connection
npx prisma db pull

# =====================================================
# 5. VERIFICATION COMMANDS
# =====================================================

# Test database connection via SSH
docker exec -i b859kqfsu6plkz3z84bh6nli psql -U postgres -d textfileskbbk -c "SELECT version();"

# Check application logs
docker logs <textfileskbbk-container-id> --tail 50

# Check network connectivity
docker network inspect coolify

# =====================================================
# 6. TROUBLESHOOTING
# =====================================================

# If database connection fails:
# 1. Check if container is running: docker ps | grep b859kqfsu6plkz3z84bh6nli
# 2. Check database logs: docker logs b859kqfsu6plkz3z84bh6nli
# 3. Test connection: docker exec -i b859kqfsu6plkz3z84bh6nli psql -U postgres -d textfileskbbk -c "SELECT version();"

# If application fails to start:
# 1. Check application logs: docker logs <app-container-id>
# 2. Check environment variables: docker inspect <app-container-id> | grep Env
# 3. Restart container: docker restart <app-container-id>

# If port conflicts:
# 1. Check port usage: netstat -tulpn | grep 3000
# 2. Kill process: fuser -k 3000/tcp
# 3. Restart container

# =====================================================
# 7. BACKUP & RESTORE
# =====================================================

# Backup database
docker exec -i b859kqfsu6plkz3z84bh6nli pg_dump -U postgres textfileskbbk > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
docker exec -i b859kqfsu6plkz3z84bh6nli psql -U postgres textfileskbbk < backup_20250511_120000.sql

# =====================================================
# 8. SECURITY NOTES
# =====================================================

# ⚠️ IMPORTANT SECURITY REMINDERS:
# 1. Database password is currently exposed in this file
# 2. SSH password is currently exposed in this file
# 3. SMTP password is currently exposed in this file
# 4. NEXTAUTH_SECRET is currently exposed in this file

# 🔐 AFTER DEPLOYMENT, ROTATE ALL SECRETS:
# 1. Run: powershell -ExecutionPolicy Bypass -File ROTATE_SECRETS.ps1
# 2. Update database password on VPS
# 3. Update SMTP password in Dynamail
# 4. Update environment variables in Coolify
# 5. Restart application

# =====================================================
# 9. COOLIFY SETUP STEPS
# =====================================================

# STEP 1: Open Coolify Dashboard
# http://waju.my:8000

# STEP 2: Navigate to CarumanPerkeso project
# http://waju.my:8000/project/r10k19fu0ro125hx8s65uxot

# STEP 3: Add new service/application
# Click: "+ Add Resource" or create new application

# STEP 4: Configure GitHub integration
# Source: GitHub
# Repository: kamkikorich/textfileskbbk
# Branch: clean-main

# STEP 5: Add environment variables
# Copy all variables from section 2 above

# STEP 6: Configure build & start
# Build Command: npm install && npm run build
# Start Command: npm start

# STEP 7: Configure domain
# Domain: caruman.waju.my (Production Domain)

# STEP 8: Deploy
# Click: Deploy button

# STEP 9: Post-deployment
# Run commands from section 4 in Coolify terminal

# =====================================================
# 10. DATABASE INFO
# =====================================================

# Container ID: b859kqfsu6plkz3z84bh6nli
# Container Name: b859kqfsu6plkz3z84bh6nli
# Database Name: textfileskbbk
# Username: postgres
# Password: nqImjUXxz5CQRzdDXd8cyZwzHV6ARqhO63v1K5ryHIgkh4pQqA2cNtmpO9dkRgqg
# Port: 5434 (external), 5432 (internal)
# Network: coolify
# Tables: 14 tables (users, employees, employers, payments, etc.)

# =====================================================
# 11. DOMAIN CONFIGURATION
# =====================================================

# Production Domain: https://caruman.waju.my
# Testing Domain: http://43.156.140.185:3000
# Coolify Dashboard: http://waju.my:8000

# =====================================================
# END OF CONFIGURATION FILE
# =====================================================
