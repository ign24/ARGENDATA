async function cargarComparacionDepartamentos() {
    try {
        const response = await fetch("../data/comparacion_departamentos.json");
        if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");

        const data = await response.json();
        if (!data || data.length === 0) throw new Error("Los datos están vacíos o mal formateados");

        const labels = data.map(item => item.departamento);
        const valores = data.map(item => item.hectareas_cosechadas);

        new Chart(document.getElementById("graficoDepartamentos"), {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "Hectáreas Cosechadas",
                    data: valores,
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                    barThickness: 4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: "Departamento" },
                        ticks: {
                            font: { size: 10 },
                            autoSkip: false, // No omitir etiquetas
                            maxRotation: 90, // Rotar etiquetas 90 grados
                            minRotation: 90
                        }        
                        
                    },
                    y: {
                        title: { display: true, text: "Hectáreas Cosechadas" },
                        beginAtZero: true
                    }
                }
            }
        });

    } catch (error) {
        console.error("Error en gráfico de comparación por departamento:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarComparacionDepartamentos);
