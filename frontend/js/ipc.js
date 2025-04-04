document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/ipc.csv")
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split("\n").map(row => {
                const matches = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
                return matches ? matches.map(cell => cell.replace(/"/g, "").trim()) : [];
            });

            let sectores = [];
            let ipcGeneral = 0;

            rows.forEach((row, index) => {
                if (index === 0 || row.length < 2) return;

                const nombre = row[0].trim();
                const valor = parseFloat(row[1]);

                if (nombre === "Nivel general") {
                    ipcGeneral = valor;
                } else if (!isNaN(valor)) {
                    sectores.push({ name: nombre, value: valor });
                }
            });

            document.getElementById("ipc-general").innerText = `IPC General: ${ipcGeneral}%`;

            // 📊 Crear gráfico ECharts
            const chartDom = document.getElementById('ipcChart');
            const ipcChart = echarts.init(chartDom);

            const option = {
                title: {
                    text: 'IPC por Sector',
                    left: 'center',
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 16
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c}%',
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '5%',
                    top: 60,
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    axisLabel: {
                        color: '#ffffff'
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255,255,255,0.2)'
                        }
                    }
                },
                yAxis: {
                    type: 'category',
                    data: sectores.map(s => s.name),
                    axisLabel: {
                        color: '#ffffff'
                    }
                },
                series: [{
                    type: 'bar',
                    data: sectores.map(s => ({
                        name: s.name,
                        value: s.value,
                        itemStyle: {
                            color: s.value < 0 ? 'lightgreen' : 'skyblue'
                        }
                    })),
                    barWidth: 14
                }],
                backgroundColor: 'transparent'
            };

            ipcChart.setOption(option);

            // ✅ Registrar para resize
            registerChart(ipcChart);

            // 🔁 Usar ResizeObserver para adaptarse a GridStack
            observeChartResize(ipcChart);
        })
        .catch(error => console.error("Error al cargar el IPC:", error));
});