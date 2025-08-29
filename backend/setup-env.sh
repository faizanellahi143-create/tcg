#!/bin/bash

# Setup script to create .env file with MongoDB Atlas connection string

echo "🚀 Setting up environment variables for TCG Bot Simulator Backend..."

# Check if .env file already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup..."
    cp .env .env.backup
fi

# Create .env file with MongoDB Atlas connection string
cat > .env << EOF
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# MongoDB Configuration (MongoDB Atlas)
MONGODB_URI=mongodb+srv://umar:umar@shopping.egbdt1m.mongodb.net/tcg?retryWrites=true&w=majority&appName=Shopping
MONGODB_URI_PROD=mongodb+srv://umar:umar@shopping.egbdt1m.mongodb.net/tcg?retryWrites=true&w=majority&appName=Shopping

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_REFRESH_EXPIRE=7d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# TCG API Configuration
TCG_API_KEY=489247805fb00cbaaa83a3f97c2a61db6cadc4e5666db650afb1f5bdb8f6d281

# Optional: External Services
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# EMAIL_FROM=noreply@tcg-bot-simulator.com

# Optional: File Upload
# MAX_FILE_SIZE=10485760
# UPLOAD_PATH=./uploads
EOF

echo "✅ .env file created successfully!"
echo "📝 Please review and customize the JWT secrets and other values as needed."
echo ""
echo "🔗 MongoDB Atlas connection string has been set to:"
echo "   mongodb+srv://umar:umar@shopping.egbdt1m.mongodb.net/tcg?retryWrites=true&w=majority&appName=Shopping"
echo ""
echo "🚀 You can now run the card sync service:"
echo "   npm run sync:cards:test"
echo ""
echo "📚 For more information, see README_CARD_SYNC.md"
