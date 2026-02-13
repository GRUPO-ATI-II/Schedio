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
	
CMD ["apachectl", "-D", "FOREGROUND"]

FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM base AS development
CMD ["npm", "run", "dev"]

FROM base AS production
RUN npm prune --production # Limpia dependencias de desarrollo
CMD ["npm", "start"]
