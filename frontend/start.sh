#!/bin/sh

# Set Django Backend URL if not provided
if [ -z "${DJANGO_API_URL:-}" ]; then
  export DJANGO_API_URL="http://localhost:8000"
  echo "[start.sh] No DJANGO_API_URL provided. Using default: $DJANGO_API_URL"
else
  echo "[start.sh] Using provided DJANGO_API_URL: $DJANGO_API_URL"
fi

# Only set NEXTAUTH_URL if not already provided (dev convenience)
if [ -z "${NEXTAUTH_URL:-}" ]; then
  export NEXTAUTH_URL="http://localhost:3000"
fi

if [ ! -f ".env.local" ]; then
  echo "Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo "⚠️  Please set NEXTAUTH_SECRET in .env.local"
  echo "💡 Generate one with: openssl rand -base64 32"
fi

# If .env.local lacks a DJANGO_API_URL line, append it.
if ! grep -q "DJANGO_API_URL=" .env.local 2>/dev/null; then
  echo "DJANGO_API_URL=$DJANGO_API_URL" >> .env.local
else
  # Update existing DJANGO_API_URL in .env.local
  sed -i "s|DJANGO_API_URL=.*|DJANGO_API_URL=$DJANGO_API_URL|" .env.local
fi

if grep -q "your-nextauth-secret-here" .env.local; then
  SECRET=$(openssl rand -base64 32)
  sed -i "s/your-nextauth-secret-here/$SECRET/" .env.local
  echo "✅ Generated NextAuth secret"
fi

set -a
. ./.env.local
set +a

echo "Checking Django backend connection..."
# Wait for Django backend to be ready
RETRIES=30
while [ $RETRIES -gt 0 ]; do
  if curl -f "$DJANGO_API_URL/" > /dev/null 2>&1; then
    echo "✅ Django backend is ready at $DJANGO_API_URL"
    break
  else
    echo "⏳ Waiting for Django backend to be ready... ($RETRIES retries left)"
    sleep 5
    RETRIES=$((RETRIES - 1))
  fi
done

if [ $RETRIES -eq 0 ]; then
  echo "⚠️  Django backend not responding at $DJANGO_API_URL after waiting"
fi

echo "Starting Next.js application..."
if [ "$NODE_ENV" = "production" ]; then
  pnpm run build
  pnpm start
else
  pnpm run dev
fi