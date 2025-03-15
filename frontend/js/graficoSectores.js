document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/crecimiento_sectores.csv")
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split("\n").slice(1);
            let sectores = [];
            let variaciones = [];

            rows.forEach(row => {
                const cols = row.split(",");
                if (cols.length === 2) {
                    sectores.push(cols[0]);
                    variaciones.push(parseFloat(cols[1]));
                }
            });

            // Colores modernos basados en la paleta de la página, con valores negativos en rojo
            const colors = variaciones.map(val => val < 0 ? "#ff4d4d" : "#00c8ff");

            // Configuración del canvas para evitar pixelado
            const canvas = document.getElementById("graficoCrecimiento");
            const ctx = canvas.getContext("2d");

            // Ajustar el tamaño del canvas para evitar pixelado
            const dpi = window.devicePixelRatio || 1;
            canvas.width = canvas.clientWidth * dpi;
            canvas.height = canvas.clientHeight * dpi;
            ctx.scale(dpi, dpi);

            // Configuración del gráfico con diseño más refinado
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: sectores,
                    datasets: [{
                        label: "Variación Interanual (%)",
                        data: variaciones,
                        backgroundColor: colors,
                        barThickness: 7,
                        borderWidth: 1.5,
                        borderColor: colors,
                        hoverBackgroundColor: colors.map(val => val === "#ff4d4d" ? "#ff6666" : "#3FD0E8"),
                        barPercentage: 0.8,
                        categoryPercentage: 0.7,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: "y",
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: "Crecimiento de Sectores Económicos",
                            color: "#ffffff",
                            font: {
                                size: 18,
                                weight: "bold"
                            },
                            padding: 20
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: "#ffffff", font: { size: 12 } },
                            grid: { color: "rgba(255, 255, 255, 0.2)" }
                        },
                        y: {
                            ticks: { color: "#ffffff", font: { size: 12 }, padding: 8 },
                            grid: { color: "rgba(255, 255, 255, 0.1)" }
                        }
                    },
                    animation: {
                        duration: 1200,
                        easing: "easeOutCubic"
                    }
                }
            });
        })
        .catch(error => console.error("Error al cargar los datos de sectores:", error));
});