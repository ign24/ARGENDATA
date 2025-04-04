document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/serie_temporal_emae.csv")
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split("\n").map(row => row.split(","));
            const labels = [], data = [];

            rows.slice(1).forEach(row => {
                if (row.length >= 2) {
                    labels.push(row[0].trim());        // Fecha
                    data.push(parseFloat(row[1]));     // EMAE
                }
            });

            const chartDom = document.getElementById("emaeChart");
            const emaeChart = echarts.init(chartDom);

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
                        const item = params[0];
                        return `${item.name}: ${item.value}`;
                    },
                    axisPointer: {
                        type: "line"
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
                    boundaryGap: false,
                    axisLabel: { color: "#ffffff" },
                    axisLine: { lineStyle: { color: "#ffffff" } },
                    splitLine: { show: false }
                },
                yAxis: {
                    type: "value",
                    axisLabel: { color: "#ffffff" },
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,0.2)"
                        }
                    }
                },
                series: [{
                    name: "EMAE",
                    type: "line",
                    data: data,
                    smooth: true,
                    lineStyle: {
                        color: "#00c8ff",
                        width: 2
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: "rgba(63, 208, 232, 0.4)" },
                            { offset: 1, color: "rgba(3, 81, 122, 0.1)" }
                        ])
                    },
                    symbolSize: 4,
                    itemStyle: {
                        color: "#3FD0E8",
                        borderColor: "#ffffff"
                    }
                }],
                backgroundColor: "transparent"
            };

            emaeChart.setOption(option);
            registerChart(emaeChart);
            observeChartResize(emaeChart);
        })
        .catch(error => console.error("Error al cargar la serie temporal EMAE:", error));
});
