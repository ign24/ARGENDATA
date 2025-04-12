document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/deuda_por_moneda.csv")
        .then(response => response.text())
        .then(csvText => {
            const totalDeuda = 465368;
            const rows = csvText.split("\n").map(row => row.split(","));
            const data = [];

            // Gradientes simulados
            const gradientAzul = {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: '#3FD0E8' },
                    { offset: 1, color: '#03517a' }
                ]
            };

            const gradientAmarillo = {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: '#ffb74d' },
                    { offset: 1, color: '#ff6f00' }
                ]
            };

            rows.slice(1).forEach((row, i) => {
                if (row.length >= 2) {
                    const tipo = row[0].trim();
                    const porcentaje = parseFloat(row[1]);
                    const montoUSD = (porcentaje / 100) * totalDeuda;

                    data.push({
                        name: tipo,
                        value: montoUSD,
                        itemStyle: {
                            color: i % 2 === 0 ? gradientAzul : gradientAmarillo
                        }
                    });
                }
            });

            document.getElementById("totalDeuda").innerText = `Total: ${totalDeuda.toLocaleString()} millones de USD`;

            const chartDom = document.getElementById('deudaPorMonedaChart');
            const deudaChart = echarts.init(chartDom);

            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c} M USD ({d}%)',
                    appendToBody: true,
                    confine: false
                },
                legend: {
                    bottom: 5,
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 10
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['50%', '70%'],
                        center: ['50%', '50%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 7,
                            borderColor: '#111',
                            borderWidth: 0.6
                        },
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },
                        data: data
                    }
                ],

                backgroundColor: 'transparent'
            };
            deudaChart.setOption(option);
            registerChart(deudaChart);
            observeChartResize(deudaChart);
        })
        .catch(error => console.error("Error al cargar la deuda por moneda:", error));
});
if (!window.activeCharts) window.activeCharts = [];
window.activeCharts.push(miGrafico);
