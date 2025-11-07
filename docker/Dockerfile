# Multi-stage build for production
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
# Skip prepare script (Husky) and install only production deps
RUN npm ci --omit=dev --ignore-scripts

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NODE_ENV=production
ENV ASTRO_TELEMETRY_DISABLED=1

# Install all dependencies (including dev deps) for build
RUN npm ci --ignore-scripts

# Build the application
RUN npm run build

# Production image, copy all the files and run astro
FROM nginx:alpine AS runner
WORKDIR /app

# Copy the built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Add labels for better container management
LABEL org.opencontainers.image.title="EuroTCG Website"
LABEL org.opencontainers.image.description="European Trading Card Game Collection Manager Website"
LABEL org.opencontainers.image.source="https://github.com/eurotcg/eurotcg-website"
LABEL org.opencontainers.image.licenses="MIT"

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S astro -u 1001

# Set ownership of nginx files
RUN chown -R astro:nodejs /usr/share/nginx/html
RUN chown -R astro:nodejs /var/cache/nginx
RUN chown -R astro:nodejs /var/log/nginx
RUN chown -R astro:nodejs /etc/nginx/conf.d
RUN touch /var/run/nginx.pid
RUN chown -R astro:nodejs /var/run/nginx.pid

USER astro

EXPOSE 3000

# Health check (install curl first)
RUN apk add --no-cache curl
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
