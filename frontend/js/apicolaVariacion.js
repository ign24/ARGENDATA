async function cargarVariacionApicola() {
    try {
        const response = await fetch("../data/apicola_variacion.json");
        if (!response.ok) throw new Error("No se pudo cargar el JSON");

        const data = await response.json();
        console.log("Datos recibidos:", data); // 🔍 Depuración

        if (!Array.isArray(data)) throw new Error("Formato incorrecto");

        // Leer correctamente "año" y "variacion_anual"
        const labels = data.map(item => item.año);
        const valores = data.map(item => item.variacion_anual);

        new Chart(document.getElementById("graficoVariacionApicola"), {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Variación Interanual (%)",
                    data: valores,
                    borderColor: "rgba(54, 162, 235, 1)",
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: "Año" } },
                    y: { title: { display: true, text: "Variación (%)" }, beginAtZero: true }
                }
            }
        });

    } catch (error) {
        console.error("Error en Variación Interanual:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarVariacionApicola);
