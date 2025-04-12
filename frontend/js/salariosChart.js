document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/variacion_interanual_salarios_2024.csv")
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split("\n").slice(1).map(row => row.split(","));
            const meses = [];
            const privado = [], publico = [], noRegistrado = [], total = [];

            rows.forEach(row => {
                const [mes, p, pub, noReg, tot] = row.map(val => val?.trim());
                if (mes) {
                    meses.push(mes);
                    privado.push(parseFloat(p) || null);
                    publico.push(parseFloat(pub) || null);
                    noRegistrado.push(parseFloat(noReg) || null);
                    total.push(parseFloat(tot) || null);
                }
            });
            const chartDom = document.getElementById("salariosChart");
            chartDom.style.width = "100%";
            chartDom.style.height = "100%";
            const salariosChart = echarts.init(chartDom);

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
                    formatter: function (params) {
                        return params.map(p => `${p.marker} ${p.seriesName}: ${p.value}%`).join("<br>");
                    }
                },
                legend: {
                    top: 8,
                    textStyle: {
                        color: "#ffffff"
                    }
                },
                grid: {
                    top: 80,
                    left: "8%",
                    right: "4%",
                    bottom: "8%",
                    containLabel: true
                },
                xAxis: {
                    type: "category",
                    data: meses,
                    axisLabel: { color: "#ffffff" },
                    axisLine: { lineStyle: { color: "#ffffff" } },
                    splitLine: { show: false }
                },
                yAxis: {
                    type: "value",
                    min: function (value) {
                        return Math.floor(value.min * 0.8);
                    },
                    max: function (value) {
                        return Math.ceil(value.max * 1.15);
                    },
                    axisLabel: {
                        color: "#ffffff",
                        formatter: "{value} %"
                    },
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,0.2)"
                        }
                    }
                },
                series: [
                    {
                        name: "Privado Registrado",
                        type: "line",
                        data: privado,
                        smooth: true,
                        symbol: "circle",
                        symbolSize: 6,
                        itemStyle: {
                            color: "#00C8FF",
                            borderColor: "#00C8FF"
                        },
                        lineStyle: { color: "#00C8FF", width: 2 }
                    },
                    {
                        name: "Sector Público",
                        type: "line",
                        data: publico,
                        smooth: true,
                        symbol: "circle",
                        symbolSize: 6,
                        itemStyle: {
                            color: "#FF9800",
                            borderColor: "#FF9800"
                        },
                        lineStyle: { color: "#FF9800", width: 2 }
                    },
                    {
                        name: "Privado No Registrado",
                        type: "line",
                        data: noRegistrado,
                        smooth: true,
                        symbol: "circle",
                        symbolSize: 6,
                        itemStyle: {
                            color: "#FF5252",
                            borderColor: "#FF5252"
                        },
                        lineStyle: { color: "#FF5252", width: 2 }
                    },
                    {
                        name: "Total Índice de Salarios",
                        type: "line",
                        data: total,
                        smooth: true,
                        symbol: "circle",
                        symbolSize: 6,
                        itemStyle: {
                            color: "#00FFAB",
                            borderColor: "#00FFAB"
                        },
                        lineStyle: { color: "#00FFAB", width: 2 }
                    }
                ]
                ,
                backgroundColor: "transparent"
            };

            // Asegura render correcto dentro de GridStack
            setTimeout(() => {
                salariosChart.setOption(option);
                salariosChart.resize(); // Forzar ajuste si contenedor fue redimensionado
                registerChart(salariosChart);
                observeChartResize(salariosChart);
            }, 50);
        })
        .catch(error => console.error("Error al cargar los datos de salarios:", error));
});
if (!window.activeCharts) window.activeCharts = [];
window.activeCharts.push(miGrafico);
