document.addEventListener("DOMContentLoaded", function () {
    const loadComponent = async (id, file, callback = null) => {
        const element = document.getElementById(id);
        if (element) {
            try {
                const response = await fetch(file);
                if (!response.ok) throw new Error(`Error cargando ${file}`);
                const html = await response.text();
                element.innerHTML = html;

                // Si hay un callback, ejecutarlo después de cargar el HTML
                if (callback) callback();
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Cargar `dynamic_loader.html` y luego ejecutar `sidebar.js` y `chat.js`
    loadComponent("dynamic-loader-container", "dynamic_loader.html", () => {
        // Asegurar que el botón toggle del sidebar funcione correctamente
        const toggleBtn = document.getElementById("toggleBtn");
        const sidebar = document.getElementById("sidebar");

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener("click", () => {
                sidebar.classList.toggle("open");
            });
        }

        // Cargar scripts después de insertar `dynamic_loader.html`
        const sidebarScript = document.createElement("script");
        sidebarScript.src = "js/sidebar.js";
        document.body.appendChild(sidebarScript);

        const chatScript = document.createElement("script");
        chatScript.src = "js/chat.js";
        document.body.appendChild(chatScript);
    });
});