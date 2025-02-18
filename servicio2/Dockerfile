# Utiliza una imagen base de Python
FROM python:3.10-slim

WORKDIR /app

# Copia el archivo de dependencias e instálalas
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 5000

ENV PYTHONUNBUFFERED=1

# Comando para iniciar la aplicación
CMD ["python", "-u", "app.py"]

