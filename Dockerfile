# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Update system packages to fix known vulnerabilities
RUN apk update && apk upgrade --no-cache

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the project
RUN pnpm run build

# Production stage
FROM node:24-alpine

WORKDIR /app

# Update system packages to fix known vulnerabilities
RUN apk update && apk upgrade --no-cache

# Install serve to run the built app
RUN npm install -g serve

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "dist", "-l", "3000"]
