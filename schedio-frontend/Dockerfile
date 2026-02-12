# Use Node.js 22 as base
FROM node:22-alpine AS base

WORKDIR /app

# Development stage
FROM base AS development
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start", "--", "--host", "0.0.0.0"]

# Builder stage for production
FROM base AS builder
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
# We need to install only production dependencies if they are needed for the SSR server
# Often the build output is self-contained or requires minimal deps.
# For Angular SSR with Express, we might need 'express' if it's not bundled.
# Assuming 'dist/schedio-frontend/server/server.mjs' is the entry point as per package.json
CMD ["node", "dist/schedio-frontend/server/server.mjs"]
