# Imagen base de Node.js (versión ligera)
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias y luego instalarlas
COPY package*.json ./
RUN npm install --legacy-peer-deps
# Copiar el resto del código de la aplicación
COPY . .

# Crear la carpeta para almacenar archivos subidos
RUN mkdir -p uploads

# Exponer el puerto en el que se ejecuta el backend (3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]