document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/variacion_interanual_ipm_2025.csv")
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split("\n").slice(1).map(row => row.split(","));
            const indices = [], variaciones = [];

            rows.forEach(([label, value]) => {
                if (label && value) {
                    indices.push(label.trim());
                    variaciones.push(parseFloat(value));
                }
            });

            const chartDom = document.getElementById("ipmChart");
            const ipmChart = echarts.init(chartDom);

            const option = {
                title: {
                    text: "IPM - 2025 [%]",
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
                        return params.map(p => `${p.name}: ${p.value}%`).join("<br>");
                    }
                },
                grid: {
                    top: 60,
                    left: "8%",
                    right: "4%",
                    bottom: "8%",
                    containLabel: true
                },
                xAxis: {
                    type: "category",
                    data: indices,
                    axisLabel: { color: "#ffffff" },
                    axisLine: { lineStyle: { color: "#ffffff" } },
                    splitLine: { show: false }
                },
                yAxis: {
                    type: "value",
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
                series: [{
                    type: "bar",
                    data: variaciones,
                    itemStyle: {
                        color: function (params) {
                            const colors = ["#00B2FF", "#007ACC", "#4C6EF5"];
                            return colors[params.dataIndex % colors.length];
                        },
                        borderColor: "#ffffff",
                        borderWidth: 1
                    },
                    barWidth: "50%"
                }],
                backgroundColor: "transparent"
            };

            ipmChart.setOption(option);
            registerChart(ipmChart);
            observeChartResize(ipmChart);
        })
        .catch(error => console.error("Error al cargar los datos del IPM:", error));
});