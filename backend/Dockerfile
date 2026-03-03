FROM node:22-alpine

# Definimos el directorio de trabajo
WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos todas las dependencias (incluyendo devDependencies)
RUN npm install

# Copiamos el resto del código
COPY . .

# Seteamos variables de entorno para desarrollo
ENV NODE_ENV=dev
# Aseguramos que los binarios de node_modules sean visibles
ENV PATH /app/node_modules/.bin:$PATH

# Exponemos el puerto definido en tu .env.dev (usualmente 3000)
EXPOSE 3000

# Comando para arrancar en modo desarrollo
CMD ["npm", "run", "start:dev"]