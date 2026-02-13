FROM ubuntu:latest AS server
RUN apt-get update && apt-get upgrade -y && apt install net-tools && apt-get install -y apache2
RUN a2enmod proxy \
    proxy_http \
    rewrite \
    deflate \
    headers \
    proxy_balancer \
    proxy_connect \
    proxy_html \
    xml2enc

COPY schedio.conf /etc/apache2/sites-available/000-default.conf
	
COPY ./dist /var/www/html/

CMD ["apachectl", "-D", "FOREGROUND"]

FROM node:22-alpine AS base

WORKDIR /app

FROM base AS development
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start", "--", "--host", "0.0.0.0"]

FROM base AS builder
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/schedio-frontend/server/server.mjs"]
