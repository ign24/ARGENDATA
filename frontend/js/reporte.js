document.getElementById("generar-reporte-btn").addEventListener("click", async () => {
    try {
        // Generar el reporte en PDF
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

        // Después de generar el reporte, también generar el audio para leerlo
        await leerReporte();

    } catch (error) {
        console.error("Error al generar el reporte:", error);
        alert("❌ No se pudo generar el reporte. Verificá que el backend esté corriendo.");
    }
});

async function leerReporte() {
    try {
        // Solicitar el archivo de audio generado por Amazon Polly
        const response = await fetch("http://127.0.0.1:8000/generar_reporte_audio", {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error("Error al generar el audio del reporte");
        }

        // Obtener el archivo de audio y reproducirlo
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();  // Reproducir el audio del reporte

    } catch (error) {
        console.error("Error al leer el reporte:", error);
        alert("❌ No se pudo generar el audio del reporte.");
    }
}