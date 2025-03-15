const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 3000;
const OPENAI_API_KEY = "TU_CLAVE_DE_API_AQUI";

app.use(cors());
app.use(express.json());

// 📌 Endpoint para el Chatbot con OpenAI
app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;
        
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: "Eres un chatbot experto en economía." },
                           { role: "user", content: userMessage }],
                max_tokens: 100
            },
            { headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" } }
        );

        res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: "Error al conectar con OpenAI" });
    }
});

// 📌 Endpoint para calcular la Media
app.post("/calcular/media", (req, res) => {
    const valores = req.body.valores;
    if (!valores || valores.length === 0) {
        return res.status(400).json({ error: "Datos inválidos" });
    }
    const media = valores.reduce((a, b) => a + b, 0) / valores.length;
    res.json({ media });
});

// 📌 Endpoint para calcular la Desviación Estándar
app.post("/calcular/desviacion", (req, res) => {
    const valores = req.body.valores;
    if (!valores || valores.length === 0) {
        return res.status(400).json({ error: "Datos inválidos" });
    }
    const media = valores.reduce((a, b) => a + b, 0) / valores.length;
    const desviacion = Math.sqrt(valores.reduce((acc, val) => acc + (val - media) ** 2, 0) / valores.length);
    res.json({ desviacion });
});

// 📌 Servidor en ejecución
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

app.use(cors());

const API_KEY = process.env.WEATHER_API_KEY;

app.get("/api/clima", async (req, res) => {
    const ciudad = req.query.q;
    if (!API_KEY) {
        return res.status(500).json({ error: "❌ API Key no configurada en el servidor." });
    }

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${ciudad}&aqi=no`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "❌ Error al obtener el clima." });
    }
});

app.listen(3000, () => console.log("🚀 Servidor corriendo en http://localhost:3000"));

