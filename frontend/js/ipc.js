document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/ipc.csv")
        .then(response => response.text())
        .then(csvText => {
            // Detectar si el CSV usa comillas para nombres con comas
            const rows = csvText.split("\n").map(row => {
                const matches = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g); 
                return matches ? matches.map(cell => cell.replace(/"/g, "").trim()) : [];
            });

            let sectores = [];
            let ipcGeneral = 0;

            rows.forEach((row, index) => {
                if (index === 0 || row.length < 2) return; // Saltar cabecera y filas incompletas

                const nombre = row[0].trim(); // Nombre del sector
                const valor = parseFloat(row[1]); // Valor del IPC

                if (nombre === "Nivel general") {
                    ipcGeneral = valor;
                } else {
                    if (!isNaN(valor)) { // Asegurar que el valor es numérico
                        sectores.push({ nombre, valor });
                    }
                }
            });

            // Insertar IPC General en la tarjeta
            document.getElementById("ipc-general").innerText = `IPC General: ${ipcGeneral}%`;

            // Crear el gráfico con Chart.js
            const ctx = document.getElementById("ipcChart").getContext("2d");
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: sectores.map(s => s.nombre),
                    datasets: [{
                        label: "Variación IPC (%)",
                        data: sectores.map(s => s.valor),
                        backgroundColor: sectores.map(s => s.valor < 0 ? "lightgreen" : "skyblue"),
                        barThickness: 7
                    }]
                },
                options: {
                    indexAxis: "y",
                    responsive: true,
                    scales: {
                        x: {
                            ticks: {
                                color: "#ffffff"
                            },
                            grid: {
                                color: "rgba(255, 255, 255, 0.2)"
                            }
                        },
                        y: {
                            ticks: {
                                color: "#ffffff",
                                padding: 40
                            },
                            grid: {
                                color: "rgba(255, 255, 255, 0.2)"
                            }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        title: { 
                            display: true, 
                            text: "IPC por Sector", 
                            color: "#ffffff"
                        }
                    }
                }
            });
        })
        .catch(error => console.error("Error al cargar el IPC:", error));
});