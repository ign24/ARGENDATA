// 📌 Config. de reflejos por tema
function getReflejoConfigPorTema() {
    const esClaro = document.body.classList.contains("modo-claro");

    return {
        luz: (x, y) =>
            esClaro
                ? `radial-gradient(circle at ${x}px ${y}px, rgba(180, 220, 255, 0.25), transparent 60%)`
                : `radial-gradient(circle at ${x}px ${y}px, rgba(80,180,255,0.18), transparent 60%)`,

        fondoTarjeta: esClaro
            ? `linear-gradient(to bottom right,
                rgba(255, 255, 255, 0.6),
                rgba(208, 236, 255, 0.4),
                rgba(255, 255, 255, 0.15))`
            : `linear-gradient(145deg,
                rgba(12, 25, 40, 0.7),
                rgba(3, 81, 122, 0.25),
                rgba(0, 0, 0, 0.1))`
    };
}

// 📌 Reflejos en tarjetas
function inicializarReflejosTarjetas() {
    document.querySelectorAll('.tarjeta, .tarjeta-dolar').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = -(y - centerY) / 100;
            const rotateY = (x - centerX) / 100;

            const config = getReflejoConfigPorTema();
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            card.style.backgroundImage = `${config.luz(x, y)}, ${config.fondoTarjeta}`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.backgroundImage = '';
            card.style.transform = '';
        });
    });
}

// 📌 Reflejo en el logo
function inicializarReflejoLogo() {
    const logo = document.querySelector(".logo-3d-glass");
    if (!logo) return;

    logo.addEventListener("mousemove", (e) => {
        const rect = logo.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 8;
        const rotateY = ((x - centerX) / centerX) * -8;

        logo.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        logo.style.setProperty("--x", `${xPercent}%`);
        logo.style.setProperty("--y", `${yPercent}%`);
    });

    logo.addEventListener("mouseleave", () => {
        logo.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });
}

// 📌 Forzar actualización de fondo en tarjetas al cambiar tema
function actualizarReflejosPorTema() {
    document.querySelectorAll('.tarjeta, .tarjeta-dolar').forEach(card => {
        card.style.backgroundImage = '';
    });
}

// 📊 Actualizar estilo de gráficos (Chart.js y ECharts)
function actualizarEstiloGraficosPorTema() {
    const esClaro = document.body.classList.contains("modo-claro");
    const colorTexto = esClaro ? "#111111" : "#ffffff";
    const colorLinea = esClaro ? "#bbbbbb" : "#444444";
    const colorEje = esClaro ? "#888888" : "#666666";

    if (!window.activeCharts) return;

    window.activeCharts.forEach(chart => {
        // Chart.js
        if (chart?.options) {
            const opciones = chart.options;

            if (opciones.plugins?.legend?.labels) {
                opciones.plugins.legend.labels.color = colorTexto;
            }

            if (opciones.plugins?.title) {
                opciones.plugins.title.color = colorTexto;
                opciones.plugins.title.font = { weight: 'normal' };
            }

            if (opciones.plugins?.datalabels) {
                opciones.plugins.datalabels.color = colorTexto;
            }

            if (opciones.scales) {
                for (const escala in opciones.scales) {
                    const axis = opciones.scales[escala];
                    if (axis.ticks) axis.ticks.color = colorTexto;
                    if (axis.grid) {
                        axis.grid.color = colorLinea;
                        axis.grid.borderColor = colorEje;
                    }
                }
            }

            chart.update?.("none");
        }

        // ECharts
        if (chart?.setOption) {
            chart.setOption({
                legend: {
                    textStyle: {
                        color: esClaro ? "#111111" : "#ffffff"
                    }
                },
                textStyle: { color: colorTexto },
                title: {
                    textStyle: {
                        color: colorTexto,
                        fontWeight: 'normal'
                    }
                },
                xAxis: {
                    axisLabel: { color: colorTexto },
                    axisLine: { lineStyle: { color: colorEje } },
                    splitLine: { lineStyle: { color: colorLinea } }
                },
                yAxis: {
                    axisLabel: { color: colorTexto },
                    axisLine: { lineStyle: { color: colorEje } },
                    splitLine: { lineStyle: { color: colorLinea } }
                },
                series: [{
                    label: {
                        color: colorTexto
                    }
                }]
            });
        }
    });
}

// 🌅 Animación de gradiente al cambiar tema
function crearOverlayTransicion(tipo) {
    const animacion = tipo === "amanecer" ? "gradienteAmanecer" : "gradienteAnochecer";

    const overlay = document.createElement("div");
    overlay.className = "overlay-tema";
    overlay.style.setProperty("--animacion-gradiente", animacion);

    const img = document.createElement("img");
    img.className = "icono-tema-css-img";
    img.src = "../frontend/assets/img/claro_oscuro.gif";
    img.alt = "Transición de tema";

    overlay.appendChild(img);
    document.body.appendChild(overlay);

    return overlay;
}

// ☀️ Activar transición completa
function activarTransicionTema(tipo, callback) {
    const overlay = crearOverlayTransicion(tipo);
    overlay.classList.add("mostrar");

    setTimeout(() => {
        overlay.classList.add("ocultar");
        setTimeout(() => {
            overlay.remove();
            if (typeof callback === "function") callback();
        }, 800);
    }, 5000); // duración de la animación
}

function transicionGradiente(tipo = "amanecer", aplicarTemaCallback) {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay-fondo-transicion");
    overlay.classList.add(tipo === "amanecer" ? "fondo-amanecer" : "fondo-anochecer");

    // Ícono opcional
    const icono = document.createElement("img");
    icono.src = "../frontend/assets/img/claro_oscuro.gif";
    icono.className = "icono-tema-css-img";
    overlay.appendChild(icono);

    document.body.appendChild(overlay);

    // 🔁 Iniciar Fade-in
    requestAnimationFrame(() => {
        overlay.style.opacity = "1";

        setTimeout(() => {
            // ✅ Aplicar tema cuando ya está cubierta la pantalla (~1.2s)
            if (typeof aplicarTemaCallback === "function") aplicarTemaCallback();

            // 🔁 Fade-out lento
            overlay.style.opacity = "0";

            // 🧼 Remover después del fade-out
            setTimeout(() => {
                overlay.remove();
            }, 2000); // fade-out

        }, 4000); // fade-in
    });
}