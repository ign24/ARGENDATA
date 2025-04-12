document.addEventListener("DOMContentLoaded", function () {
    const contenedorDolares = document.getElementById("tarjetas-dolares");

    if (!contenedorDolares) {
        console.error("No se encontró el contenedor 'tarjetas-dolares'");
        return;
    }

    fetchDolares();
});

// 🔹 Función para generar el icono de calendario en formato SVG
function getCalendarIcon() {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
        </svg>
    `;
}

async function fetchDolares() {
    const contenedorDolares = document.getElementById("tarjetas-dolares");
    contenedorDolares.innerHTML = `<p class="text-center text-gray-400">Cargando...</p>`;

    try {
        const response = await fetch('https://dolarapi.com/v1/dolares');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        contenedorDolares.innerHTML = ""; // Limpiar el contenedor antes de agregar datos

        data.forEach((dolar, index) => {
            // Crear tarjeta para cada tipo de dólar
            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta-dolar");

            tarjeta.innerHTML = `
                <div class="flex justify-center items-center">
                    <h3 class="text-sm font-semibold">${dolar.nombre}</h3>
                </div>
                <p class="precio-venta">$ ${dolar.venta.toFixed(2)}</p>
                    <div class="actualizacion flex gap-1 text-xs text-gray-100">
                        ${getCalendarIcon()}
                        <span>${new Date(dolar.fechaActualizacion).toLocaleString()}</span>
                    </div>
            `;

            contenedorDolares.appendChild(tarjeta);

            // 📌 Agregar animación con un pequeño retraso para cada tarjeta
            setTimeout(() => {
                tarjeta.classList.add("aparecer");
            }, index * 150); // 🔥 Cada tarjeta aparece con un pequeño delay
        });

    } catch (error) {
        console.error("Error al obtener los datos:", error);
        contenedorDolares.innerHTML = `<p class="text-center text-red-500">No se pudieron cargar los datos.</p>`;
    }
}
if (!window.activeCharts) window.activeCharts = [];
window.activeCharts.push(miGrafico);
