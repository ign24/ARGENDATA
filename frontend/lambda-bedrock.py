import json
import boto3
import os
import datetime
import requests
from fpdf import FPDF

# Inicializar clientes de AWS
bedrock_runtime = boto3.client("bedrock-runtime", region_name="us-east-1")
s3 = boto3.client("s3")

# Configuración
BUCKET_NAME = os.getenv("S3_BUCKET_NAME", "argendata-reports")
DASHBOARD_API_URL = os.getenv("DASHBOARD_API_URL", "https://api.argendata.com")

def obtener_datos_dashboard():
    """Extrae los datos clave del dashboard desde la API."""
    endpoints = ["dolar", "ipc", "pib", "exportaciones", "industria"]
    datos = {}

    for endpoint in endpoints:
        try:
            response = requests.get(f"{DASHBOARD_API_URL}/{endpoint}", timeout=5)
            response.raise_for_status()
            datos[endpoint] = response.json().get("valor", "No disponible")
        except requests.RequestException:
            datos[endpoint] = "No disponible"

    return datos

def generar_analisis_bedrock(datos):
    """Envía un prompt a AWS Bedrock para generar un análisis de los datos."""
    prompt = f"""
    Genera un informe económico basado en estos datos:
    - Dólar: {datos['dolar']}
    - IPC: {datos['ipc']}
    - PIB: {datos['pib']}
    - Exportaciones: {datos['exportaciones']}
    - Industria: {datos['industria']}
    
    Analiza tendencias, impacto y proyecciones económicas.
    """

    response = bedrock_runtime.invoke_model(
        modelId="anthropic.claude-v2", 
        body=json.dumps({"prompt": prompt, "max_tokens": 500})
    )

    return json.loads(response["body"].read())["completion"]

def generar_pdf(datos, analisis):
    """Crea un archivo PDF con los datos y el análisis económico."""
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    
    pdf.set_font("Arial", "B", 16)
    pdf.cell(200, 10, "📊 Reporte Económico de Argentina", ln=True, align="C")
    pdf.ln(10)

    pdf.set_font("Arial", "B", 12)
    pdf.cell(200, 10, "📍 Datos Clave del Dashboard", ln=True)
    pdf.set_font("Arial", "", 12)
    for key, value in datos.items():
        pdf.cell(200, 8, f"{key}: {value}", ln=True)
    pdf.ln(10)

    pdf.set_font("Arial", "B", 12)
    pdf.cell(200, 10, "📌 Análisis y Tendencias", ln=True)
    pdf.set_font("Arial", "", 12)
    pdf.multi_cell(0, 8, analisis)
    pdf.ln(10)
    pdf.cell(200, 8, "🔹 Reporte generado automáticamente con IA (Bedrock)", ln=True, align="C")

    file_path = f"/tmp/reporte_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    pdf.output(file_path)
    return file_path

def subir_a_s3(file_path):
    """Sube el archivo PDF a Amazon S3 y devuelve la URL de descarga."""
    file_name = os.path.basename(file_path)
    s3.upload_file(file_path, BUCKET_NAME, file_name, ExtraArgs={"ACL": "public-read"})
    return f"https://{BUCKET_NAME}.s3.amazonaws.com/{file_name}"

def lambda_handler(event, context):
    """Función principal de AWS Lambda."""
    datos = obtener_datos_dashboard()
    analisis = generar_analisis_bedrock(datos)
    pdf_path = generar_pdf(datos, analisis)
    pdf_url = subir_a_s3(pdf_path)

    return {
        "statusCode": 200,
        "body": json.dumps({"reporte_url": pdf_url})
    }