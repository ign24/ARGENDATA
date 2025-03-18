document.getElementById("generar-reporte-btn").addEventListener("click", async () => {
    const boton = document.getElementById("generar-reporte-btn");
    boton.innerHTML = "Generando...";
    boton.disabled = true;

    try {
        const response = await fetch("http://127.0.0.1:8000/generar_reporte", { method: "POST" });
        const data = await response.json();
        
        if (response.ok && data.reporte_url) {
            window.open(data.reporte_url, "_blank");
        } else {
            alert("Error al generar el reporte.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al generar el reporte.");
    }

    boton.innerHTML = '<i class="fas fa-file-alt"></i> Generar Reporte';
    boton.disabled = false;
});
