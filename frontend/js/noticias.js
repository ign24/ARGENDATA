const API_LOCAL = "http://127.0.0.1:8000/noticias";
const contenedorNoticias = document.getElementById("lista-noticias");

let noticiasHoy = [];
let indiceActual = 0;
let intervaloRotacion = null;

async function cargarNoticias() {
    try {
        const response = await fetch(API_LOCAL);
        const data = await response.json();
        noticiasHoy = data.noticias || [];

        if (noticiasHoy.length === 0) {
            mostrarMensaje("No hay noticias del día.");
        } else {
            mostrarNoticia(noticiasHoy[indiceActual]);
            iniciarRotacion();
        }
    } catch (error) {
        console.error("❌ Error al cargar noticias:", error);
        mostrarMensaje("Error al cargar noticias.");
    }
}

function mostrarMensaje(texto) {
    contenedorNoticias.innerHTML = `<li class="noticia-item">${texto}</li>`;
}

function mostrarNoticia(noticia) {
    const { title, url } = noticia;

    contenedorNoticias.innerHTML = `
        <li class="noticia-item">
            <strong>${title}</strong>
            <br/>
            <button onclick="window.open('${url}', '_blank')" class="btn-ver-mas">
                Ver más
            </button>
        </li>
    `;
}

function iniciarRotacion() {
    if (intervaloRotacion) clearInterval(intervaloRotacion);

    intervaloRotacion = setInterval(() => {
        indiceActual = (indiceActual + 1) % noticiasHoy.length;
        mostrarNoticia(noticiasHoy[indiceActual]);
    }, 15000);
}

function agregarEstiloBoton() {
    const style = document.createElement("style");
    style.textContent = `
        .btn-ver-mas {
            margin-top: 8px;
            background: rgba(255, 255, 255, 0.15);
            color: #00c8ff;
            border: none;
            padding: 6px 10px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: background 0.3s;
        }
        .btn-ver-mas:hover {
            background: rgba(255, 255, 255, 0.3);
            color: #ffffff;
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", () => {
    agregarEstiloBoton();
    cargarNoticias();
});