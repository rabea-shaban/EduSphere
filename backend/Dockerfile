# ====================================================
# STAGE 1: Build Stage
# ====================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code and config files
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript to dist
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

# ====================================================
# STAGE 2: Production Runner Stage
# ====================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Install curl for health check
RUN apk add --no-cache curl

# Set Node environment
ENV NODE_ENV=production
ENV PORT=5000

# Copy node_modules and built output from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Create non-root user and set permissions
USER node

# Health check endpoint verification
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:${PORT}/api/v1/ || exit 1

EXPOSE 5000

CMD ["node", "dist/server.js"]
