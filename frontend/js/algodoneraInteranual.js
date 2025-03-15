async function cargarVariacionInteranual() {
    try {
        const response = await fetch("../data/variacion_interanual.json");
        const data = await response.json();
        const labels = data.map(item => item.año);
        const valores = data.map(item => item.variacion_anual);

        new Chart(document.getElementById("graficoVariacion"), {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Variación Anual (%)",
                    data: valores,
                    borderColor: "rgba(255, 205, 86, 1)",
                    borderWidth: 2
                }]
            }
        });

    } catch (error) {
        console.error("Error al cargar el gráfico de variación interanual:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarVariacionInteranual);