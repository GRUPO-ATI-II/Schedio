FROM node:22-alpine AS base

WORKDIR /app

FROM base AS development
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--allowed-hosts", "all"]

FROM base AS builder
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/schedio-frontend/server/server.mjs"]
