#!/bin/bash

echo "🐳 Docker Setup for Car Rental Platform"
echo "======================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker is available"

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📋 Creating .env.local from .env.example..."
    cp .env.example .env.local
    
    # Generate NextAuth secret
    echo "🔐 Generating NextAuth secret..."
    if command -v openssl &> /dev/null; then
        SECRET=$(openssl rand -base64 32)
        # Replace the placeholder secret in .env.local
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/your-nextauth-secret-here/$SECRET/" .env.local
        else
            # Linux
            sed -i "s/your-nextauth-secret-here/$SECRET/" .env.local
        fi
        echo "✅ NextAuth secret generated and set"
    else
        echo "⚠️  OpenSSL not found. Please manually set NEXTAUTH_SECRET in .env.local"
        echo "💡 Generate one with: openssl rand -base64 32"
    fi
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🚀 Building and starting the application with Docker..."
echo ""

# Build and start with docker-compose
docker-compose up --build

echo ""
echo "🎉 Setup complete!"
echo "📱 Your app should be running at: http://localhost:3000"
echo ""
echo "📝 Useful Docker commands:"
echo "  • Stop the app: docker-compose down"
echo "  • View logs: docker-compose logs -f"
echo "  • Restart: docker-compose restart"
echo "  • Rebuild: docker-compose up --build"
