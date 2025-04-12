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

                setTimeout(() => {
                    const header = document.querySelector("header");
                    if (header) header.classList.add("animacion-reflejo");

                    aplicarEfectoVidrioEnHeaderYSidebar();

                    // 👇 Lógica desacoplada
                    cargarScript("js/temaManager.js", () => inicializarTema());
                    cargarScript("js/modoLite.js", () => inicializarModoLite());

                    // Lógica del sidebar (interna)
                    inicializarSidebar();

                }, 50);

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

    function inicializarSidebar() {
        const toggleBtn = document.getElementById("toggleBtn");
        const sidebar = document.getElementById("sidebar");
        const mainWrapper = document.getElementById("main-wrapper");

        if (toggleBtn && sidebar && mainWrapper) {
            toggleBtn.addEventListener("click", () => {
                sidebar.classList.toggle("open");
                mainWrapper.classList.toggle("with-sidebar");
                window.dispatchEvent(new Event("resize"));
            });
        }
    }
    cargarScript("js/temaVisual.js", () => {
        inicializarReflejosTarjetas();
        inicializarReflejoLogo();
    });
        
    loadComponent("dynamic-loader-container", "dynamic_loader.html", () => {
        cargarScript("js/chat.js", () => {
            console.log("✅ chat.js cargado");
            if (typeof iniciarNotificacionChat === "function") iniciarNotificacionChat();
        });
    });
});