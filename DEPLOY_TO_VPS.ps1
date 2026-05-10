# =====================================================
# VPS DEPLOYMENT SCRIPT - TextFileSKBBK SaaS (PowerShell + PuTTY plink)
# =====================================================
# This script will deploy TextFileSKBBK application to VPS using plink.exe
# =====================================================

# Configuration
$VPS_IP = "43.156.140.185"
$VPS_USER = "ubuntu"
$VPS_PASSWORD = "NZp-eMt-p4P-QL3"

$PROJECT_DIR = "/home/ubuntu/textfileskbbk"
$GITHUB_REPO = "https://github.com/kamkikorich/textfileskbbk.git"
$GITHUB_BRANCH = "clean-main"

$DATABASE_CONTAINER = "b859kqfsu6plkz3z84bh6nli"
$DATABASE_NAME = "textfileskbbk"
$DATABASE_USER = "postgres"
$DATABASE_PASSWORD = "nqImjUXxz5CQRzdDXd8cyZwzHV6ARqhO63v1K5ryHIgkh4pQqA2cNtmpO9dkRgqg"

$PLINK_PATH = "C:\Program Files\PuTTY\plink.exe"

Write-Host "🚀 Starting deployment of TextFileSKBBK SaaS..." -ForegroundColor Green

# =====================================================
# STEP 1: Check SSH Connection
# =====================================================
Write-Host "`n[1/12] Checking SSH connection..." -ForegroundColor Yellow
$testConnection = & $PLINK_PATH -ssh "$VPS_USER@$VPS_IP" -P 22 -pw $VPS_PASSWORD "echo 'SSH connection successful'" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ SSH connection successful" -ForegroundColor Green
} else {
    Write-Host "❌ SSH connection failed!" -ForegroundColor Red
    Write-Host "Error: $testConnection" -ForegroundColor Red
    exit 1
}

# =====================================================
# STEP 2: Setup Project Directory
# =====================================================
Write-Host "`n[2/12] Setting up project directory..." -ForegroundColor Yellow
& $PLINK_PATH -ssh "$VPS_USER@$VPS_IP" -P 22 -pw $VPS_PASSWORD "mkdir -p $PROJECT_DIR" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Project directory created: $PROJECT_DIR" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create project directory!" -ForegroundColor Red
    exit 1
}

# =====================================================
# STEP 3: Clone Repository
# =====================================================
Write-Host "`n[3/12] Cloning repository..." -ForegroundColor Yellow
& $PLINK_PATH -ssh "$VPS_USER@$VPS_IP" -P 22 -pw $VPS_PASSWORD "cd $PROJECT_DIR && rm -rf .git && git init && git remote add origin $GITHUB_REPO && git fetch origin $GITHUB_BRANCH && git checkout -b $GITHUB_BRANCH origin/$GITHUB_BRANCH" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Repository cloned from $GITHUB_REPO" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to clone repository!" -ForegroundColor Red
    exit 1
}

# =====================================================
# STEP 4: Install Dependencies
# =====================================================
Write-Host "`n[4/12] Installing dependencies..." -ForegroundColor Yellow
& $PLINK_PATH -ssh "$VPS_USER@$VPS_IP" -P 22 -pw $VPS_PASSWORD "cd $PROJECT_DIR && npm install" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
    exit 1
}

# =====================================================
# STEP 5: Build Application
# =====================================================
Write-Host "`n[5/12] Building application..." -ForegroundColor Yellow
& $PLINK_PATH -ssh "$VPS_USER@$VPS_IP" -P 22 -pw $VPS_PASSWORD "cd $PROJECT_DIR && npm run build" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Application built successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to build application!" -ForegroundColor Red
    exit 1
}

# =====================================================
# STEP 6: Setup Environment Variables
# =====================================================
Write-Host "`n[6/12] Setting up environment variables..." -ForegroundColor Yellow

$envContent = @"
DATABASE_URL=postgresql://postgres:$DATABASE_PASSWORD@$DATABASE_CONTAINER:5432/$DATABASE_NAME
NEXTAUTH_SECRET=9JD2KoJuzDEb6Uvpfx3hVBxVMghUR/Uq7kebAvX04iw=
NEXTAUTH_URL=https://caruman.waju.my
NEXT_PUBLIC_APP_NAME=TextFileSKBBK SaaS
NEXT_PUBLIC_APP_URL=https://caruman.waju.my
SMTP_HOST=mail9.dynamail.asia
SMTP_PORT=587
SMTP_USER=walter@caruman.waju.my
SMTP_PASSWORD=NamaSayaWalter@77
SMTP_SECURE=false
BILLPLZ_SECRET_KEY=sk_test_xxxxxx_or_sk_live_xxxxxx
BILLPLZ_WEBHOOK_KEY=whk_xxxxxx
BILLPLZ_FORM_ID=xxxxxx
NODE_ENV=production
PORT=3000
"@

$envContent | Out-File -FilePath "$env:TEMP\textfileskbbk.env" -Encoding UTF8 -NoNewline

# Upload environment file using pscp
$PSCP_PATH = "C:\Program Files\PuTTY\pscp.exe"
& $PSCP_PATH -pw $VPS_PASSWORD "$env:TEMP\textfileskbbk.env" "$VPS_USER@$VPS_IP:$PROJECT_DIR/.env" 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Environment variables configured" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to configure environment variables!" -ForegroundColor Red
    exit 1
}

