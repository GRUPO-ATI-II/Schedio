# Use Node.js 22 Alpine as base
FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Development stage
FROM base AS development
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
CMD ["npm", "start"]
