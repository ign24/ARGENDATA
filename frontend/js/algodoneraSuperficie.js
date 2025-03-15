async function cargarEvolucionSuperficie() {
    try {
        const response = await fetch("../data/evolucion_superficie.json");
        if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Formato de JSON incorrecto");

        // Usamos "año" en lugar de "anio"
        const labels = data.map(item => item.año);
        const valores = data.map(item => item.hectareas_cosechadas);

        new Chart(document.getElementById("graficoEvolucion"), {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Hectáreas Cosechadas",
                    data: valores,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: "Año" } },
                    y: { title: { display: true, text: "Hectáreas Cosechadas" } }
                }
            }
        });

    } catch (error) {
        console.error("Error en gráfico de evolución de superficie:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarEvolucionSuperficie);
