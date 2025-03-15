async function cargarProduccionMaxMin() {
    try {
        const response = await fetch("../data/apicola_max_min.json");
        if (!response.ok) throw new Error("No se pudo cargar el JSON");

        const data = await response.json();
        console.log("Datos recibidos:", data); // 🔍 Depuración

        if (!data || !data.produccion_maxima || !data.produccion_minima) {
            throw new Error("Estructura JSON incorrecta");
        }

        // Obtener datos de producción máxima y mínima
        const maxAño = data.produccion_maxima.año || "N/A";
        const maxProduccion = data.produccion_maxima.produccion_miel_tn || "N/A";
        const minAño = data.produccion_minima.año || "N/A";
        const minProduccion = data.produccion_minima.produccion_miel_tn || "N/A";

        document.getElementById("produccionMaxMin").innerHTML = `
            🌟 Máximo: ${maxAño} - ${maxProduccion.toLocaleString()} toneladas <br>
            ❄️ Mínimo: ${minAño} - ${minProduccion.toLocaleString()} toneladas
        `;

    } catch (error) {
        console.error("Error en Producción Máxima y Mínima:", error);
        document.getElementById("produccionMaxMin").innerHTML = "⚠️ No se pudieron cargar los datos.";
    }
}

document.addEventListener("DOMContentLoaded", cargarProduccionMaxMin);