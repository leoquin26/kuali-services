# Imagen base de Node.js (versión Alpine)
FROM node:18-alpine

WORKDIR /app

# Copiar package.json y package-lock.json e instalar dependencias
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto en el que se ejecuta la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
