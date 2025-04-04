// 👉 Almacenar todos los charts registrados
window.activeCharts = [];

/**
 * Registra una instancia de Chart (Chart.js o ECharts) para ser redimensionada automáticamente
 * @param {any} chart - instancia del gráfico
 */
function registerChart(chart) {
  window.activeCharts.push(chart);
}

/**
 * Redimensiona todos los charts registrados (Chart.js o ECharts)
 */
function resizeAllCharts() {
  setTimeout(() => {
    window.activeCharts.forEach(chart => {
      if (!chart) return;

      // Chart.js
      if (chart.canvas) {
        const canvas = chart.canvas;
        const container = canvas.parentNode;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        chart.resize();
        chart.update?.('none');
      }

      // ECharts
      if (chart.resize) {
        chart.resize();
      }
    });
  }, 50);
}

/**
 * Observa redimensionamiento del contenedor de un gráfico y ajusta su tamaño
 */
function observeChartResize(chart) {
  const container = chart.canvas?.parentNode || chart.getDom();

  const resizeObserver = new ResizeObserver(() => {
    if (chart.canvas) {
      const canvas = chart.canvas;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      chart.resize();
      chart.update?.('none');
    } else if (chart.resize) {
      chart.resize();
    }
  });

  resizeObserver.observe(container);
}

// 👉 Inicialización de GridStack con mejoras visuales
document.addEventListener("DOMContentLoaded", () => {
  const grid = GridStack.init({
    cellHeight: 150,
    margin: 3,
    marginUnit: 'px',
    float: false,
    column: 42,
    animate: true,
    disableOneColumnMode: false,
    resizable: {
      handles: 'e,se,s,sw,w,n',
    },
    draggable: {
      handle: '.grid-stack-item-content',
    }

  });

  console.log("✅ GridStack inicializado con estilo y resize");

  // 🔁 Compactar y redimensionar gráficos al cambiar tamaño
  grid.on('resizestart', (event, el) => {
    el.classList.add("resizing");
  });

  grid.on('resizestop', (event, el) => {
    el.classList.remove("resizing");
    grid.compact();
    resizeAllCharts();
  });

  grid.on('dragstop', () => {
    grid.compact();
  });

});
