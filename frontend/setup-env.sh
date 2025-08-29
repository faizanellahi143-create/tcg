#!/bin/bash

# Setup script to create .env file for frontend

echo "🚀 Setting up environment variables for TCG Bot Simulator Frontend..."

# Check if .env file already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup..."
    cp .env .env.backup
fi

# Create .env file
cat > .env << EOF
# Frontend Environment Configuration

# Backend API URL
VITE_API_URL=http://localhost:5000

# Frontend URL (for development)
VITE_FRONTEND_URL=http://localhost:5173
EOF

echo "✅ .env file created successfully!"
echo "🔗 Backend API URL set to: http://localhost:5000"
echo ""
echo "🚀 You can now start the frontend development server:"
echo "   npm run dev"
echo ""
echo "📝 Make sure your backend is running on http://localhost:5000"

