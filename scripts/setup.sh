#!/bin/bash

# ============================================
# TextFileSKBBK SaaS - Setup Script
# ============================================

set -e

echo "🚀 Setting up TextFileSKBBK SaaS..."
echo ""

# 1. Check prerequisites
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 20+"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker Desktop"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version must be 20 or higher (current: $(node -v))"
    exit 1
fi

echo "✅ Node.js: $(node -v)"
echo "✅ Docker: $(docker --version)"
echo ""

# 2. Install dependencies
echo "📦 Installing npm dependencies..."
npm install
echo ""

# 3. Setup environment
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "⚠️  Please edit .env.local with your credentials"
    echo ""
fi

# 4. Start Docker
echo "🐳 Starting PostgreSQL container..."
docker-compose -f docker-compose.dev.yml up -d
echo "⏳ Waiting for database to be ready..."
sleep 5
echo ""

# 5. Generate Prisma client
echo "🔨 Generating Prisma client..."
npx prisma generate
echo ""

# 6. Run migrations
echo "🗄️  Running database migrations..."
npx prisma migrate dev --name init
echo ""

# 7. Seed database
echo "🌱 Seeding database..."
npx prisma db seed
echo ""

echo "✅ Setup complete!"
echo ""
echo "📝 Login Credentials:"
echo "   Email: admin@limvui.com"
echo "   Password: admin123"
echo ""
echo "🚀 Start development server:"
echo "   npm run dev"
echo ""
echo "🌐 Visit: http://localhost:3000"
echo ""
