document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/serie_temporal_emae.csv")
        .then(response => response.text())
        .then(csvText => {
            let rows = csvText.split("\n").map(row => row.split(","));
            let labels = [], data = [];

            // Extraer datos (suponiendo formato: Fecha, EMAE)
            rows.slice(1).forEach(row => {
                if (row.length >= 2) {
                    labels.push(row[0].trim());  // Fecha
                    data.push(parseFloat(row[1])); // EMAE
                }
            });

            // Crear gráfico de líneas con Chart.js
            const ctx = document.getElementById("emaeChart").getContext("2d");
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Índice EMAE",
                        data: data,
                        borderColor: "#00c8ff", // Cyan brillante
                        backgroundColor: "rgba(0, 200, 255, 0.2)", // Fondo semi-transparente
                        borderWidth: 2,
                        pointRadius: 2,
                        pointBackgroundColor: "#3FD0E8", // Azul más claro
                        pointBorderColor: "#ffffff", // Borde blanco para resaltar
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { 
                            ticks: { color: "#ffffff" },
                            grid: { color: "rgba(255, 255, 255, 0.2)" }
                        },
                        y: { 
                            ticks: { color: "#ffffff" },
                            grid: { color: "rgba(255, 255, 255, 0.2)" }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        title: { display: true, text: "Evolución Mensual del EMAE", color: "#ffffff" }
                    }
                }
            });
        })
        .catch(error => console.error("Error al cargar la serie temporal EMAE:", error));
});