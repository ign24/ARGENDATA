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
                    sectores.push(cols[0].trim());
                    variaciones.push(parseFloat(cols[1]));
                }
            });

            // Colores condicionales (rojo para negativos, celeste para positivos)
            const barColors = variaciones.map(val =>
                val < 0 ? "#E53935" : "lightgreen"
            );
            

            const chartDom = document.getElementById("graficoCrecimiento");
            const crecimientoChart = echarts.init(chartDom);

            const option = {
                title: {
                    left: "center",
                    textStyle: {
                        color: "#ffffff",
                        fontSize: 18,
                        fontWeight: "bold"
                    },
                    top: 10
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow"
                    },
                    formatter: function (params) {
                        const item = params[0];
                        return `${item.name}: ${item.value}%`;
                    }
                },
                grid: {
                    top: 60,
                    bottom: 40,
                    left: 200,
                    right: 20
                },
                xAxis: {
                    type: "value",
                    axisLabel: {
                        color: "#ffffff"
                    },
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,0.2)"
                        }
                    }
                },
                yAxis: {
                    type: "category",
                    data: sectores,
                    axisLabel: {
                        color: "#ffffff"
                    },
                    axisTick: { show: false }
                },
                series: [{
                    type: "bar",
                    data: variaciones.map((val, i) => ({
                        value: val,
                        itemStyle: { color: barColors[i] }
                    })),
                    barWidth: '70%',
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: "rgba(255, 255, 255, 0.3)",
                            borderColor: "#ffffff",
                            borderWidth: 1
                        }
                    }
                }],
                backgroundColor: "transparent",
                animationDuration: 1200,
                animationEasing: "cubicOut"
            };

            crecimientoChart.setOption(option);
            registerChart(crecimientoChart);
            observeChartResize(crecimientoChart);
        })
        .catch(error => console.error("Error al cargar los datos de sectores:", error));
});
if (!window.activeCharts) window.activeCharts = [];
window.activeCharts.push(miGrafico);
