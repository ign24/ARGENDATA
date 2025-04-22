# Cómo ejecutar el proyecto localmente

Este proyecto se ejecuta completamente de forma local. Para que funcione correctamente, necesitás configurar tus claves de API.

---

## Requisitos

- Una clave de API de **Gemini** (Google Generative AI)
- (Opcional) Clave de **Amazon Polly** si querés habilitar la lectura en voz alta del reporte

Crea un archivo `.env` a partir del ejemplo:

```bash
cd backend
cp .env.example .env
```

Editá el archivo `.env` y colocá tu clave en la variable correspondiente:

```
GEMINI_API_KEY=tu_clave_aqui
```

---

## Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

El backend estará disponible en: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## Frontend (Five Server o Live Server)

```bash
cd frontend
five-server .
```

O abrí directamente el archivo `index.html` con la extensión **Live Server** de VSCode o Cursor.
