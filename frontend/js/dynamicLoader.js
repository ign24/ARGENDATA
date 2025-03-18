document.addEventListener("DOMContentLoaded", function () {
    const loadComponent = async (id, file, callback = null) => {
        const element = document.getElementById(id);
        if (element) {
            try {
                const response = await fetch(file);
                if (!response.ok) throw new Error(`Error cargando ${file}`);
                const html = await response.text();
                element.innerHTML = html;

                console.log(`✅ ${file} cargado correctamente`);

                // Esperar a que el header se inserte antes de aplicar la animación
                setTimeout(() => {
                    const header = document.querySelector("header");
                    if (header) {
                        header.classList.add("animacion-reflejo");
                        console.log("✨ Animación de reflejo aplicada al header");
                    }
                }, 50); // Pequeño delay para asegurar que el DOM se actualizó

                // Ejecutar el callback después de cargar el HTML
                if (callback) callback();
            } catch (error) {
                console.error(error);
            }
        }
    };

    function cargarScript(url, callback) {
        const script = document.createElement("script");
        script.src = url;
        script.onload = callback;
        document.body.appendChild(script);
    }

    // Cargar `dynamic_loader.html` y luego los scripts dependientes
    loadComponent("dynamic-loader-container", "dynamic_loader.html", () => {
        console.log("✅ dynamic_loader.html ha sido cargado");

        // Asegurar que el sidebar funcione correctamente
        const toggleBtn = document.getElementById("toggleBtn");
        const sidebar = document.getElementById("sidebar");

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener("click", () => {
                sidebar.classList.toggle("open");
            });
        }

        // Cargar `sidebar.js`
        cargarScript("js/sidebar.js", () => console.log("✅ sidebar.js ha sido cargado"));

        // Cargar `chat.js` y ejecutar la función de notificación
        cargarScript("js/chat.js", () => {
            console.log("✅ chat.js ha sido cargado");
            if (typeof iniciarNotificacionChat === "function") {
                iniciarNotificacionChat();
            } else {
                console.error("❌ La función iniciarNotificacionChat no está definida.");
            }
        });
    });
});
