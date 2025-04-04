document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/icc_variaciones.csv")
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split("\n").slice(1).map(row => row.split(","));
            const categorias = rows.map(row => row[0].trim());
            const variacionMensual = rows.map(row => parseFloat(row[1]));

            const chartDom = document.getElementById("iccChart");
            const iccChart = echarts.init(chartDom);

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
                    axisPointer: { type: "shadow" },
                    formatter: function (params) {
                        const item = params[0];
                        return `${item.name}: ${item.value}%`;
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
                    data: categorias,
                    axisLabel: { color: "#ffffff" },
                    axisLine: { lineStyle: { color: "#ffffff" } },
                    splitLine: { show: false }
                },
                yAxis: {
                    type: "value",
                    axisLabel: {
                        color: "#ffffff",
                        formatter: "{value}%"
                    },
                    splitLine: {
                        lineStyle: {
                            color: "rgba(255,255,255,0.2)"
                        }
                    }
                },
                series: [{
                    name: "Variación Mensual",
                    type: "bar",
                    data: variacionMensual,
                    barWidth: "50%",
                    itemStyle: {
                        color: "#00c8ff"
                    }
                }],
                backgroundColor: "transparent",
                animationDuration: 1000,
                animationEasing: "cubicOut"
            };

            iccChart.setOption(option);
            registerChart(iccChart);
            observeChartResize(iccChart);
        })
        .catch(error => console.error("Error al cargar los datos del ICC:", error));
});