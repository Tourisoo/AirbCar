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

# Copy only the necessary files for the application
COPY .env.example ./
COPY next.config.js ./
COPY postcss.config.mjs ./
COPY eslint.config.mjs ./
COPY jsconfig.json ./
COPY start.sh ./

# Copy source directories
COPY src ./src/
COPY public ./public/

# Create .env.local from example and set default DATABASE_URL
RUN cp .env.example .env.local && \
    sed -i 's/your-nextauth-secret-here/temp-secret-for-build/' .env.local

# Generate Prisma client
RUN pnpm dlx prisma generate

# Set default environment variables
ENV DATABASE_URL="file:./prisma/dev.db"
ENV NEXTAUTH_URL="http://localhost:3000"
ENV NODE_ENV="development"

# Make the startup script executable
RUN chmod +x /app/start.sh

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Use the start script as entrypoint
CMD ["sh", "/app/start.sh"]
