from flask import Flask, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

URL = "https://www.economia.gob.ar/datos/"

@app.route("/ipc", methods=["GET"])
def obtener_ipc():
    try:
        # 📌 Descargar la página con un User-Agent válido
        headers = {"User-Agent": "Mozilla/5.0"}
        respuesta = requests.get(URL, headers=headers)

        if respuesta.status_code != 200:
            return jsonify({"error": "No se pudo acceder a la página"}), 500

        # 📌 Parsear el HTML
        soup = BeautifulSoup(respuesta.text, "html.parser")

        # 📌 Intentar encontrar el elemento del IPC con distintos selectores
        ipc_elemento = (
            soup.select_one("#\\31 45\\.3_INGNACUAL_DICI_M_38 > p.units_representation") or
            soup.select_one("//*[@id='145.3_INGNACUAL_DICI_M_38']/p[2]") or
            soup.select_one("body > div > section:nth-of-type(1) > div > div:nth-of-type(6) > p:nth-of-type(2)")
        )

        if not ipc_elemento:
            return jsonify({"error": "No se encontró el IPC en la página"}), 404

        ipc_valor = ipc_elemento.text.strip()

        return jsonify({"ipc": ipc_valor})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)