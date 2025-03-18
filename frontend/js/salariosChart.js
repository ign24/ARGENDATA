document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/variacion_interanual_salarios_2024.csv")
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split("\n").slice(1).map(row => row.split(","));
            const meses = rows.map(row => row[0]);
            const privado = rows.map(row => parseFloat(row[1]));
            const publico = rows.map(row => parseFloat(row[2]));
            const noRegistrado = rows.map(row => parseFloat(row[3]));
            const total = rows.map(row => parseFloat(row[4]));

            const ctx = document.getElementById("salariosChart").getContext("2d");
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: meses,
                    datasets: [
                        { 
                            label: "Privado Registrado", 
                            data: privado, 
                            borderColor: "#00B2FF", // Celeste vibrante
                            tension: 0.3,
                            fill: false
                        },
                        { 
                            label: "Sector Público", 
                            data: publico, 
                            borderColor: "#007ACC", // Azul medio
                            tension: 0.3,
                            fill: false
                        },
                        { 
                            label: "Privado No Registrado", 
                            data: noRegistrado, 
                            borderColor: "#4C6EF5", // Azul intenso
                            tension: 0.3,
                            fill: false
                        },
                        { 
                            label: "Total Índice de Salarios", 
                            data: total, 
                            borderColor: "#A3AED0", // Gris claro
                            tension: 0.3,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { 
                            beginAtZero: true, 
                            ticks: { 
                                color: "white",
                                callback: function(value) { return value + "%"; } // Mostrar porcentaje
                            },
                            grid: { color: "rgba(255, 255, 255, 0.2)" } 
                        },
                        x: { 
                            ticks: { color: "white" },
                            grid: { color: "rgba(255, 255, 255, 0.2)" } 
                        }
                    },
                    plugins: {
                        legend: { labels: { color: "white" } },
                        title: { 
                            display: true, 
                            text: "Variación Interanual del Índice de Salarios (2024) [%]", 
                            color: "white" 
                        }
                    }
                }
            });
        })
        .catch(error => console.error("Error al cargar los datos:", error));
});
