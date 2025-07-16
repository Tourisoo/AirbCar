# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy Prisma schema for database setup
COPY prisma ./prisma/

# Copy environment example
COPY .env.example ./

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm dlx prisma generate

# Create a script to handle environment setup and database migration
RUN echo '#!/bin/sh\n\
# Check if .env.local exists, if not create from example\n\
if [ ! -f ".env.local" ]; then\n\
  echo "Creating .env.local from .env.example..."\n\
  cp .env.example .env.local\n\
  echo "⚠️  Please set NEXTAUTH_SECRET in .env.local"\n\
  echo "💡 Generate one with: openssl rand -base64 32"\n\
fi\n\
\n\
# Run database migration\n\
echo "Setting up database..."\n\
pnpm dlx prisma migrate deploy\n\
\n\
# Start the application\n\
echo "Starting application..."\n\
if [ "$NODE_ENV" = "production" ]; then\n\
  pnpm run build\n\
  pnpm start\n\
else\n\
  pnpm run dev\n\
fi' > /app/start.sh && chmod +x /app/start.sh

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/test-env || exit 1

# Use the start script as entrypoint
CMD ["/app/start.sh"]
