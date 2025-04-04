const API_URL = "http://127.0.0.1:8000/chat";

// Evento para enviar el mensaje con "Enter"
document.getElementById("mensaje").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        enviarMensaje();
    }
});

// Función para enviar el mensaje al backend
async function enviarMensaje() {
    let mensajeUsuario = document.getElementById("mensaje").value.trim();
    if (!mensajeUsuario) return;

    agregarMensaje("usuario", mensajeUsuario);
    document.getElementById("mensaje").value = "";

    // 🔵 Mostrar animación "bot escribiendo..."
    const chatBody = document.getElementById("chat-box");
    const typingDiv = document.createElement("div");
    typingDiv.className = "chat-message-container";
    typingDiv.id = "typing-indicator";
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    `;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: mensajeUsuario })
        });

        if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
        }

        const mensajeIA = await response.text();

        // 🟡 Remover animación typing
        document.getElementById("typing-indicator")?.remove();

        // 🟢 Mostrar mensaje con efecto typing
        agregarMensaje("bot", mensajeIA || "No se recibió respuesta.");
    } catch (error) {
        console.error("Error al conectar con el backend:", error);
        document.getElementById("typing-indicator")?.remove();
        agregarMensaje("bot", "Lo siento, hubo un problema al obtener la respuesta.");
    }
}


function agregarMensaje(tipo, mensaje) {
    const chatBody = document.getElementById("chat-box");
    if (!chatBody) {
        console.error("Elemento #chat-box no encontrado");
        return;
    }

    const containerDiv = document.createElement("div");
    containerDiv.className = "chat-message-container";

    const mensajeDiv = document.createElement("div");
    mensajeDiv.className = tipo === "usuario" ? "user" : "bot";
    containerDiv.appendChild(mensajeDiv);
    chatBody.appendChild(containerDiv);

    if (tipo === "bot") {
        // ✅ Convertir Markdown a HTML
        const htmlCompleto = marked.parse(mensaje);

        // ✅ Animación tipo máquina de escribir (HTML-safe)
        let index = 0;
        let tempSpan = document.createElement("span");
        mensajeDiv.appendChild(tempSpan);

        function escribirHTML() {
            if (index < htmlCompleto.length) {
                tempSpan.innerHTML += htmlCompleto.charAt(index);
                index++;
                setTimeout(escribirHTML, 10); // velocidad de escritura
            } else {
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        }

        escribirHTML();
    } else {
        // Usuario sin formato
        mensajeDiv.textContent = mensaje;
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}

// Alternar pantalla completa del chat
function toggleFullScreen() {
    const chatContainer = document.getElementById("chat-container");
    const chatContent = document.getElementById("chat-box");

    if (!chatContainer || !chatContent) {
        console.error("Elementos necesarios no encontrados");
        return;
    }

    chatContainer.classList.toggle("fullscreen");
    chatContent.style.maxHeight = chatContainer.classList.contains("fullscreen") ? "85vh" : "400px";
}

// Ocultar el chat al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("chat-container")?.classList.remove("activo");
});

// Alternar la visibilidad del chat
function toggleChat() {
    const chatContainer = document.getElementById("chat-container");
    const chatButton = document.getElementById("chat-button");

    if (!chatContainer || !chatButton) {
        console.error("Elementos del chat no encontrados");
        return;
    }

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

// Alternar modo pantalla completa en el chat
function toggleFullScreenChat() {
    const chatContainer = document.getElementById("chat-container");
    const fullscreenBtn = document.getElementById("fullscreen-chat-btn");

    if (!chatContainer || !fullscreenBtn) {
        console.error("Elementos del chat no encontrados");
        return;
    }

    chatContainer.classList.toggle("fullscreen");
    fullscreenBtn.innerHTML = chatContainer.classList.contains("fullscreen") ? "_" : "⛶";
}

// Función para iniciar la notificación del chatbot
function iniciarNotificacionChat() {
    function checkChatButton() {
        const chatButton = document.getElementById("chat-button");

        if (!chatButton) {
            setTimeout(checkChatButton, 500);
            return;
        }

        function obtenerFraseAleatoria() {
            let nuevaFrase;
            do {
                nuevaFrase = frasesChatbot[Math.floor(Math.random() * frasesChatbot.length)];
            } while (nuevaFrase === ultimaFrase);
            ultimaFrase = nuevaFrase;
            return nuevaFrase;
        }

        function escribirTexto(element, text, speed = 40) {
            element.innerHTML = "";
            let index = 0;

            function escribir() {
                if (index < text.length) {
                    element.innerHTML += text[index];
                    index++;
                    setTimeout(escribir, speed);
                } else {
                    element.parentElement.style.width = "auto";
                }
            }

            escribir();
        }



        function showChatNotification() {
            chatButton.classList.add("notify");

            let notification = document.getElementById("chat-notification");
            if (!notification) {
                notification = document.createElement("div");
                notification.id = "chat-notification";
                notification.classList.add("chat-notification");
                notification.innerHTML = `
                    <span class="chat-text">...</span>
                    <img src="assets/asistente-de-inteligencia-artificial.gif" alt="Chatbot" class="chat-gif">
                    
                `;
                document.body.appendChild(notification);
            }

            const chatTextElement = notification.querySelector(".chat-text");

            // ✅ Borra el contenido anterior antes de iniciar la animación de escritura
            chatTextElement.innerHTML = "...";
            chatTextElement.classList.add("typing-effect");

            setTimeout(() => {
                chatTextElement.classList.remove("typing-effect");

                // ✅ Ahora sí muestra el nuevo mensaje de manera progresiva
                const newMessage = obtenerFraseAleatoria();
                escribirTexto(chatTextElement, newMessage, 40);
            }, 2000); // ✅ Espera 2 segundos antes de empezar a escribir

            notification.classList.add("show");

            setTimeout(() => {
                notification.classList.remove("show");
                chatButton.classList.remove("notify");
            }, 9000);
        }

        setTimeout(() => {
            showChatNotification();
            setInterval(showChatNotification, 30000);
        }, 9000);
    }

    checkChatButton();
}

const frasesChatbot = [
    "Si cierra, es análisis.",
    "Error 404: ganas de laburar.",
    "PowerPoint lo arregla todo.",
    "Cálculo en proceso… o no.",
    "Si es urgente, paciencia.",
    "Sin métricas no hay paraíso.",
    "Plan B: justificarlo bien.",
    "Si no sé, lo googleo más rápido que vos.",
    "Las estadísticas me dan la razón.",
    "Tendencia clara: necesito un mate.",
    "Si no cierra, meto un gráfico.",
    "Los datos no opinan, yo sí.",
    "Lo importante es sonar convincente.",
    "Predicción del día: incertidumbre total.",
    "Soy IA, no terapeuta.",
    "Mi única constante: más datos.",
    "No sé, pero lo argumento bien.",
    "El margen de error me respalda.",
    "Un buen informe tapa todo."
];


let ultimaFrase = "";
function agregarMensaje(tipo, mensaje) {
    const chatBody = document.getElementById("chat-box");

    if (!chatBody) {
        console.error("Elemento #chat-box no encontrado");
        return;
    }

    // ✅ Crear un contenedor para el mensaje
    const containerDiv = document.createElement("div");
    containerDiv.className = "chat-message-container";

    const mensajeDiv = document.createElement("div");
    mensajeDiv.className = tipo === "usuario" ? "user" : "bot";

    // ✅ Agregar el texto correctamente
    mensajeDiv.innerText = mensaje;

    containerDiv.appendChild(mensajeDiv);
    chatBody.appendChild(containerDiv);

    // ✅ Auto-scroll al último mensaje
    chatBody.scrollTop = chatBody.scrollWidth;
}

// Iniciar la función cuando se cargue la página
document.addEventListener("DOMContentLoaded", iniciarNotificacionChat);
