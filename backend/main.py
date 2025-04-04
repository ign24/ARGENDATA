from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from mangum import Mangum
from pathlib import Path
from fpdf import FPDF
import logging

import os
import pandas as pd
from glob import glob
from datetime import datetime

import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

# Configurar logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# 📌 Cargar variables de entorno
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logger.error("No se encontró la API key de Gemini en las variables de entorno")
    raise EnvironmentError("GEMINI_API_KEY no está definida en el archivo .env")

# 📌 Inicializar cliente y modelo Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Configuraciones de seguridad y generación
safety_settings = {
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
}

# Modelo y configuración
GEMINI_MODEL = "gemini-2.0-flash"
generation_config = {
    "temperature": 0.6,
    "top_p": 0.9,
    "top_k": 40,
    "max_output_tokens": 1600,
}

# 📌 Inicializar FastAPI
app = FastAPI(title="ARGENDATA API", description="API para el dashboard de ARGENDATA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📌 Instrucciones base
SYS_INSTRUCT = """
Sos un asistente conversacional simpático y relajado que trabaja en ARGENDATA.
Tu tono es cálido, accesible y profesional, como si charlaras con un colega o usuario curioso que está navegando el dashboard.
Podés explicar conceptos económicos si te lo piden, hacer comentarios divertidos o sugerir cosas interesantes para mirar en el tablero.
"""

SYS_INSTRUCT_REPORTE = """
Sos un asistente conversacional simpático, relajado y con buena onda. Formás parte del equipo de ARGENDATA, una plataforma inteligente para explorar datos económicos y productivos de Argentina.

🧑‍💻 Tu rol:
Acompañás a los usuarios mientras navegan el dashboard. Charlás con ellos como si fueran colegas curiosos: con un tono cálido, humano y profesional. Siempre estás listo para explicar conceptos, sugerir insights o ayudar a entender lo que se ve en pantalla.

📊 Conocés a fondo cómo está organizada la plataforma:
- El dashboard muestra indicadores clave como inflación (IPC), PIB, deuda pública, salarios, EMAE, costos de construcción y crecimiento sectorial.
- Hay un botón que permite **generar reportes automáticos**, con análisis integrados en base a los datos cargados.
- También hay una **tarjeta de noticias** con lo último sobre economía argentina.
- La página usa **GridStack**, así que los usuarios pueden mover tarjetas y personalizar su vista.
- Hay una sección para consultar **los distintos tipos de dólar**.
- Existe un **modo Lite** que desactiva animaciones para mejorar el rendimiento en computadoras lentas.

🧭 Si un usuario no sabe por dónde empezar, podés sugerirle:
- Mirar la evolución del IPC,
- Ver cómo creció el PIB en el último año,
- Explorar el crecimiento por sector económico,
- O tocar el botón de "Generar Reporte".

💡 Además:
- Podés hacer comentarios divertidos sobre los datos ("¡La inflación viene picante!"), explicar términos económicos con ejemplos simples y responder dudas técnicas o conceptuales.
- Siempre buscá que la experiencia sea amena, clara y útil. Si detectás algo interesante en los datos, invitá al usuario a explorarlo.
- Nunca respondas como una IA genérica. Sos parte del equipo humano de ARGENDATA.

"""


PDF_FILENAME = "reporte_dashboard.pdf"
DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# ✅ Health check
@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

# ✅ Chat con Gemini 2.0 Flash
@app.post("/chat")
async def chat_endpoint(request: Request):
    try:
        data = await request.json()
        user_msg = data.get("message", "")
        if not user_msg:
            raise HTTPException(status_code=400, detail="Mensaje vacío")
        
        # 🔹 Leer datos actualizados del dashboard
        datos_csv = leer_indicadores_csv()

        # 🔹 Prompt combinado
        full_prompt = f"""{SYS_INSTRUCT}

A continuación tenés acceso a los indicadores económicos actualizados del dashboard:

{datos_csv}

Usuario: {user_msg}
"""

        # Crear modelo y responder
        model = genai.GenerativeModel(
            model_name=GEMINI_MODEL,
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        
        chat = model.start_chat(history=[])
        response = chat.send_message(full_prompt)
        
        return response.text.strip()
    except HTTPException as he:
        logger.warning(f"Error de cliente: {str(he)}")
        raise
    except Exception as e:
        logger.error(f"Error en el endpoint de chat: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")


# ✅ Generar Reporte Económico
@app.post("/generar_reporte")
async def generar_reporte():
    try:
        datos_csv = leer_indicadores_csv()
        
        prompt_ia = f"""
        {SYS_INSTRUCT_REPORTE}

        Actuás como un analista económico senior especializado en elaboración de informes ejecutivos. Recibiste datos actualizados desde distintos informes económicos en el siguiente formato CSV:

        {datos_csv}

        🧠 Tu tarea es redactar un informe ejecutivo claro, técnico y orientado a la toma de decisiones estratégicas. El informe debe incluir:

        1. 📊 **Análisis de Datos**: 
        - Describe patrones y tendencias relevantes detectadas en los datos.
        - Evitá frases vagas. Utilizá cifras exactas, porcentajes, variaciones interanuales o mensuales, comparaciones entre periodos y métricas concretas.

        2. 🔎 **Interpretación Económica**:
        - Identificá causas probables detrás de las variaciones.
        - Incluí impactos potenciales en variables macroeconómicas como inflación, empleo, consumo, etc.

        3. 🎯 **Conclusiones Ejecutivas**:
        - Resumí hallazgos clave en 3 a 5 bullets accionables.
        - Mantené el foco en los indicadores críticos para la toma de decisiones.

        ⚠️ Importante:
        - Si algún punto no puede ser desarrollado por falta de datos suficientes, OMITILO directamente.
        - No uses frases genéricas como “requiere análisis más profundo” o “muestra una variación”.
        - Prioriza la precisión técnica y la claridad comunicacional.

        El informe debe ser coherente, con buena estructura y tono profesional.
        """

        model = genai.GenerativeModel(
            model_name=GEMINI_MODEL,
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        
        response = model.generate_content(prompt_ia)
        analisis_ia = response.text.strip() if response.text else "⚠️ No se obtuvo respuesta del modelo."
        
        pdf_path = generar_pdf_reporte(PDF_FILENAME, "Reporte Económico de Argentina", analisis_ia)
        return FileResponse(pdf_path, media_type="application/pdf", filename=PDF_FILENAME)
    
    except Exception as e:
        logger.error(f"Error al generar reporte: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error al generar reporte: {str(e)}")

# ✅ Leer indicadores desde CSVs
def leer_indicadores_csv():
    try:
        archivos = list(DATA_DIR.glob("*.csv"))
        
        if not archivos:
            logger.warning(f"No se encontraron archivos CSV en {DATA_DIR}")
            return "No se encontraron datos disponibles."
        
        resumenes = []
        for ruta in archivos:
            try:
                df = pd.read_csv(ruta)
                nombre = ruta.stem.replace("_", " ").capitalize()
                # Limitar a las primeras 3 filas para un resumen conciso
                vista = df.head(3).to_markdown(index=False)
                resumenes.append(f"📄 {nombre}:\n{vista}")
            except Exception as e:
                logger.error(f"Error al procesar {ruta}: {str(e)}", exc_info=True)
                resumenes.append(f"⚠️ Error al leer {ruta.name}: {str(e)}")
        
        return "\n\n".join(resumenes)
    except Exception as e:
        logger.error(f"Error general al leer indicadores: {str(e)}", exc_info=True)
        return f"Error al leer indicadores: {str(e)}"

# ✅ Generar PDF con el análisis
def generar_pdf_reporte(nombre_archivo: str, titulo: str, contenido: str) -> Path:
    try:
        # Reemplazar caracteres problemáticos
        contenido = contenido.replace("•", "-")  # Reemplazar bullet points con guiones
        
        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        
        # Agregar primera página con portada
        pdf.add_page()
        pdf.set_fill_color(0, 51, 102)  # Azul corporativo
        pdf.rect(0, 0, 210, 40, style="F")  # Rectángulo superior
        
        # Logo o título en blanco
        pdf.set_text_color(255, 255, 255)
        pdf.set_font("Arial", "B", 24)
        pdf.cell(0, 30, "ARGENDATA", ln=True, align="C")
        
        # Título del informe
        pdf.set_text_color(0, 0, 0)
        pdf.ln(20)
        pdf.set_font("Arial", "B", 20)
        pdf.cell(0, 10, titulo, ln=True, align="C")
        
        # Fecha y tipo de documento
        fecha_actual = datetime.now().strftime("%d de %B de %Y")
        fecha_actual = fecha_actual.replace("April", "Abril").replace("October", "Octubre")
        pdf.ln(10)
        pdf.set_font("Arial", "I", 12)
        pdf.cell(0, 10, f"Reporte economico - {fecha_actual}", ln=True, align="C")
        
        # Línea de separación
        pdf.ln(15)
        pdf.set_draw_color(0, 51, 102)
        pdf.line(30, pdf.get_y(), 180, pdf.get_y())
        
        # Contenido en páginas subsiguientes
        pdf.add_page()
        
        # Encabezado de página
        pdf.set_font("Arial", "B", 14)
        pdf.cell(0, 10, "INFORME EJECUTIVO", ln=True)
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())
        pdf.ln(5)
        
        # Contenido principal con formato mejorado
        pdf.set_font("Arial", "", 11)
        
        # Procesar el contenido para agregar formato
        secciones = contenido.split("**")
        
        for i, seccion in enumerate(secciones):
            if i == 0:  # Resumen inicial
                pdf.set_font("Arial", "", 11)
                pdf.multi_cell(0, 6, seccion)
                continue
                
            if i % 2 == 1:  # Títulos (índices impares después de dividir por **)
                pdf.ln(4)
                pdf.set_font("Arial", "B", 12)
                pdf.set_text_color(0, 51, 102)
                pdf.multi_cell(0, 6, seccion)
                pdf.set_text_color(0, 0, 0)
            else:  # Contenido (índices pares)
                pdf.set_font("Arial", "", 11)
                pdf.multi_cell(0, 6, seccion)
        
        # Pie de página con información de la empresa
        pdf.set_y(-30)
        pdf.set_font("Arial", "I", 8)
        pdf.set_text_color(128, 128, 128)
        pdf.cell(0, 10, "Centro ARGENDATA - Analisis Economico y Social", ln=True, align="C")
        pdf.cell(0, 10, "Generado con asistencia de IA - Confidencial", align="C")
        
        # Guardar PDF
        pdf_path = Path(nombre_archivo)
        pdf.output(str(pdf_path))
        logger.info(f"PDF generado exitosamente: {pdf_path}")
        return pdf_path
    
    except Exception as e:
        logger.error(f"Error al generar PDF: {str(e)}", exc_info=True)
        raise Exception(f"Error al generar PDF: {str(e)}")