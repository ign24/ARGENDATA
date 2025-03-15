async function obtenerIPC() {
    const url = "http://127.0.0.1:5000/ipc";

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("No se pudo obtener el IPC.");

        const datos = await respuesta.json();
        const ipcValor = datos.ipc;

        document.getElementById("tarjeta-ipc").innerHTML = `
            <h3>IPC Nacional</h3>
            <p class="text-3xl font-bold">${ipcValor}</p>
        `;
    } catch (error) {
        console.error(error);
        document.getElementById("tarjeta-ipc").innerHTML = "<p class='text-red-500'>Error al cargar el IPC</p>";
    }
}

// 📌 Ejecutar la función cuando la página cargue
document.addEventListener("DOMContentLoaded", () => {
    obtenerIPC();
});