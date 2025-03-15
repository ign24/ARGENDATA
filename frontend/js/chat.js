const API_URL = "http://127.0.0.1:8000/chat";

document.getElementById("mensaje").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        enviarMensaje();
    }
});

async function enviarMensaje() {
    let mensajeUsuario = document.getElementById("mensaje").value.trim();
    if (mensajeUsuario === "") return;

    agregarMensaje("usuario", mensajeUsuario);
    document.getElementById("mensaje").value = "";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: mensajeUsuario })
        });

        if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const respuestaAI = data.response || "No se recibió respuesta.";

        agregarMensaje("bot", respuestaAI);

    } catch (error) {
        console.error("Error al conectar con el backend:", error);
        agregarMensaje("bot", "Lo siento, hubo un problema al obtener la respuesta.");
    }
}

function agregarMensaje(tipo, mensaje) {
    let chatBody = document.getElementById("chat-box");

    if (!chatBody) {
        console.error("Elemento #chat-box no encontrado");
        return;
    }

    let mensajeHTML = `<div class="${tipo === 'usuario' ? 'user' : 'bot'} p-2 rounded-lg mb-2 bg-${tipo === 'usuario' ? 'blue-500' : 'gray-700'} text-white max-w-xs break-words">
        ${mensaje}
    </div>`;

    chatBody.insertAdjacentHTML("beforeend", mensajeHTML);
    chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll al final
}

function toggleFullScreen() {
    const chatContainer = document.getElementById("chat-container");
    const chatContent = document.getElementById("chat-box");

    if (!chatContainer || !chatContent) {
        console.error("Elementos necesarios no encontrados");
        return;
    }

    chatContainer.classList.toggle("fullscreen");

    if (chatContainer.classList.contains("fullscreen")) {
        chatContent.style.maxHeight = "85vh"; // Se expande en pantalla completa
    } else {
        chatContent.style.maxHeight = "400px"; // Tamaño estándar
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const chatContainer = document.getElementById("chat-container");
    chatContainer.classList.remove("activo"); // Asegura que empieza oculto
});

function toggleChat() {
    const chatContainer = document.getElementById("chat-container");
    const chatButton = document.getElementById("chat-button");

    if (chatContainer.classList.contains("activo")) {
        chatContainer.classList.remove("activo");
        setTimeout(() => {
            chatContainer.style.display = "none";
            chatButton.style.opacity = "1";
            chatButton.style.visibility = "visible";
        }, 300);
    } else {
        chatContainer.style.display = "flex";
        setTimeout(() => {
            chatContainer.classList.add("activo");
            chatButton.style.opacity = "0";
            chatButton.style.visibility = "hidden";
        }, 10);
    }
}

function toggleFullScreenChat() {
    const chatContainer = document.getElementById("chat-container");
    chatContainer.classList.toggle("fullscreen");

    const fullscreenBtn = document.getElementById("fullscreen-chat-btn");
    if (chatContainer.classList.contains("fullscreen")) {
        fullscreenBtn.innerHTML = "_"; // Icono para salir del modo fullscreen
    } else {
        fullscreenBtn.innerHTML = "⛶"; // Icono para entrar en fullscreen
    }
}