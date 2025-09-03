# Etapa 1: Build de la app
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos solo lo necesario para instalar dependencias y compilar
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Elimina archivos default de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia el build generado
COPY --from=builder /app/build /usr/share/nginx/html

# Copia configuración personalizada si la tienes (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]