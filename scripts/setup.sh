#!/bin/bash

# TCG Bot Simulator Setup Script
# This script helps you set up the development environment

set -e

echo "🚀 TCG Bot Simulator Setup Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Check if Docker is installed (optional)
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "✅ Docker and Docker Compose detected"
    DOCKER_AVAILABLE=true
else
    echo "⚠️  Docker not detected. You'll need to install MongoDB manually."
    DOCKER_AVAILABLE=false
fi

echo ""
echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install frontend dependencies
echo "📱 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "🔧 Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "🔐 Setting up environment variables..."

# Copy environment template
if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "✅ Environment file created at backend/.env"
    echo "   Please edit this file with your MongoDB connection details"
else
    echo "ℹ️  Environment file already exists at backend/.env"
fi

echo ""
echo "🎯 Setup Options:"
echo "1. Use Docker (recommended for development)"
echo "2. Manual setup (install MongoDB locally)"

read -p "Choose an option (1 or 2): " choice

case $choice in
    1)
        if [ "$DOCKER_AVAILABLE" = true ]; then
            echo ""
            echo "🐳 Starting services with Docker..."
            docker-compose up -d
            
            echo ""
            echo "⏳ Waiting for services to start..."
            sleep 10
            
            echo ""
            echo "🎉 Setup complete! Services are running:"
            echo "   📊 MongoDB: localhost:27017"
            echo "   🗄️  Mongo Express: http://localhost:8081"
            echo "   🔧 Backend API: http://localhost:5000"
            echo "   📱 Frontend: http://localhost:5173"
            echo ""
            echo "👤 Default admin credentials: admin / admin123"
            echo ""
            echo "🚀 To start development:"
            echo "   npm run dev"
        else
            echo "❌ Docker is not available. Please install Docker first."
            exit 1
        fi
        ;;
    2)
        echo ""
        echo "📋 Manual Setup Instructions:"
        echo "1. Install MongoDB locally or use MongoDB Atlas"
        echo "2. Update backend/.env with your MongoDB connection string"
        echo "3. Start MongoDB service"
        echo "4. Run: npm run dev:backend"
        echo "5. In another terminal: npm run dev:frontend"
        echo ""
        echo "🔗 MongoDB installation guides:"
        echo "   - macOS: brew install mongodb-community"
        echo "   - Ubuntu: sudo apt-get install mongodb"
        echo "   - Windows: https://docs.mongodb.com/manual/installation/"
        echo "   - Cloud: https://www.mongodb.com/atlas"
        ;;
    *)
        echo "❌ Invalid option. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📚 For more information, see README.md"
echo "🎮 Happy coding!"
