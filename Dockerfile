# Stage 1: Builder (construye la app)
FROM node:22.14.0-alpine AS builder

WORKDIR /usr/src/app

# Copia solo package.json y lock primero (cachea dependencias)
COPY package*.json ./

RUN npm install

# Copia el resto del código
COPY . .

# Construye en producción
ARG env_name
ARG env_port
ENV NODE_ENV=$env_name
ENV PORT=$env_port

RUN npm run build

# Stage 2: Producción (imagen liviana)
FROM node:22.14.0-alpine

WORKDIR /usr/src/app

# Copia solo lo necesario de builder
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/public ./public  

# Variables de entorno
ARG env_name
ARG env_port
ENV NODE_ENV=$env_name
ENV PORT=$env_port

EXPOSE $env_port

# Comando de producción
CMD ["npm", "run", "start"]