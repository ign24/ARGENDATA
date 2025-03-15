document.addEventListener("DOMContentLoaded", function () {
    const btnReporte = document.getElementById("generar-reporte-btn");

    if (btnReporte) {
        btnReporte.addEventListener("click", async function () {
            btnReporte.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Generando...`;
            btnReporte.disabled = true;

            try {
                const response = await fetch("http://127.0.0.1:8000/generar_reporte", { method: "POST" });

                if (!response.ok) throw new Error("Error en la generación del reporte.");

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "reporte_dashboard.pdf";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                btnReporte.innerHTML = `<i class="fas fa-file-alt"></i> Generar Reporte`;
            } catch (error) {
                console.error("Error:", error);
                alert("Hubo un problema al generar el reporte.");
            }

            btnReporte.disabled = false;
        });
    }
});
