#!/bin/bash

# =====================================================
# VPS DEPLOYMENT SCRIPT - TextFileSKBBK SaaS
# =====================================================
# This script will deploy TextFileSKBBK application to VPS
# =====================================================

# Configuration
VPS_IP="43.156.140.185"
VPS_USER="ubuntu"
VPS_PASSWORD="NZp-eMt-p4P-QL3"

PROJECT_DIR="/home/ubuntu/textfileskbbk"
GITHUB_REPO="https://github.com/kamkikorich/textfileskbbk.git"
GITHUB_BRANCH="clean-main"

DATABASE_CONTAINER="b859kqfsu6plkz3z84bh6nli"
DATABASE_NAME="textfileskbbk"
DATABASE_USER="postgres"
DATABASE_PASSWORD="nqImjUXxz5CQRzdDXd8cyZwzHV6ARqhO63v1K5ryHIgkh4pQqA2cNtmpO9dkRgqg"

echo "🚀 Starting deployment of TextFileSKBBK SaaS..."

# =====================================================
# STEP 1: Check SSH Connection
# =====================================================
echo "📡 Checking SSH connection..."
sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "echo '✅ SSH connection successful'" || {
    echo "❌ SSH connection failed!"
    exit 1
}

# =====================================================
# STEP 2: Setup Project Directory
# =====================================================
echo "📁 Setting up project directory..."
sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "mkdir -p $PROJECT_DIR" || {
    echo "❌ Failed to create project directory!"
    exit 1
}

# =====================================================
# STEP 3: Clone Repository
# =====================================================
echo "📥 Cloning repository..."
sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "cd $PROJECT_DIR && rm -rf .git && git init && git remote add origin $GITHUB_REPO && git fetch origin $GITHUB_BRANCH && git checkout -b $GITHUB_BRANCH origin/$GITHUB_BRANCH" || {
    echo "❌ Failed to clone repository!"
    exit 1
}

# =====================================================
# STEP 4: Install Dependencies
# =====================================================
echo "📦 Installing dependencies..."
sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "cd $PROJECT_DIR && npm install" || {
    echo "❌ Failed to install dependencies!"
    exit 1
}

# =====================================================
# STEP 5: Build Application
# =====================================================
echo "🔨 Building application..."
sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "cd $PROJECT_DIR && npm run build" || {
    echo "❌ Failed to build application!"
    exit 1
}

# =====================================================
# STEP 6: Setup Environment Variables
# =====================================================
echo "🔧 Setting up environment variables..."
cat > /tmp/env_vars.txt <<EOF
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
EOF

sshpass -p "$VPS_PASSWORD" scp -o StrictHostKeyChecking=no /tmp/env_vars.txt "$VPS_USER@$VPS_IP:$PROJECT_DIR/.env" || {
    echo "❌ Failed to upload environment variables!"
    exit 1
}

# =====================================================
# STEP 7: Apply Database Migrations
# =====================================================
echo "🗄️  Applying database migrations..."
sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "cd $PROJECT_DIR && npx prisma migrate deploy" || {
    echo "❌ Failed to apply database migrations!"
    exit 1
}

# =====================================================
# STEP 8: Generate Prisma Client
# =====================================================
echo "🔄 Generating Prisma client..."
sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "cd $PROJECT_DIR && npx prisma generate" || {
    echo "❌ Failed to generate Prisma client!"
    exit 1
}

# =====================================================
# STEP 9: Create Docker Compose File
# =====================================================
echo "🐳 Creating Docker Compose file..."
cat > /tmp/docker-compose.yml <<EOF
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
EOF

sshpass -p "$VPS_PASSWORD" scp -o StrictHostKeyChecking=no /tmp/docker-compose.yml "$VPS_USER@$VPS_IP:$PROJECT_DIR/docker-compose.yml" || {
    echo "❌ Failed to upload docker-compose.yml!"
    exit 1
}

# =====================================================
# STEP 10: Deploy with Docker Compose
# =====================================================
echo "🚀 Deploying with Docker Compose..."
sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "cd $PROJECT_DIR && docker-compose down && docker-compose up -d" || {
    echo "❌ Failed to deploy application!"
    exit 1
}

# =====================================================
# STEP 11: Wait for Application to Start
# =====================================================
echo "⏳ Waiting for application to start..."
sleep 10

# =====================================================
# STEP 12: Check Application Status
# =====================================================
echo "🔍 Checking application status..."
sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "cd $PROJECT_DIR && docker-compose ps" || {
    echo "❌ Failed to check application status!"
    exit 1
}

# =====================================================
# STEP 13: Check Application Logs
# =====================================================
echo "📋 Checking application logs..."
sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "cd $PROJECT_DIR && docker-compose logs --tail=20" || {
    echo "❌ Failed to check application logs!"
    exit 1
}

# =====================================================
# STEP 14: Verify Database Connection
# =====================================================
echo "🔗 Verifying database connection..."
sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "docker exec -i $DATABASE_CONTAINER psql -U $DATABASE_USER -d $DATABASE_NAME -c 'SELECT version();'" || {
    echo "❌ Failed to verify database connection!"
    exit 1
}

# =====================================================
# STEP 15: Test Application
# =====================================================
echo "🧪 Testing application..."
sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000" || {
    echo "❌ Application test failed!"
    exit 1
}

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║        ✅ DEPLOYMENT COMPLETED SUCCESSFULLY!                    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 DEPLOYMENT DETAILS:"
echo "  - Application URL: https://caruman.waju.my"
echo "  - Internal URL: http://$VPS_IP:3000"
echo "  - Database: $DATABASE_CONTAINER:$DATABASE_NAME"
echo "  - Project Directory: $PROJECT_DIR"
echo ""
echo "📋 NEXT STEPS:"
echo "  1. Test application at: https://caruman.waju.my"
echo "  2. Monitor logs: cd $PROJECT_DIR && docker-compose logs -f"
echo "  3. Update environment variables if needed"
echo "  4. Rotate secrets for production security"
echo ""
echo "🔧 MANAGEMENT COMMANDS:"
echo "  - Stop application: cd $PROJECT_DIR && docker-compose down"
echo "  - Start application: cd $PROJECT_DIR && docker-compose up -d"
echo "  - Restart application: cd $PROJECT_DIR && docker-compose restart"
echo "  - View logs: cd $PROJECT_DIR && docker-compose logs -f"
echo "  - Update code: cd $PROJECT_DIR && git pull && docker-compose up -d --build"
echo ""
echo "⚠️  SECURITY REMINDERS:"
echo "  - Rotate database password: docker exec -i $DATABASE_CONTAINER psql -U postgres -d $DATABASE_NAME -c \"ALTER USER postgres WITH PASSWORD 'new_password';\""
echo "  - Update environment variables in docker-compose.yml"
echo "  - Restart application: cd $PROJECT_DIR && docker-compose up -d"
echo ""
echo "🎉 Deployment successful! Your application should be live now."
