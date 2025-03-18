document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 commodities.js cargado correctamente");

    // 📌 Crear y agregar la tarjeta de commodities
    const container = createContainer();
    document.body.appendChild(container);

    console.log("✅ Tarjeta de commodities insertada en el DOM");

    // 📌 Crear la tabla y agregarla al contenedor
    const table = createTable();
    container.appendChild(table);

    // 📌 Lista de 10 commodities compactos
    const commoditiesList = [
        { name: "Petróleo", price: 85.32, change: 1.25, trend: [83, 84, 85, 86, 85.3] },
        { name: "Gas", price: 3.21, change: -0.89, trend: [3.5, 3.4, 3.3, 3.2, 3.21] },
        { name: "Oro", price: 2045.50, change: 0.75, trend: [2020, 2030, 2040, 2050, 2045.5] },
        { name: "Plata", price: 25.12, change: -0.45, trend: [26, 25.5, 25, 24.8, 25.12] },
        { name: "Cobre", price: 4.29, change: 0.88, trend: [4.1, 4.2, 4.3, 4.4, 4.29] },
        { name: "Litio", price: 35400, change: -1.12, trend: [36000, 35800, 35700, 35500, 35400] },
        { name: "Soja", price: 14.75, change: 0.54, trend: [14.2, 14.3, 14.5, 14.6, 14.75] },
        { name: "Trigo", price: 6.30, change: -0.25, trend: [6.8, 6.6, 6.5, 6.4, 6.3] },
        { name: "Maíz", price: 5.80, change: 0.65, trend: [5.5, 5.6, 5.7, 5.8, 5.8] },
        { name: "Hierro", price: 115.50, change: -0.78, trend: [118, 117, 116, 115, 115.5] }
    ];

    // 📌 Generar las filas de la tabla con los datos
    generateTableRows(commoditiesList);
});

/**
 * 📌 Crea el contenedor principal de la tarjeta
 */
function createContainer() {
    const container = document.createElement("div");
    container.id = "commodities-container";
    container.classList.add("commodities-card");

    // 📌 Título estilizado
    const title = document.createElement("h3");
    title.innerText = "Commodities";
    container.appendChild(title);

    return container;
}

/**
 * 📌 Crea la estructura de la tabla de commodities
 */
function createTable() {
    const table = document.createElement("table");
    table.classList.add("commodities-table");

    // 📌 Crear encabezado de la tabla
    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th>🛢️</th>
            <th>💲</th>
            <th>📊</th>
            <th>📈</th>
        </tr>
    `;
    table.appendChild(thead);

    // 📌 Crear el cuerpo de la tabla
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    return table;
}

/**
 * 📌 Genera dinámicamente las filas de la tabla con los datos de commodities
 */
function generateTableRows(commodities) {
    const tbody = document.querySelector(".commodities-table tbody");

    commodities.forEach((commodity, index) => {
        const row = document.createElement("tr");

        // 📌 Crear celdas de datos
        const nameCell = document.createElement("td");
        nameCell.innerText = commodity.name;

        const priceCell = document.createElement("td");
        priceCell.innerText = commodity.price.toFixed(2);

        const changeCell = document.createElement("td");
        changeCell.innerText = `${commodity.change.toFixed(2)}%`;
        changeCell.classList.add(commodity.change >= 0 ? "positive" : "negative");

        // 📌 Crear la celda del gráfico y agregar un `canvas`
        const chartCell = document.createElement("td");
        const canvas = document.createElement("canvas");
        canvas.id = `chart-${index}`;
        chartCell.appendChild(canvas);

        // 📌 Agregar todas las celdas a la fila
        row.appendChild(nameCell);
        row.appendChild(priceCell);
        row.appendChild(changeCell);
        row.appendChild(chartCell);

        // 📌 Agregar la fila al cuerpo de la tabla
        tbody.appendChild(row);

        setTimeout(() => drawChart(canvas.id, commodity.trend), 200);
    });
}
/**
 * 📌 Genera un gráfico de tendencia optimizado para un tamaño pequeño (50x20px).
 * @param {string} id - ID del canvas donde se dibujará el gráfico.
 * @param {Array} trend - Array con los valores históricos del commodity.
 */
function generateSmallChart(id, trend) {
    setTimeout(() => {
        const ctx = document.getElementById(id);
        if (!ctx) {
            console.error(`❌ No se encontró el canvas con ID: ${id}`);
            return;
        }

        new Chart(ctx, {
            type: "line",
            data: {
                labels: ["", "", "", "", ""], // Eliminamos etiquetas para ahorrar espacio
                datasets: [{
                    data: trend,
                    borderColor: "#ffffff",  // Color blanco para que sea visible
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    fill: false,
                    tension: 0.3,
                    pointRadius: 0,  // Ocultar puntos para hacer la línea más limpia
                    borderWidth: 0.8  // Línea muy delgada para no saturar la tabla
                }]
            },
            options: { 
                responsive: false, 
                maintainAspectRatio: false,
                elements: {
                    line: { borderWidth: 0.8 }
                },
                scales: { 
                    x: { display: false }, 
                    y: { display: false }
                },
                plugins: { legend: { display: false } }
            }
        });

        console.log(`📊 Gráfico generado correctamente en: ${id}`);
    }, 250);  // Delay optimizado para que cargue de forma fluida
}
setInterval(() => {
    let card = document.querySelector(".commodities-card");

    if (card) {
        card.style.setProperty("--animation-trigger", "none");
        void card.offsetWidth; 
        card.style.setProperty("--animation-trigger", "metallicLoop 2.5s ease-in-out forwards");
    }
}, 15000);
