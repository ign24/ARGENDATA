document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/pib_2024.csv")
        .then(response => response.text())
        .then(csvText => {
            let rows = csvText.split("\n").map(row => row.split(","));
            let labels = [], data = [];

            rows.slice(1).forEach(row => {
                if (row.length >= 2) {
                    labels.push(row[0].trim());  // Año
                    data.push(parseFloat(row[1])); // PIB
                }
            });

            const chartDom = document.getElementById("pibChart");
            const pibChart = echarts.init(chartDom);

            const option = {
                title: {
                    left: "center",
                    textStyle: {
                        color: "#ffffff",
                        fontSize: 16
                    }
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "shadow"
                    },
                    formatter: function (params) {
                        const item = params[0];
                        return `${item.name}: ${item.value.toLocaleString()} M USD`;
                    }
                },
                grid: {
                    left: "8%",
                    right: "4%",
                    bottom: "8%",
                    top: 60,
                    containLabel: true
                },
                xAxis: {
                    type: "category",
                    data: labels,
                    axisLabel: { color: "#ffffff" },
                    axisLine: { lineStyle: { color: "#ffffff" } },
                    splitLine: { show: false }
                },
                yAxis: {
                    type: "value",
                    axisLabel: {
                        formatter: "{value}",
                        color: "#ffffff"
                    },
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,0.2)"
                        }
                    }
                },
                series: [{
                    data: data,
                    type: "bar",
                    barWidth: "70%",
                    itemStyle: {
                        color: {
                            type: "linear",
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: "#3FD0E8" },
                                { offset: 1, color: "#03517a" }
                            ]
                        }
                    }
                }],
                backgroundColor: "transparent"
            };

            pibChart.setOption(option);

            // Integración con GridStack
            registerChart(pibChart);
            observeChartResize(pibChart);
        })
        .catch(error => console.error("Error al cargar PIB:", error));
});
if (!window.activeCharts) window.activeCharts = [];
window.activeCharts.push(miGrafico);
