#!/bin/bash

echo "🚀 Starting SSN News Development Environment..."

# Check if node_modules exists in root
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

# Check if server dependencies are installed
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install && cd ..
fi

# Check if client dependencies are installed
if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client && npm install && cd ..
fi

# Check if .env files exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating root .env file..."
    cp .env.example .env 2>/dev/null || echo "# Root environment variables" > .env
fi

if [ ! -f "server/.env" ]; then
    echo "⚙️  Creating server .env file..."
    cp server/.env.example server/.env 2>/dev/null || cp .env server/.env
fi

if [ ! -f "client/.env" ]; then
    echo "⚙️  Creating client .env file..."
    echo "REACT_APP_API_URL=http://localhost:8080" > client/.env
fi

echo "✅ Setup complete!"
echo "🔥 Starting development servers..."
echo ""
echo "🌐 Client will be available at: http://localhost:3000"
echo "🔧 Server will be available at: http://localhost:8080"
echo ""

# Start both client and server
npm run dev