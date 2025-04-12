function inicializarModoLite() {
    const animBtn = document.getElementById("toggle-animations-btn");
    if (!animBtn) return;

    // 🧠 Leer preferencia previa desde localStorage
    let modoLite = localStorage.getItem("modoLite") === "true";

    // 💡 Aplicar clase inicial
    document.body.classList.toggle("modo-lite", modoLite);
    animBtn.textContent = `Modo Lite: ${modoLite ? "ON" : "OFF"}`;

    // 🎆 Control de partículas al cargar
    controlarParticulas(modoLite);

    // 🖱️ Listener del botón
    animBtn.addEventListener("click", () => {
        modoLite = !modoLite;
        document.body.classList.toggle("modo-lite", modoLite);
        animBtn.textContent = `Modo Lite: ${modoLite ? "ON" : "OFF"}`;
        localStorage.setItem("modoLite", modoLite);

        controlarParticulas(modoLite);
    });

    // 🎇 Encendido/apagado de partículas (si están presentes)
    function controlarParticulas(deshabilitar) {
        if (window.pJSDom?.length > 0) {
            const particles = window.pJSDom[0].pJS;
            particles.particles.move.enable = !deshabilitar;
            particles.fn.particlesEmpty();
            if (!deshabilitar) particles.fn.particlesCreate();
        }
    }
}