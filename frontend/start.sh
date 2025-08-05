#!/bin/sh
# Set environment variables
export DATABASE_URL="file:./prisma/dev.db"
export NEXTAUTH_URL="http://localhost:3000"

# Check if .env.local exists, if not create from example
if [ ! -f ".env.local" ]; then
  echo "Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo "⚠️  Please set NEXTAUTH_SECRET in .env.local"
  echo "💡 Generate one with: openssl rand -base64 32"
fi

# Ensure DATABASE_URL is set in .env.local
if ! grep -q "DATABASE_URL=file:" .env.local; then
  echo "DATABASE_URL=file:./prisma/dev.db" >> .env.local
fi

# Generate a NextAuth secret if not set
if grep -q "your-nextauth-secret-here" .env.local; then
  SECRET=$(openssl rand -base64 32)
  sed -i "s/your-nextauth-secret-here/$SECRET/" .env.local
  echo "✅ Generated NextAuth secret"
fi

# Source environment variables
set -a
. ./.env.local
set +a

# Run database migration
echo "Setting up database..."
pnpm dlx prisma migrate deploy || pnpm dlx prisma db push

# Start the application
echo "Starting application..."
if [ "$NODE_ENV" = "production" ]; then
  pnpm run build
  pnpm start
else
  pnpm run dev
fi
