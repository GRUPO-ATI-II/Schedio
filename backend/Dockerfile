FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN mkdir -p migrations
COPY . .

# Etapa de desarrollo
FROM base AS development
ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:$PATH
EXPOSE 3000
# Usamos el nuevo comando que definiste
CMD ["npm", "run", "start:dev"]

# Etapa de producción (Para Jenkins)
FROM base AS production
ENV NODE_ENV=production
RUN npm prune --production
EXPOSE 3000
CMD ["npm", "start"]