from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import os
import httpx
import openai
from dotenv import load_dotenv
from fpdf import FPDF
from google import genai

# 📌 Cargar variables de entorno
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# 📌 Inicializar FastAPI
app = FastAPI()

# 📌 Configuración de CORS
origins = ["http://127.0.0.1:5500", "http://localhost:5500"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📌 Inicializar clientes de IA
if OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)

# 📌 URL del backend del dashboard
API_DASHBOARD_URL = "http://127.0.0.1:8000"  # Ajusta si la API está en otro puerto/servidor

# 📌 Ruta del archivo PDF generado
PDF_FILENAME = "reporte_dashboard.pdf"

# 📌 Instrucciones del Chatbot Gemini
sys_instruct = """
Eres un Asistente Avanzado de Datos y Análisis del Centro de Monitoreo de la Argentina Productiva...
"""

# 📌 Verificar si el backend está en línea
@app.get("/health")
async def health_check():
    return {"status": "ok"}

# 📌 Obtener datos del dashboard en tiempo real (Asíncrono)
async def obtener_datos_dashboard():
    endpoints = ["dolar", "ipc", "pib", "exportaciones", "industria"]
    datos = {}

    async with httpx.AsyncClient() as client:
        for endpoint in endpoints:
            try:
                response = await client.get(f"{API_DASHBOARD_URL}/{endpoint}", timeout=5)
                datos[endpoint] = response.json().get("valor", "No disponible") if response.status_code == 200 else "No disponible"
            except httpx.RequestError:
                datos[endpoint] = "No disponible"

    return {
        "Cotización del Dólar": datos.get("dolar", "No disponible"),
        "Inflación IPC": datos.get("ipc", "No disponible"),
        "PIB Crecimiento": datos.get("pib", "No disponible"),
        "Exportaciones Totales": datos.get("exportaciones", "No disponible"),
        "Producción Industrial": datos.get("industria", "No disponible"),
    }

# 📌 Generar el reporte en PDF con análisis de GPT-4
@app.post("/generar_reporte")
async def generar_reporte():
    datos_dashboard = await obtener_datos_dashboard()
    
    if "error" in datos_dashboard:
        raise HTTPException(status_code=500, detail=datos_dashboard["error"])

    # 📌 Crear el prompt para GPT-4
    prompt_ia = f"""
    Genera un informe económico basado en los siguientes indicadores de Argentina:

    📌 Cotización del Dólar: {datos_dashboard['Cotización del Dólar']}
    📌 Inflación IPC: {datos_dashboard['Inflación IPC']}
    📌 PIB Crecimiento: {datos_dashboard['PIB Crecimiento']}
    📌 Exportaciones Totales: {datos_dashboard['Exportaciones Totales']}
    📌 Producción Industrial: {datos_dashboard['Producción Industrial']}
    
    🔹 Explica las tendencias económicas observadas...
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "system", "content": "Eres un analista económico experto en Argentina."},
                      {"role": "user", "content": prompt_ia}]
        )
        analisis_gpt = response["choices"][0]["message"]["content"]
    except openai.error.OpenAIError as e:
        analisis_gpt = f"Error al generar análisis con IA: {str(e)}"

    # 📌 Crear el PDF con FPDF
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(200, 10, "📊 Reporte Económico de Argentina", ln=True, align="C")
    pdf.ln(10)

    pdf.set_font("Arial", "B", 12)
    pdf.cell(200, 10, "📍 Datos Clave del Dashboard", ln=True)
    pdf.set_font("Arial", "", 12)
    for key, value in datos_dashboard.items():
        pdf.cell(200, 8, f"{key}: {value}", ln=True)
    pdf.ln(10)

    pdf.set_font("Arial", "B", 12)
    pdf.cell(200, 10, "📌 Análisis y Tendencias", ln=True)
    pdf.set_font("Arial", "", 12)
    pdf.multi_cell(0, 8, analisis_gpt)
    pdf.ln(10)
    pdf.cell(200, 8, "🔹 Reporte generado automáticamente con IA (GPT-4)", ln=True, align="C")

    pdf.output(PDF_FILENAME)
    return FileResponse(PDF_FILENAME, media_type="application/pdf", filename=PDF_FILENAME)

# 📌 Chatbot con Gemini AI
@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_message = data.get("message")
    full_message = f"{sys_instruct}\n\nUsuario: {user_message}"

    try:
        response = client.generate_content(
            model="gemini-2.0-flash",
            contents=[{"role": "user", "parts": [{"text": full_message}]}]
        )
        generated_text = response.text if response.text else "No se recibió respuesta válida."
        return {"response": generated_text}

    except Exception as e:
        return {"response": f"Error interno: {str(e)}"}