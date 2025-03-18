document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/variacion_interanual_ipm_2025.csv")
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split("\n").slice(1).map(row => row.split(","));
            const indices = rows.map(row => row[0]);
            const variaciones = rows.map(row => parseFloat(row[1]));

            const ctx = document.getElementById("ipmChart").getContext("2d");
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: indices,
                    datasets: [{
                        label: "Variación Interanual (%)",
                        data: variaciones,
                        backgroundColor: ["#00B2FF", "#007ACC", "#4C6EF5"], // Colores alineados con el dashboard
                        borderColor: "white",
                        borderWidth: 1,
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: "white", callback: value => value + "%" },
                            grid: { color: "rgba(255, 255, 255, 0.2)" }
                        },
                        x: {
                            ticks: { color: "white" },
                            grid: { color: "rgba(255, 255, 255, 0.2)" }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: "IPM - 2025 [%]",
                            color: "white"
                        }
                    }
                }
            });
        })
        .catch(error => console.error("Error al cargar los datos:", error));
});