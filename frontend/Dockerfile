# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

# Copy Prisma schema for database setup
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy environment example
COPY .env.example ./

# Copy source code
COPY . .

# Create .env.local from example and set default DATABASE_URL
RUN cp .env.example .env.local && \
    sed -i 's/your-nextauth-secret-here/temp-secret-for-build/' .env.local

# Generate Prisma client
RUN pnpm dlx prisma generate

# Set default environment variables
ENV DATABASE_URL="file:./prisma/dev.db"
ENV NEXTAUTH_URL="http://localhost:3000"
ENV NODE_ENV="development"

# Create a script to handle environment setup and database migration
RUN printf '#!/bin/sh\n\
# Set environment variables\n\
export DATABASE_URL="file:./prisma/dev.db"\n\
export NEXTAUTH_URL="http://localhost:3000"\n\
\n\
# Check if .env.local exists, if not create from example\n\
if [ ! -f ".env.local" ]; then\n\
  echo "Creating .env.local from .env.example..."\n\
  cp .env.example .env.local\n\
  echo "⚠️  Please set NEXTAUTH_SECRET in .env.local"\n\
  echo "💡 Generate one with: openssl rand -base64 32"\n\
fi\n\
\n\
# Ensure DATABASE_URL is set in .env.local\n\
if ! grep -q "DATABASE_URL=file:" .env.local; then\n\
  echo "DATABASE_URL=file:./prisma/dev.db" >> .env.local\n\
fi\n\
\n\
# Generate a NextAuth secret if not set\n\
if grep -q "your-nextauth-secret-here" .env.local; then\n\
  SECRET=$(openssl rand -base64 32)\n\
  sed -i "s/your-nextauth-secret-here/$SECRET/" .env.local\n\
  echo "✅ Generated NextAuth secret"\n\
fi\n\
\n\
# Source environment variables\n\
set -a\n\
. ./.env.local\n\
set +a\n\
\n\
# Run database migration\n\
echo "Setting up database..."\n\
pnpm dlx prisma migrate deploy || pnpm dlx prisma db push\n\
\n\
# Start the application\n\
echo "Starting application..."\n\
if [ "$NODE_ENV" = "production" ]; then\n\
  pnpm run build\n\
  pnpm start\n\
else\n\
  pnpm run dev\n\
fi\n' > /app/start.sh && chmod +x /app/start.sh


# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Use the start script as entrypoint
CMD ["/app/start.sh"]