# =====================================================
# STEP 7: Apply Database Migrations
# =====================================================
Write-Host "`n[7/12] Applying database migrations..." -ForegroundColor Yellow
& $PLINK_PATH -ssh "$VPS_USER@$VPS_IP" -P 22 -pw $VPS_PASSWORD "cd $PROJECT_DIR && npx prisma migrate deploy" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database migrations applied" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to apply database migrations!" -ForegroundColor Red
    exit 1
}

# =====================================================
# STEP 8: Generate Prisma Client
# =====================================================
Write-Host "`n[8/12] Generating Prisma client..." -ForegroundColor Yellow
& $PLINK_PATH -ssh "$VPS_USER@$VPS_IP" -P 22 -pw $VPS_PASSWORD "cd $PROJECT_DIR && npx prisma generate" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma client generated" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to generate Prisma client!" -ForegroundColor Red
    exit 1
}

# =====================================================
# STEP 9: Create Docker Compose File
# =====================================================
Write-Host "`n[9/12] Creating Docker Compose file..." -ForegroundColor Yellow

$dockerComposeContent = @"
version: '3.8'
services:
  textfileskbbk:
    image: node:18-alpine
    working_dir: /app
    command: sh -c "npm start"
    environment:
      - DATABASE_URL=postgresql://postgres:$DATABASE_PASSWORD@$DATABASE_CONTAINER:5432/$DATABASE_NAME
      - NEXTAUTH_SECRET=9JD2KoJuzDEb6Uvpfx3hVBxVMghUR/Uq7kebAvX04iw=
      - NEXTAUTH_URL=https://caruman.waju.my
      - NEXT_PUBLIC_APP_NAME=TextFileSKBBK SaaS
      - NEXT_PUBLIC_APP_URL=https://caruman.waju.my
      - SMTP_HOST=mail9.dynamail.asia
      - SMTP_PORT=587
      - SMTP_USER=walter@caruman.waju.my
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
      - $DATABASE_CONTAINER
    restart: unless-stopped
networks:
  coolify:
    external: true
    name: coolify
"@

$dockerComposeContent | Out-File -FilePath "$env:TEMP\docker-compose.yml" -Encoding UTF8 -NoNewline

& $PSCP_PATH -pw $VPS_PASSWORD "$env:TEMP\docker-compose.yml" "$VPS_USER@$VPS_IP:$PROJECT_DIR/docker-compose.yml" 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker Compose file created" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create Docker Compose file!" -ForegroundColor Red
    exit 1
}

# =====================================================
# STEP 10: Deploy with Docker Compose
# =====================================================
Write-Host "`n[10/12] Deploying with Docker Compose..." -ForegroundColor Yellow
& $PLINK_PATH -ssh "$VPS_USER@$VPS_IP" -P 22 -pw $VPS_PASSWORD "cd $PROJECT_DIR && docker-compose down && docker-compose up -d" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Application deployed" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to deploy application!" -ForegroundColor Red
    exit 1
}

# =====================================================
# STEP 11: Wait for Application to Start
# =====================================================
Write-Host "`n[11/12] Waiting for application to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# =====================================================
# STEP 12: Check Application Status
# =====================================================
Write-Host "`n[12/12] Checking application status..." -ForegroundColor Yellow
$appStatus = & $PLINK_PATH -ssh "$VPS_USER@$VPS_IP" -P 22 -pw $VPS_PASSWORD "cd $PROJECT_DIR && docker-compose ps" 2>&1
Write-Host "Application Status:" -ForegroundColor Cyan
Write-Host $appStatus

# Check logs
Write-Host "`n📋 Checking application logs..." -ForegroundColor Yellow
$appLogs = & $PLINK_PATH -ssh "$VPS_USER@$VPS_IP" -P 22 -pw $VPS_PASSWORD "cd $PROJECT_DIR && docker-compose logs --tail=20" 2>&1
Write-Host "Recent Logs:" -ForegroundColor Cyan
Write-Host $appLogs

# =====================================================
# COMPLETED
# =====================================================
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        ✅ DEPLOYMENT COMPLETED SUCCESSFULLY!                    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 DEPLOYMENT DETAILS:" -ForegroundColor Yellow
Write-Host "  - Application URL: https://caruman.waju.my" -ForegroundColor White
Write-Host "  - Internal URL: http://$VPS_IP:3000" -ForegroundColor White
Write-Host "  - Database: $DATABASE_CONTAINER:$DATABASE_NAME" -ForegroundColor White
Write-Host "  - Project Directory: $PROJECT_DIR" -ForegroundColor White
Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "  1. Test application at: https://caruman.waju.my" -ForegroundColor White
Write-Host "  2. Monitor logs: See logs above" -ForegroundColor White
Write-Host "  3. Update environment variables if needed" -ForegroundColor White
Write-Host "  4. Rotate secrets for production security" -ForegroundColor White
Write-Host ""
Write-Host "🔧 MANAGEMENT COMMANDS:" -ForegroundColor Yellow
Write-Host "  - Stop application: docker-compose down" -ForegroundColor White
Write-Host "  - Start application: docker-compose up -d" -ForegroundColor White
Write-Host "  - Restart application: docker-compose restart" -ForegroundColor White
Write-Host "  - View logs: docker-compose logs -f" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  SECURITY REMINDERS:" -ForegroundColor Yellow
Write-Host "  - Rotate database password in container $DATABASE_CONTAINER" -ForegroundColor White
Write-Host "  - Update environment variables in docker-compose.yml" -ForegroundColor White
Write-Host "  - Restart application after changes" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Deployment successful! Your application should be live now." -ForegroundColor Green

Write-Host "`nPress Enter to exit..." -ForegroundColor Gray
$null = $Host.UI.ReadLine()
