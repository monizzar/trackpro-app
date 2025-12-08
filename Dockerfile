# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm from standalone binary
RUN apk add --no-cache curl && \
    curl -fsSL https://github.com/pnpm/pnpm/releases/download/v9.1.0/pnpm-linuxstatic-x64 -o /usr/local/bin/pnpm && \
    chmod +x /usr/local/bin/pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy prisma schema first
COPY prisma ./prisma

# Generate Prisma Client
RUN pnpm db:generate

# Copy source code
COPY .  .

# Build application
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Copy standalone build
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/. next/static . /.next/static
COPY --from=builder /app/prisma ./prisma

# Copy node_modules for Prisma
COPY --from=builder /app/node_modules/. prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

# Start the application
CMD ["node", "server.js"]