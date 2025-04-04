document.addEventListener("DOMContentLoaded", function () {
    const loadComponent = async (id, file, callback = null) => {
        const element = document.getElementById(id);
        if (element) {
            try {
                const response = await fetch(file);
                if (!response.ok) throw new Error(`Error cargando ${file}`);
                const html = await response.text();
                element.innerHTML = html;

                // Esperar a que el header se inserte antes de aplicar efectos
                setTimeout(() => {
                    const header = document.querySelector("header");
                    if (header) {
                        header.classList.add("animacion-reflejo");
                    }

                    aplicarEfectoVidrioEnHeaderYSidebar();
                    inicializarTema();
                    inicializarModoLite(); // ⬅️ Agregado

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

    function inicializarTema() {
        const toggleBtn = document.getElementById("toggle-theme");
        const themeIcon = document.getElementById("theme-icon");

        if (!toggleBtn || !themeIcon) return;

        const preferencia = localStorage.getItem("tema") || "oscuro";
        const esClaro = preferencia === "claro";

        if (esClaro) {
            aplicarModoClaro(); // Estilo + partículas + tarjetas
        } else {
            aplicarModoOscuro();
        }
        toggleBtn.addEventListener("click", () => {
            const modoEsClaro = document.body.classList.contains("modo-claro");

            if (!modoEsClaro) {
                animarTransicionAModoClaro(() => {
                    aplicarModoClaro();
                    localStorage.setItem("tema", "claro");
                });
            } else {
                animarTransicionAModoOscuro(() => {
                    aplicarModoOscuro();
                    localStorage.setItem("tema", "oscuro");
                });
            }
        });
    }

    // En loadComponent callback (ya lo tenés definido)
    setTimeout(() => {
        const header = document.querySelector("header");
        if (header) {
            header.classList.add("animacion-reflejo");
        }

        aplicarEfectoVidrioEnHeaderYSidebar();

        // Animación del logo al cargar
        const figura = document.getElementById("logo-figura");
        if (figura) {
            figura.style.transform = "rotate(0deg)";
        }

        inicializarTema();
        inicializarModoLite();
    }, 50);

    // ✅ Inicializar modo lite
    function inicializarModoLite() {
        const animBtn = document.getElementById("toggle-animations-btn");
        if (!animBtn) {
            console.warn("⚠️ Botón de animaciones no encontrado.");
            return;
        }

        let modoLite = localStorage.getItem("modoLite") === "true";

        // Aplicar si estaba activado previamente
        if (modoLite) {
            document.body.classList.add("modo-lite");
            animBtn.textContent = "Modo Lite: ON";
        }

        animBtn.addEventListener("click", () => {
            modoLite = !modoLite;
            document.body.classList.toggle("modo-lite", modoLite);
            animBtn.textContent = `Modo Lite: ${modoLite ? "ON" : "OFF"}`;
            localStorage.setItem("modoLite", modoLite);

            // 🧨 Desactivar partículas
            if (window.pJSDom && window.pJSDom.length > 0) {
                const particles = window.pJSDom[0].pJS;
                particles.particles.move.enable = !modoLite;
                particles.fn.particlesEmpty();
                if (!modoLite) particles.fn.particlesCreate();
            }
        });
    }

    // ✅ Cargar todo
    loadComponent("dynamic-loader-container", "dynamic_loader.html", () => {
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
        cargarScript("js/sidebar.js", () => console.log("✅ sidebar.js cargado"));
        cargarScript("js/chat.js", () => {
            console.log("✅ chat.js cargado");
            if (typeof iniciarNotificacionChat === "function") iniciarNotificacionChat();
        });
    });
});
