// 📌 Verifica que el contenedor del mapa existe antes de inicializarlo
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("mapa-clima")) {
        iniciarMapa();
        cargarClima();
    } else {
        console.error("❌ No se encontró el contenedor #mapa-clima");
    }
});

// 📌 Iniciar el mapa en Argentina
let map;

function iniciarMapa() {
    map = L.map("mapa-clima").setView([-38.4161, -63.6167], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    console.log("✅ Mapa inicializado correctamente.");
}

// 📌 Lista de capitales de provincia en Argentina
const provincias = [
    { nombre: "Buenos Aires", ciudad: "La Plata" },
    { nombre: "Córdoba", ciudad: "Cordoba" },
    { nombre: "Mendoza", ciudad: "Mendoza" }
    // Agrega más provincias aquí
];

// 📌 Mostrar mensaje de carga mientras se obtienen los datos
const loadingMessage = L.control({ position: "topright" });

loadingMessage.onAdd = function () {
    this.div = L.DomUtil.create("div", "loading-message");
    this.div.innerHTML = "⏳ Cargando clima...";
    return this.div;
};

// 📌 Función para obtener datos climáticos
async function obtenerClima(provincia, index) {
    setTimeout(async () => {
        try {
            const ciudad = (provincia.nombre === "Buenos Aires") ? "-34.9214,-57.9545" : encodeURIComponent(provincia.ciudad);
            const url = `http://localhost:3000/api/clima?q=${ciudad}`;

            console.log(`🔍 Consultando clima para: ${provincia.nombre} - ${provincia.ciudad}`);

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error en la API: ${response.status}`);

            const data = await response.json();
            if (!data.current || !data.location) throw new Error(`Datos de clima no disponibles para ${provincia.nombre}`);

            const { temp_c, humidity, condition } = data.current;
            const { lat, lon } = data.location;

            if (!lat || !lon) throw new Error(`Coordenadas no disponibles para ${provincia.nombre}`);

            // 📌 Crear marcador con popup de clima
            L.marker([lat, lon])
                .addTo(map)
                .bindPopup(`
                    <b>${provincia.nombre} - ${provincia.ciudad}</b><br>
                    🌡️ Temp: ${temp_c}°C<br>
                    💧 Humedad: ${humidity}%<br>
                    ☁️ Clima: ${condition.text}
                `);

            console.log(`✅ Clima obtenido para ${provincia.nombre}`);

            // 📌 Elimina el mensaje de carga cuando se obtienen todos los datos
            if (index === provincias.length - 1) {
                map.removeControl(loadingMessage);
            }

        } catch (error) {
            console.error(`⚠️ Error al obtener clima de ${provincia.nombre}:`, error);
        }
    }, index * 3000);
}

// 📌 Cargar datos de clima con un delay controlado
function cargarClima() {
    map.addControl(loadingMessage);
    provincias.forEach((provincia, index) => obtenerClima(provincia, index));
}

// 📌 Recargar datos cada 30 minutos
setInterval(cargarClima, 1800000);