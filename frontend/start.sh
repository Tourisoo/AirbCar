#!/bin/sh

# Respect an existing DATABASE_URL (e.g. provided by Docker compose pointing to Postgres).
# Fallback to local SQLite only if nothing is set.
if [ -z "${DATABASE_URL:-}" ]; then
  export DATABASE_URL="file:./prisma/dev.db"
  echo "[start.sh] No DATABASE_URL provided. Using local SQLite fallback: $DATABASE_URL"
else
  echo "[start.sh] Using provided DATABASE_URL: $DATABASE_URL"
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

# If we're falling back to SQLite AND .env.local lacks a DATABASE_URL line, append it.
if [ "$DATABASE_URL" = "file:./prisma/dev.db" ] && ! grep -q "DATABASE_URL=file:" .env.local 2>/dev/null; then
  echo "DATABASE_URL=file:./prisma/dev.db" >> .env.local
fi

if grep -q "your-nextauth-secret-here" .env.local; then
  SECRET=$(openssl rand -base64 32)
  sed -i "s/your-nextauth-secret-here/$SECRET/" .env.local
  echo "✅ Generated NextAuth secret"
fi

set -a
# Load .env.local but keep existing DATABASE_URL if already pointing to Postgres
if grep -q '^DATABASE_URL=' .env.local 2>/dev/null; then
  ORIGINAL_DB_URL="$DATABASE_URL"
  . ./.env.local
  # If .env.local overwrote with a file: URL and we had a postgres one before, restore it
  if [ "${ORIGINAL_DB_URL:-}" != "" ] && printf '%s' "$ORIGINAL_DB_URL" | grep -qi '^postgres'; then
    if printf '%s' "$DATABASE_URL" | grep -qi '^file:'; then
      export DATABASE_URL="$ORIGINAL_DB_URL"
      echo "[start.sh] Restored Postgres DATABASE_URL from compose instead of SQLite fallback."
    fi
  fi
else
  . ./.env.local
fi
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