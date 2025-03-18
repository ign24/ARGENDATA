document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/pib_2024.csv")
        .then(response => response.text())
        .then(csvText => {
            let rows = csvText.split("\n").map(row => row.split(","));
            let labels = [], data = [];

            // Extraer datos (suponiendo formato: Año,PIB)
            rows.slice(1).forEach(row => {
                if (row.length >= 2) {
                    labels.push(row[0].trim());  // Año
                    data.push(parseFloat(row[1])); // PIB
                }
            });

            // Crear gráfico de barras verticales con Chart.js
            const ctx = document.getElementById("pibChart").getContext("2d");
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "PIB en Millones de USD",
                        data: data,
                        backgroundColor: "rgba(0, 200, 255, 0.6)", 
                        borderColor: "#00c8ff",
                        borderWidth: 2
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
                        title: { display: true, text: "Evolución del PIB", color: "#ffffff" }
                    }
                }
            });
        })
        .catch(error => console.error("Error al cargar PIB:", error));
});