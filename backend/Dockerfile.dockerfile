# Usar una imagen base de Python
FROM python:3.11

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos del backend al contenedor
COPY . /app

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Exponer el puerto en el que correrá FastAPI
EXPOSE 8000

# Comando para ejecutar el servidor
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]