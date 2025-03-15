document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/deuda_por_moneda.csv")
        .then(response => response.text())
        .then(csvText => {
            const totalDeuda = 465368;  // 📌 Total en millones de USD
            const rows = csvText.split("\n").map(row => row.split(","));
            const labels = [];
            const data = [];

            rows.slice(1).forEach(row => {
                if (row.length >= 2) {
                    const tipo = row[0].trim();
                    const porcentaje = parseFloat(row[1]);
                    const montoEnUSD = (porcentaje / 100) * totalDeuda; // 📌 Convertimos porcentaje a USD

                    labels.push(tipo);  // 📌 Solo el nombre, sin montos
                    data.push(montoEnUSD);
                }
            });

            // 📌 Mostrar el total de la deuda debajo del título
            document.getElementById("totalDeuda").innerText = `Total: ${totalDeuda.toLocaleString()} millones de USD`;

            const ctx = document.getElementById("deudaPorMonedaChart").getContext("2d");

            // 📌 Crear un gradiente más notorio
            const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
            gradient1.addColorStop(0, "#3FD0E8");  // Azul brillante
            gradient1.addColorStop(1, "#03517a");  // Azul oscuro

            const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
            gradient2.addColorStop(0, "#ffb74d");  // Naranja brillante
            gradient2.addColorStop(1, "#ff6f00");  // Naranja oscuro

            const backgroundColors = [gradient1, gradient2];

            // 📌 Crear el gráfico Doughnut con la leyenda abajo y color blanco
            new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: backgroundColors,
                        hoverOffset: 40
                    }]
                },
                options: {
                    radius: "70%",
                    cutout: "65%",  // 📌 Hace que el gráfico sea más delgado y estilizado
                    responsive: true,
                    plugins: {
                        legend: { 
                            display: true, 
                            position: "bottom",  // 📌 Mueve la leyenda debajo del gráfico
                            labels: { 
                                color: "#ffffff", // 📌 Color blanco en la leyenda
                                font: { size: 13 }
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error("Error al cargar la deuda por moneda:", error));
});