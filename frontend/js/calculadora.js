// 📌 Función para activar pestañas
document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab-button");
    const contents = document.querySelectorAll(".tab-content");

    function activateTab(tabId) {
        contents.forEach(content => {
            content.classList.remove("active");
            if (content.id === tabId) content.classList.add("active");
        });

        tabs.forEach(tab => {
            tab.classList.remove("active");
            if (tab.dataset.tab === tabId) tab.classList.add("active");
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            activateTab(this.dataset.tab);
        });
    });

    // Activa la primera pestaña por defecto
    activateTab(tabs[0].dataset.tab);
});

// 📌 Función de manejo de errores
function mostrarError(id) {
    document.getElementById(id).innerText = "Error en los datos ingresados.";
}

// 📉 Regresión Lineal
function calcularRegresion() {
    let xValores = document.getElementById("x-values").value.split(",").map(Number);
    let yValores = document.getElementById("y-values").value.split(",").map(Number);
    let predictX = parseFloat(document.getElementById("predict-x").value);

    if (xValores.length !== yValores.length || xValores.length === 0 || isNaN(predictX)) {
        return mostrarError("resultadoRegresion");
    }

    let n = xValores.length;
    let sumX = xValores.reduce((a, b) => a + b, 0);
    let sumY = yValores.reduce((a, b) => a + b, 0);
    let sumXY = xValores.map((x, i) => x * yValores[i]).reduce((a, b) => a + b, 0);
    let sumX2 = xValores.map(x => x ** 2).reduce((a, b) => a + b, 0);

    let b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
    let a = (sumY - b * sumX) / n;
    let predictY = a + b * predictX;

    document.getElementById("resultadoRegresion").innerText = `Predicción: ${predictY.toFixed(2)}`;
}

// 📌 Media
function calcularMedia() {
    let valores = document.getElementById("valores-media").value.split(",").map(Number);
    if (valores.some(isNaN)) return mostrarError("resultadoMedia");

    let media = valores.reduce((a, b) => a + b, 0) / valores.length;
    document.getElementById("resultadoMedia").innerText = `Media: ${media.toFixed(2)}`;
}

// 📌 Mediana
function calcularMediana() {
    let valores = document.getElementById("valores-mediana").value.split(",").map(Number);
    if (valores.some(isNaN)) return mostrarError("resultadoMediana");

    valores.sort((a, b) => a - b);
    let mitad = Math.floor(valores.length / 2);
    let mediana = valores.length % 2 === 0 ? (valores[mitad - 1] + valores[mitad]) / 2 : valores[mitad];

    document.getElementById("resultadoMediana").innerText = `Mediana: ${mediana}`;
}

// 📌 Moda
function calcularModa() {
    let valores = document.getElementById("valores-moda").value.split(",").map(Number);
    if (valores.some(isNaN)) return mostrarError("resultadoModa");

    let frecuencia = {};
    valores.forEach(num => frecuencia[num] = (frecuencia[num] || 0) + 1);
    let maxFrecuencia = Math.max(...Object.values(frecuencia));
    let moda = Object.keys(frecuencia).filter(num => frecuencia[num] == maxFrecuencia);

    document.getElementById("resultadoModa").innerText = `Moda: ${moda.join(", ")}`;
}

// 📌 Desviación Estándar
function calcularDesviacionPoblacion() {
    let valores = document.getElementById("valores-desviacion-poblacion").value.split(",").map(Number);
    if (valores.some(isNaN)) return mostrarError("resultadoDesviacionPoblacion");

    let media = valores.reduce((a, b) => a + b, 0) / valores.length;
    let sumatoria = valores.reduce((acc, val) => acc + (val - media) ** 2, 0);
    let desviacion = Math.sqrt(sumatoria / valores.length);

    document.getElementById("resultadoDesviacionPoblacion").innerText = `Desviación Estándar: ${desviacion.toFixed(2)}`;
}

// 📌 Correlación
function calcularCorrelacion() {
    let xValores = document.getElementById("valores-x-correlacion").value.split(",").map(Number);
    let yValores = document.getElementById("valores-y-correlacion").value.split(",").map(Number);

    if (xValores.length !== yValores.length || xValores.some(isNaN) || yValores.some(isNaN)) {
        return mostrarError("resultadoCorrelacion");
    }

    let mediaX = xValores.reduce((a, b) => a + b, 0) / xValores.length;
    let mediaY = yValores.reduce((a, b) => a + b, 0) / yValores.length;

    let numerador = xValores.reduce((acc, x, i) => acc + (x - mediaX) * (yValores[i] - mediaY), 0);
    let denominadorX = Math.sqrt(xValores.reduce((acc, x) => acc + (x - mediaX) ** 2, 0));
    let denominadorY = Math.sqrt(yValores.reduce((acc, y) => acc + (y - mediaY) ** 2, 0));

    let correlacion = numerador / (denominadorX * denominadorY);
    document.getElementById("resultadoCorrelacion").innerText = `Correlación: ${correlacion.toFixed(4)}`;
}

// 📈 Índice de Variación Interanual
function calcularVariacionInteranual() {
    let valores = document.getElementById("valores-interanual").value.split(",").map(Number);
    if (valores.length < 2 || valores.some(isNaN)) return mostrarError("resultadoVariacion");

    let variaciones = valores.slice(1).map((val, i) => ((val - valores[i]) / valores[i]) * 100);
    document.getElementById("resultadoVariacion").innerText = `Variaciones: ${variaciones.join("%, ")}%`;
}

// 📊 Tasa de Crecimiento
function calcularCrecimiento() {
    let pasado = parseFloat(document.getElementById("valor-pasado").value);
    let actual = parseFloat(document.getElementById("valor-actual").value);
    if (isNaN(pasado) || isNaN(actual)) return mostrarError("resultadoCrecimiento");

    let tasa = ((actual - pasado) / pasado) * 100;
    document.getElementById("resultadoCrecimiento").innerText = `Crecimiento: ${tasa.toFixed(2)}%`;
}