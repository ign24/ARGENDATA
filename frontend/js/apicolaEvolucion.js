async function cargarEvolucionApicola() {
    try {
        const response = await fetch("../data/apicola_evolucion.json");
        if (!response.ok) throw new Error("No se pudo cargar el JSON");

        const data = await response.json();
        console.log("Datos recibidos:", data); // 🔍 Depuración

        if (!Array.isArray(data)) throw new Error("Formato incorrecto");

        // Leer correctamente "año" y "produccion_miel_tn"
        const labels = data.map(item => item.año);
        const valores = data.map(item => item.produccion_miel_tn);

        new Chart(document.getElementById("graficoEvolucionApicola"), {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Producción de Miel (toneladas)",
                    data: valores,
                    borderColor: "rgba(255, 159, 64, 1)",
                    backgroundColor: "rgba(255, 159, 64, 0.2)",
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: "Año" } },
                    y: { title: { display: true, text: "Producción (toneladas)" }, beginAtZero: true }
                }
            }
        });

    } catch (error) {
        console.error("Error en Evolución de la Producción:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarEvolucionApicola);
