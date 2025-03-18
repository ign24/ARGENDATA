document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/icc_variaciones.csv")
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split("\n").slice(1).map(row => row.split(","));
            const categorias = rows.map(row => row[0]);
            const variacionMensual = rows.map(row => parseFloat(row[1]));

            const ctx = document.getElementById("iccChart").getContext("2d");
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: categorias,
                    datasets: [{
                        label: "Variación Mensual (%)",
                        data: variacionMensual,
                        backgroundColor: "rgba(0, 200, 255, 0.6)", 
                        borderColor: "#00c8ff",
                        borderWidth: 2,
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: "white" },
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
                            text: "Variación Mensual de Costos (%)",
                            color: "white"
                        }
                    }
                }
            });
        })
        .catch(error => console.error("Error al cargar los datos:", error));
});