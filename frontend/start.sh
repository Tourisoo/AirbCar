#!/bin/sh
export DATABASE_URL="file:./prisma/dev.db"
export NEXTAUTH_URL="http://localhost:3000"

if [ ! -f ".env.local" ]; then
  echo "Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo "⚠️  Please set NEXTAUTH_SECRET in .env.local"
  echo "💡 Generate one with: openssl rand -base64 32"
fi

if ! grep -q "DATABASE_URL=file:" .env.local; then
  echo "DATABASE_URL=file:./prisma/dev.db" >> .env.local
fi

if grep -q "your-nextauth-secret-here" .env.local; then
  SECRET=$(openssl rand -base64 32)
  sed -i "s/your-nextauth-secret-here/$SECRET/" .env.local
  echo "✅ Generated NextAuth secret"
fi

set -a
. ./.env.local
set +a

echo "Setting up database..."
pnpm dlx prisma migrate deploy || pnpm dlx prisma db push

echo "Starting application..."
if [ "$NODE_ENV" = "production" ]; then
  pnpm run build
  pnpm start
else
  pnpm run dev
fi