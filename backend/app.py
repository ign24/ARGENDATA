from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import FileResponse
import os
import boto3
import openai
from dotenv import load_dotenv
from fpdf import FPDF
import json

# 📌 Cargar variables de entorno
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# 📌 Inicializar FastAPI
app = FastAPI()

# 📌 Configuración de AWS S3
s3_client = boto3.client('s3')
BUCKET_NAME = "argendata-reports"

# 📌 Ruta del PDF temporal antes de subirlo a S3
TEMP_PDF_PATH = "/tmp/reporte.pdf"

# 📌 Endpoint de generación de reportes
@app.post("/generar_reporte")
async def generar_reporte(request: Request):
    """Genera un reporte económico en PDF basado en datos recientes."""
    
    # 📌 Simulación de obtención de datos económicos
    datos = {
        "Inflación": "5.2%",
        "PIB Crecimiento": "3.4%",
        "Exportaciones": "50,000 millones USD",
        "Producción Industrial": "2.8%",
    }

    # 📌 Crear el prompt para AWS Bedrock (GPT-4)
    prompt_ia = f"""
    Genera un análisis detallado sobre la economía argentina con base en los siguientes datos:

    - Inflación: {datos['Inflación']}
    - PIB Crecimiento: {datos['PIB Crecimiento']}
    - Exportaciones: {datos['Exportaciones']}
    - Producción Industrial: {datos['Producción Industrial']}

    Explica tendencias clave y posibles impactos económicos en el país.
    """

    try:
        # 📌 Generar análisis con AWS Bedrock (GPT-4)
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "system", "content": "Eres un analista económico experto en Argentina."},
                      {"role": "user", "content": prompt_ia}]
        )
        analisis_ia = response["choices"][0]["message"]["content"]
    except openai.error.OpenAIError as e:
        analisis_ia = f"Error al generar análisis con IA: {str(e)}"

    # 📌 Crear PDF con el reporte
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(200, 10, "📊 Reporte Económico de Argentina", ln=True, align="C")
    pdf.ln(10)

    pdf.set_font("Arial", "B", 12)
    pdf.cell(200, 10, "📍 Datos Clave", ln=True)
    pdf.set_font("Arial", "", 12)
    for key, value in datos.items():
        pdf.cell(200, 8, f"{key}: {value}", ln=True)
    pdf.ln(10)

    pdf.set_font("Arial", "B", 12)
    pdf.cell(200, 10, "📌 Análisis y Tendencias", ln=True)
    pdf.set_font("Arial", "", 12)
    pdf.multi_cell(0, 8, analisis_ia)
    pdf.ln(10)
    pdf.cell(200, 8, "🔹 Reporte generado automáticamente con IA (GPT-4)", ln=True, align="C")

    # 📌 Guardar PDF temporalmente
    pdf.output(TEMP_PDF_PATH)

    # 📌 Subir PDF a S3
    s3_client.upload_file(TEMP_PDF_PATH, BUCKET_NAME, "reportes/reporte.pdf")

    # 📌 Generar URL de descarga
    url_descarga = f"https://{BUCKET_NAME}.s3.amazonaws.com/reportes/reporte.pdf"

    return {"mensaje": "Reporte generado con éxito", "url": url_descarga}

# 📌 Verificar si el backend está en línea
@app.get("/health")
async def health_check():
    return {"status": "ok"}