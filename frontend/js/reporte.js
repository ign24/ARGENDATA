document.getElementById("generar-reporte-btn").addEventListener("click", async () => {
    try {
        const response = await fetch("http://127.0.0.1:8000/generar_reporte", {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error(`Error al generar reporte: ${response.statusText}`);
        }

        const blob = await response.blob();

        // Crear link de descarga
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "reporte_dashboard.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();

        // Liberar memoria del objeto URL
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error al generar el reporte:", error);
        alert("❌ No se pudo generar el reporte. Verificá que el backend esté corriendo.");
    }
});