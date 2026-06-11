# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Update system packages to fix known vulnerabilities
RUN apk update && apk upgrade --no-cache

# Install pnpm
RUN npm install -g pnpm

# Relax supply-chain minimum release age (date-fns-hijri & hijri-core published recently)
RUN pnpm config set minimum-release-age 0 --location project

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --ignore-scripts

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
