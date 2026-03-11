FROM node:22-alpine AS base

WORKDIR /app

FROM base AS development
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start", "--", "--host", "0.0.0.0"]

FROM base AS builder
COPY package*.json ./
RUN npm install --include=dev
COPY . .
RUN rm -rf .angular/cache && npx ng build --localize --configuration production

FROM node:22-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist/schedio-frontend/server ./server
CMD ["node", "server/es/server.mjs"]

FROM nginx:alpine AS server

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/schedio-frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
