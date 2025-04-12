function inicializarTema() {
    const toggleBtn = document.getElementById("toggle-theme");
    if (!toggleBtn) return;

    const temaGuardado = localStorage.getItem("tema") || "oscuro";
    aplicarTema(temaGuardado);

    toggleBtn.addEventListener("click", () => {
        const esClaro = document.body.classList.contains("modo-claro");
        const nuevoTema = esClaro ? "oscuro" : "claro";
        const tipoTransicion = esClaro ? "anochecer" : "amanecer";

        if (document.body.classList.contains("modo-lite")) {
            aplicarTema(nuevoTema);
            return;
        }

        toggleBtn.disabled = true;

        transicionGradiente(tipoTransicion, () => {
            aplicarTema(nuevoTema); // ✅ Aplicar inmediatamente cuando ya cubrió
            toggleBtn.disabled = false;
        });
    });

    function aplicarTema(modo) {
        document.body.classList.remove("modo-claro", "modo-oscuro");
        document.body.classList.add(modo === "claro" ? "modo-claro" : "modo-oscuro");
        localStorage.setItem("tema", modo);

        if (typeof actualizarReflejosPorTema === "function") actualizarReflejosPorTema();
        if (typeof actualizarEstiloGraficosPorTema === "function") actualizarEstiloGraficosPorTema();
    }
}