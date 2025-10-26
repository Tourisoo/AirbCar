#!/bin/sh

# Set Django Backend URL if not provided
if [ -z "${DJANGO_API_URL:-}" ]; then
  export DJANGO_API_URL="http://django-api:8000"
  echo "[start.sh] No DJANGO_API_URL provided. Using default: $DJANGO_API_URL"
else
  echo "[start.sh] Using provided DJANGO_API_URL: $DJANGO_API_URL"
fi

echo "Starting Next.js application..."
if [ "$NODE_ENV" = "production" ]; then
  pnpm run build
  pnpm start
else
  pnpm run dev
fi