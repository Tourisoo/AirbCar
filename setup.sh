#!/bin/bash

echo "🚀 Setting up your car rental project..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📋 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local and add your actual values!"
    echo "💡 Generate a NextAuth secret with: openssl rand -base64 32"
    echo ""
    echo "After editing .env.local, run:"
    echo "  pnpm run db:setup"
    echo "  pnpm run dev"
else
    echo "✅ .env.local already exists"
    echo "🗄️  Setting up database..."
    pnpm run db:setup
    echo "🎉 Setup complete! Run 'pnpm run dev' to start the development server"
fi
